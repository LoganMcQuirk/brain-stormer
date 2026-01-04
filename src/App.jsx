import { useState } from 'react'


import Project from './Project.jsx'

function App() {


  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
    {/* Header */}
      <header className="w-full p-4">
        <h1 className="text-2xl font-bold">Brain Stormer</h1>
      </header>
    {/* Main Content */}
      <main>
        <Project />

      </main>


    {/* Footer */}
      <footer>
        <p>© 2024 Brain Stormer. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
