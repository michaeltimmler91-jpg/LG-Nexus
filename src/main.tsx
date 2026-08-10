import React from 'react'
import ReactDOM from 'react-dom/client'
import NexusRoot from './NexusRoot'
import AccountAdminMount from './AccountAdminMount'
import PermissionNavigationGuard from './PermissionNavigationGuard'
import ServiceNavigationMount from './ServiceNavigationMount'
import MedicalModuleMount from './MedicalModuleMount'
import MedicalMedicationMount from './MedicalMedicationMount'
import './styles.css'
import './auth.css'
import './account-layout-fix.css'
import './account-admin.css'
import './permission-navigation.css'
import './service-navigation.css'
import './city-organization-admin.css'
import './medical-module.css'
import './medical-clinical.css'
import './medical-medications.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NexusRoot />
    <AccountAdminMount />
    <PermissionNavigationGuard />
    <ServiceNavigationMount />
    <MedicalModuleMount />
    <MedicalMedicationMount />
  </React.StrictMode>,
)