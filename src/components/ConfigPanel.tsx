'use client';

import React from 'react';
import { AsciiConfig, CharacterSet } from '@/lib/ascii-converter';

interface ConfigPanelProps {
  config: AsciiConfig;
  onConfigChange: (updates: Partial<AsciiConfig>) => void;
  onReset: () => void;
  disabled?: boolean;
}

const CHARACTER_SET_OPTIONS: { value: CharacterSet; label: string; preview: string }[] = [
  { value: 'simple', label: 'Simple', preview: '@%#*+=-:.' },
  { value: 'standard', label: 'Standard', preview: '$@B%8&WM#*o...' },
  { value: 'dense', label: 'Dense', preview: '@QB#NgWM8RD...' },
  { value: 'blocks', label: 'Blocks', preview: '█▓▒░' },
];

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

function Slider({ label, value, min, max, step = 1, onChange, formatValue, disabled }: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString();
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm text-accent font-mono">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full disabled:opacity-50"
      />
    </div>
  );
}

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Toggle({ label, description, checked, onChange, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-muted mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`toggle-switch ${checked ? 'active' : ''} disabled:opacity-50`}
        aria-pressed={checked}
      />
    </div>
  );
}

export function ConfigPanel({ config, onConfigChange, onReset, disabled }: ConfigPanelProps) {
  return (
    <div className="space-y-6">
      {/* Resolution */}
      <Slider
        label="Resolution"
        value={config.resolution}
        min={40}
        max={200}
        step={5}
        onChange={(value) => onConfigChange({ resolution: value })}
        formatValue={(v) => `${v} chars`}
        disabled={disabled}
      />
      
      {/* Character Set */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Character Set</label>
        <div className="grid grid-cols-2 gap-2">
          {CHARACTER_SET_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onConfigChange({ charset: option.value })}
              disabled={disabled}
              className={`
                p-3 rounded-lg border text-left transition-all
                ${config.charset === option.value 
                  ? 'border-primary bg-primary/10 text-foreground' 
                  : 'border-border hover:border-primary/50 text-muted hover:text-foreground'
                }
                disabled:opacity-50 disabled:pointer-events-none
              `}
            >
              <div className="text-sm font-medium mb-1">{option.label}</div>
              <div className="text-xs font-mono text-muted truncate">{option.preview}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Contrast */}
      <Slider
        label="Contrast"
        value={config.contrast}
        min={0.5}
        max={2.0}
        step={0.1}
        onChange={(value) => onConfigChange({ contrast: value })}
        formatValue={(v) => `${v.toFixed(1)}x`}
        disabled={disabled}
      />
      
      {/* Toggles */}
      <div className="space-y-3 pt-2">
        <Toggle
          label="Invert Colors"
          description="Swap light and dark"
          checked={config.invert}
          onChange={(checked) => onConfigChange({ invert: checked })}
          disabled={disabled}
        />
        
        <Toggle
          label="Color Mode"
          description={config.colorMode === 'colored' ? 'Full color from image' : 'Grayscale only'}
          checked={config.colorMode === 'colored'}
          onChange={(checked) => onConfigChange({ colorMode: checked ? 'colored' : 'monochrome' })}
          disabled={disabled}
        />
      </div>
      
      {/* Reset Button */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="
          w-full py-2.5 px-4 rounded-lg
          border border-border text-muted
          hover:border-primary/50 hover:text-foreground
          transition-colors text-sm font-medium
          disabled:opacity-50 disabled:pointer-events-none
        "
      >
        Reset to Defaults
      </button>
    </div>
  );
}

