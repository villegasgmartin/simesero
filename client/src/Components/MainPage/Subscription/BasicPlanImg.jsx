import { IoRestaurantSharp } from 'react-icons/io5';

// eslint-disable-next-line react/prop-types
export default function BasicPlanImg({ handleOpenSubscribe }) {
	return (
		<div className="subscription-img">
			<IoRestaurantSharp className="icon" />
			<h3>Plan Basico </h3>
			<ul className="subs-list">
				<li>1. Carta digital autoadministrable </li>
				<li>2. Actualizacion en tiempo real</li>
				<li>3. Llamar al mesero/a</li>
				<li>4. Mesas con QR</li>
				<li>5. Gratuito</li>
			</ul>

			<button className="subs-btn" onClick={handleOpenSubscribe}>
			Suscribirme
			</button>
		</div>
	);
}
