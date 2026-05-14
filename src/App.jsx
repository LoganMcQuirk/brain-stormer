import { useState, useEffect } from 'react'



import Project from './components/Project.jsx'

function App() {


  return (
    <div className="min-h-screen flex flex-col items-center bg-cyan-700/90">
    {/* Header */}
      <header className="w-full p-4 flex justify-center items-center">
        <h1 className="text-shadow-md text-shadow-teal-200 text-2xl text-4xl text-white font-bold">Brain Stormer</h1>
      </header>
    {/* Main Content */}

      <main className='h-full flex-grow p-1 border-w-1 w-full max-w-100'>
        
        <Project />

      </main>


    {/* Footer */}
      <footer className='color-grey'>
        <p>© 2025 Brain Stormer. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App