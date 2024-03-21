/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import {
	changePlan,
	getLocalData,
	getPlans,
	modifData
} from '../../../redux/actions';
import './ClientConfig.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import swal from 'sweetalert';
import QrSiMesero from '../../../assets/QrSiMesero.jpg';

export default function ClientConfig() {
	// Datos del usuario
	const user = useSelector((state) => state.localData.usuario);
	console.log(user);
	// Precio de planes
	const plans = useSelector((state) => state.plans);

	useEffect(() => {
		if (user) {
			setInput({
				name: user.name,
				storeName: user.storeName,
				telefono: user.telefono,
				address: user.address,
				pais: user.pais,
				localidad: user.localidad,
				tipo: user.tipo
			});
		}
	}, [user]);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const userEmail = searchParams.get('email');
	const dispatch = useDispatch();

	const [input, setInput] = useState({
		name: '',
		storeName: '',
		telefono: '',
		address: '',
		pais: '',
		localidad: '',
		tipo: ''
	});

	const [popUpOpen, setPopUpOpen] = useState(false);
	const handlepopUp = () => {
		setPopUpOpen(!popUpOpen);
	};

	const [planPopUpOpen, setPlanPopUpOpen] = useState(false);
	const handlePlanPopUp = () => {
		setPlanPopUpOpen(!planPopUpOpen);
	};

	useEffect(() => {
		dispatch(getLocalData(userEmail));
		dispatch(getPlans());
	}, []);
	// Cambio de datos del usuario
	const handleChangeData = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		});
	};
	//Cambio de plan
	const [newPlan, setNewPlan] = useState();
	const handleChangePlan = (e) => {
		setNewPlan(e.target.value);
	};

	const handleSubmitData = (e) => {
		e.preventDefault();
		swal({
			title: 'Modificar',
			text: 'Esta seguro que desea modificar los datos?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(modifData(input));
				swal({
					text: `Se han modificadao los datos`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se han modificado los datos', icon: 'info' });
			}
		});
	};

	const handleSubmitNewPlan = (e) => {
		e.preventDefault();
		swal({
			title: 'Activar',
			text: 'Esta seguro que desea modificar su plan?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(changePlan({ plan: newPlan }));
				if (newPlan === 'premium') {
					window.location.assign(
						'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848af994d0018b02039da906a5'
					);
				}

				swal({
					text: `Se han modificadao su plan, continue al pago`,
					icon: 'success'
				});
			} else {
				swal({ text: 'no se han modificado su plan', icon: 'info' });
			}
		});
	};

	return (
		<main className="client-config">
			<div>
				<div className={popUpOpen === true ? ' backdrop' : ''}>
					<div
						className={
							popUpOpen === true ? 'client-data-popup' : 'popup-hidden'
						}
					>
						<div className="client-data-popup-container">
							<div className="client-data-popup-btn">
								<button onClick={handlepopUp}>X</button>
							</div>
							<h3>Modificar datos</h3>
							<label htmlFor="">Nombre</label>
							<input
								type="text"
								name="name"
								value={input.name}
								onChange={handleChangeData}
							/>
							<label htmlFor="">Nombre del local:</label>
							<input
								type="text"
								name="storeName"
								value={input.storeName}
								onChange={handleChangeData}
							/>
							<label htmlFor="">Direccion:</label>
							<input
								type="text"
								name="address"
								value={input.address}
								onChange={handleChangeData}
							/>
							<label htmlFor="">Telefono</label>
							<input
								type="text"
								name="telefono"
								value={input.telefono}
								onChange={handleChangeData}
							/>
							<label htmlFor="">Pais</label>
							<input
								type="text"
								name="pais"
								value={input.pais}
								onChange={handleChangeData}
							/>
							<label htmlFor="">Localidad</label>
							<input
								type="text"
								name="localidad"
								value={input.localidad}
								onChange={handleChangeData}
							/>
							<label htmlFor="">Tipo de comercio</label>
							<select name="tipo" onClick={handleChangeData}>
								<option value="">-</option>
								<option value="cafe">Café</option>
								<option value="restaurant">Restaurante</option>
								<option value="bar">Bar</option>
								<option value="hotel">Hotel</option>
								<option value="otro">Otro</option>
							</select>

							<button className="submit-btn" onClick={handleSubmitData}>
								Modificar
							</button>
						</div>
					</div>
				</div>

				<div className="client-config-container">
					<div className="client-config-personal">
						<h3>Datos Personales</h3>
						<h4>
							Nombre : <span>{user?.name}</span>
						</h4>
						<h4>
							Nombre del local: <span>{user?.storeName}</span>
						</h4>
						<h4>
							Direccion: <span>{user?.address}</span>
						</h4>
						<h4>
							Telefono: <span>{user?.telefono}</span>
						</h4>
						<h4>
							Mail: <span>{user?.email}</span>
						</h4>
						<h4>
							Pais: <span>{user?.pais}</span>
						</h4>
						<h4>
							Localidad: <span>{user?.localidad}</span>
						</h4>
						<h4>
							Tipo de comercio: <span>{user?.tipo}</span>
						</h4>
						<button className="client-config-btn" onClick={handlepopUp}>
							Modificar datos
						</button>
					</div>
				</div>
			</div>

			<div className="client-config-plan">
				<h3>Plan adquirido</h3>
				<h4 className="h4-plan">{user?.plan}</h4>
				<button className="client-config-btn" onClick={handlePlanPopUp}>
					Actualizar plan
				</button>
			</div>
			<div className="client-config-qr-container">
				<h3>Generador de Qr</h3>
				<img src={QrSiMesero} alt="" className="client-config-qr" />
				<a
					href={`http://localhost:5173/dashboard/qrgenerator?email=${userEmail}`}
				>
					<button className="client-config-btn">Generar codigos Qr</button>
				</a>
			</div>
			<div className={planPopUpOpen === true ? ' backdrop' : ''}></div>
			<div
				className={
					planPopUpOpen === true ? 'client-plan-popup' : 'popup-hidden'
				}
			>
				<div className="client-data-popup-btn">
					<button onClick={handlePlanPopUp}>X</button>
				</div>
				<div className="client-plan-select">
					<select name="plan" id="" onClick={handleChangePlan}>
						<option value="">Actual: {user?.plan}</option>
						{user?.plan === 'basic' ? <option value="premium">Premium</option> : <option value="basic">Basic</option>}
					</select>
				</div>
				<div className="subs-btn-container-plan">
					
				{newPlan === 'basic' ? (
						<div>
							<button className="subs-btn" onClick={handleSubmitNewPlan}>
							Actualizar plan
							</button>
						</div>
					) : newPlan === 'premium' ? (
						<div>
							<button
								onClick={handleSubmitNewPlan}
								className="subs-btn-newPlan"
								href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848af994d0018b02039da906a5"
							>
								Actualizar plan
							</button>
							{/* <a
								// eslint-disable-next-line react/no-unknown-property
								mp-mode="dftl"
								href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848af994d0018b02039da906a5"
								name="MP-payButton"
								className="subs-btn-newPlan"
								>
								Continuar a pago
							</a> */}
							<script type="text/javascript">
								{(function () {
									function $MPC_load() {
										window.$MPC_loaded !== true &&
											(function () {
												var s = document.createElement('script');
												s.type = 'text/javascript';
												s.async = true;
												s.src =
													document.location.protocol +
													'//secure.mlstatic.com/mptools/render.js';
												var x = document.getElementsByTagName('script')[0];
												x.parentNode.insertBefore(s, x);
												window.$MPC_loaded = true;
											})();
									}
									window.$MPC_loaded !== true
										? window.attachEvent
											? window.attachEvent('onload', $MPC_load)
											: window.addEventListener('load', $MPC_load, false)
										: null;
								})()}
								;
								{/*
        // to receive event with message when closing modal from congrants back to site
        function $MPC_message(event) {
			// onclose modal ->CALLBACK FUNCTION
         // !!!!!!!!FUNCTION_CALLBACK HERE Received message: {event.data} preapproval_id !!!!!!!!
        }
        window.$MPC_loaded !== true ? (window.addEventListener("message", $MPC_message)) : null;
        */}
							</script>
						</div>
					) : (
						<div>Seleccione un tipo de plan</div>
					)}
				</div>
			</div>
			
		</main>
	);
}
