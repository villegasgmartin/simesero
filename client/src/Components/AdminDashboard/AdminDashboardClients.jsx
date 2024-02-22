import React, { lazy, Suspense } from 'react';

// Importaciones dinámicas
const AdminMenu = lazy(() => import('./AdminMenu/AdminMenu'));
const AllClientsTable = lazy(() => import('./AllClientsTable/AllClientsTable'));
const SideMenu = lazy(() => import('./SideMenu/SideMenu'));

export default function AdminDashboardHome() {
  return (
    <div className="admin-dashboard">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminMenu />
        <SideMenu />
        <AllClientsTable />
        {/* <FunctionPanel /> */}
      </Suspense>
    </div>
  );
}
