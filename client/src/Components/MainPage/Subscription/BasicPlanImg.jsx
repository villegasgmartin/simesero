import { IoRestaurantSharp } from 'react-icons/io5';

// eslint-disable-next-line react/prop-types
export default function BasicPlanImg({ handleOpenSubscribe }) {
	return (
		<div className="subscription-img">
			<IoRestaurantSharp className="icon" />
			<h3>Gratis </h3>
			<ul className="subs-list">
				<li>1. Carta digital autoadministrable </li>
				<li>3. Actualizacion en tiempo real</li>
				<li>4. Llamar al mesero/a</li>
				<li>5. Mesas con QR</li>
			</ul>

			<button className="subs-btn" onClick={handleOpenSubscribe}>
				Comprar ahora
			</button>
		</div>
	);
}
