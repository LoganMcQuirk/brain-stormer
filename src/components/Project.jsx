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


function SortableNote({ id, children }) { 
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform ? transform.x : 0}px, ${transform ? transform.y : 0}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 1000 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      
       {React.cloneElement(children, { dragAttributes: attributes, dragListeners: listeners })}
    </div>
  );
}

// Sortable item component for headings

function SortableItem({ id, content }) { 

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform ? transform.x : 0}px, ${transform ? transform.y : 0}px, 0)` : undefined,
    transition,
    cursor: 'grab',
    zIndex: isDragging ? 1000 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div 
        {...attributes} 
        {...listeners}
        className='group text-[14px] font-bold w-full h-6 p-0 bg-black/40 hover:bg-black/55 transition-colors cursor-grab active:cursor-grabbing flex items-center justify-between text-white text-xs font-semibold'
      >
        <div className="flex  items-center justify-center h-6 w-6 m-0 p-0"> </div>
        :::
          <div className="flex flex-col justify-center items-center h-full w-6 m-0 p-0 group-hover:opacity-100 opacity-0 transition-opacity">
            <button onClick={content.props.onDeleteHeading} className="flex items-center justify-center text-white/90 text-xs font-black bg-red-700/85 text-shadow-lg 
            border-none h-6 w-6 m-0 p-0 bg-gray-400/0 hover:bg-red-700/85 transition-colors transition-opacity">
              ✕
            </button>
        </div>
      </div>
      
      <div>
        {content}
      </div>
    </div>
  );



}

// Default project structure for new projects or when clearing existing project.

const DEFAULT_PROJECT = {
  title: '',
  headings: [
    { id: crypto.randomUUID(), headingText: '', notes: [{ id: crypto.randomUUID(), text: '', color: '#fbbf24' }] }
  ]
}

// Use crypto.randomUUID() to generate new headings new Unique ID's. Stablises Dnd-kit keys
const createHeading = () => ({
  id: crypto.randomUUID(),
  headingText: '',
  notes: [{ id: crypto.randomUUID(), text: '', color: '#fbbf24' }]
})


// Full project component that manages the overall state of the brainstorming project
// Includes title, headings, and notes. Handles adding, updating, deleting, and reordering of headings and notes. 
// Persists project state to localStorage for data persistence across sessions.

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

  
  const updateHeading = (headingIndex, updater) => {
    setProject({
      ...project,
      headings: project.headings.map((hd, i) => {
        return i === headingIndex ? updater(hd) : hd
      })
    })
  }

  


  // // Handle drag end to reorder headings
  // const handleDragEnd = (event) => {
  //   const { active, over } = event;

  //   if (over && active.id !== over.id) {
  //     const oldIndex = project.headings.findIndex(h => h.id === active.id)
  //     const newIndex = project.headings.findIndex(h => h.id === over.id)

  //     setProject({
  //       ...project,
  //       headings: arrayMove(project.headings, oldIndex, newIndex)
  //     });
  //   }
  // }

  // Handle drag end to reorder headings
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = project.headings.findIndex(h => h.id === active.id)
      const newIndex = project.headings.findIndex(h => h.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        setProject({
          ...project,
          headings: arrayMove(project.headings, oldIndex, newIndex)
        });
      }
    }
  }

  // Save project to localStorage on changes
  useEffect(() => {
    localStorage.setItem('brainstorm-project', JSON.stringify(project))
  }, [project])

  // Render
  return (
    <div className='flex flex-col items-center w-full p-4 overflow-auto'>
      <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-400 ease-in-out"
        onClick={() => {
          localStorage.removeItem('brainstorm-project')
          const resetProject = {
            title: '',
            headings: DEFAULT_PROJECT.headings.map(h => ({
              id: h.id,
              headingText: '',
              notes: Array(h.notes.length).fill({id: crypto.randomUUID(), text: ''})
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
        <span contenteditable="true"
          className="border rounded p-2 min-w-[200px] text-center text-xl font-semibold bg-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Title"
          value={project.title}
          onChange={(e) => {
            setProject({ ...project, title: e.target.value })
          }}
        ></span>
      </div>

      <div className="flex flex-row justify-center items-start gap-2 w-full">

        {/* Left Add heading Button */}
        <button
          className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm transition duration-400 ease-in-out"
          onClick={() => {
            setProject({
              ...project,
              headings: [createHeading(), ...project.headings]
            })
            setTimeout(() => {
              headingRefs.current[0]?.focus()
            }, 0)
          }}
        >
          + Add
        </button>
        {/* style={{ display: project.headings.length === 9 ? 'none' : 'block' }} */}
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
                  onChangeHeading={(newText) => {
                    updateHeading(headingIndex, (hd) => ({ ...hd, headingText: newText }))
                  }}
                  onChangeNotes={(noteId, newText) => {
                    updateHeading(headingIndex, (hd) => ({
                      ...hd,
                      notes: hd.notes.map((nt) => nt.id === noteId ? { ...nt, text: newText } : nt)
                    }))
                  }}
                  onAddNote={() => {
                    updateHeading(headingIndex, (hd) => ({ ...hd, notes: [...hd.notes, { id: crypto.randomUUID(), text: '' }] }))
                  }}
                  onDeleteNote={(noteId) => {
                    updateHeading(headingIndex, (hd) => ({
                      ...hd,
                      notes: hd.notes.filter((nt) => nt.id !== noteId)
                    }))
                  }}
                  onReorderNotes={(reorderedNotes) => {
                    updateHeading(headingIndex, (hd) => ({
                      ...hd,
                      notes: reorderedNotes
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
              headings: [...project.headings, createHeading()]
            })
            setTimeout(() => {
              headingRefs.current[newLength]?.focus()
            }, 0)
          }}
        >
          + Add
        </button>
        {/*style={{ display: project.headings.length === 9 ? 'none' : 'block' }}*/}
      </div>

      {/* <pre className="mt-6 text-xs bg-gray-100 p-4 rounded">
        {JSON.stringify({ project }, null, 2)}
      </pre> */}
    </div>
  )
}
export { SortableNote }
export default Project