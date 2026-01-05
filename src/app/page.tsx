'use client';

import { useAsciiConverter } from '@/hooks/useAsciiConverter';
import { ImageUploader } from '@/components/ImageUploader';
import { ConfigPanel } from '@/components/ConfigPanel';
import { AsciiPreview } from '@/components/AsciiPreview';
import { ExportButtons } from '@/components/ExportButtons';
import { CopyButtons } from '@/components/CopyButtons';

export default function Home() {
  const {
    image,
    config,
    result,
    isProcessing,
    error,
    setImage,
    clearImage,
    updateConfig,
    resetConfig,
  } = useAsciiConverter();

  return (
    <div className="min-h-screen grid-pattern">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-mono font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  ASCII Art Generator
                </h1>
                <p className="text-xs text-muted hidden sm:block">
                  Transform images into beautiful ASCII art
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Controls */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Upload Section */}
            <section className="bg-card rounded-xl border border-border p-4 animate-fade-in">
              <h2 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Source Image
              </h2>
              <ImageUploader 
                onImageSelect={setImage}
                currentImage={image}
                onClear={clearImage}
              />
            </section>

            {/* Configuration Section */}
            <section className="bg-card rounded-xl border border-border p-4 animate-fade-in" style={{ animationDelay: '50ms' }}>
              <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Configuration
              </h2>
              <ConfigPanel
                config={config}
                onConfigChange={updateConfig}
                onReset={resetConfig}
                disabled={!image}
              />
            </section>

            {/* Copy Section */}
            <section className="bg-card rounded-xl border border-border p-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CopyButtons 
                result={result}
                disabled={isProcessing}
              />
            </section>

            {/* Export Section */}
            <section className="bg-card rounded-xl border border-border p-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
              <ExportButtons 
                result={result}
                disabled={isProcessing}
              />
            </section>
          </aside>

          {/* Right Side - Preview */}
          <div className="flex-1 min-h-[500px] lg:min-h-[calc(100vh-180px)] flex flex-col animate-fade-in" style={{ animationDelay: '200ms' }}>
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <AsciiPreview 
              result={result}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
            <p>Built with Next.js, Tailwind CSS, and Canvas API</p>
            <p>All processing happens in your browser - no uploads to servers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
