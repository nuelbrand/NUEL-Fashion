/**
 * ENTRY POINT
 * ===========
 * FILE: src/main.jsx
 *
 * WHAT THIS IS:
 *   The very first JavaScript file that runs.
 *   It finds the <div id="root"> in index.html and
 *   "mounts" the React app inside it.
 *
 *   After this, React takes full control of the page.
 *
 * YOU SHOULD RARELY NEED TO CHANGE THIS FILE.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global styles (Tailwind base + any custom CSS)
import './styles/index.css'

import App from './App.jsx'

// Find the <div id="root"> in index.html and render the app inside it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      StrictMode is a development tool that helps you catch bugs.
      It runs certain checks twice in development (but NOT in production).
      This is why some things seem to render twice during development — that's normal.
    */}
    <App />
  </StrictMode>
)
