'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AsciiResult } from '@/lib/ascii-converter';
import { copyAsciiArt, CopyFormat } from '@/lib/export-utils';

interface CopyButtonsProps {
  result: AsciiResult | null;
  disabled?: boolean;
}

export function CopyButtons({ result, disabled }: CopyButtonsProps) {
  const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);

  const handleCopy = async (format: CopyFormat) => {
    if (!result) return;

    try {
      await copyAsciiArt(result, format);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Copy</h3>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => handleCopy('svg')}
          className="flex-1"
        >
          {copiedFormat === 'svg' ? 'Copied!' : 'SVG'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => handleCopy('png')}
          className="flex-1"
        >
          {copiedFormat === 'png' ? 'Copied!' : 'PNG'}
        </Button>
      </div>
    </div>
  );
}
