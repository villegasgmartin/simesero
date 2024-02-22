import { IoRestaurantSharp } from 'react-icons/io5';

import { useDispatch, useSelector } from 'react-redux';
import { getPlans } from '../../../redux/actions';
import { useEffect } from 'react';
// eslint-disable-next-line react/prop-types
export default function PremiumPlanImg({ handleOpenSubscribe }) {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getPlans());
	}, []);
	const plans = useSelector((state) => state.plans);

	return (
		<div className="subscription-img">
			<IoRestaurantSharp className="icon" />
			<h3>$ {plans.premium} <span>(mensual)</span></h3>
			
			<ul className="subs-list">
				<li>1. Carta digital autoadministrable </li>
				<li>3. Actualizacion en tiempo real</li>
				<li>4. Llamar al mesero/a</li>
				<li>5. Monitoreo y gestion de pedidos</li>
				<li>5. Mensajes online con el comensal</li>
				<li>6. Notificacion subdivision de cuenta para pagar</li>
				<li>7.Agregar imagenes a la carta</li>
			</ul>
			

			<button className="subs-btn" onClick={handleOpenSubscribe}>
				Comprar ahora
			</button>
			<br />
			<span>*15 dias gratis</span>
		</div>
	);
}
