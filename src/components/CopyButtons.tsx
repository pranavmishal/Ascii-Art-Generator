'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AsciiResult } from '@/lib/ascii-converter';
import { copyAsciiArt, CopyFormat } from '@/lib/export-utils';

interface CopyButtonsProps {
  result: AsciiResult | null;
  disabled?: boolean;
}

const copyFormats: { format: CopyFormat; label: string; icon: React.ReactNode }[] = [
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
];

export function CopyButtons({ result, disabled }: CopyButtonsProps) {
  const [copiedFormat, setCopiedFormat] = useState<CopyFormat | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async (format: CopyFormat) => {
    if (!result || isCopying) return;

    setIsCopying(true);
    try {
      await copyAsciiArt(result, format);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    } finally {
      setIsCopying(false);
    }
  };

  const isDisabled = disabled || !result || isCopying;

  return (
    <div>
      <h2 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy to Clipboard
      </h2>
      <div className="flex gap-2">
        {copyFormats.map(({ format, label, icon }) => (
          <Button
            key={format}
            variant="outline"
            size="sm"
            disabled={isDisabled}
            onClick={() => handleCopy(format)}
            className="flex-1 gap-1.5"
          >
            {copiedFormat === format ? (
              <>
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
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

