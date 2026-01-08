import React, { useState } from 'react'

function Notes({value, onChange}) {

    return (
        
        <textarea  
            className="resize-none flex items-center justify-center p-4 border rounded size-40 mt-2 mb-2"
            placeholder="Notes"
            value={value}
            onChange={onChange}
        />
        

        
    )
    
    
}

export default Notes