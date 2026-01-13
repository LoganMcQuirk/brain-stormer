import React, { useState, useEffect } from 'react'
import Heading from './Heading.jsx'

const DEFAULT_PROJECT = {
        title: '',
        headings: [
            {headingText:'', 
                notes:['']},
            {headingText:'', 
                notes:['']},
            {headingText:'', 
                notes:['']}
        ]

    }

function Project() {

    const [project, setProject] = useState(() => {
        const saved = localStorage.getItem('brainstorm-project')
        return saved ? JSON.parse(saved) : DEFAULT_PROJECT
    })

    
    useEffect(() => {
        localStorage.setItem('brainstorm-project', JSON.stringify(project))
    }, [project])


    return (
        
        <div className='flex flex-col items-center w-full p-4'>
            <button
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
            
            <div className="project-title w-full mb-4  flex justify-center text-center">
                <input className="border rounded p-2 w-fit max-w-fit text-center text-xl font-semibold " placeholder="Title"
                    value={project.title}
                    onChange={(e) => {
                        setProject({
                            ...project,
                            title: e.target.value
                        }
                        )
                        
                        }
                    }
                />
            </div>
            

            <div className="flex flex-row justify-end items-start gap-4 w-full">

                <button
                    className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm  "
                    onClick={() => {
                        
                        setProject({...project, 
                            headings: [{headingText: '', notes: ['']}, ...project.headings ]
                        })
                    }}
                >
                + Add
                </button>

                {project.headings.map((heading, headingIndex) => (
                    <Heading
                        key={headingIndex}
                        heading={heading}
                        onChangeHeading={(newText) => {
                            const newProject = {...project,
                                headings: project.headings.map((hd, i) => {
                                        return i === headingIndex ? {...hd, headingText: newText} :  hd    
                                    }
                                )
                            }
                            setProject(newProject)
                            
                        }}
                        onChangeNotes={(noteIndex, newText) => {
                            const newProject = {...project, 
                                headings: project.headings.map((hd, i) => {
                                    return i === headingIndex
                                        ? {...hd, 
                                            notes: hd.notes.map((nt, ntIdx) => {
                                                return ntIdx === noteIndex ? newText : nt
                                            })} 
                                        : hd 
                                })
                            }
                            setProject(newProject)
                        }}
                        onAddNote={() => {
                            const newProject = {...project,
                                headings: project.headings.map((hd, i) => {
                                    return i === headingIndex ? {...hd, notes: [...hd.notes, '']} : hd
                                })
                            }
                            
                            setProject(newProject)
                        }}
                    
                    />
                ))}  
                

                
                
                <button
                    className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm  "
                    onClick={() => {
                        
                        setProject({...project, 
                            headings: [...project.headings, {headingText: '', notes: ['']}]
                        })
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