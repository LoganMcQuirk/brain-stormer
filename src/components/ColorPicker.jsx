import { useState, useEffect } from 'react';

function ColorPicker() {
  const [noteColor, setNoteColor] = useState('#fbbf24'); // amber-400 default

  const handleColorChange = (e) => {
    const hexColor = e.target.value;
    setNoteColor(hexColor);
    
    // Convert hex to RGB
    const rgb = hexToRgb(hexColor);
    
    // Update CSS variable
    document.documentElement.style.setProperty(
      '--color-note',
      `${rgb.r} ${rgb.g} ${rgb.b}`
    );
    
    // Optional: Save to localStorage
    localStorage.setItem('noteColor', hexColor);
  };

  // Load saved color on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('noteColor');
    if (savedColor) {
      setNoteColor(savedColor);
      const rgb = hexToRgb(savedColor);
      document.documentElement.style.setProperty(
        '--color-note',
        `${rgb.r} ${rgb.g} ${rgb.b}`
      );
    }
  }, []);

  return (
    <div>
      <label>
        Choose Note Color:
        <input 
          type="color" 
          value={noteColor}
          onChange={handleColorChange}
        />
      </label>
    </div>
  );
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export default ColorPicker;