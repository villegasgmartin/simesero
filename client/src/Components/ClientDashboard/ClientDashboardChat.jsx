import { lazy, Suspense } from 'react';

// Importaciones dinámicas
const ClientChat = lazy(() => import('./ClientChat/ClientChat.jsx'));
const ClientSideMenu = lazy(() =>
	import('./ClientSideMenu/ClientSideMenu.jsx')
);

export default function ClientDashboardHome() {
	return (
		<div className="admin-dashboard">
			<Suspense fallback={<div>Loading...</div>}>
				<ClientSideMenu />
				<ClientChat />
			</Suspense>
		</div>
	);

}

