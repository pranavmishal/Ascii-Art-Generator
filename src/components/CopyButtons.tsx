'use client';

import React, { useState, useRef } from 'react';
import { AsciiResult } from '@/lib/ascii-converter';
import { copyAsciiArt, CopyFormat } from '@/lib/export-utils';

interface CopyButtonsProps {
  result: AsciiResult | null;
  disabled?: boolean;
}

interface CopyOption {
  format: CopyFormat;
  label: string;
  description: string;
}

const COPY_OPTIONS: CopyOption[] = [
  {
    format: 'svg',
    label: 'SVG',
    description: 'Vector code',
  },
  {
    format: 'png',
    label: 'PNG',
    description: 'Image',
  },
  {
    format: 'jpg',
    label: 'JPG',
    description: 'Image',
  },
];

export function CopyButtons({ result, disabled }: CopyButtonsProps) {
  const [copying, setCopying] = useState<CopyFormat | null>(null);
  const [success, setSuccess] = useState<CopyFormat | null>(null);
  const [error, setError] = useState<CopyFormat | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; format: CopyFormat }[]>([]);
  const rippleIdRef = useRef(0);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>, format: CopyFormat) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleIdRef.current++;

    setRipples((prev) => [...prev, { id, x, y, format }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>, format: CopyFormat) => {
    if (!result || disabled || copying) return;

    createRipple(e, format);
    setCopying(format);
    setSuccess(null);
    setError(null);

    try {
      await copyAsciiArt(result, format);
      setSuccess(format);

      // Clear success after animation
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      setError(format);
      setTimeout(() => setError(null), 2000);
    } finally {
      setCopying(null);
    }
  };

  const isDisabled = disabled || !result;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Copy to Clipboard
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {COPY_OPTIONS.map((option) => {
          const isCurrentlyCopying = copying === option.format;
          const isSuccess = success === option.format;
          const isError = error === option.format;
          const buttonRipples = ripples.filter((r) => r.format === option.format);

          return (
            <button
              key={option.format}
              onClick={(e) => handleCopy(e, option.format)}
              disabled={isDisabled || isCurrentlyCopying}
              className={`
                group relative flex flex-col items-center gap-1 p-3 rounded-lg
                border overflow-hidden
                transition-all duration-300 ease-out
                ${
                  isSuccess
                    ? 'border-success bg-success/10 text-success scale-[1.02]'
                    : isError
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : isDisabled
                    ? 'border-border/50 text-muted/50 cursor-not-allowed'
                    : 'border-border hover:border-accent text-muted hover:text-foreground hover:bg-accent/5 active:scale-[0.98]'
                }
              `}
            >
              {/* Ripple effects */}
              {buttonRipples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-accent/30 animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}

              {/* Icon container with animation */}
              <div
                className={`
                  relative w-6 h-6 flex items-center justify-center
                  transition-transform duration-300
                  ${isSuccess ? 'scale-110' : ''}
                `}
              >
                {isCurrentlyCopying ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : isSuccess ? (
                  <svg
                    className="w-5 h-5 animate-success-check"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                      className="animate-draw-check"
                    />
                  </svg>
                ) : isError ? (
                  <svg className="w-5 h-5 animate-shake" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              {/* Label with micro-animation */}
              <span
                className={`
                  text-xs font-medium transition-all duration-200
                  ${isSuccess ? 'translate-y-0' : 'group-hover:-translate-y-px'}
                `}
              >
                {isSuccess ? 'Copied!' : option.label}
              </span>

              {/* Subtle glow effect on success */}
              {isSuccess && (
                <div className="absolute inset-0 rounded-lg bg-success/5 animate-pulse-glow pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {!result && <p className="text-xs text-muted/60 text-center">Upload an image to enable copy</p>}
    </div>
  );
}

