import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addToMinicart,
	getMenuCategories,
	getProducts
} from '../../../redux/actions';
import './Products.css';
import queryString from 'query-string';

export default function Products() {
	const dispatch = useDispatch();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [addedProductId, setAddedProductId] = useState(null);

	useEffect(() => {
		const url = window.location.href;
		const parsed = queryString.parseUrl(url);
		const email = parsed.query.email;

		dispatch(getMenuCategories(email));
		dispatch(getProducts(email));
	}, []);

	const categories = useSelector((state) => state.menuCategories.categorias);
	const products = useSelector((state) => state.localProducts);


	// Funcion para mostrar solo los productos correspondientes a la categoria seleccionada
	const handleCategorySelection = (categoryName) => {
		setSelectedCategory(categoryName);
	};
	// Funcion para mostrar todas las categorias
	const handleShowAll = () => {
		setSelectedCategory(null);
	};

	const handleAddToMinicart = (e, prodId) => {
		const producto = JSON.parse(e.target.value); // Convierte la cadena JSON en un objeto
		dispatch(addToMinicart(producto));
		setAddedProductId(prodId);
		setShowConfirmation(true);
		setTimeout(() => {
			setShowConfirmation(false);
			setAddedProductId(null);
		}, 1000);
	};
	const [selectedProductToShow, setselectedProductToShow] = useState(null);
	const handleEditPopUp = (product) => {
		setselectedProductToShow(product);
	};

	return (
		<main className="products-container">
			<div className="menu-mobile-admin-categories">
				<button
					className={`menu-mobile-admin-btn ${
						selectedCategory === null ? 'selected-category' : ''
					}`}
					onClick={handleShowAll}
				>
					Todas
				</button>
				{categories?.map((c, index) => (
					<button
						className={`menu-mobile-admin-btn ${
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
				{products.map((categoria, index) => (
					<div key={categoria.categoria + index}>
						{selectedCategory === null ||
						selectedCategory === categoria.categoria ? (
							<>
								<h2 className="category-title">{categoria.categoria}</h2>
								{categoria.subcategorias.map((subcategoria, subIndex) => (
									<div key={subcategoria.subcategoria_id + subIndex}>

										<div className="subcategory-container">
											{console.log(subcategoria)}
											<img
												src={subcategoria.imgsubcategoria}
												alt=""
												className="subcategory-img"
											/>
											<h2 className="subcategory-title">
												{subcategoria.subcategoria}
											</h2>
										</div>
										<ul className="products-list">
											{subcategoria.productos.map((producto, prodIndex) => (
												<div key={producto.nombre + prodIndex}>
													<li
														className={`product-container ${
															showConfirmation && addedProductId === producto.id
																? 'confirmation-symbol'
																: ''
														}`}
													>
														<div className="product-info">
															<p className="product-name">{producto.nombre}</p>
															
															<p className="product-price">
																${producto.precio}
															</p>
															{selectedProductToShow === producto ? (
														<div className="menu-product-edit-popup">
															<p className="product-description">
																{producto.descripcion}
															</p>
														</div>
													) : null}
															{selectedProductToShow === null ? (
																<a
																	onClick={() => handleEditPopUp(producto)}
																	className='ver-desc'
																>
																	Ver descripcion
																</a>
															) : (
																<a
																	onClick={() => setselectedProductToShow(null)}
																	className='ver-desc'
																>
																	Ocultar
																</a>
															)}
															
															
														</div>
														<div>
															<img
																src={producto.img}
																alt={producto.nombre}
																className="product-img"
															/>
														</div>
														<div className="product-add">
															<button
																value={JSON.stringify(producto)}
																onClick={(e) =>
																	handleAddToMinicart(e, producto.id)
																}
															>
																+
															</button>
														</div>
													</li>
													
												</div>

											))}
										</ul>
									</div>
								))}
							</>
						) : null}
					</div>
				))}
			</div>
		</main>
	);
}
