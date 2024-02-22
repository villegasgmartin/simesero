import './FirstView.css';
import { BsInstagram } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa';
import { BsWhatsapp } from 'react-icons/bs';

export default function FirstView() {
	return (
		<main className="fv">
			<div className="fv-container">
				<div className="about-imgs">
						<div></div>
						<div></div>
						<div></div>
				</div>
				<div className="fv-text">
				<div className="fv-title">
					
					<h1>El mesero virtual</h1>
					<h2>que suma agilidad</h2>
					<h2 className='title-mobile'>y ganancia a tu salon</h2>
					<h2 className='title-desk'>y ganancias</h2>
					<h2 className='title-desk'>a tu salón</h2>
				</div>
				<button className="fv-plan-btn-mobile">
					<a href="#suscripcion">Ver planes</a>
				</button>
				<div className='descripcion-opening'>
					<p>
						Gestioná pedidos de manera inteligente y optimizá tiempos de
						espera para un servicio impecable. ¡Marcá la diferencia en el
						competitivo mundo gastronómico y convertite en el favorito de
						todos!
					</p>
						<div className="circles">
							<div className="circle">
								<a
									href="https://instagram.com/simesero?igshid=MzRlODBiNWFlZA=="
									target="_blank"
									rel="noreferrer"
								>
									<BsInstagram />
								</a>
							</div>
							<div className="circle">
								<a
									href="https://www.facebook.com/profile.php?id=61552535904934&mibextid=ZbWKwL"
									target="_blank"
									rel="noreferrer"
								>
									<FaFacebook />
								</a>
							</div>
							<div className="circle">
								<a
									href="https://wa.link/vkaxvw"
									target="_blank"
									rel="noreferrer"
								>
									<BsWhatsapp />
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="fv-imgs">
					<div></div>
					<div></div>
					<div></div>
				</div>
				<button className="fv-plan-btn">
					<a href="#suscripcion">Ver planes</a>
				</button>
			</div>
		</main>
	);
}
