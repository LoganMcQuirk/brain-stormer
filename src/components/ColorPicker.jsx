import { useState, useEffect } from 'react';

// When used inside a Note, pass `color` and `onColorChange` as props.
// When used standalone (e.g. the dev tool in Project), it falls back to
// the old global CSS variable behaviour so nothing else breaks.
function ColorPicker({ color, onColorChange }) {
  const isControlled = color !== undefined && onColorChange !== undefined;

  const [localColor, setLocalColor] = useState(() => {
    if (isControlled) return color;
    return localStorage.getItem('noteColor') || '#fbbf24';
  });

  const handleColorChange = (e) => {
    const hex = e.target.value;

    if (isControlled) {
      onColorChange(hex);
    } else {
      // Legacy global mode
      setLocalColor(hex);
      const rgb = hexToRgb(hex);
      document.documentElement.style.setProperty('--color-note', `${rgb.r} ${rgb.g} ${rgb.b}`);
      localStorage.setItem('noteColor', hex);
    }
  };

  // Sync local display when controlled value changes externally
  useEffect(() => {
    if (isControlled) setLocalColor(color);
  }, [color, isControlled]);

  // Legacy: load saved colour on mount when uncontrolled
  useEffect(() => {
    if (!isControlled) {
      const saved = localStorage.getItem('noteColor');
      if (saved) {
        setLocalColor(saved);
        const rgb = hexToRgb(saved);
        document.documentElement.style.setProperty('--color-note', `${rgb.r} ${rgb.g} ${rgb.b}`);
      }
    }
  }, []);

  return (
    <div>
      <input
        type="color"
        value={isControlled ? color : localColor}
        onChange={handleColorChange}
        className='w-5 h-5 border border-radius-50'
      />
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Returns '#ffffff' or '#000000' depending on how dark the background colour is.
// Threshold of 382 (half of max 765) works well in practice — tune if needed.
export function getTextColor(hex) {
  const { r, g, b } = hexToRgb(hex || '#fbbf24');
  return (r + g + b) < 382 ? '#ffffff' : '#000000';
}

export default ColorPicker;