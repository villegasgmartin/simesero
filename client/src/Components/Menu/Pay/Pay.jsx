import { useEffect, useState } from 'react';
import './Pay.css';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalPlan, getPlanToMenu } from '../../../redux/actions';
import swal from 'sweetalert';

const socket = io();
//const socket = io('https://menu-didactico.up.railway.app/');

export default function Pay() {
	const [nombre, setNombre] = useState('');
	const [payMethod, setPayMethod] = useState('');
	const [payType, setPayType] = useState('');

	const [comment, setComment] = useState('');

	const dispatch = useDispatch();
	const handleSetName = (e) => {
		setNombre(e.target.value.toUpperCase());
	};

	const handleSetMethod = (e) => {
		setPayMethod(e.target.value);
	};

	const handleSetPayType = (e) => {
		setPayType(e.target.value);
	};


	const handleComment = (e) => {
		setComment(e.target.value);
	};

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);

	const userEmail = atob(searchParams.get('email'));
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
	// Enviar el pedido de cuenta al dashboard del cliente
	const handleSubmit = () => {
		// Validar que todos los campos estén llenos
		if (!nombre) {
			swal({
			text: 'Por favor, complete todos los campos del formulario.',
			icon: 'error'
			});
			return;
		}

		swal({
			title: 'Pedir cuenta',
			text: '¿Desea pedir la cuenta?',
			icon: 'warning',
			buttons: ['No', 'Sí']
		}).then((respuesta) => {
			if (respuesta) {
				socket.emit(
					'pedir-cuenta',
					usuario,
					{
						nombre: nombre,
						metodo: payMethod,
						dividir: payType,
						comment: comment
					},
					payload
				);
				swal({
					text: 'Se ha pedido la cuenta',
					icon: 'success'
				});
			} else {
				swal({ text: 'No se pedido la cuenta', icon: 'info' });
			}
		});

	};

	useEffect(() => {
		dispatch(getPlanToMenu(usuario.email));
		dispatch(getLocalPlan(userEmail));
	}, []);
	const plan = useSelector((state) => state.planToMenu);
	const planActual = useSelector((state) => state.localPlan);

	return (
		<>
			{planActual === 'premium' ? (
				<div className="pay-container">
					{plan === 'basic' ? (
						<div>Funcionalidad sin acceso</div>
					) : (
						<div>
							<div className="pay-username">
								<p className='pay-name'>Su Nombre*</p>
								<input type="text" value={nombre} onChange={handleSetName} placeholder='Indique aqui su nombre'/>
							</div>

							<div className="payment-type-container">
								<p>Seleccione el metodo de pago</p>
								<select name="payment-type" id="" onChange={handleSetMethod}>
									<option value="-">-</option>
									<option value="efectivo">Efectivo</option>
									<option value="debito">Debito</option>
									<option value="credito">Credito</option>
									<option value="Mercado Pago">Mercado Pago</option>
									<option value="otro">Otro</option>
								</select>

								<p>Seleccione tipo de pago</p>
								<select name="payment-type" id="" onChange={handleSetPayType}>
									<option value="-">-</option>
									<option value="dividir">Quiero dividir la cuenta</option>
									<option value="pagar-total">Quiero pagar el total</option>
									<option value="pagar-parte">Quiero pagar una parte</option>
								</select>

								<div className="payment-type-container">
									<p htmlFor="">Comentario</p>
									<input
										type="text"
										value={comment}
										onChange={handleComment}
										placeholder="Deje aqui su comentario"
									/>
								</div>

								<button className="payment-btn" onClick={handleSubmit}>
									Pedir la cuenta
								</button>
							</div>
						</div>

			)}
		</div>
		) : (
			<p>Este usuario no tiene disponible la opcion de solicitar la cuenta</p>
			)}
			</>
	);
}
