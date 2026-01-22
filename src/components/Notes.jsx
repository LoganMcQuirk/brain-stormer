import React, { forwardRef, useState } from 'react'
import ColorPicker from './ColorPicker'

const Notes = forwardRef(function Notes({value, onChange, onDelete, noteIndex, }, ref) {

    return (
        <div className='relative size-40 group overflow-y-hidden mt-3 flex items-center flex-col justify-end'>
            
            <div className='flex flex-row items-center justify-between w-40 max-h-5 -mb-8 bg-note-color border rounded 
                           -translate-y-8
                           group-hover:-translate-y-3
                           transition-translate
                           duration-150 
                            '
            >
                <ColorPicker />
                <div className='h-full w-auto m-0 text-white text-xs cursor-grab flex-grow text-center bg-black/20'
                
                > _-_</div>
                <button
                onClick={() => onDelete(noteIndex)}
                className="flex items-end justify-end text-note-color text-xs font-black border border-grey bg-slate-600 text-shadow-lg border rounded h-full m-0 pl-1 pr-1"
                
            >
                ✕
            </button>
            
            </div>
            
        <textarea  
            rows={4} 
            ref={ref}
            maxLength={200}
            className="resize-none flex self-end items-end justify-center p-4 border rounded size-40 bg-note-color overflow-y-auto"
            placeholder="Notes"
            
            value={value}
            onChange={onChange}
            
        />
        </div>

        
    )
    
    
})

export default Notes