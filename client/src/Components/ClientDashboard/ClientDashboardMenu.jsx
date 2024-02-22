import { lazy, Suspense } from 'react';

// Importaciones dinámicas
const ClientMenu = lazy(() => import('./ClientMenu/ClientMenu.jsx'));
const ClientProfile = lazy(() => import('./ClientProfile/ClientProfile.jsx'));
const ClientSideMenu = lazy(() => import('./ClientSideMenu/ClientSideMenu.jsx'));

export default function ClientDashboard() {
  return (
    <div className="admin-dashboard">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientProfile />
        <ClientSideMenu />
        <ClientMenu />
      </Suspense>
    </div>
  );
}