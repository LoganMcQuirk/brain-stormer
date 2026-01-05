import React, { useState } from 'react'
import Notes from './Notes.jsx'

function Heading() {
const [headingText, setHeadingText] = useState('')


    return (
        <div>
        <input 
            className="flex items-center justify-center p-4 border rounded w-40 text-center font-medium" 
            placeholder='Heading'
            value={headingText}
            onChange={(e) => setHeadingText(e.target.value)}
        
        />
        <Notes 
            />

        <Notes 
        />
        
        </div>
    )
    
    
}

export default Heading