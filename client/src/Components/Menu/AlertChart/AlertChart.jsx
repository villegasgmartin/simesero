import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();
//const socket = io('https://menu-didactico.up.railway.app/');

export default function AlertChart() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const userEmail = searchParams.get('email');
	// Funcion para emitir las alertas al dashboard del bar
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
				document.getElementById('lblTicket1').innerText = payload[email][0];
			}

			if (payload[email][1]) {
				document.getElementById('lblTicket2').innerText = payload[email][1];
			}

			if (payload[email][2]) {
				document.getElementById('lblTicket3').innerText = payload[email][2];
			}

			if (payload[email][3]) {
				document.getElementById('lblTicket4').innerText = payload[email][3];
			}
		});
	}, []);

	return (
		<div>
			<h1>SALA</h1>
			<table>
				<tbody>
					<tr>
						<td>
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
											<span id="lblEscritorio2"></span>
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
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
