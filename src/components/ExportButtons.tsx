'use client';

import React, { useState } from 'react';
import { AsciiResult } from '@/lib/ascii-converter';
import { exportAsciiArt, ExportFormat } from '@/lib/export-utils';

interface ExportButtonsProps {
  result: AsciiResult | null;
  disabled?: boolean;
}

interface ExportOption {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: 'svg',
    label: 'SVG',
    description: 'Vector, scalable',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    format: 'png',
    label: 'PNG',
    description: 'Transparent bg',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    format: 'jpg',
    label: 'JPG',
    description: 'Compressed',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function ExportButtons({ result, disabled }: ExportButtonsProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [success, setSuccess] = useState<ExportFormat | null>(null);
  
  const handleExport = async (format: ExportFormat) => {
    if (!result || disabled || exporting) return;
    
    setExporting(format);
    setSuccess(null);
    
    try {
      await exportAsciiArt(result, format);
      setSuccess(format);
      
      // Clear success after 2 seconds
      setTimeout(() => setSuccess(null), 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(null);
    }
  };
  
  const isDisabled = disabled || !result;
  
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </h3>
      
      <div className="grid grid-cols-3 gap-2">
        {EXPORT_OPTIONS.map((option) => {
          const isCurrentlyExporting = exporting === option.format;
          const isSuccess = success === option.format;
          
          return (
            <button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isDisabled || isCurrentlyExporting}
              className={`
                relative flex flex-col items-center gap-1 p-3 rounded-lg
                border transition-all duration-200
                ${isSuccess 
                  ? 'border-success bg-success/10 text-success' 
                  : isDisabled
                    ? 'border-border/50 text-muted/50 cursor-not-allowed'
                    : 'border-border hover:border-primary text-muted hover:text-foreground hover:bg-primary/5'
                }
              `}
            >
              {isCurrentlyExporting ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isSuccess ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                option.icon
              )}
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
      
      {!result && (
        <p className="text-xs text-muted/60 text-center">
          Upload an image to enable export
        </p>
      )}
    </div>
  );
}

