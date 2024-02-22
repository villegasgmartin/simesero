import React, { lazy, Suspense } from 'react';

// Importaciones dinámicas
const AdminConfig = lazy(() => import('./AdminConfig/AdminConfig'));
const AdminMenu = lazy(() => import('./AdminMenu/AdminMenu'));
const SideMenu = lazy(() => import('./SideMenu/SideMenu'));

export default function AdminDashboardConfig() {
  return (
    <div className="admin-dashboard">
      <h3 className="admin-menu-title">CONFIGURACION</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminMenu />
        <SideMenu />
        <AdminConfig />
      </Suspense>
    </div>
  );
}