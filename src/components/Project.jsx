import React, { useState, useEffect, useRef } from 'react'
import Heading from './Heading.jsx'
import ColorPicker from './ColorPicker.jsx'

const DEFAULT_PROJECT = {
  title: '',
  headings: [
    { headingText: '', notes: [''] },
    { headingText: '', notes: [''] },
    { headingText: '', notes: [''] }
  ]
}

function Project() {
  const headingRefs = useRef([])

  // Helper to update a specific heading
  const updateHeading = (headingIndex, updater) => {
    setProject({
      ...project,
      headings: project.headings.map((hd, i) => {
        return i === headingIndex ? updater(hd) : hd
      })
    })
  }

  // Load project from localStorage or use default
  const [project, setProject] = useState(() => {
    const saved = localStorage.getItem('brainstorm-project')
    return saved ? JSON.parse(saved) : DEFAULT_PROJECT
  })

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
        {project.headings.map((heading, headingIndex) => (
          <Heading
            ref={(el) => headingRefs.current[headingIndex] = el}
            key={headingIndex}
            heading={heading}
            onChangeHeading={(newText) => {
              updateHeading(headingIndex, (hd) => ({ ...hd, headingText: newText }))
            }}
            onChangeNotes={(noteIndex, newText) => {
              updateHeading(headingIndex, (hd) => ({
                ...hd,
                notes: hd.notes.map((nt, ntIdx) => {
                  return ntIdx === noteIndex ? newText : nt
                })
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
        ))}

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

      {/* <pre className="mt-6 text-xs bg-gray-100 p-4 rounded">
        {JSON.stringify({ project }, null, 2)}
      </pre> */}
    </div>
  )
}

export default Project