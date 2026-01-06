import React, { useState } from 'react'
import Heading from './Heading.jsx'



function Project() {
    const [headingText, setHeadingText] = useState(['', '', ''])

    return (
        <div className='flex flex-col items-center w-full p-4'>
            <div className="project-title w-full mb-4  flex justify-center text-center">
                <input className="border rounded p-2 w-fit max-w-fit text-center text-xl font-semibold " placeholder="Title" />
            </div>

            <div className="flex flex-row justify-end items-center gap-4 w-full">
                <Heading 
                    value={headingText[0]}
                    onChange={(e) =>{
                        const newHeadingText = [...headingText]
                        newHeadingText[0] = e.target.value
                        setHeadingText(newHeadingText)
                    }}                
                />
                <Heading 
                    value={headingText[1]}
                        onChange={(e) =>{
                            const newHeadingText = [...headingText]
                            newHeadingText[1] = e.target.value
                            setHeadingText(newHeadingText)
                        }}   
                    />
                <Heading 
                    value={headingText[2]}
                    onChange={(e) =>{
                        const newHeadingText = [...headingText]
                        newHeadingText[2] = e.target.value
                        setHeadingText(newHeadingText)
                    }}   
                />
                
            </div>

        </div>
        

    )
    
    
}

export default Project