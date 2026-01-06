'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AsciiResult } from '@/lib/ascii-converter';
import { exportAsciiArt, ExportFormat } from '@/lib/export-utils';

interface ExportButtonsProps {
  result: AsciiResult | null;
  disabled?: boolean;
}

export function ExportButtons({ result, disabled }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!result) return;

    setIsExporting(format);
    try {
      await exportAsciiArt(result, format);
    } catch (error) {
      console.error('Failed to export:', error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Download</h3>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isExporting !== null}
          onClick={() => handleExport('svg')}
          className="flex-1"
        >
          {isExporting === 'svg' ? '...' : 'SVG'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isExporting !== null}
          onClick={() => handleExport('png')}
          className="flex-1"
        >
          {isExporting === 'png' ? '...' : 'PNG'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isExporting !== null}
          onClick={() => handleExport('jpg')}
          className="flex-1"
        >
          {isExporting === 'jpg' ? '...' : 'JPG'}
        </Button>
      </div>
    </div>
  );
}
