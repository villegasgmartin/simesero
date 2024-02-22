import './SideMenu.css';
import { BsFillHouseFill } from 'react-icons/bs';
import { FaMoneyBillWave } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { IoMdSettings } from 'react-icons/io';
import { VscSignOut } from 'react-icons/vsc';

import logo from '../../../assets/logos/Logo1.png';
import { useState } from 'react';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { changeAdminImg } from '../../../redux/actions';
import swal from 'sweetalert';

export default function SideMenu() {
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);
	const [imgInput, setImgInput] = useState(false);
	const [newImg, setNewImg] = useState('');
	const dataAdmin = useSelector((state) => state.validation.usuario);

	const handleOpenInput = () => {
		setImgInput(true);
	};

	const handleImg = (e) => {
		setNewImg(e.target.files[0]); // Use e.target.files[0] to get the selected file
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		swal({
			title: 'Activar',
			text: 'Esta seguro que desea  cambiar la imagen de perfil?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				const formData = new FormData();
				formData.append('newImagen', newImg); // Use the correct field name expected by the backend
				dispatch(changeAdminImg(formData));
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
		<div className="menu-admin-container">
			<button
				onClick={() => setMenuOpen(!menuOpen)}
				className={menuOpen === true ? `openSideBtn` : `closedSideBtn`}
			>
				{' '}
				<BsArrowRightCircle className="menuBtn" />
			</button>
			{menuOpen ? (
				<aside className="admin-side-menu-web ">
					<img src={logo} alt="" className="admin-side-menu-logo" />
					<div className="admin-side-container">
						<div className="admin-side-link">
							<BsFillHouseFill />
							<a href="/admin">Panel de control</a>
						</div>
						<div className="admin-side-link">
							<FaMoneyBillWave />
							<a href="">Ganancias</a>
						</div>
						<div className="admin-side-link">
							<BsFillPersonFill />
							<a href="/admin/clientes">Clientes</a>
						</div>
						<div className="admin-side-link">
							<IoMdSettings />
							<a href="/admin/configuracion">Configuracion</a>
						</div>
						<div className="admin-side-link">
							<VscSignOut />

							<a href="/">Salir</a>
						</div>
						<div className="admin-side-img">
							<img src={dataAdmin?.img} alt="" />
							<button className="cambiarimg-btn" onClick={handleOpenInput}>Cambiar imagen</button>
							{imgInput ? (
								<div className="admin-side-img-change">
									<input
										type="file"
										id="newImg"
										accept="image/*"
										onChange={handleImg}
									/>
									<button className="cambiarimg-btn" onClick={handleSubmit}>Cambiar</button>
								</div>
							) : (
								<div></div>
							)}
						</div>
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
							<BsFillHouseFill />
							<a href="/admin">Panel de control</a>
						</div>
						<div className="admin-side-link">
							<FaMoneyBillWave />
							<a href="">Ganancias</a>
						</div>
						<div className="admin-side-link">
							<BsFillPersonFill />
							<a href="/admin/clientes">Clientes</a>
						</div>
						<div className="admin-side-link">
							<IoMdSettings />
							<a href="/admin/configuracion">Configuracion</a>
						</div>
						<div className="admin-side-link">
							<VscSignOut />
							<a href="/">Salir</a>
						</div>
						<div className="admin-side-img">
							<img src={dataAdmin?.img} alt="" />
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
