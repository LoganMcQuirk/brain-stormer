import React, { useState } from 'react'
import Notes from './Notes.jsx'

function Heading({ heading, onChangeHeading, onChangeNotes, onAddNote }) {



    return (
        <div className='flex flex-col justify-center items-center'>
        <input 
            className="flex items-center justify-center p-4 border rounded w-40 text-center font-medium" 
            placeholder='Heading'
            value={heading.headingText}
            onChange={(e) => onChangeHeading(e.target.value)}
            
        />
        
        {heading.notes.map((noteText, i) => (
            <Notes
            key={i}
            value={noteText}
            onChange={(e) => onChangeNotes(i, e.target.value)}
            />
        ))}
        
        
        <button
        className="mt-2 px-2 py-1 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 text-sm  "
        onClick={() => {
            onAddNote()
        }}
        >
        + Add Note
        </button>
        
        </div>
    )
    
    
}

export default Heading