import React, { useState, useRef, forwardRef } from 'react'
import Notes from './Notes.jsx'

const Heading = forwardRef(function Heading(
  {
    heading,
    onChangeHeading,
    onDeleteHeading,
    onChangeNotes,
    onAddNote,
    onDeleteNote
  },
  ref
) {
  const noteRefs = useRef([])

  return (
    <div className='relative flex flex-col justify-center items-center p-3 rounded-lg bg-black/15 shadow-sm hover:shadow-md transition-shadow'>
      <button onClick={onDeleteHeading} className='text-red-600 text-xs mb-2'>
        Delete Heading
      </button>
      <input
        className='flex items-center justify-center p-4 border rounded w-40 text-center font-medium'
        placeholder='Heading'
        maxLength={22}
        ref={ref}
        value={heading.headingText}
        onChange={(e) => onChangeHeading(e.target.value)}
      />
      {heading.notes.map((noteText, i) => (
        <div key={i} className='flex items-center gap-1'>
          <Notes
            ref={(el) => noteRefs.current[i] = el}
            value={noteText}
            onChange={(e) => onChangeNotes(i, e.target.value)}
            onDelete={onDeleteNote}
            noteIndex={i}
          />
        </div>
      ))}
      <button
        className='mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm transition duration-400 ease-in-out'
        onClick={() => {
          onAddNote()
          setTimeout(() => {
            noteRefs.current[heading.notes.length]?.focus()
          }, 0)
        }}
      >
        + Add Note
      </button>
    </div>
  )
})

export default Heading    