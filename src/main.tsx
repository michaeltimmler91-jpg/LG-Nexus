import React from 'react'
import ReactDOM from 'react-dom/client'
import NexusRoot from './NexusRoot'
import AccountAdminMount from './AccountAdminMount'
import PermissionNavigationGuard from './PermissionNavigationGuard'
import ServiceNavigationMount from './ServiceNavigationMount'
import DashboardLiveMount from './DashboardLiveMount'
import BusinessesLiveMount from './BusinessesLiveMount'
import BusinessWorkspaceMount from './BusinessWorkspaceMount'
import EventsLiveMount from './EventsLiveMount'
import CalendarLiveMount from './CalendarLiveMount'
import OrganizationManagementMount from './OrganizationManagementMount'
import OrganizationExternalMediaMount from './OrganizationExternalMediaMount'
import OrganizationEventsMount from './OrganizationEventsMount'
import ServiceOrganizationAdminMount from './ServiceOrganizationAdminMount'
import GlobalAdminMount from './GlobalAdminMount'
import GlobalOrganizationRegistryMount from './GlobalOrganizationRegistryMount'
import MedicalWorkspaceMount from './MedicalWorkspaceMount'
import MedicalTreatmentEditMount from './MedicalTreatmentEditMount'
import PoliceEasyMount from './PoliceEasyMount'
import PoliceCitizenHistoryMount from './PoliceCitizenHistoryMount'
import PoliceQuickToolsMount from './PoliceQuickToolsMount'
import PoliceWorkspaceNavMount from './PoliceWorkspaceNavMount'
import FireSimpleMount from './FireSimpleMount'
import JusticeSimpleMount from './JusticeSimpleMount'
import './styles.css'
import './nexus-brand.css'
import './auth.css'
import './account-access-gate.css'
import './account-layout-fix.css'
import './account-admin.css'
import './permission-navigation.css'
import './service-navigation.css'
import './city-organization-admin.css'
import './dashboard-live.css'
import './businesses-live.css'
import './business-workspace.css'
import './events-live.css'
import './event-calendar-action.css'
import './calendar-live.css'
import './nexus-brand-pages.css'
import './organization-control.css'
import './organization-external-media.css'
import './organization-events.css'
import './service-organization-admin.css'
import './global-admin.css'
import './global-organization-registry.css'
import './medical-module.css'
import './medical-workspace.css'
import './medical-workspace-visibility-fix.css'
import './medical-treatment-edit.css'
import './police-easy.css'
import './police-citizen-history.css'
import './police-quick-tools.css'
import './police-workspace-nav.css'
import './fire-simple.css'
import './justice-simple.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NexusRoot />
    <AccountAdminMount />
    <PermissionNavigationGuard />
    <ServiceNavigationMount />
    <DashboardLiveMount />
    <BusinessesLiveMount />
    <BusinessWorkspaceMount />
    <EventsLiveMount />
    <CalendarLiveMount />
    <OrganizationManagementMount />
    <OrganizationExternalMediaMount />
    <OrganizationEventsMount />
    <ServiceOrganizationAdminMount />
    <GlobalAdminMount />
    <GlobalOrganizationRegistryMount />
    <MedicalWorkspaceMount />
    <MedicalTreatmentEditMount />
    <PoliceEasyMount />
    <PoliceWorkspaceNavMount />
    <PoliceCitizenHistoryMount />
    <PoliceQuickToolsMount />
    <FireSimpleMount />
    <JusticeSimpleMount />
  </React.StrictMode>,
)
