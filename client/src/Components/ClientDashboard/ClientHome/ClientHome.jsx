import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import './ClientHome.css';
import { useLocation } from 'react-router-dom';
import {
	deletePedido,
	getPedidos,
	changePedidoState,
	resetAlerts,
	getLocalData
} from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import alertSound from '../../../assets/audio/new-ticket.mp3';
import swal from 'sweetalert';
import { PiCallBell } from 'react-icons/pi';
import { TbReportMoney } from 'react-icons/tb';

const socket = io();
//const socket = io('https://menu-didactico.up.railway.app/');
export default function ClientHome() {
	const [popUp, setPopUp] = useState(false);
	const [selectedPedidoId, setSelectedPedidoId] = useState(null);

	const [audioActive, setAudioActive] = useState(false);
	const handleAudio = () => {
		setAudioActive(true);
	};
	const handleQuitAudio = () => {
		setAudioActive(false);
	};

	const playAlertSound = () => {
		const audio = new Audio(alertSound);
		audio.play();
	};

	// Funcion para cuando llega una nueva notificacion
	const [newAlert, setNewAlert] = useState(false);
	const handleNewAlert = () => {
		if (audioActive === true) {
			setNewAlert(true);
			playAlertSound();
		} else {
			setNewAlert(true);
		}
	};

	// Funcion para marcar las alertas como vistas
	const handleCheckAlert = () => {
		setNewAlert(false);
	};

	const handleOpenPopUp = (orderId) => {
		setSelectedPedidoId(orderId);
		setPopUp(!popUp);
	};

	const dispatch = useDispatch();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const userEmail = searchParams.get('email');

	const [checkedItems, setCheckedItems] = useState({});

	const handleChangePedidoState = (e) => {
		const mesa = e.target.value;
		const isChecked = e.target.checked;
		console.log(isChecked);

		setCheckedItems((prevItems) => ({
			...prevItems,
			[mesa]: isChecked
		}));

		// Persistir el estado del checkbox en el almacenamiento local
		localStorage.setItem(
			'checkedItems',
			JSON.stringify({ ...checkedItems, [mesa]: isChecked })
		);

		// Realizar otras operaciones según sea necesario
		dispatch(changePedidoState(userEmail, { mesa }));
	};

	const handleResetAlert = (e) => {
		const mesa = e.target.value;
		dispatch(resetAlerts(userEmail, { mesa }));
		window.location.reload(true);
	};

	useEffect(() => {
		dispatch(getPedidos());
		dispatch(getLocalData(userEmail));
		const storedCheckedItems =
			JSON.parse(localStorage.getItem('checkedItems')) || {};
		setCheckedItems(storedCheckedItems);
		socket.on('connect', () => {
			console.log('conectado a la sala' + userEmail);
			socket.emit('join-room', { room: userEmail + '-llamar-camarera' });
			socket.emit('join-room', { room: userEmail + '-pedir-cuenta' });
			socket.emit('join-room', { room: userEmail });
		});

		socket.on('disconnect', () => {
			console.log('desconectado');
		});

		socket.emit('join-room', { room: userEmail });

		socket.on('estado-actual', (payload) => {
			console.log('payload', payload);

			const email = searchParams.get('email');
			console.log(payload[email][0]);

			if (payload[email][0]) {
				handleNewAlert();
				document.getElementById('lblTicket1').innerText = payload[email][0];
			}

			if (payload[email][1]) {
				handleNewAlert();
				document.getElementById('lblTicket2').innerText = payload[email][1];
			}

			if (payload[email][2]) {
				handleNewAlert();
				document.getElementById('lblTicket3').innerText = payload[email][2];
			}

			if (payload[email][3]) {
				handleNewAlert();
				document.getElementById('lblTicket4').innerText = payload[email][3];
			}
			if (payload[email][4]) {
				handleNewAlert();
				document.getElementById('lblTicket5').innerText = payload[email][4];
			}
			if (payload[email][5]) {
				handleNewAlert();
				document.getElementById('lblTicket6').innerText = payload[email][5];
			}
			if (payload[email][6]) {
				handleNewAlert();
				document.getElementById('lblTicket7').innerText = payload[email][6];
			}
			if (payload[email][7]) {
				handleNewAlert();
				document.getElementById('lblTicket8').innerText = payload[email][7];
			}
			if (payload[email][8]) {
				handleNewAlert();
				document.getElementById('lblTicket9').innerText = payload[email][8];
			}
			if (payload[email][9]) {
				handleNewAlert();
				document.getElementById('lblTicket10').innerText = payload[email][9];
			}
		});

		// Actualizar los datos de la tabla cada un minuto
		const updateTableData = () => {
			dispatch(getPedidos());
		};

		// Llamar a la función de actualización cada 1 minuto
		const intervalId = setInterval(updateTableData, 60000);

		// Limpieza del intervalo al desmontar el componente
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const user = useSelector((state) => state.localData.usuario);

	const pedidos = useSelector((state) => state.pedidos.pedidos);

	const handleDelete = (e) => {
		e.preventDefault();
		swal({
			title: 'Eliminar',
			text: 'Esta seguro que desea liberar el pedido?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(deletePedido(e.target.name, e.target.value));
				swal({
					text: `Se ha liberado el pedido`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha liberado el pedido', icon: 'info' });
			}
		});
	};

	return (
		<main>
			<div className="client-home-container">
				<div>
					<div>
						<h2>Monitoreo del salon</h2>
					</div>
					{audioActive === true ? (
						<button className="client-home-table-btn" onClick={handleQuitAudio}>
							Desactivar Audio
						</button>
					) : (
						<button className="client-home-table-btn" onClick={handleAudio}>
							Activar audio
						</button>
					)}
				</div>
				{user?.plan === 'basic' ? (<div>Actualice su plan para adminstrar los pedidos</div>) : <></>}
				<div className="client-home">
					{user?.plan === 'premium' ? (
						<div className="client-home-table-container">
							<table className="client-home-table">
								<thead className="">
									<tr>
										<th>Mesa</th>
										<th>Nombre</th>
										<th>Pedido</th>
										<th>Total</th>
										<th>Alertas</th>
										<th>En preparacion</th>
										<th>-</th>
									</tr>
								</thead>
								<tbody className="client-table-body">
									{pedidos?.map((c) => {
										return (
											<tr key={c.id}>
												<td>{c.mesa}</td>
												<td>{c.nombre}</td>
												<td>
													<button
														className="ver-btn"
														onClick={() => handleOpenPopUp(c.id)}
													>
														Ver
													</button>
												</td>
												<td>$ {c.total}</td>
												<td className="alertas-iconos">
													{c.camarera === 1 && c.cuenta === 1 ? (
														<button value={c.mesa} onClick={handleResetAlert}>
															<PiCallBell className="bell-icon-2" />{' '}
															<TbReportMoney className="pay-icon-2" />
														</button>
													) : c.camarera === 0 && c.cuenta === 1 ? (
														<button value={c.mesa} onClick={handleResetAlert}>
															<TbReportMoney className="pay-icon" />
														</button>
													) : c.camarera === 1 && c.cuenta === 0 ? (
														<button value={c.mesa} onClick={handleResetAlert}>
															<PiCallBell className="bell-icon" />
														</button>
													) : (
														<p></p>
													)}
												</td>
												<td>
													<input
														type="checkbox"
														value={c.mesa}
														onChange={handleChangePedidoState}
														checked={checkedItems[c.mesa] || false}
													/>
													Preparando
												</td>

												<td>
													<button
														name={c.mesa}
														value={c.nombre}
														className="client-home-table-btn"
														onClick={handleDelete}
													>
														Liberar Pedido
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
								{popUp && selectedPedidoId !== null && (
									<div className="popup-background">
										<div className="popup-container">
											<span
												className="popup-close"
												onClick={() => handleOpenPopUp(null)}
											>
												&times;
											</span>
											<div className="popup-content">
												<h3>Detalles del Pedido</h3>
												<p>
													Mesa:{' '}
													{
														pedidos.find(
															(order) => order.id === selectedPedidoId
														).mesa
													}
												</p>
												<p>
													Nombre:{' '}
													{
														pedidos.find(
															(order) => order.id === selectedPedidoId
														).nombre
													}
												</p>
												<p>
													Pedido:{' '}
													{
														pedidos.find(
															(order) => order.id === selectedPedidoId
														).pedido
													}
												</p>
												<p>
													Comentarios:{' '}
													{
														pedidos.find(
															(order) => order.id === selectedPedidoId
														).comentarios
													}
												</p>
											</div>
										</div>
									</div>
								)}
							</table>
						</div>
					) : (
						<div></div>
					)}

					<div
						className={
							newAlert ? 'client-home-alerts-active' : 'client-home-alerts'
						}
					>
						<div>
							<button className="alert-btn" onClick={handleCheckAlert}>
								Alerta Vista
							</button>

							<table>
								<tbody>
									<tr>
										<td valign="middle" className="ticket-actual">
											<span
												id="lblTicket1"
												className="ticket-actual-numero"
											></span>
											<span
												id="lblEscritorio1"
												className="ticket-actual-escritorio"
											></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket2"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio2"> </span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket3"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio3"></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket4"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio4"></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket5"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio5"></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket6"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio6"></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket7"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio7"></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket8"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio8"></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket9"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio9"></span>
										</td>
									</tr>
									<tr>
										<td>
											<span
												id="lblTicket10"
												className="ticket-secundario"
											></span>
											<span id="lblEscritorio10"></span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}