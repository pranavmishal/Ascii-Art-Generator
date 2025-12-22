'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  AsciiConfig, 
  AsciiResult, 
  DEFAULT_CONFIG, 
  convertImageToAscii 
} from '@/lib/ascii-converter';

interface UseAsciiConverterReturn {
  // State
  image: string | null;
  imageFile: File | null;
  config: AsciiConfig;
  result: AsciiResult | null;
  isProcessing: boolean;
  error: string | null;
  
  // Actions
  setImage: (file: File) => void;
  clearImage: () => void;
  updateConfig: (updates: Partial<AsciiConfig>) => void;
  resetConfig: () => void;
}

export function useAsciiConverter(): UseAsciiConverterReturn {
  const [image, setImageState] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [config, setConfig] = useState<AsciiConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<AsciiResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce timer ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  // Store the loaded image element for faster reprocessing
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  
  // Process image with current config
  const processImage = useCallback(async (imgSrc: string | HTMLImageElement, cfg: AsciiConfig) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const asciiResult = await convertImageToAscii(imgSrc, cfg);
      setResult(asciiResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert image');
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);
  
  // Debounced processing when config changes
  useEffect(() => {
    if (!image) return;
    
    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new debounce timer
    debounceRef.current = setTimeout(() => {
      const imgSource = imageElementRef.current || image;
      processImage(imgSource, config);
    }, 100);
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [image, config, processImage]);
  
  // Set a new image
  const setImage = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }
    
    // Create object URL for the file
    const url = URL.createObjectURL(file);
    
    // Preload the image element
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementRef.current = img;
    };
    img.src = url;
    
    setImageFile(file);
    setImageState(url);
    setError(null);
  }, []);
  
  // Clear the current image
  const clearImage = useCallback(() => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImageState(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    imageElementRef.current = null;
  }, [image]);
  
  // Update config partially
  const updateConfig = useCallback((updates: Partial<AsciiConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Reset config to defaults
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);
  
  return {
    image,
    imageFile,
    config,
    result,
    isProcessing,
    error,
    setImage,
    clearImage,
    updateConfig,
    resetConfig,
  };
}

