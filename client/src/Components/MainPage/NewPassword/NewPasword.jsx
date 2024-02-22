/* eslint-disable react/no-unescaped-entities */
import './NewPasword.css'
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { changePassword } from '../../../redux/actions';
import swal from 'sweetalert';
import { useLocation } from 'react-router-dom';

export default function NewPassword() {
	const dispatch = useDispatch();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const token = searchParams.get('token');

	//Estado para verificar si el administrador tiene acceso

	const [input, setInput] = useState({
		password: ''
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

		if (input.password.trim() === '') {
			alert('Ingrese una contraseña');
			return;
		} else if (input.password.trim() !== repeatPass) {
			alert('Las contraseñas no coinciden');
			return;
		}
		swal({
			title: 'Cambio de contraseña',
			text: '¿Está seguro de que cambiar la contraseña?',
			icon: 'warning',
			buttons: ['No', 'Sí']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(changePassword(token, { password: input.password }));
				swal({
					text: 'Se ha cambiado la contraseña',
					icon: 'success'
				}).then(() => {
					window.location.assign('/');
				});
			} else {
				swal({ text: 'No se ha cambiado la contraseña', icon: 'info' });
			}
		});
	};

	return (
		<div className="loginAdmin">
			<div className="login-img-container"></div>
			<div className="form-loginadmin">
				<form action="">
					<h2 className="h2-login">Cambio de contraseña</h2>

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