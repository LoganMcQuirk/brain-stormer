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
        className='resize-y flex self-end items-start justify-start p-3 border border-gray-300/0 rounded min-w-40 min-h-40 bg-note-color 
         focus:outline-none focus:ring-1 focus:ring-cyan-400 z-20 cursor-text group-hover:rounded-t-[0px] transition-all duration-200 whitespace pre-wrap break-words'
        placeholder='Notes'
        value={value}
        onChange={onChange}
      ></span>
    </div>
  )
})

export default Notes