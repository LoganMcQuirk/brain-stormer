import React, { forwardRef, useEffect, useRef } from 'react'
import ColorPicker, { getTextColor } from './ColorPicker'

const Notes = forwardRef(function Notes(
  { value, onChange, onDelete, noteIndex, color, onColorChange, dragAttributes, dragListeners },
  ref
) {
  // Internal ref for the contentEditable span
  const spanRef = useRef(null)

  // Merge external ref with internal ref
  const setRef = (el) => {
    spanRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  // Set innerHTML only on mount (or when the note ID changes = new note mounted).
  // We do NOT update innerHTML on every `value` change — that would reset the cursor.
  // Text stays in sync via onInput writing back to state.
  useEffect(() => {
    if (spanRef.current && spanRef.current.textContent !== (value ?? '')) {
      spanRef.current.textContent = value ?? ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteIndex]) // noteIndex = note id, so this fires when a new note mounts
  return (

      
    <div className='relative min-w-40 min-h-40 group overflow-y-hidden mb-1 flex items-center flex-col justify-end'>
      
    {/*Handle Bar*/}
      <div className='flex flex-row items-center justify-between min-w-40 w-full max-h-5 translate-y-6 group-hover:translate-y-0 transition-translate duration-100
      bg-gray-500 hover:bg-gray-600 cursor-grab active:cursor-grabbing z-10'
        {...dragAttributes}
        {...dragListeners}
      >
        <ColorPicker color={color} onColorChange={onColorChange} />
        <div className='h-full w-auto m-0 text-white text-xs cursor-grab flex-grow text-center z-30'>
          :::
        </div>
        <button
          onClick={() => onDelete(noteIndex)}
          
          className=" z-30 flex flex-col items-center justify-center text-white/90 text-xs border-none font-black bg-gray-400/0 hover:bg-rose-700/85 text-shadow-lg h-full w-5 m-0 p-0"
        >
          ✕
        </button>
      </div>

    {/* Note area */}
      <span contentEditable='true'
        suppressContentEditableWarning
        ref={setRef}
        className='resize-xflex items-center min-h-40 justify-center p-4 mb-[1px] border rounded w-40 flex-wrap
        cursor-default focus:cursor-text focus:outline-none focus:ring-2 focus:ring-cyan-500 whitespace z-20'
        style={{ backgroundColor: color || '#ffffff', color: getTextColor(color) }}
        placeholder='Notes'
        onInput={(e) => onChange({ target: { value: e.currentTarget.textContent } })}
      ></span>
    </div>
  )
})

export default Notes