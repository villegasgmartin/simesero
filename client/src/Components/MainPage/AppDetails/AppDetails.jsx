import './AppDetails.css';
import mobile1 from '../../../assets/mobile1.webp';
import mobile2 from '../../../assets/mobile2.png';
import mobile3 from '../../../assets/mobile4.webp';

export default function AppDetails() {
	return (
		<div className="appdet">
			<div className="appdet-circles">
			<div>
					<h3>Autoadministra tu menú y precios sin esperas</h3>
				</div>
				<div>
					<h3>Sin instalar apps, gestiona pedidos y más</h3>
				</div>
				<div>
					<h3>Subdivide las cuentas a pagar por mesa, sin caos</h3>
				</div>
			</div>
			<div className="appdet-images">
				<img src={mobile1} alt="" />
				<img src={mobile2} alt="" />
				<img src={mobile3} alt="" />
			</div>
		</div>
	);
}
