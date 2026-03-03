import React, { forwardRef, useState } from 'react'
import ColorPicker from './ColorPicker'

const Notes = forwardRef(function Notes(
  { value, onChange, onDelete, noteIndex },
  ref
) {
  return (

      
    <div className='relative size-40 group overflow-y-hidden mt-3 flex items-center flex-col justify-end'>

    {/*Handle Bar*/}
      <div className='flex flex-row items-center justify-between w-40 max-h-5 -mb-8 bg-black/15 border rounded -translate-y-8 group-hover:-translate-y-3 transition-translate duration-150'>
        <ColorPicker />
        <div className='h-full w-auto m-0 text-white text-xs cursor-grab flex-grow text-center'>
          _-_
        </div>
        <button
          onClick={() => onDelete(noteIndex)}
         
                className="flex items-end justify-end text-white/90 text-xs font-black border border-grey bg-red-700/85 text-shadow-lg border rounded h-full m-0 pl-1 pr-1"
        >
          ✕
        </button>
      </div>

    {/* Note area */}
      <textarea
        rows={4}
        ref={ref}
        maxLength={200}
        className='resize-none flex self-end items-end justify-center p-4 border rounded size-40 bg-note-color overflow-y-auto'
        placeholder='Notes'
        value={value}
        onChange={onChange}
      />
    </div>
  )
})

export default Notes