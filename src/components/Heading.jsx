import React, { useState, useRef, forwardRef } from 'react'
import Notes from './Notes.jsx'
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { SortableNote } from './Project.jsx'

const Heading = forwardRef(function Heading(
  {
    heading,
    onChangeHeading,
    onDeleteHeading,
    onChangeNotes,
    onAddNote,
    onDeleteNote,
    onReorderNotes
  },
  ref
) {
  const noteRefs = useRef([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleNoteDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = heading.notes.findIndex(n => n.id === active.id)
      const newIndex = heading.notes.findIndex(n => n.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderNotes(arrayMove(heading.notes, oldIndex, newIndex))
      }
    }
  }

  return (
    <div className='relative flex flex-col justify-center items-center  p-3 bg-black/20 shadow-sm hover:shadow-md transition-shadow'>
      
      <input
        className='flex items-center justify-center p-4 mb-[1px] border rounded w-40 text-center font-medium flex-wrap'
        placeholder='Heading'
        maxLength={22}
        ref={ref}
        value={heading.headingText}
        onChange={(e) => onChangeHeading(e.target.value)}
      />
        
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleNoteDragEnd}
      >
        <SortableContext 
          items={heading.notes.map(n => n.id)}
          strategy={verticalListSortingStrategy}
        >
          {heading.notes.map((note, i) => (
            <SortableNote key={note.id} id={note.id}>
              <Notes
                ref={(el) => noteRefs.current[i] = el}
                value={note.text}
                onChange={(e) => onChangeNotes(note.id, e.target.value)}
                onDelete={() => onDeleteNote(note.id)}
                noteIndex={note.id}
              />
            </SortableNote>
          ))}
        </SortableContext>
      </DndContext>
        
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