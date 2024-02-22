import './Footer.css';
import { BsInstagram } from 'react-icons/bs';

export default function Footer() {
	return (
		<div>
			<div className="line"></div>
			<div className="footer">
				<div className="footer-container">
					<div className="footer-links">
						<div className="footer-links-a">
							<a href="">Aviso legal</a>|<a href="">Privacidad</a>
						</div>
						<h3>2023 Todos los derechos reservados. Duwoh Developers</h3>
					</div>
					<div className="footer-socials">
						<a
							href="https://instagram.com/duwohdev?igshid=MzMyNGUyNmU2YQ=="
							target="_blank"
							rel="noreferrer"
						>
							<BsInstagram />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
