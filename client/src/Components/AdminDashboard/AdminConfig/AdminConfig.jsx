import { useEffect, useState } from 'react';
import './AdminConfig.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	confirmUserNewPlan,
	confirmUserPayment,
	getAllClients,
	getClientsToConfirm,
	getClientsToConfirmPlan,
	getPlans,
	planPrice,
	validateAdmin
} from '../../../redux/actions';
import swal from 'sweetalert';

export default function AdminConfig() {
	const dispatch = useDispatch();
	const plans = useSelector((state) => state.plans);
	const validation = useSelector((state) => state.validation.msg);
	const clientsToConfirm = useSelector((state) => state.clientsToConfirm);
	const clientsToConfirmPlan = useSelector(
		(state) => state.clientsToConfirmPlan
	);

	
	const [planPremiumInput, setPlanPremiumInput] = useState('');
	// eslint-disable-next-line no-unused-vars
	const [pageLoaded, setPageLoaded] = useState(false);

	const handleChangePremium = (e) => {
		setPlanPremiumInput(e.target.value);
	};

	const handleSubmitPlan = (e) => {
		e.preventDefault();
		swal({
			title: 'Activar',
			text: `Esta seguro que el nuevo precio sea $ ${planPremiumInput}??`,
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(
					planPrice({
						premium: planPremiumInput
					})
				);
				swal({
					text: `Se ha modificadao el precio`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha modificado el precio', icon: 'info' });
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			}
		});
	};

	const handleConfirmPayment = (e) => {
		e.preventDefault();
		swal({
			title: 'Activar',
			text: `Esta seguro que desea confirmar el pago del usuario ${e.target.value} ?`,
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(confirmUserPayment({ email: e.target.value }));
				swal({
					text: `Se ha confirmado el pago de ${e.target.value}`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha confirmado el pago', icon: 'info' });
			}
		});
	};

	const handleConfirmPlanChange = (e) => {

		e.preventDefault();
		swal({
			title: 'Activar',
			text: `Esta seguro que desea confirmar el pago del usuario  ${e.target.value} por cambio de plan ?`,
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(
					confirmUserNewPlan({ email: e.target.value, plan: e.target.name })
				);
				swal({
					text: `Se ha confirmado el pago de ${e.target.value}`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha confirmado el pago', icon: 'info' });
			}
		});
	};

	useEffect(() => {
		dispatch(getAllClients());
		dispatch(validateAdmin());
		dispatch(getPlans());
		dispatch(getClientsToConfirm());
		dispatch(getClientsToConfirmPlan());
		// Marcar la página como cargada después de las operaciones asincrónicas
		Promise.all([
			dispatch(getAllClients()),
			dispatch(validateAdmin()),
			dispatch(getPlans()),
			dispatch(getClientsToConfirm()),
			dispatch(getClientsToConfirmPlan())
		]).then(() => {
			setPageLoaded(true);
		});
	}, []);

	// Actualiza el valor de los input siempre que se modifiquen los planes
	useEffect(() => {
		if (plans) {
			setPlanPremiumInput(plans.premium);
			
		}
	}, [plans]); // Actualiza cuando 'planes' cambie sus valores

	return (
		<div>
			{pageLoaded === true ? (
				validation !== 'admin' ? (
					<h1>Usted no tiene acceso </h1>
				) : (
					<main className="admin-config-container">
						<div className="tablas">
							<div className="primer-pago">
								<h3>Usuarios a confirmar el pago</h3>
								<table className="act-table">
									<thead className="">
										<tr>
											<th>Mail</th>
											<th>Nombre</th>
											<th>Alta</th>
											<th>Activar</th>
										</tr>
									</thead>
									<tbody className="act-table-body">
										{clientsToConfirm?.map((c) => {
											return (
												<tr key={c.id}>
													<td>{c.email}</td>
													<td>{c.storeName}</td>
													<td>{c.date}</td>

													{c.pagoConfirmado === 0 ? (
														<td>
															<button
																value={c.email}
																onClick={handleConfirmPayment}
															>
																Confirmar
															</button>
														</td>
													) : (
														<td>Confirmado</td>
													)}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
							<div className="pago-plan">
								<h3>Usuarios a confirmar el cambio de plan</h3>
								<table className="act-table">
									<thead className="">
										<tr>
											<th>Mail</th>
											<th>Nuevo Plan</th>
											<th>Activar</th>
										</tr>
									</thead>
									<tbody className="act-table-body">
										{clientsToConfirmPlan?.map((c) => {
											return (
												<tr key={c.id}>
													<td>{c.email}</td>
													{c.plan === 'basic' ? (
													<td>Premium</td> ) : 
														( <td>Basico</td>) 
														
														}
													{c.pagoCambioPlan === 0 ? (
														<td>
															<button
																value={c.email}
																name={c.plan === 'basic' ? 'premium' : 'basic'}
																onClick={handleConfirmPlanChange}
															>
																Confirmar
															</button>
														</td>
													) : (
														<td>Confirmado</td>
													)}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
						<div></div>
						<div className="admin-functions-panel">
							<div className="admin-functions-panel-container">
								<div className="admin-changedata">
								<h3>Modificar precio del plan</h3>
									<div>
										<label>Premium:</label>
										<input
											type="text"
											value={planPremiumInput}
											onChange={handleChangePremium}
										/>
									</div>
									<button
										onClick={handleSubmitPlan}
										className="admin-config-submit-btn"
									>
										Modificar
									</button>
								</div>
							</div>
						</div>
					</main>
				)
			) : (
				<p>Cargando...</p>
			)}
		</div>
	);
}