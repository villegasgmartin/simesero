import { RxTriangleDown } from 'react-icons/rx';
import './AdminMenu.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
export default function AdminMenu() {
	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen(!open);
	};
	const dataAdmin = useSelector((state) => state.validation.usuario);
	return (
		<nav className="admin-menu">
			<div className="admin-menu-container">
				<div className="admin-menu-panel">
					<img src={dataAdmin?.img} alt="" className="admin-menu-img" />
					<div>
						<div>
							<h3>Mi cuenta</h3>
							<button className='arrow-menu' onClick={handleClick}>
								<RxTriangleDown />
							</button>
						</div>
						<div className={`${open ? 'panel-open' : 'panel-closed'}`}>
							<a href="">Mi perfil</a>
							<a href="/">Cerrar sesion</a>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}