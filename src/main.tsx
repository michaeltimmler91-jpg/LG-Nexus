import React from 'react'
import ReactDOM from 'react-dom/client'
import NexusRoot from './NexusRoot'
import AccountAdminMount from './AccountAdminMount'
import PermissionNavigationGuard from './PermissionNavigationGuard'
import ServiceNavigationMount from './ServiceNavigationMount'
import MedicalSimpleMount from './MedicalSimpleMount'
import MedicalTreatmentEditMount from './MedicalTreatmentEditMount'
import PoliceSimpleMount from './PoliceSimpleMount'
import PoliceCaseTimelineMount from './PoliceCaseTimelineMount'
import './styles.css'
import './auth.css'
import './account-layout-fix.css'
import './account-admin.css'
import './permission-navigation.css'
import './service-navigation.css'
import './city-organization-admin.css'
import './medical-module.css'
import './medical-simple.css'
import './medical-treatment-edit.css'
import './police-simple.css'
import './police-case-timeline.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NexusRoot />
    <AccountAdminMount />
    <PermissionNavigationGuard />
    <ServiceNavigationMount />
    <MedicalSimpleMount />
    <MedicalTreatmentEditMount />
    <PoliceSimpleMount />
    <PoliceCaseTimelineMount />
  </React.StrictMode>,
)
