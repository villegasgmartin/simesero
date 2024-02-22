/* eslint-disable no-unused-vars */
import { useState } from 'react';
import './NavBar.css';
import LoginModal from '../LoginModal/LoginModal';
import SubsbribeModal from '../SubscibeModal/SubscribeModal.jsx';
import { BsPersonCircle } from 'react-icons/bs';
import logo2 from '../../../assets/logos/Logo2.png';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logOutUser } from '../../../redux/actions';

export default function NavBar() {
	//manejo de estado de la barra de navegacion
	const dispatch = useDispatch();
	const [navbar, setNavbar] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);
	const handleOpenLogin = () => {
		setLoginOpen(true);
	};
	const handleCloseLogin = () => {
		setLoginOpen(false);
	};
	const [subscribeOpen, setSubscribeOpen] = useState(false);
	const handleOpenSubscribe = () => {
		setSubscribeOpen(true);
	};
	const handleCloseSubscribe = () => {
		setSubscribeOpen(false);
	};

	const handleLogOut = () => {
		dispatch(logOutUser());
		window.location.reload(true);
	};
	// Caracteristicas del usuario logueado
	const userType = useSelector((state) => state.userType);
	const actualUser = useSelector((state) => state.actualUser);

	return (
		<nav className="navbar">
			<div className="navbar-container">
				<div>
					<div className="navbar-brand">
						<div className="navbar-toggle">
							{/* En caso de ser false, el navBar se encuentra oculto, cuando se presiona el boton se despliega */}
							<button onClick={() => setNavbar(!navbar)}>
								{navbar ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="navbar-icon"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="navbar-icon"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								)}
							</button>
						</div>
						<div className="navbar-title">
							<img src={logo2} alt="" className="nav-logo" />
						</div>
						<div className="navBar-icon">
							<BsPersonCircle
								className="navBar-icon-child"
								onClick={handleOpenLogin}
							/>
						</div>
					</div>
				</div>
				<div className="navbar-info">
					{/* Los clasname block y hidden determinan el comportamiento de la barra dependiendo si se esta viendo en una pc o un smartphone */}
					<div className={`   ${navbar ? 'block' : 'hidden'} `}>
						<ul className="navbar-list">
							<li className=" navbar-item">
								<a className="navbar-link" href="#nosotros">
									Sobre nosotros
								</a>
							</li>
							<li className=" navbar-item">
								<a className="navbar-link" href="#testimonios">
									Testimonios
								</a>
							</li>
							<li className="navbar-item">
								<a className="navbar-link" href="#suscripcion">
									Suscripción{' '}
								</a>
							</li>
						</ul>
						{userType === 'admin' ? (
							<div className="navbar-btns">
								<Link to="/admin">
									<button className="navbar-btn">Administrador</button>
								</Link>
								<button className="navbar-btn">
									<a href="/">Cerrar sesion</a>
								</button>
							</div>
						) : userType === 'local' ? (
							<div className="navbar-btns">
								<Link to={`/dashboard?email=${actualUser.email}`}>
									<button className="navbar-btn">Dashboard</button>
								</Link>
								<button className="navbar-btn">
									<a href="/">Cerrar sesion</a>
								</button>
							</div>
						) : (
							<div className="navbar-btns">
								<button className="navbar-btn" onClick={handleOpenLogin}>
									Iniciar sesión
								</button>
								<button className="navbar-btn" onClick={handleOpenSubscribe}>
									Registrarse
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<article
				className={
					loginOpen === true ? `modal modal-is-open` : `modal modal-is-close`
				}
			>
				<div className="modal-container">
					<LoginModal
						handleCloseLogin={handleCloseLogin}
						handleOpenSuscribe={handleOpenSubscribe}
					/>
				</div>
			</article>
			<article
				className={
					subscribeOpen === true
						? `modalSubs modalSubs-is-open`
						: `modalSubs modalSubs-is-close`
				}
			>
				<div className="modalSubs-container">
					<SubsbribeModal
						handleCloseSubscribe={handleCloseSubscribe}
						handleOpenLogin={handleOpenLogin}
					/>
				</div>
			</article>
		</nav>
	);
}
