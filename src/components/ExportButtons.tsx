'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AsciiResult } from '@/lib/ascii-converter';
import { exportAsciiArt, ExportFormat } from '@/lib/export-utils';

interface ExportButtonsProps {
  result: AsciiResult | null;
  disabled?: boolean;
}

const exportFormats: { format: ExportFormat; label: string; icon: React.ReactNode }[] = [
  {
    format: 'svg',
    label: 'SVG',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    format: 'png',
    label: 'PNG',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    format: 'jpg',
    label: 'JPG',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function ExportButtons({ result, disabled }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!result || isExporting) return;

    setIsExporting(format);
    try {
      await exportAsciiArt(result, format);
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const isDisabled = disabled || !result;

  return (
    <div>
      <h2 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </h2>
      <div className="flex gap-2">
        {exportFormats.map(({ format, label, icon }) => (
          <Button
            key={format}
            variant="outline"
            size="sm"
            disabled={isDisabled || isExporting !== null}
            onClick={() => handleExport(format)}
            className="flex-1 gap-1.5"
          >
            {isExporting === format ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                {icon}
                {label}
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}

