import './AllClientsTable.css';
import { BsCheckCircle } from 'react-icons/bs';
import { BsXCircle } from 'react-icons/bs';
import { VscMail } from 'react-icons/vsc';
// import grafico from '../../../assets/grTorta.png';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { CiSearch } from 'react-icons/ci';

import {
	activateUser,
	getAllClients,
	getSuspendedClients,
	suspendUser,
	validateAdmin
} from '../../../redux/actions';
import swal from 'sweetalert';

export default function AllClientsTable() {
	const dispatch = useDispatch();
	const allUsers = useSelector((state) => state.allUsers);

	const validation = useSelector((state) => state.validation.msg);
	const emailAddresses = allUsers.map((user) => user.email).join(';');

	const [popUp, setPopUp] = useState(false);
	const [selectedClientId, setSelectedClientId] = useState(null);
	const handleOpenPopUp = (clientId) => {
		setSelectedClientId(clientId);
		setPopUp(!popUp);
	};

	const [pageLoaded, setPageLoaded] = useState(false);

	const [clientEmail, setClientEmail] = useState('');
	const handleChange = (e) => {
		setClientEmail(e.target.value);
	};
	const searchClient = () => {
		if (!clientEmail) return [];
	const localClients = allUsers.filter((client) =>
		client.email.toLowerCase().includes(clientEmail.toLowerCase()) ||
		client.storeName.toLowerCase().includes(clientEmail.toLowerCase())
		);
	
		return localClients;
	};

	const searchedClients = searchClient();
	const handleSubmitSuspend = (e) => {
		e.preventDefault();
		swal({
			title: 'Suspender',
			text: 'Esta seguro que desea suspender el usuario?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(suspendUser({ email: e.target.value }));
				swal({
					text: `Se ha suspendido el usuario ${e.target.value}`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha suspendido el usuario', icon: 'info' });
			}
		});
	};

	const handleSubmitActivate = (e) => {
		e.preventDefault();
		swal({
			title: 'Activar',
			text: 'Esta seguro que desea activar el usuario?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(activateUser({ email: e.target.value }));
				swal({
					text: `Se ha activado el usuario ${e.target.value}`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha activado el usuario', icon: 'info' });
			}
		});
	};

	const handleFilterByStatus = () => {
		dispatch(getSuspendedClients());
	};

	const handleViewAll = () => {
		dispatch(getAllClients());
	};

	useEffect(() => {
		dispatch(getAllClients());
		dispatch(validateAdmin());
		Promise.all([dispatch(getAllClients()), dispatch(validateAdmin())]).then(
			() => {
				setPageLoaded(true);
			}
		);
	}, []);

	return (
		<div>
			{pageLoaded ? (
				validation !== 'admin' ? (
					<h1> Usted no tiene acceso</h1>
				) : (
					<main className="act-container">
						<h2>
							TOTAL CLIENTES
							<span className="total-clients">
								{' '}
								<br />
								{allUsers?.length}
							</span>
						</h2>
						<div className="buscar">
							<button>
								<CiSearch />
							</button>
							<input
								value={clientEmail}
								onChange={handleChange}
								type="text"
								placeholder="Buscar un cliente"
								className="input-buscar"
							></input>
						</div>

						<div className="act-table-container">
							<div className="act-title">
								<div className="act-table-filters">
									<div>
										<button
											onClick={handleFilterByStatus}
											className="act-table-filter-btn"
										>
											Ver suspendidos
										</button>
										<button
											onClick={handleViewAll}
											className="act-table-filter-btn"
										>
											Ver todos
										</button>
										<button className="act-table-filter-btn">
											<a
												href={`mailto:${emailAddresses}`}
												target="_blank"
												rel="noreferrer"
											>
												{' '}
												Enviar mensaje a todos
											</a>
										</button>
									</div>
								</div>
							</div>
							<table className="act-table">
								<thead className="admin-tabla-usuarios">
									<tr>
										<th>Nombre</th>
										<th>Fecha de alta</th>
										<th>Plan</th>
										<th>Estado</th>
										<th>Pedidos Mensuales</th>
										<th>Pago</th>
										<th>Cambio Plan</th>
										<th>Mensaje</th>
										<th>Ver mas</th>
										<th>Activar</th>
										<th>Suspender</th>
									</tr>
								</thead>
								<tbody className="act-table-body">
									{clientEmail !== '' ? (
										<>
											{searchedClients?.map((c) => {
												return (
													<tr key={c.id}>
														<td>{c.storeName}</td>
														<td>{c.date}</td>
														<td>{c.plan}</td>
														{c.status === 1 ? (
															<td>
																<BsCheckCircle className="check-icon" />
															</td>
														) : (
															<td>
																<BsXCircle className="X-icon" />
															</td>
														)}
														<td>{c.cantidad_pedidos}</td>
														{c.pagoConfirmado === 1 ? <td>SI</td> : <td>NO</td>}
														{c.pagoCambioPlan === 1 ? <td>SI</td> : <td>NO</td>}
														<td>
															<a
																href={`mailto:${c.email}`}
																target="_blank"
																rel="noreferrer"
															>
																<VscMail className="mail-icon" />
															</a>
														</td>
														<td>
															<button className="status-btn-suspend" onClick={() => handleOpenPopUp(c.id)}>
																Ver
															</button>
														</td>
														<td>
															<button
																value={c.email}
																onClick={handleSubmitActivate}
																className="status-btn-activate"
															>
																Activar
															</button>
														</td>
														<td>
															<button
																value={c.email}
																onClick={handleSubmitSuspend}
																className="status-btn-suspend"
															>
																Suspender
															</button>
														</td>
													</tr>
												);
											})}
										</>
									) : (
										<>
											{allUsers?.map((c) => {
												return (
													<tr key={c.id}>
														<td>{c.storeName}</td>
														<td>{c.date}</td>
														<td>{c.plan}</td>
														{c.status === 1 ? (
															<td>
																<BsCheckCircle className="check-icon" />
															</td>
														) : (
															<td>
																<BsXCircle className="X-icon" />
															</td>
														)}
														<td>{c.cantidad_pedidos}</td>
														{c.pagoConfirmado === 1 ? <td>SI</td> : <td>NO</td>}
														{c.pagoCambioPlan === 1 ? <td>SI</td> : <td>NO</td>}
														<td>
															<a
																href={`mailto:${c.email}`}
																target="_blank"
																rel="noreferrer"
															>
																<VscMail className="mail-icon" />
															</a>
														</td>
														<td>
															<button className="status-btn-suspend" onClick={() => handleOpenPopUp(c.id)}>
																Ver
															</button>
														</td>
														<td>
															<button
																value={c.email}
																onClick={handleSubmitActivate}
																className="status-btn-activate"
															>
																Activar
															</button>
														</td>
														<td>
															<button
																value={c.email}
																onClick={handleSubmitSuspend}
																className="status-btn-suspend"
															>
																Suspender
															</button>
														</td>
													</tr>
												);
											})}
										</>
									)}
								</tbody>
								{popUp && selectedClientId !== null && (
									<div className="popup-background">
										<div className="popup-container">
											<span
												className="popup-close"
												onClick={() => handleOpenPopUp(null)}
											>
												&times;
											</span>
											<div className="popup-content">
												<h3>Detalles del Cliente</h3>
												<p>
													Nombre:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).name
													}
												</p>
												<p>
													Nombre del local:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).storeName
													}
												</p>
												<p>
													Email:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).email
													}
												</p>
												<p>
													Telefono:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).telefono
													}
												</p>
												<p>
													Direccion:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).address
													}
												</p>
												<p>
													Pais:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).pais
													}
												</p>
												<p>
													Localidad:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).localidad
													}
												</p>
												<p>
													Tipo de comercio:{' '}
													{
														allUsers.find(
															(client) => client.id === selectedClientId
														).tipo
													}
												</p>
											</div>
										</div>
									</div>
								)}
							</table>
							<div className="state-reference">
								<div>
									<BsCheckCircle className="check-icon" />
									<p>Al dia</p>
								</div>
								<div>
									<BsXCircle className="X-icon" />
									<p>Deuda</p>
								</div>
							</div>
						</div>
					</main>
				)
			) : (
				<h1>Cargando...</h1>
			)}
		</div>
	);
}
