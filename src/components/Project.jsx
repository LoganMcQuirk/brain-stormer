import React, { useState } from 'react'
import Heading from './Heading.jsx'



function Project() {
    // Future shape:
    // headings = [
    //   { title: '', notes: ['', ''] },
    //   { title: '', notes: ['', ''] },
    //   { title: '', notes: ['', ''] }
    // ]

    const [title, setTitle] = useState('')
    const [headings, setHeadings] = useState(['', '', ''])

    return (
        <div className='flex flex-col items-center w-full p-4'>
            <div className="project-title w-full mb-4  flex justify-center text-center">
                <input className="border rounded p-2 w-fit max-w-fit text-center text-xl font-semibold " placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="flex flex-row justify-end items-center gap-4 w-full">
                <Heading 
                    value={headings[0]}
                    onChange={(e) =>{
                        const newHeadings = [...headings]
                        newHeadings[0] = e.target.value
                        setHeadings(newHeadings)
                    }}                
                />
                
                
                <Heading 
                    value={headings[1]}
                        onChange={(e) =>{
                            const newHeadings = [...headings]
                            newHeadings[1] = e.target.value
                            setHeadings(newHeadings)
                        }}   
                    />
                <Heading 
                    value={headings[2]}
                    onChange={(e) =>{
                        const newHeadings = [...headings]
                        newHeadings[2] = e.target.value
                        setHeadings(newHeadings)
                    }}   
                />
                
                       
            </div>

            
                    <pre className="mt-6 text-xs bg-gray-100 p-4 rounded">
                    {JSON.stringify({ title, headings }, null, 2)}
                    </pre>
        </div>
        
        

    )
    
    
}

export default Project