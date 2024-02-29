// import { useLocation } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './Call.css';
import { PiCallBellDuotone } from 'react-icons/pi';
import swal from 'sweetalert';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPedidoState } from '../../../redux/actions';

const socket = io();

export default function Call() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);

	const dispatch = useDispatch();
	const userEmail = searchParams.get('email');
	const mesa = searchParams.get('mesa');

	const [stateOpen, setStateOpen] = useState(false);
	const handleViewState = () => {
		dispatch(getPedidoState(userEmail, mesa));
		setStateOpen(true);
		setTimeout(function () {
			setStateOpen(false);
		}, 5000);
	};
	const pedidoState = useSelector((state) => state.pedidoState);
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
			<button className="estadopedido" onClick={handleViewState}>
				Consultar estado de pedido realizado
			</button>
			{pedidoState && pedidoState !== undefined && (
				<>
					{stateOpen === true && pedidoState.msg === 'true' ? (
						<p className="pedido-state">Estamos preparando tu pedido </p>
					) : pedidoState.msg === 'false' ? (
						<p className="pedido-state">Su pedido aun no ha sido procesado</p>
					) : (
						<></>
					)}
				</>
			)}
			<div className='mesero-call'>
				<div>
					<h4 className="call-text">
						Desea llamar al mesero/a? presione el siguiente boton
					</h4>
				</div>
				<p>Llamar mesero/a</p>
				<button onClick={handleSubmit} className="call-btn">
					<PiCallBellDuotone className="call-logo" />
				</button>
			</div>
			
		</div>
	);
}