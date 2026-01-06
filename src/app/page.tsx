'use client';

import { useAsciiConverter } from '@/hooks/useAsciiConverter';
import { ImageUploader } from '@/components/ImageUploader';
import { ConfigPanel } from '@/components/ConfigPanel';
import { AsciiPreview } from '@/components/AsciiPreview';
import { ExportButtons } from '@/components/ExportButtons';
import { CopyButtons } from '@/components/CopyButtons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Separator } from '@/components/ui/separator';

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono font-bold text-sm">
              A
            </div>
            <span className="font-semibold">ASCII Art Generator</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-1 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-6">
            <div>
              <h2 className="text-sm font-medium mb-3">Upload Image</h2>
              <ImageUploader 
                onImageSelect={setImage}
                currentImage={image}
                onClear={clearImage}
              />
            </div>

            <Separator />

            <div>
              <h2 className="text-sm font-medium mb-4">Settings</h2>
              <ConfigPanel
                config={config}
                onConfigChange={updateConfig}
                onReset={resetConfig}
                disabled={!image}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <CopyButtons 
                result={result}
                disabled={isProcessing || !result}
              />
              <ExportButtons 
                result={result}
                disabled={isProcessing || !result}
              />
            </div>
          </aside>

          {/* Preview */}
          <div className="flex-1 min-h-[500px] lg:min-h-[calc(100vh-8rem)]">
            {error && (
              <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
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
      <footer className="border-t py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>Built with Next.js and shadcn/ui</p>
          <p>All processing happens locally in your browser</p>
        </div>
      </footer>
    </div>
  );
}
