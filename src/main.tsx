import React from 'react'
import ReactDOM from 'react-dom/client'
import NexusRoot from './NexusRoot'
import AccountAdminMount from './AccountAdminMount'
import './styles.css'
import './auth.css'
import './account-layout-fix.css'
import './account-admin.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NexusRoot />
    <AccountAdminMount />
  </React.StrictMode>,
)
