'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  currentImage: string | null;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, currentImage, onClear }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPasteHint, setShowPasteHint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            onImageSelect(file);
            setShowPasteHint(false);
          }
          break;
        }
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [onImageSelect]);
  
  // Show paste hint on keyboard shortcut detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        if (!currentImage) {
          setShowPasteHint(true);
          setTimeout(() => setShowPasteHint(false), 1500);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentImage]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onImageSelect(files[0]);
    }
  }, [onImageSelect]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  }, [onImageSelect]);
  
  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  if (currentImage) {
    return (
      <div className="space-y-2">
        <div className="relative rounded-md overflow-hidden border bg-muted">
          <img 
            src={currentImage} 
            alt="Uploaded" 
            className="w-full h-40 object-contain"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleClick} className="flex-1">
            Replace
          </Button>
          <Button variant="outline" size="sm" onClick={onClear} className="flex-1">
            Remove
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }
  
  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 cursor-pointer transition-all",
        isDragOver && "border-primary bg-muted",
        showPasteHint && "border-primary bg-primary/5",
        !isDragOver && !showPasteHint && "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}
    >
      <div className="rounded-full bg-muted p-3">
        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">
          {showPasteHint ? 'Pasting...' : 'Drop, paste, or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG, GIF, WebP • <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">⌘V</kbd> to paste
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
