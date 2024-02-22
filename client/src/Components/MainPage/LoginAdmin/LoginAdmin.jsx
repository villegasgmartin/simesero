/* eslint-disable react/no-unescaped-entities */
import { useDispatch, useSelector } from 'react-redux';
import './LoginAdmin.css';
import { useState } from 'react';
import { createAdmin } from '../../../redux/actions';
import swal from 'sweetalert';

export default function LoginAdmin() {
	const dispatch = useDispatch();
	//Estado para verificar si el administrador tiene acceso
	const newAdmin = useSelector((state) => state.newAdmin);

	const [input, setInput] = useState({
		name: '',
		email: '',
		password: '',
		img: ''
	});

	const [repeatPass, setRepeatPass] = useState('');
	const handleRepeatPass = (e) => {
		setRepeatPass(e.target.value);
	};

	const handleChange = (e) => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

		if (input.name.trim() === '') {
			alert('Por favor complete su nombre');
			return;
		} else if (input.email.trim() === '') {
			alert('Por favor ingrese su email');
			return;
		} else if (!emailRegex.test(input.email)) {
			alert('Email no válido');
			return;
		} else if (input.password.trim() === '') {
			alert('Ingrese una contraseña');
			return;
		} else if (input.password.trim() !== repeatPass) {
			alert('Las contraseñas no coinciden');
			return;
		}

		swal({
			title: 'Crear admin',
			text: '¿Está seguro de que desea crear este administrador?',
			icon: 'warning',
			buttons: ['No', 'Sí']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(createAdmin(input));
				swal({
					text: 'Se ha creado un nuevo admin',
					icon: 'success'
				}).then(() => {
					// Mover history.push('/') aquí para que se ejecute después de swal
					window.location.assign('/');
					console.log('push');
				});
			} else {
				swal({ text: 'No se ha creado el admin', icon: 'info' });
			}
		});
	};

	return (
		<div className="loginAdmin">
			<div className="login-img-container"></div>
			<div className="form-loginadmin">
				<form action="">
					<h2 className="h2-login">Crea un Administrador</h2>
					{newAdmin?.msg === 'email existente' ? (
						<h3>Usuario ya existente</h3>
					) : (
						<div></div>
					)}
					<label htmlFor="">Nombre</label>
					<input
						type="text"
						name="name"
						id=""
						value={input.name}
						onChange={handleChange}
					/>
					<label htmlFor="">Email</label>
					<input
						type="email"
						name="email"
						id=""
						value={input.email}
						onChange={handleChange}
					/>
					<label htmlFor="">Password</label>
					<input
						type="password"
						name="password"
						id=""
						value={input.password}
						onChange={handleChange}
					/>
					<label htmlFor="">Confirmar Password</label>
					<input
						type="password"
						name=""
						id=""
						value={repeatPass}
						onChange={handleRepeatPass}
					/>
					<button className="submit-login" onClick={handleSubmit}>
						Enviar
					</button>
				</form>
			</div>
		</div>
	);
}