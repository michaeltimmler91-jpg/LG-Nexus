import React from 'react'
import ReactDOM from 'react-dom/client'
import NexusRoot from './NexusRoot'
import './styles.css'
import './auth.css'
import './account-layout-fix.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NexusRoot />
  </React.StrictMode>,
)
