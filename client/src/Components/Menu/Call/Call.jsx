// import { useLocation } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './Call.css';
import { PiCallBellDuotone } from 'react-icons/pi';
import swal from 'sweetalert';

const socket = io();

export default function Call() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	console.log('searchParams:', searchParams.toString()); // Verifica qué parámetros de consulta se están pasando

	const userEmail = searchParams.get('email');
	const mesa = searchParams.get('mesa');

	const payload = () => {
		console.log('emitiendo');
	};

	socket.on('connect', () => {
		console.log('conectado');
	});

	const usuario = {
		email: userEmail,
		mesa: mesa
	};
	// Funcion para enviar la alerta de llamar camarera
	const handleSubmit = () => {
		swal({
			title: 'Llamar mesero/a',
			text: '¿Desea llamar al mesero/a?',
			icon: 'warning',
			buttons: ['No', 'Sí']
		}).then((respuesta) => {
			if (respuesta) {
				socket.emit('llamar-camarera', usuario, payload);
				swal({
					text: 'Se ha llamado al mesero/a',
					icon: 'success'
				});
			} else {
				swal({ text: 'No se ha llamado al mesero/a', icon: 'info' });
			}
		});
	};

	return (
		<div className="call-container">
			<div>
				<h2 className="call-text">
					Desea llamar al mesero/a? presione el siguiente boton
				</h2>
			</div>
			<p>Llamar mesero/a</p>
			<button onClick={handleSubmit} className="call-btn">
				<PiCallBellDuotone className="call-logo" />
			</button>
		</div>
	);
}



  

