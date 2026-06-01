import React, { forwardRef, useState } from 'react'
import ColorPicker from './ColorPicker'

const Notes = forwardRef(function Notes(
  { value, onChange, onDelete, noteIndex, dragAttributes, dragListeners },
  ref
) {
  return (

      
    <div className='relative min-w-40 min-h-40 group overflow-y-hidden mb-1 flex items-center flex-col justify-end'>
      
    {/*Handle Bar*/}
      <div className='flex flex-row items-center justify-between min-w-40 w-full max-h-5 translate-y-6 group-hover:translate-y-0 transition-translate duration-100
      bg-gray-500 hover:bg-gray-600 cursor-grab active:cursor-grabbing z-10'
        {...dragAttributes}
        {...dragListeners}
      >
        <ColorPicker />
        <div className='h-full w-auto m-0 text-white text-xs cursor-grab flex-grow text-center z-30'>
          :::
        </div>
        <button
          onClick={() => onDelete(noteIndex)}
          
          className=" z-30 flex flex-col items-center justify-center text-white/90 text-xs border-none font-black bg-gray-400/0 hover:bg-red-700/85 text-shadow-lg h-full w-5 m-0 p-0"
        >
          ✕
        </button>
      </div>

    {/* Note area */}
      <span contentEditable='true'
        rows={4}
        ref={ref}
        maxLength={200}
        className='resize-xflex items-center min-h-40 justify-center p-4 mb-[1px] border rounded w-40 flex-wrap
        bg-note-color cursor-default focus:cursor-text focus:outline-none focus:ring-2 focus:ring-cyan-500 whitespace z-20'
        placeholder='Notes'
        value={value}
        onChange={onChange}
      ></span>
    </div>
  )
})

export default Notes