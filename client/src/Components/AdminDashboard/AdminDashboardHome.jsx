import React, { lazy, Suspense } from 'react';

// Importaciones dinámicas
const AdminMenu = lazy(() => import('./AdminMenu/AdminMenu'));
const ClientsTableHome = lazy(() => import('./ClientsTableHome/ClientsTableHome.jsx'));
const SideMenu = lazy(() => import('./SideMenu/SideMenu'));

export default function AdminDashboardHome() {
  return (
    <div className="admin-dashboard">
      <h3 className="admin-menu-title">INICIO</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminMenu />
        <SideMenu />
        <ClientsTableHome />
        {/* <FunctionPanel /> */}
      </Suspense>
    </div>
  );
}