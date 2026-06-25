import React, { useState, useEffect, useRef, useCallback } from 'react'
import Heading from './Heading.jsx'
import ColorPicker, { getTextColor } from './ColorPicker.jsx'
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import Notes from './Notes.jsx'

// ─── Sortable wrapper for notes ──────────────────────────────────────────────
// Passes dnd-kit drag attributes/listeners down into the Note's handle bar
export function SortableNote({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0 : 1,   // hide the original while DragOverlay shows the ghost
    zIndex: isDragging ? 1000 : 0,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {React.cloneElement(children, { dragAttributes: attributes, dragListeners: listeners })}
    </div>
  )
}

// ─── Sortable wrapper for headings ───────────────────────────────────────────
function SortableItem({ id, content }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 1000 : 0,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div
        {...attributes}
        {...listeners}
        className='group text-[14px] font-bold w-full h-6 p-0 bg-black/40 hover:bg-black/55 transition-colors cursor-grab active:cursor-grabbing flex items-center justify-between text-white text-xs font-semibold'
      >
        <div className="flex items-center justify-center h-6 w-6 m-0 p-0"> </div>
        :::
        <div className="flex flex-col justify-center items-center h-full w-6 m-0 p-0 group-hover:opacity-100 opacity-0 transition-opacity">
          <button
            onClick={content.props.onDeleteHeading}
            className="flex items-center justify-center text-white/90 text-xs font-black text-shadow-lg border-none h-6 w-6 m-0 p-0 bg-gray-400/0 hover:bg-red-700/85 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      <div>{content}</div>
    </div>
  )
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

const DEFAULT_PROJECT = {
  title: '',
  headings: [
    { id: crypto.randomUUID(), headingText: '', notes: [{ id: crypto.randomUUID(), text: '', color: '#ffffff' }] }
  ]
}

const createHeading = () => ({
  id: crypto.randomUUID(),
  headingText: '',
  notes: [{ id: crypto.randomUUID(), text: '', color: '#ffffff' }]
})

// Given the full headings array, find which heading contains a note with this id
function findHeadingIndexByNoteId(headings, noteId) {
  return headings.findIndex(h => h.notes.some(n => n.id === noteId))
}

// ─── Custom collision detection ───────────────────────────────────────────────
// Try pointerWithin first (accurate for nested containers), fall back to rectIntersection
function customCollisionDetection(args) {
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) return pointerCollisions
  return rectIntersection(args)
}

// ─── Project ─────────────────────────────────────────────────────────────────

