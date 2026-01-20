import React, { forwardRef, useState } from 'react'

const Notes = forwardRef(function Notes({value, onChange, onDelete, noteIndex}, ref) {

    return (
        <div>
            <div className='absolute flex flex-row items-end justify-end w-40 t-1 mt-2'>
                <button
                onClick={() => onDelete(noteIndex)}
                className="flex items-end justify-end text-note-color text-sm font-black border border-grey bg-slate-600 text-shadow-lg border rounded h-auto m-0 pl-1 pr-1"
                
            >
                ✕
            </button>
            </div>
        <textarea  
            ref={ref}
            className="resize-none flex self-end items-center justify-center p-4 border rounded size-40 mt-2 mb-2 bg-note-color "
            placeholder="Notes"
            value={value}
            onChange={onChange}
            
        />
        </div>

        
    )
    
    
})

export default Notes