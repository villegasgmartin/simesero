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

	// Función para formatear el número con separadores de miles
	const formatNumberWithSeparator = (number) => {
        if (typeof number === 'number' && !isNaN(number)) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return ''; // Retorna un string vacío si el número no está definido o no es válido
    };

	return (
		<div className="subscription-img">
			<IoRestaurantSharp className="icon" />
			<h3>Plan Premium</h3>
			<span>$ {formatNumberWithSeparator(plans?.premium)}</span>
			
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
			Suscribirme
			</button>
			<br />
			
		</div>
	);
}
