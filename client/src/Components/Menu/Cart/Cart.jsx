import {
	getLocalPlan,
	
	ordering,
	removeFromMinicart
} from '../../../redux/actions';
import { useLocation } from 'react-router-dom';
import './Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';

export default function Cart() {
	const micart = useSelector((state) => state.productsAdeedToMinicart);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const dispatch = useDispatch();
	const userEmail = searchParams.get('email');
	const mesa = searchParams.get('mesa');
	const nombresProductos = micart.map((producto) => producto.nombre).join(', ');


	useEffect(() => {
		dispatch(getLocalPlan(userEmail));
	}, []);
	const plan = useSelector((state) => state.localPlan);

	// Calcular la suma de los precios
	const totalPrice = micart.reduce(
		(total, product) => parseFloat(total) + parseFloat(product.precio),
		0
	);
	// Quitar un producto del carrito
	const handleQuit = (e) => {
		console.log('quit');
		dispatch(removeFromMinicart(e.target.value));
	};
	// Poner el nombre de usuario
	const [userName, setUserName] = useState('');
	const handleUserName = (e) => {
		setUserName(e.target.value.toUpperCase());
	};

	const [comment, setComment] = useState('');
	const handleComment = (e) => {
		setComment(e.target.value);
	};
	// Realizar el pedido
	const handleSubmit = (e) => {
		e.preventDefault();
		swal({
			title: 'Enviar',
			text: 'Desea enviar este pedido?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(
					ordering(userEmail, mesa, {
						pedido: nombresProductos,
						nombre: userName,
						total: totalPrice,
						comentarios: comment
					})
				);
				swal({
					text: `Se ha enviado el pedido`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'no se ha enviado el pedido', icon: 'info' });
			}
		});
	};

	return (
		<>
			{plan === 'premium' ? (
				<div className="cart-container">
					
					<div className="name-area-container">
						<p className='cart-name'>Su Nombre*</p>
						<input
							type="text"
							name=""
							id=""
							value={userName}
							onChange={handleUserName}
							placeholder='Indique aqui su nombre'
						/>
					</div>
					{micart.map((product, index) => (
						<div key={index}>
							<div className="minicart-product">
								<img src={product.img} alt="" className="minicart-prod-img" />
								<h2 className="minicart-prod-name">{product.nombre}</h2>
								<h2 className="minicart-prod-price">$ {product.precio}</h2>

								<button
									value={product.id}
									onClick={handleQuit}
									className="cart-quit-btn"
								>
									X
								</button>
							</div>
						</div>
					))}
					<div>
						<div className="comment-area-container">
							<p>¿Desea dejar algun comentario?</p>
							<textarea
								name="comentario"
								id=""
								cols="36"
								rows="6"
								className="comment-area"
								value={comment}
								onChange={handleComment}
							></textarea>
						</div>
						<h2 className="minicart-total-price">Total: ${totalPrice}</h2>{' '}
						<div className="submit-order-container">
							{userName === '' ? (
								<div>Ingrese su nombre</div>
							) : micart.length === 0 ? (
								<div>Seleccione un producto</div>
							) : (
								<div>
									<button className="payment-btn" onClick={handleSubmit}>Enviar pedido</button>
								</div>
							)}
						</div>
					</div>
					
				</div>
			) : (
				<p>Este usuario no dispone de carrito de compras</p>
			)}
		</>
	);
}