import { lazy, Suspense } from 'react';

// Importaciones dinámicas
const ClientProfile = lazy(() => import('./ClientProfile/ClientProfile.jsx'));
const ClientSideMenu = lazy(() => import('./ClientSideMenu/ClientSideMenu.jsx'));
const ClientConfig = lazy(() => import('./ClientConfig/ClientConfig.jsx'));

export default function ClientDashboardConfig() {
  return (
    <div className="admin-dashboard">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientProfile />
        <ClientSideMenu />
        <ClientConfig />
        {/* <FunctionPanel /> */}
      </Suspense>
    </div>
  );
}