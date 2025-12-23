'use client';

import React, { useCallback, useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  currentImage: string | null;
  onClear: () => void;
}

export function ImageUploader({ onImageSelect, currentImage, onClear }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      <div className="relative group animate-fade-in">
        <div className="relative rounded-xl overflow-hidden bg-card border border-border">
          <img 
            src={currentImage} 
            alt="Uploaded" 
            className="w-full h-48 object-contain bg-black/20"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              Replace
            </button>
            <button
              onClick={onClear}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
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
      className={`
        drop-zone rounded-xl p-8 cursor-pointer
        flex flex-col items-center justify-center gap-4
        min-h-[200px] transition-all duration-200
        ${isDragOver ? 'drag-over scale-[1.02]' : 'hover:border-primary/50'}
      `}
    >
      {/* Upload Icon */}
      <div className={`
        w-16 h-16 rounded-full flex items-center justify-center
        transition-colors duration-200
        ${isDragOver ? 'bg-accent/20' : 'bg-primary/10'}
      `}>
        <svg 
          className={`w-8 h-8 transition-colors ${isDragOver ? 'text-accent' : 'text-primary'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
      
      <div className="text-center">
        <p className="text-foreground font-medium mb-1">
          {isDragOver ? 'Drop your image here' : 'Drag & drop an image'}
        </p>
        <p className="text-muted text-sm">
          or click to browse / paste from clipboard
        </p>
      </div>
      
      <p className="text-muted/60 text-xs">
        Supports JPG, PNG, GIF, WebP • Ctrl+V to paste
      </p>
      
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