function Project() {
  const [project, setProject] = useState(() => {
    try {
      const saved = localStorage.getItem('brainstorm-project')
      return saved ? JSON.parse(saved) : DEFAULT_PROJECT
    } catch {
      return DEFAULT_PROJECT
    }
  })

  // Track what is currently being dragged so DragOverlay can render it
  const [activeId, setActiveId] = useState(null)
  const [activeType, setActiveType] = useState(null) // 'note' | 'heading'
  const [activeNote, setActiveNote] = useState(null) // snapshot for DragOverlay

  const headingRefs = useRef([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  // ── State updaters ──────────────────────────────────────────────────────────

  const updateHeading = useCallback((headingIndex, updater) => {
    setProject(prev => ({
      ...prev,
      headings: prev.headings.map((hd, i) => i === headingIndex ? updater(hd) : hd)
    }))
  }, [])

  // ── Drag lifecycle ──────────────────────────────────────────────────────────

  const handleDragStart = ({ active }) => {
    const id = active.id
    const headings = project.headings

    // Is it a heading?
    if (headings.some(h => h.id === id)) {
      setActiveId(id)
      setActiveType('heading')
      setActiveNote(null)
      return
    }

    // Is it a note?
    const headingIndex = findHeadingIndexByNoteId(headings, id)
    if (headingIndex !== -1) {
      const note = headings[headingIndex].notes.find(n => n.id === id)
      setActiveId(id)
      setActiveType('note')
      setActiveNote(note)  // snapshot for DragOverlay
    }
  }

  // onDragOver: move notes between containers WHILE dragging (gives live placeholder)
  const handleDragOver = ({ active, over }) => {
    if (!over) return
    const activeId = active.id
    const overId = over.id
    if (activeId === overId) return

    const headings = project.headings

    // Only handle note-over-different-heading here
    const sourceIndex = findHeadingIndexByNoteId(headings, activeId)
    if (sourceIndex === -1) return  // it's a heading being dragged, skip

    let destIndex = findHeadingIndexByNoteId(headings, overId)
    if (destIndex === -1) destIndex = headings.findIndex(h => h.id === overId) // dropped on heading itself
    if (destIndex === -1 || sourceIndex === destIndex) return  // same container, handled in DragEnd

    // Move note from source to dest immediately so placeholder shows up
    setProject(prev => {
      const srcHeading = prev.headings[sourceIndex]
      const draggedNote = srcHeading.notes.find(n => n.id === activeId)
      if (!draggedNote) return prev

      const destHeading = prev.headings[destIndex]
      const overNoteIndex = destHeading.notes.findIndex(n => n.id === overId)
      const insertAt = overNoteIndex === -1 ? destHeading.notes.length : overNoteIndex

      return {
        ...prev,
        headings: prev.headings.map((hd, i) => {
          if (i === sourceIndex) return { ...hd, notes: hd.notes.filter(n => n.id !== activeId) }
          if (i === destIndex) {
            const newNotes = [...hd.notes]
            newNotes.splice(insertAt, 0, draggedNote)
            return { ...hd, notes: newNotes }
          }
          return hd
        })
      }
    })
  }

  // onDragEnd: handle final position commit
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    setActiveType(null)
    setActiveNote(null)

    if (!over || active.id === over.id) return

    const headings = project.headings

    // ── Heading reorder ──
    const activeHeadingIndex = headings.findIndex(h => h.id === active.id)
    const overHeadingIndex = headings.findIndex(h => h.id === over.id)

    if (activeHeadingIndex !== -1 && overHeadingIndex !== -1) {
      setProject(prev => ({
        ...prev,
        headings: arrayMove(prev.headings, activeHeadingIndex, overHeadingIndex)
      }))
      return
    }

    // ── Note reorder within same container ──
    // (cross-container move already happened in onDragOver, so here we only need same-column sort)
    const containerIndex = findHeadingIndexByNoteId(headings, active.id)
    if (containerIndex === -1) return

    const overContainerIndex = findHeadingIndexByNoteId(headings, over.id)
    if (overContainerIndex !== containerIndex) return  // cross-container already done

    const notes = headings[containerIndex].notes
    const oldIndex = notes.findIndex(n => n.id === active.id)
    const newIndex = notes.findIndex(n => n.id === over.id)
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    setProject(prev => ({
      ...prev,
      headings: prev.headings.map((hd, i) =>
        i === containerIndex
          ? { ...hd, notes: arrayMove(hd.notes, oldIndex, newIndex) }
          : hd
      )
    }))
  }

  const handleDragCancel = () => {
    setActiveId(null)
    setActiveType(null)
    setActiveNote(null)
  }

  // ── Persist ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    localStorage.setItem('brainstorm-project', JSON.stringify(project))
  }, [project])

  // ── Render ──────────────────────────────────────────────────────────────────

  // Collect all note ids across all headings for the flat SortableContext
  const allNoteIds = project.headings.flatMap(h => h.notes.map(n => n.id))

  return (
    <div className='flex flex-col items-center w-full p-4 overflow-auto'>
      <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-400 ease-in-out"
        onClick={() => {
          localStorage.removeItem('brainstorm-project')
          setProject({ title: '', headings: [createHeading()] })
        }}
      >
        Clear Project
      </button>

      <div className="project-title w-full mb-4 flex justify-center text-center">
        <span
          contentEditable="true"
          suppressContentEditableWarning
          className="border rounded p-2 min-w-[200px] text-center text-xl font-semibold bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Title"
          onInput={(e) => setProject(prev => ({ ...prev, title: e.currentTarget.textContent }))}
        ></span>
      </div>

      <div className="flex flex-row justify-center items-start gap-2 w-full">

        <button
          className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm transition duration-400 ease-in-out"
          onClick={() => {
            setProject(prev => ({ ...prev, headings: [createHeading(), ...prev.headings] }))
            setTimeout(() => headingRefs.current[0]?.focus(), 0)
          }}
        >
          + Add
        </button>

        {project.headings.length === 0 && (
          <div className="text-gray-400 italic mt-6">
            No headings yet — click "+ Add" to start brainstorming.
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {/* Heading-level sortable context */}
          <SortableContext
            items={project.headings.map(h => h.id)}
            strategy={horizontalListSortingStrategy}
          >
            {project.headings.map((heading, headingIndex) => (
              <SortableItem
                key={heading.id}
                id={heading.id}
                content={
                  <Heading
                    ref={(el) => headingRefs.current[headingIndex] = el}
                    heading={heading}
                    onChangeHeading={(newText) => updateHeading(headingIndex, hd => ({ ...hd, headingText: newText }))}
                    onChangeNotes={(noteId, newText) => updateHeading(headingIndex, hd => ({
                      ...hd,
                      notes: hd.notes.map(nt => nt.id === noteId ? { ...nt, text: newText } : nt)
                    }))}
                    onChangeNoteColor={(noteId, newColor) => updateHeading(headingIndex, hd => ({
                      ...hd,
                      notes: hd.notes.map(nt => nt.id === noteId ? { ...nt, color: newColor } : nt)
                    }))}
                    onAddNote={() => updateHeading(headingIndex, hd => ({
                      ...hd, notes: [...hd.notes, { id: crypto.randomUUID(), text: '' }]
                    }))}
                    onDeleteNote={(noteId) => updateHeading(headingIndex, hd => ({
                      ...hd, notes: hd.notes.filter(nt => nt.id !== noteId)
                    }))}
                    onReorderNotes={(reorderedNotes) => updateHeading(headingIndex, hd => ({
                      ...hd, notes: reorderedNotes
                    }))}
                    onDeleteHeading={() => setProject(prev => ({
                      ...prev,
                      headings: prev.headings.filter((_, idx) => idx !== headingIndex)
                    }))}
                  />
                }
              />
            ))}
          </SortableContext>

          {/* DragOverlay: floating ghost that follows the cursor while dragging */}
          <DragOverlay dropAnimation={null}>
            {activeType === 'note' && activeNote && (
              <div style={{ opacity: 0.9, pointerEvents: 'none' }}
                className='relative min-w-40 min-h-40 flex items-center flex-col justify-end'
              >
                {/* Drag bar — forced visible (no hover needed in the overlay) */}
                <div className='flex flex-row items-center justify-between min-w-40 w-full max-h-5
                  bg-gray-500 z-10'>
                  <div className='w-5 h-5' />
                  <div className='text-white text-xs flex-grow text-center'>:::</div>
                  <div className='w-5 h-5' />
                </div>
                {/* Note body */}
                <div className='min-h-40 p-4 border rounded w-40 whitespace-pre-wrap z-20'
                  style={{ backgroundColor: activeNote.color || '#ffffff', color: getTextColor(activeNote.color) }}
                >
                  {activeNote.text}
                </div>
              </div>
            )}
            {activeType === 'heading' && activeId && (() => {
              const h = project.headings.find(h => h.id === activeId)
              return h ? (
                <div style={{ opacity: 0.9, pointerEvents: 'none' }}>
                  {/* Heading drag bar — forced visible */}
                  <div className='w-full h-6 bg-black/40 flex items-center justify-between px-1 text-white text-xs font-semibold'>
                    <div className='w-6' />
                    :::
                    <div className='w-6' />
                  </div>
                  {/* Heading column body */}
                  <div className='flex flex-col items-center p-3 bg-black/20 shadow-md'>
                    <div className='flex items-center min-h-[58px] justify-center p-4 border rounded w-40 text-center font-medium bg-gray-200'>
                      {h.headingText || ''}
                    </div>
                    {h.notes.map(note => (
                      <div key={note.id} className='min-h-40 p-4 mt-1 border rounded w-40 bg-gray-100 whitespace-pre-wrap'>
                        {note.text}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            })()}
          </DragOverlay>
        </DndContext>

        <button
          className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm"
          onClick={() => {
            const newLength = project.headings.length
            setProject(prev => ({ ...prev, headings: [...prev.headings, createHeading()] }))
            setTimeout(() => headingRefs.current[newLength]?.focus(), 0)
          }}
        >
          + Add
        </button>
      </div>
    </div>
  )
}

export default Project