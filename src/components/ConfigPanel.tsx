'use client';

import React from 'react';
import { AsciiConfig, CharacterSet } from '@/lib/ascii-converter';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ConfigPanelProps {
  config: AsciiConfig;
  onConfigChange: (updates: Partial<AsciiConfig>) => void;
  onReset: () => void;
  disabled?: boolean;
}

const CHARACTER_SETS: { value: CharacterSet; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'standard', label: 'Standard' },
  { value: 'dense', label: 'Dense' },
  { value: 'blocks', label: 'Blocks' },
];

export function ConfigPanel({ config, onConfigChange, onReset, disabled }: ConfigPanelProps) {
  return (
    <div className="space-y-6">
      {/* Resolution */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Resolution</Label>
          <span className="text-xs text-muted-foreground tabular-nums">{config.resolution} chars</span>
        </div>
        <Slider
          value={[config.resolution]}
          min={40}
          max={200}
          step={5}
          onValueChange={([value]) => onConfigChange({ resolution: value })}
          disabled={disabled}
        />
      </div>
      
      {/* Character Set */}
      <div className="space-y-2">
        <Label className="text-sm">Character Set</Label>
        <div className="grid grid-cols-2 gap-2">
          {CHARACTER_SETS.map((item) => (
            <Button
              key={item.value}
              variant={config.charset === item.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onConfigChange({ charset: item.value })}
              disabled={disabled}
              className="w-full"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Contrast */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Contrast</Label>
          <span className="text-xs text-muted-foreground tabular-nums">{config.contrast.toFixed(1)}x</span>
        </div>
        <Slider
          value={[config.contrast]}
          min={0.5}
          max={2.0}
          step={0.1}
          onValueChange={([value]) => onConfigChange({ contrast: value })}
          disabled={disabled}
        />
      </div>
      
      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="invert" className="text-sm font-normal">Invert Colors</Label>
          <Switch
            id="invert"
            checked={config.invert}
            onCheckedChange={(checked) => onConfigChange({ invert: checked })}
            disabled={disabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="color-mode" className="text-sm font-normal">Color Mode</Label>
          <Switch
            id="color-mode"
            checked={config.colorMode === 'colored'}
            onCheckedChange={(checked) => onConfigChange({ colorMode: checked ? 'colored' : 'monochrome' })}
            disabled={disabled}
          />
        </div>
      </div>
      
      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        disabled={disabled}
        className="w-full text-muted-foreground"
      >
        Reset to defaults
      </Button>
    </div>
  );
}
