// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // react-beautiful-dnd is not compatible with React.StrictMode
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)
