import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	deleteProduct,
	getMenuCategories,
	getLocalData,
	getProducts,
	modifyProduct
} from '../../../redux/actions';
import queryString from 'query-string';
import './ClientMenuConfig.css';
import swal from 'sweetalert';

export default function ClientMenuConfig() {
	const dispatch = useDispatch();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedProductForEdit, setSelectedProductForEdit] = useState({});

	useEffect(() => {
		const url = window.location.href;
		const parsed = queryString.parseUrl(url);
		const email = parsed.query.email;
		dispatch(getMenuCategories(email));
		dispatch(getProducts(email));
		dispatch(getLocalData(email));
	}, []);
	const products = useSelector((state) => state.localProducts);
	console.log(products);

	const categories = useSelector((state) => state.menuCategories.categorias);
	const user = useSelector((state) => state.localData.usuario);

	const handleCategorySelection = (categoryName) => {
		setSelectedCategory(categoryName);
	};

	const handleShowAll = () => {
		setSelectedCategory(null);
	};

	const handleDeleteProduct = (e) => {
		e.preventDefault();
		swal({
			title: 'Eliminar',
			text: 'Desea eliminar este producto?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				dispatch(deleteProduct(e.target.value));
				swal({
					text: `Se ha eliminado el producto`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'No se ha eliminado el producto', icon: 'info' });
			}
		});
	};

	const handleEditPopUp = (product) => {
		setSelectedProductForEdit(product);

		setInput({
			nombre: product.nombre || '', // Agrega el valor del nombre del producto
			precio: product.precio || 0, // Agrega el valor del precio del producto
			img: product.img || null,
			descripcion: product.descripcion || ''
		});
	};

	const [input, setInput] = useState({
		nombre: '',
		precio: 0,
		img: null, // Use null initially
		descripcion: ''
	});

	const handleChangeImg = (e) => {
		setInput({ ...input, img: e.target.files[0] });
	};

	const handleChangeProduct = (e) => {
		setInput((prevInput) => ({
			...prevInput,
			[e.target.name]: e.target.value
		}));
	};

	const handleSubmitChanges = (e) => {
		e.preventDefault();
		swal({
			title: 'Modificar',
			text: 'Desea modificar este producto?',
			icon: 'warning',
			buttons: ['No', 'Si']
		}).then((respuesta) => {
			if (respuesta) {
				const formData = new FormData();
				formData.append('nombre', input.nombre);
				formData.append('precio', input.precio);
				formData.append('img', input.img); // You can append the image to the FormData
				formData.append('descripcion', input.descripcion);

				dispatch(modifyProduct(selectedProductForEdit.id, formData));
				swal({
					text: `Se ha modificado el producto`,
					icon: 'success'
				});
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			} else {
				swal({ text: 'No se ha modificado el producto', icon: 'info' });
			}
		});
	};

	return (
		<main className="products-container">
			<div className="menu-config-admin-categories">
				<button
					className={`menu-config-admin-btn ${
						selectedCategory === null ? 'selected-category' : ''
					}`}
					onClick={handleShowAll}
				>
					Todas
				</button>
				{categories?.map((c, index) => (
					<button
						className={`menu-config-admin-btn ${
							selectedCategory === c.nombre_categoria ? 'selected-category' : ''
						}`}
						key={c.nombre_categoria + index}
						onClick={() => handleCategorySelection(c.nombre_categoria)}
					>
						{c.nombre_categoria}
					</button>
				))}
			</div>
			<div>
				{products === undefined ? (
					<h3>Cargando</h3>
				) : (
					products?.map((categoria, index) => (
						<div key={categoria.categoria + index}>
							{selectedCategory === null ||
							selectedCategory === categoria.categoria ? (
								<>
									<h2 className="category-title">{categoria.categoria}</h2>
									{categoria.subcategorias.map((subcategoria, subIndex) => (
										<div key={subcategoria.subcategoria_id + subIndex}>
											<h2 className="subcategory-title">
												{subcategoria.subcategoria}
											</h2>
											<img src={subcategoria.img} alt="" />
											<ul className="products-list">
												{subcategoria.productos.map((producto, prodIndex) => (
													<li
														className="client-menu-product-container"
														key={prodIndex}
													>
														<div>
															<div className="product-list-display">
															{user?.plan === 'premium' ? (
																	<div>
																		<img
																			src={producto.img}
																			alt={producto.nombre}
																			className="product-img"
																		/>
																	</div>
																) : (
																	<></>
																)}
																<div className="product-info">
																	<p className="product-name">
																		{producto.nombre}
																	</p>
																	<p className="product-price">
																		Precio: ${producto.precio}
																	</p>
																</div>
																<div className="admin-product-btn-container">
																	<button
																		value={producto.id}
																		onClick={handleDeleteProduct}
																		className="admin-product-btn"
																	>
																		Eliminar
																	</button>
																	<button
																		onClick={() => handleEditPopUp(producto)}
																		className="admin-product-btn"
																	>
																		Editar
																	</button>
																</div>
															</div>
															{selectedProductForEdit === producto ? (
																<div className="product-edit-popup">
																	<form
																		action=""
																		onChange={handleChangeProduct}
																	>
																		<label htmlFor="">Nombre:</label>
																		<input
																			type="text"
																			name="nombre"
																			id=""
																			value={input.nombre}
																		/>
																		<label htmlFor="">Precio:</label>
																		<input
																			type="number"
																			name="precio"
																			id=""
																			value={input.precio}
																		/>
																		<label htmlFor="">Descripcion:</label>
																		<input
																			type="text"
																			name="descripcion"
																			id=""
																			value={input.descripcion}
																		/>
																		<label htmlFor="">Imagen:</label>
																		<input
																			type="file"
																			id="newImg"
																			accept="img/*"
																			onChange={handleChangeImg}
																		/>
																		<button
																			type="submit"
																			onClick={handleSubmitChanges}
																		>
																			Realizar cambios
																		</button>
																	</form>
																	<button
																		onClick={() =>
																			setSelectedProductForEdit(null)
																		}
																	>
																		Cerrar
																	</button>
																</div>
															) : null}
														</div>
													</li>
												))}
											</ul>
										</div>
									))}
								</>
							) : null}
						</div>
					))
				)}
			</div>
		</main>
	);
}
