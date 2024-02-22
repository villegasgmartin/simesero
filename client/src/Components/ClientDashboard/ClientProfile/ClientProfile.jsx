import { IoNotifications } from 'react-icons/io5';
import { RxTriangleDown } from 'react-icons/rx';
import './ClientProfile.css';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { getLocalData } from '../../../redux/actions';
import io from 'socket.io-client';

const socket = io();

// eslint-disable-next-line react/prop-types
export default function ClientProfile() {
	const [newAlert, setNewAlert] = useState(false);
	const handleNewAlert = () => {
		setNewAlert(true);
	};

	useEffect(() => {
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
	}, []);

	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const userEmail = searchParams.get('email');
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getLocalData(userEmail));
	}, []);
	const dataLocal = useSelector((state) => state.localData.usuario);

	return (
		<nav className="client-menu">
			<div className="client-menu-container">
				<div className="client-menu-panel">
					<IoNotifications
						className={
							newAlert === false
								? 'client-menu-notification'
								: 'client-menu-notification-on'
						}
					/>
					<img src={dataLocal?.img} alt="" className="client-menu-img" />
					<div>
						<div>
							<h3>Mi cuenta</h3>
							<button className="arrow-menu" onClick={handleClick}>
								<RxTriangleDown />
							</button>
						</div>
						<div className={`${open ? 'panel-open' : 'panel-closed'}`}>
							<a href={`/dashboard/configuracion?email=${userEmail}`}>
								Mi perfil
							</a>
							<a href="/">Cerrar sesion</a>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
