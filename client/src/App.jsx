import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

const MainPage = lazy(() => import('./Components/MainPage'));
const AdminDashboardHome = lazy(() =>
	import('./Components/AdminDashboard/AdminDashboardHome')
);
const AdminDashboardClients = lazy(() =>
	import('./Components/AdminDashboard/AdminDashboardClients')
);
const AdminDashboardConfig = lazy(() =>
	import('./Components/AdminDashboard/AdminDashboardConfig')
);
const ClientDashboardHome = lazy(() =>
	import('./Components/ClientDashboard/ClientDashboardHome')
);
const ClientDashboardMenu = lazy(() =>
	import('./Components/ClientDashboard/ClientDashboardMenu')
);
const ClientDashboardConfig = lazy(() =>
	import('./Components/ClientDashboard/ClientDashboardConfig')
);
const Menu = lazy(() => import('./Components/Menu/Menu'));
const QrGenerator = lazy(() =>
	import('./Components/ClientDashboard/ClientConfig/QrGenerator')
);
const Gracias = lazy(() => import('./Components/MainPage/Gracias/Gracias'));
const LoginAdmin = lazy(() =>
	import('./Components/MainPage/LoginAdmin/LoginAdmin')
);
const AlertChart = lazy(() =>
	import('./Components/Menu/AlertChart/AlertChart')
);
const ClientDashboardChat = lazy(() =>
	import('./Components/ClientDashboard/ClientDashboardChat/')
);
const NewPassword = lazy(() =>
	import('./Components/MainPage/NewPassword/NewPasword')
);

function App() {
	return (
		<BrowserRouter>
			<div>
				<Routes>
					{/* Ruta de pagina principal */}
					<Route
						path="/"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<MainPage />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/home"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<MainPage />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/gracias"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<Gracias />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/newpassword"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<NewPassword />{' '}
							</Suspense>
						}
					/>

					<Route
						path="/admin-boss"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<LoginAdmin />{' '}
							</Suspense>
						}
					/>
					{/* Rutas del panel de administrador */}
					<Route
						path="/admin"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<AdminDashboardHome />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/admin/clientes"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<AdminDashboardClients />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/admin/configuracion"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<AdminDashboardConfig />{' '}
							</Suspense>
						}
					/>
					{/* Rutas del panel de cada cliente */}

					<Route
						path="/dashboard/menu"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<ClientDashboardMenu />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/dashboard/configuracion"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<ClientDashboardConfig />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/dashboard/chat"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<ClientDashboardChat />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/dashboard/qrgenerator"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<QrGenerator />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<ClientDashboardHome />{' '}
							</Suspense>
						}
					/>
					{/* Ruta del menu */}
					<Route
						path="/menulocal"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<Menu />{' '}
							</Suspense>
						}
					/>
					<Route
						path="/alert"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								{' '}
								<AlertChart />{' '}
							</Suspense>
						}
					/>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
