import React, { useState } from 'react'

function Notes({value, onChange}) {

    return (
        
        <textarea  
            className="flex items-center justify-center p-4 border rounded w-40 mt-2 mb-2"
            placeholder="Notes"
            value={value}
            onChange={onChange}
        />
        

        
    )
    
    
}

export default Notes