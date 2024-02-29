import './ClientSideMenu.css';
import { IoRestaurantOutline } from 'react-icons/io5';
import { MdMenuBook } from 'react-icons/md';
import { BsFillPersonFill } from 'react-icons/bs';

import { VscSignOut } from 'react-icons/vsc';

import logo from '../../../assets/logos/Logo2.png';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BsArrowRightCircle } from 'react-icons/bs';
import { IoSettingsSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';


import { changeLocalImg, getLocalData } from '../../../redux/actions';
import swal from 'sweetalert';

export default function ClientSideMenu() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const userEmail = searchParams.get('email');
	// Datos del cliente

	useEffect(() => {
		dispatch(getLocalData(userEmail));
	}, []);
	const dataLocal = useSelector((state) => state.localData.usuario);

	const dispatch = useDispatch();

	const [menuOpen, setMenuOpen] = useState(false);

	// Funciones para cambiar la imagen de perfil
	const [imgInput, setImgInput] = useState(false);
	const [newImg, setNewImg] = useState('');

	const handleOpenInput = () => {
		setImgInput(true);
	};

	const handleImg = (e) => {
		setNewImg(e.target.files[0]);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		swal({
			title: 'Modificar',
			text: 'Esta seguro que desea  cambiar la imagen de perfil?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				const formData = new FormData();
				formData.append('newImagen', newImg);
				dispatch(changeLocalImg(formData));
				swal({
					text: `Se ha modificado la imagen de perfil`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha modificado la imagen', icon: 'info' });
			}
		});
	};

	return (
		<div>
			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className={menuOpen === true ? `openSideBtn` : `closedSideBtn`}
			>
				{' '}
				<BsArrowRightCircle className="menuBtn" />
			</button>
			{menuOpen ? (
				<aside className="client-side-menu-web">
					<img src={logo} alt="" className="client-side-menu-logo" />
					<div className="client-side-container">
						<div className="client-side-link">
							<IoRestaurantOutline />
							<a href={`/dashboard?email=${userEmail}`}>Salon</a>
						</div>
						<div className="client-side-link">
							<MdMenuBook />
							<a href={`/dashboard/menu?email=${userEmail}`}>Menu</a>
						</div>
						<div className="client-side-link">
						<IoSettingsSharp />
							<a href={`/dashboard/configuracion?email=${userEmail}`}>
								Configuracion
							</a>
						</div>
						<div className="client-side-link">
							<BsFillPersonFill />
							<a href={`/dashboard/chat?email=${userEmail}`}>Chat</a>
						</div>
						<div className="client-side-link">
							<VscSignOut />
							<a href="/">Salir</a>
						</div>
						<div className="client-side-img">
							<img src={dataLocal?.img} alt="" />

							<button className="cambiarimg-btn" onClick={handleOpenInput}>
								Cambiar logo
							</button>
							{imgInput ? (
								<div className="admin-side-img-change">
									<input
										type="file"
										id="newImg"
										accept="image/*"
										onChange={handleImg}
									/>
									<button className="cambiarimg-btn" onClick={handleSubmit}>
										Cambiar
									</button>
								</div>
							) : (
								<div></div>
							)}
						</div>
					</div>
					<div className="navbar-mail-links">
						<a
							href="mailto:sugerencias@simesero.com"
							target="_blank"
							rel="noreferrer"
						>
							Sugerencias
						</a>
						<a
							href="mailto:contacto@simesero.com"
							target="_blank"
							rel="noreferrer"
						>
							Contacto
						</a>
					</div>
				</aside>
			) : (
				<div className="sideMenuClosed"></div>
			)}
			<nav className="admin-menu-mobile">
				<div className="admin-menu-mobile-top">
					<div>
						<button onClick={() => setMenuOpen(!menuOpen)}>
							{menuOpen ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="nav-icon"
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
									className="nav-icon"
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
					<div>
						<div className="nav-menu-logo-mobile"></div>
					</div>
				</div>
				<div className={`${menuOpen ? 'nav-open' : 'nav-hidden'} `}>
					<div className="admin-side-container">
						<div className="admin-side-link">
							<IoRestaurantOutline />
							<a href={`/dashboard?email=${userEmail}`}>Salon</a>
						</div>
						<div className="admin-side-link">
							<MdMenuBook />
							<a href={`/dashboard/menu?email=${userEmail}`}>Menu</a>
						</div>
						<div className="admin-side-link">
							<BsFillPersonFill />
							<a href={`/dashboard/configuracion?email=${userEmail}`}>
								Configuracion
							</a>
						</div>
						<div className="admin-side-link">
							<BsFillPersonFill />
							<a href={`/dashboard/chat?email=${userEmail}`}>Chat</a>
						</div>
						<div className="admin-side-link">
							<VscSignOut />
							<a href="/">Salir</a>
						</div>

						<div className="admin-side-img">
							<img src={dataLocal?.img} alt="" />
							<button onClick={handleOpenInput}>Cambiar imagen</button>
							{imgInput ? (
								<div className="admin-side-img-change">
									<input
										type="file"
										id="newImg"
										accept="image/*"
										onChange={handleImg}
									/>
									<button onClick={handleSubmit}>Cambiar</button>
								</div>
							) : (
								<div></div>
							)}
						</div>
					</div>
				</div>
			</nav>
		</div>
	);
}
