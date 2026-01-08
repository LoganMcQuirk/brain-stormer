import React, { useState } from 'react'
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

    const [project, setProject] = useState(DEFAULT_PROJECT)


    return (
        
        <div className='flex flex-col items-center w-full p-4'>
            <button
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                
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
                <Heading 
                    heading={project.headings[0]}
                    onChangeHeading={(newText) => {
                            const newProject = {...project}
                            newProject.headings[0].headingText = newText
                            setProject(newProject)    
                        }
                        
                    }  
                    
                    onChangeNotes={(noteIndex, newText) => {
                                const newProject = {...project}
                                newProject.headings[0].notes[noteIndex] = newText
                                setProject(newProject)
                            }
                        }
                    onAddNote={() => {
                            const newProject = {...project}
                            newProject.headings[0].notes = [...newProject.headings[0].notes, '']
                            setProject(newProject)
                        }
                    }
                />
                
                
                <Heading 
                    heading={project.headings[1]}
                    onChangeHeading={(newText) => {
                            const newProject = {...project}
                            newProject.headings[1].headingText = newText
                            setProject(newProject)    
                        }  
                    }
                    onChangeNotes={(noteIndex, newText) => {
                                const newProject = {...project}
                                newProject.headings[1].notes[noteIndex] = newText
                                setProject(newProject)
                            }
                        }
                    onAddNote={() => {
                            const newProject = {...project}
                            newProject.headings[1].notes = [...newProject.headings[1].notes, '']
                            setProject(newProject)
                        }
                    }
                    />
                <Heading 
                    heading={project.headings[2]}
                    onChangeHeading={(newText) => {
                            const newProject = {...project}
                            newProject.headings[2].headingText = newText
                            setProject(newProject)    
                        }
                    }
                    onChangeNotes={(noteIndex, newText) => {
                                const newProject = {...project}
                                newProject.headings[2].notes[noteIndex] = newText
                                setProject(newProject)
                            }
                        }
                    onAddNote={() => {
                            const newProject = {...project}
                            newProject.headings[2].notes = [...newProject.headings[2].notes, '']
                            setProject(newProject)
                        }
                    }
                />
                
                       
            </div>
            
                    <pre className="mt-6 text-xs bg-gray-100 p-4 rounded">
                    {JSON.stringify({ project }, null, 2)}
                    </pre>
        </div>
        
        

    )
    
    
}

export default Project