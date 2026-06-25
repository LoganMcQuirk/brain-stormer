import React, { useRef, forwardRef } from 'react'
import Notes from './Notes.jsx'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableNote } from './Project.jsx'

const Heading = forwardRef(function Heading(
  {
    heading,
    onChangeHeading,
    onDeleteHeading,
    onChangeNotes,
    onChangeNoteColor,
    onAddNote,
    onDeleteNote,
    onReorderNotes,
  },
  ref
) {
  const noteRefs = useRef([])

  return (
    <div className='relative flex flex-col justify-center items-center p-3 bg-black/20 shadow-sm hover:shadow-md transition-shadow'>

      <span
        contentEditable='true'
        suppressContentEditableWarning
        className='flex items-center min-h-[58px] justify-center p-4 mb-[1px] border rounded w-40 text-center font-medium flex-wrap
          bg-gray-200 cursor-default focus:cursor-text focus:outline-none focus:ring-2 focus:ring-cyan-500'
        placeholder='Heading'
        ref={ref}
        onInput={(e) => onChangeHeading(e.currentTarget.textContent)}
      ></span>

      {/*
        SortableContext registers this column's note IDs with the parent DndContext.
        No nested DndContext here — the parent handles all drag events.
      */}
      <SortableContext
        items={heading.notes.map(n => n.id)}
        strategy={verticalListSortingStrategy}
      >
        {heading.notes.map((note, i) => (
          <SortableNote key={note.id} id={note.id}>
            <Notes
              ref={(el) => noteRefs.current[i] = el}
              value={note.text}
              color={note.color}
              onChange={(e) => onChangeNotes(note.id, e.target.value)}
              onColorChange={(newColor) => onChangeNoteColor(note.id, newColor)}
              onDelete={() => onDeleteNote(note.id)}
              noteIndex={note.id}
            />
          </SortableNote>
        ))}
      </SortableContext>

      <button
        className='mt-2 px-2 py-1
        bg-gradient-to-r from-cyan-500 to-sky-500
        text-white rounded-full text-sm font-medium
        shadow-md shadow-cyan-500/20
        hover:shadow-lg hover:shadow-cyan-500/30
        hover:from-cyan-600 hover:to-sky-600
        transition-all duration-300'
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