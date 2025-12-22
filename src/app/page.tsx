'use client';

import { useAsciiConverter } from '@/hooks/useAsciiConverter';
import { ImageUploader } from '@/components/ImageUploader';
import { ConfigPanel } from '@/components/ConfigPanel';
import { AsciiPreview } from '@/components/AsciiPreview';
import { ExportButtons } from '@/components/ExportButtons';

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
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
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

            {/* Export Section */}
            <section className="bg-card rounded-xl border border-border p-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <ExportButtons 
                result={result}
                disabled={isProcessing}
              />
            </section>
          </aside>

          {/* Right Side - Preview */}
          <div className="flex-1 min-h-[500px] lg:min-h-[calc(100vh-180px)] flex flex-col animate-fade-in" style={{ animationDelay: '150ms' }}>
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
