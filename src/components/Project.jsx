import React, { useState, useEffect, useRef } from 'react'
import Heading from './Heading.jsx'
import ColorPicker from './ColorPicker.jsx'
import { DndContext, closestCenter, 
  useSensors, 
  useSensor, PointerSensor
} from '@dnd-kit/core' ;
import { 
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove

 } from '@dnd-kit/sortable';

//need to add handlers for function for drag and drop of headings to begin with, then can add for notes within headings if time allows.

/**
 * @typedef {Object} Item
 * @property {any} id
 * @property {any} content
 */

/**
 * @param {{ id: any, content: any }} props
 */

function SortableItem({ id, content }) { 

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: `translate3d(${transform ? transform.x : 0}px, ${transform ? transform.y : 0}px, 0)`,
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div 
        {...attributes} 
        {...listeners}
        className='w-full h-8 bg-gray-400 hover:bg-gray-500 cursor-grab active:cursor-grabbing flex items-center justify-center rounded-t text-white text-xs font-semibold'
      >
        ⋮⋮ Drag to reorder
      </div>
      <div>
        {content}
      </div>
    </div>
  );



}







const DEFAULT_PROJECT = {
  title: '',
  headings: [
    { headingText: '', notes: [''] },
    { headingText: '', notes: [''] },
    { headingText: '', notes: [''] }
  ]
}

function Project() {

  // Load project from localStorage or use default
  const [project, setProject] = useState(() => {
    const saved = localStorage.getItem('brainstorm-project')
    return saved ? JSON.parse(saved) : DEFAULT_PROJECT
  })

  const headingRefs = useRef([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  /**
   * @param {number} headingIndex
   * @param {Function} updater
   */
  const updateHeading = (headingIndex, updater) => {
    setProject({
      ...project,
      headings: project.headings.map((hd, i) => {
        return i === headingIndex ? updater(hd) : hd
      })
    })
  }

  /**
   * @param {Object} event - DragEndEvent
   * @param {Object} event.active - Active draggable
   * @param {Object} event.over - Over droppable
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = active.id;
      const newIndex = over.id;

      setProject({
        ...project,
        headings: arrayMove(project.headings, oldIndex, newIndex)
      });
    }
  }

  // Save project to localStorage on changes
  useEffect(() => {
    localStorage.setItem('brainstorm-project', JSON.stringify(project))
  }, [project])

  // Render
  return (
    <div className='flex flex-col items-center w-full p-4 overflow-hidden'>
      <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-400 ease-in-out"
        onClick={() => {
          localStorage.removeItem('brainstorm-project')
          const resetProject = {
            title: '',
            headings: DEFAULT_PROJECT.headings.map(h => ({
              headingText: '',
              notes: Array(h.notes.length).fill('')
            }))
          }
          setProject(resetProject)
        }}
      >
        Clear Project
      </button>

      {/* The Color picker below is only a temporary dev tool for quick visualisation of design ideas without code edits */}
      <ColorPicker />

      <div className="project-title w-full mb-4 flex justify-center text-center">
        <input
          className="border rounded p-2 w-fit max-w-fit text-center text-xl font-semibold"
          placeholder="Title"
          value={project.title}
          onChange={(e) => {
            setProject({ ...project, title: e.target.value })
          }}
        />
      </div>

      <div className="flex flex-row justify-center items-start gap-2 w-full">

        {/* Left Add heading Button */}
        <button
          className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm transition duration-400 ease-in-out"
          onClick={() => {
            setProject({
              ...project,
              headings: [{ headingText: '', notes: [''] }, ...project.headings]
            })
            setTimeout(() => {
              headingRefs.current[0]?.focus()
            }, 0)
          }}
        >
          + Add
        </button>
          {/* No headings display */}
        {project.headings.length === 0 && (
          <div className="text-gray-400 italic mt-6">
            No headings yet — click "+ Add" to start brainstorming.
          </div>
        )}
        {/* Headings */}

        <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={project.headings.map((_, i) => i)} 
          strategy={horizontalListSortingStrategy}
        >
          {project.headings.map((heading, headingIndex) => (
            <SortableItem 
              key={headingIndex}
              id={headingIndex}
              content={
                <Heading
                  ref={(el) => headingRefs.current[headingIndex] = el}
                  heading={heading}
                  onChangeHeading={(newText) => {
                    updateHeading(headingIndex, (hd) => ({ ...hd, headingText: newText }))
                  }}
                  onChangeNotes={(noteIndex, newText) => {
                    updateHeading(headingIndex, (hd) => ({
                      ...hd,
                      notes: hd.notes.map((nt, ntIdx) => ntIdx === noteIndex ? newText : nt)
                    }))
                  }}
                  onAddNote={() => {
                    updateHeading(headingIndex, (hd) => ({ ...hd, notes: [...hd.notes, ''] }))
                  }}
                  onDeleteNote={(noteIndex) => {
                    updateHeading(headingIndex, (hd) => ({
                      ...hd,
                      notes: hd.notes.filter((_, idx) => idx !== noteIndex)
                    }))
                  }}
                  onDeleteHeading={() => {
                    setProject({
                      ...project,
                      headings: project.headings.filter((_, idx) => idx !== headingIndex)
                    })
                  }}
                />
              }
            />
          ))}
        </SortableContext>
      </DndContext>

        {/* Right Add heading Button */}
        <button
          className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm"
          onClick={() => {
            const newLength = project.headings.length
            setProject({
              ...project,
              headings: [...project.headings, { headingText: '', notes: [''] }]
            })
            setTimeout(() => {
              headingRefs.current[newLength]?.focus()
            }, 0)
          }}
        >
          + Add
        </button>
      </div>

      <pre className="mt-6 text-xs bg-gray-100 p-4 rounded">
        {JSON.stringify({ project }, null, 2)}
      </pre>
    </div>
  )
}

export default Project