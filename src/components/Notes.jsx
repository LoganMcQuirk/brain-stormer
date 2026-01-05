import React, { useState } from 'react'

function Notes() {

    const [noteText, setNoteText] = useState('')
    return (
        <textarea  
            className="flex items-center justify-center p-4 border rounded w-40"
            placeholder="Notes"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
        
        />
        
    )
    
    
}

export default Notes