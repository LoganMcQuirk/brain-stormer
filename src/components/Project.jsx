import React, { useState } from 'react'
import Heading from './Heading.jsx'



function Project() {
    return (
        <div className='flex flex-col items-center w-full p-4'>
            <div className="project-title w-full mb-4  flex justify-center text-center">
                <input className="border rounded p-2 w-fit max-w-fit text-center text-xl font-semibold " placeholder="Title" />
            </div>

            <div className="flex flex-row justify-around items-center gap-4 w-full">
                <Heading />
                <Heading />
                <Heading />
            </div>

        </div>
        

    )
    
    
}

export default Project