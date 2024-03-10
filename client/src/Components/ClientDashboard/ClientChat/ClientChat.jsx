/* eslint-disable no-unused-vars */

import './ClientChat.css';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import {
	changeChatState,
	deleteMensajes,
	getChatState,
	getLocalData,
	verMensaje
} from '../../../redux/actions';
import swal from 'sweetalert';
const socket = io({
	auth: {
		serverOffset: 0
	}
});
//const socket = io('https://menu-didactico.up.railway.app/');

export default function ClientChat() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const dispatch = useDispatch();
	const usuario = {
		email: searchParams.get('email'),
		mesa: 'Local'
	};

	const userEmail = searchParams.get('email');

	const [mensaje, setMessages] = useState([]);

	const divUsuarios = document.querySelector('#divUsuarios');
	const formEnviar = document.querySelector('#formEnviar');
	const txtMensaje = document.querySelector('#txtMensaje');
	const divChatbox = document.querySelector('#divChatbox');

	function renderizarUsuarios(personas, email) {
		personas?.forEach((persona) => {
			email = persona.email;
			return email;
		});
		let html = '';

		personas?.forEach((persona) => {
			html += (
				<li>
					<a data-id="${persona.id}" href="javascript:void(0)">
						<span>
							{' '}
							Mesa ${persona.mesa}{' '}
							<small className="text-success">online</small>
						</span>
					</a>
				</li>
			);
		});

		// if (divUsuarios) {
		//     divUsuarios.innerHTML = html;
		// }
	}

	const handleDeleteChat = (e) => {
		e.preventDefault();
		swal({
			title: 'Activar',
			text: 'Esta seguro que desea eliminar el historial de chat?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(deleteMensajes(userEmail));
				swal({
					text: `Se ha eliminado el historial`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha eliminado el historial', icon: 'info' });
			}
		});
	};

	function scrollBottom() {
		// Verificar si divChatbox es null o undefined
		if (!divChatbox) {
			return;
		}
		const newMessage = divChatbox.querySelector('li:last-child');
		if (newMessage) {
			const clientHeight = divChatbox.clientHeight;
			const scrollTop = divChatbox.scrollTop;
			const scrollHeight = divChatbox.scrollHeight;
			const newMessageHeight = newMessage.clientHeight;
			const lastMessageHeight =
				(newMessage.previousElementSibling &&
					newMessage.previousElementSibling.clientHeight) ||
				0;

			if (
				clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
				scrollHeight
			) {
				divChatbox.scrollTop = scrollHeight;
			}
		}
	}

	useEffect(() => {
		socket.on('connect', () => {
			console.log('conectado a la sala' + usuario.email);
			//unirse a la sala del email para el chat
			socket.emit('join-room', { room: usuario.email });

			socket.emit('entrarChat', usuario, (resp) => {
				// console.log('Usuarios conectados', resp);
				renderizarUsuarios(resp);
			});
		});
		socket.on('crearMensaje', (mensaje, serverOffset) => {
			console.log('Servidor:', mensaje);
			dispatch(changeChatState(userEmail));
			receiveMessage(mensaje);
			socket.auth.serverOffset = serverOffset;
			scrollBottom();
		});
		socket.on('listaPersona', (personas) => {
			console.log('personas:', personas);
			renderizarUsuarios(personas);
		});
		socket.on('disconnect', () => {
			console.log('desconectado');
		});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (txtMensaje.value.trim().length === 0) {
			return;
		}

		socket.emit(
			'crearMensaje',
			{
				email: usuario.email,
				mesa: usuario.mesa,
				mensaje: txtMensaje.value
			},
			(mensaje) => {
				txtMensaje.value = '';
				txtMensaje.focus();
				receiveMessage(mensaje);

				scrollBottom();
			}
		);
	};

	const receiveMessage = (mensaje) =>
		setMessages((state) => [mensaje, ...state]);

	useEffect(() => {
		dispatch(getLocalData(userEmail));
		dispatch(verMensaje(userEmail));
	}, []);
	const newChat = useSelector((state) => state.newChat);
	const user = useSelector((state) => state.localData.usuario);
	return (
		<div className="container-fluid">
			{user?.plan === 'basic' || user?.plan === 'standard' ? (
				<div>
					<h2>Actualice su plan a Premium para usar esta funcion</h2>
					<button>
						<a href={`/dashboard?email=${user.email}`}>Volver</a>
					</button>
				</div>
			) : (
				<div className="row animated fadeIn">
					<div className="col-12">
						<div className="card m-b-0">
							<div className="chat-main-box">
								<div className="chat-left-aside">
									<div className="open-panel">
										<i className="ti-angle-right"></i>
									</div>
									<div className="chat-left-inner">
										<ul className="chatonline style-none" id="divUsuarios">
											{' '}
										</ul>
									</div>
								</div>

								<div className="chat-right-aside">
									<div className="chat-main-header">
										<div className="p-20 b-b">
											<h3 className="box-title">Sala de Chat </h3>
										</div>
										<button onClick={handleDeleteChat}>Borrar chat</button>
									</div>

									<div className="chat-rbox">
										<ul className="chat-list p-20" id="divChatbox">
											{mensaje
												.slice()
												.reverse()
												.map((mensaje, index) => (
													<li
														key={index}
														className={`${
															mensaje.mesa === 'Local' ||
															mensaje.mesa === 'Mesa : Local'
																? 'chat-local'
																: 'chat-mesa'
														}`}
													>
														<b>{mensaje.mesa}</b> <br />
														{mensaje.mensaje}
														<br />{' '}
														<span className="hora-chat">{mensaje.fecha}</span>
													</li>
												))}
										</ul>
									</div>
									<div className="card-body b-t">
										<form id="formEnviar">
											<div className="row">
												<div className="col-8">
													<input
														autoComplete="off"
														id="txtMensaje"
														placeholder="Escribe tu mensaje aquí"
														className="form-control b-0 chat-input"
														autoFocus
													/>
												</div>
												<div className="col-4 text-right">
													<button
														type="submit"
														className="login-btn chat-btn"
														onClick={handleSubmit}
													>
														Enviar
													</button>
												</div>
											</div>
										</form>
									</div>
									{/* {renderizarMensajes()}
									{renderizarUsuarios()} */}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
