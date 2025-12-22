'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { AsciiResult } from '@/lib/ascii-converter';

interface AsciiPreviewProps {
  result: AsciiResult | null;
  isProcessing: boolean;
}

export function AsciiPreview({ result, isProcessing }: AsciiPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset zoom when result changes significantly
  useEffect(() => {
    if (result) {
      setZoom(100);
    }
  }, [result?.width]);
  
  // Generate SVG content
  const svgContent = useMemo(() => {
    if (!result) return null;
    
    const { chars, fontSize, lineHeight, width, height } = result;
    const charWidthPx = fontSize * 0.6;
    const svgWidth = width * charWidthPx;
    const svgHeight = height * lineHeight;
    
    // Build optimized SVG - group characters by color per row
    const textElements: React.ReactNode[] = [];
    
    for (let y = 0; y < chars.length; y++) {
      const row = chars[y];
      let currentColor = '';
      let currentText = '';
      let startX = 0;
      
      for (let x = 0; x < row.length; x++) {
        const { char, color } = row[x];
        
        if (color !== currentColor) {
          if (currentText) {
            textElements.push(
              <text
                key={`${y}-${startX}`}
                x={startX * charWidthPx}
                y={(y + 1) * lineHeight}
                fill={currentColor}
              >
                {currentText}
              </text>
            );
          }
          currentColor = color;
          currentText = char;
          startX = x;
        } else {
          currentText += char;
        }
      }
      
      if (currentText) {
        textElements.push(
          <text
            key={`${y}-${startX}-end`}
            x={startX * charWidthPx}
            y={(y + 1) * lineHeight}
            fill={currentColor}
          >
            {currentText}
          </text>
        );
      }
    }
    
    return { svgWidth, svgHeight, fontSize, textElements };
  }, [result]);
  
  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 25));
  const handleZoomReset = () => setZoom(100);
  
  // Empty state
  if (!result && !isProcessing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card rounded-xl border border-border">
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No ASCII Art Yet</h3>
          <p className="text-muted text-sm max-w-xs">
            Upload an image to see it transformed into beautiful ASCII art
          </p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isProcessing && !result) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card rounded-xl border border-border">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-subtle">
            <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-muted text-sm">Converting to ASCII...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card-hover/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">
            {result?.width} × {result?.height} chars
          </span>
          {isProcessing && (
            <span className="flex items-center gap-1 text-xs text-accent">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              Updating...
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-border/50 text-muted hover:text-foreground transition-colors"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleZoomReset}
            className="px-2 py-1 rounded hover:bg-border/50 text-xs font-mono text-muted hover:text-foreground transition-colors min-w-[48px]"
            title="Reset zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-border/50 text-muted hover:text-foreground transition-colors"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4"
        style={{ backgroundColor: '#0c0c0f' }}
      >
        {svgContent && (
          <div 
            className="inline-block origin-top-left transition-transform duration-150"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <svg 
              width={svgContent.svgWidth} 
              height={svgContent.svgHeight}
              viewBox={`0 0 ${svgContent.svgWidth} ${svgContent.svgHeight}`}
              style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                fontSize: svgContent.fontSize,
              }}
            >
              <g>{svgContent.textElements}</g>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

