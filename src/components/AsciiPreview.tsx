'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { AsciiResult } from '@/lib/ascii-converter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AsciiPreviewProps {
  result: AsciiResult | null;
  isProcessing: boolean;
}

export function AsciiPreview({ result, isProcessing }: AsciiPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (result) {
      setZoom(100);
    }
  }, [result?.width]);
  
  const svgContent = useMemo(() => {
    if (!result) return null;
    
    const { chars, fontSize, lineHeight, width, height } = result;
    const charWidthPx = fontSize * 0.6;
    const svgWidth = width * charWidthPx;
    const svgHeight = height * lineHeight;
    
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
  
  // Empty state
  if (!result && !isProcessing) {
    return (
      <div className="flex h-full items-center justify-center rounded-md border border-dashed">
        <div className="text-center p-8">
          <svg className="mx-auto h-10 w-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-sm text-muted-foreground">Upload an image to generate ASCII art</p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isProcessing && !result) {
    return (
      <div className="flex h-full items-center justify-center rounded-md border">
        <div className="text-center">
          <svg className="mx-auto h-6 w-6 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-2 text-sm text-muted-foreground">Generating...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-full flex-col rounded-md border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/50">
        <span className="text-xs text-muted-foreground font-mono">
          {result?.width} × {result?.height}
          {isProcessing && <span className="ml-2 text-primary">Updating...</span>}
        </span>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom((z) => Math.max(z - 25, 25))}
            disabled={zoom <= 25}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center tabular-nums">{zoom}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom((z) => Math.min(z + 25, 200))}
            disabled={zoom >= 200}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Preview Area */}
      <div 
        ref={containerRef}
        className={cn(
          "flex-1 overflow-auto p-4",
          "bg-[#0a0a0a]"
        )}
      >
        {svgContent && (
          <div 
            className="inline-block origin-top-left transition-transform"
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
