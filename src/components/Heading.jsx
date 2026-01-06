import React, { useState } from 'react'
import Notes from './Notes.jsx'

function Heading({value, onChange}) {
const [notes, setNotes] = useState(['', ''])


    return (
        <div>
        <input 
            className="flex items-center justify-center p-4 border rounded w-40 text-center font-medium" 
            placeholder='Heading'
            value={value}
            onChange={onChange}
        />
        
        <Notes 
            value={notes[0]}
            onChange={(e) => {
                const newNotes = [...notes]
                newNotes[0] = e.target.value
                setNotes(newNotes)
            }}
            />
            

        <Notes 
            value={notes[1]}
            onChange={(e) => {
                const newNotes = [...notes]
                newNotes[1] = e.target.value
                setNotes(newNotes)
            
            }}  
        />
        
        </div>
    )
    
    
}

export default Heading