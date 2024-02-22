import { lazy, Suspense } from 'react';

// Importaciones dinámicas
const ClientHome = lazy(() => import('./ClientHome/ClientHome.jsx'));
const ClientProfile = lazy(() => import('./ClientProfile/ClientProfile.jsx'));
const ClientSideMenu = lazy(() =>
	import('./ClientSideMenu/ClientSideMenu.jsx')
);

export default function ClientDashboardHome() {
	return (
		<div className="admin-dashboard">
			<Suspense fallback={<div>Loading...</div>}>
				<ClientProfile />
				<ClientSideMenu />
				<ClientHome />
			</Suspense>
		</div>
	);
}
