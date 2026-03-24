import React from 'react';

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.1,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">Temperature</label>
        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {(value || 0).toFixed(1)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className={`
          w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Precise</span>
        <span>Creative</span>
      </div>
    </div>
  );
};
