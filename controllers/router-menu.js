const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const pool = require('../database');
const generarJWT = require('../middlerwares/generar-jwt');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const mostrarMenu = async (req, res = response) => {
	const emailUsuario = req.query.email;
	try {
		const query = `
      SELECT
        c.id_categoria AS categoria_id,
        c.nombre_categoria AS categoria,
        s.id_subcategoria AS subcategoria_id,
        s.nombre_subcategoria AS subcategoria,
		s.img_subcategoria,
        i.id_producto,
        i.img,
        i.nombre,
        i.precio,
		i.descripcion
      FROM
        categorias AS c
      LEFT JOIN
        subcategorias AS s ON c.id_categoria = s.id_categoria
      LEFT JOIN
        items AS i ON s.id_subcategoria = i.id_subcategoria
      WHERE
        i.emailusuario = ?
    `;

		const [rows] = await pool.query(query, [emailUsuario]);

		// Organizar los resultados en una estructura jerárquica
		const result = [];
		rows.forEach((row) => {
			let categoriaIndex = result.findIndex(
				(item) => item.categoria_id === row.categoria_id
			);
			if (categoriaIndex === -1) {
				// Si la categoría aún no está en el resultado, agrégala
				result.push({
					categoria_id: row.categoria_id,
					categoria: row.categoria,
					subcategorias: []
				});
				categoriaIndex = result.length - 1;
			}

			if (row.subcategoria_id) {
				// Si la fila tiene una subcategoría, agrégala
				let subcategoriaIndex = result[categoriaIndex].subcategorias.findIndex(
					(item) => item.subcategoria_id === row.subcategoria_id
				);
				if (subcategoriaIndex === -1) {
					result[categoriaIndex].subcategorias.push({
						subcategoria_id: row.subcategoria_id,
						subcategoria: row.subcategoria,
						imgsubcategoria: row.img_subcategoria,
						productos: []
					});
					subcategoriaIndex = result[categoriaIndex].subcategorias.length - 1;
				}

				// Agrega el producto a la subcategoría
				result[categoriaIndex].subcategorias[subcategoriaIndex].productos.push({
					id: row.id_producto,
					img: row.img,
					nombre: row.nombre,
					precio: row.precio,
					descripcion: row.descripcion
				});
			} else {
				// Si no tiene subcategoría, agrega el producto directamente a la categoría
				result[categoriaIndex].productos.push({
					img: row.img,
					nombre: row.nombre,
					precio: row.precio
				});
			}
		});

		res.status(200).json(result);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
};

// Ruta para agregar un elemento
const agregarProducto = async (req, res) => {
	const emailUsuario = req.email;
	try {
		let { nombre, categoria, subcategoria, precio, descripcion } = req.body;
		console.log(nombre, categoria, subcategoria, precio, descripcion);
		let id_producto = uuidv4();

		
		//agregar imagen a cloudinary para obterner url

		if (req.files) {
			const { tempFilePath } = req.files.img;

			const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

			img_url = secure_url;
		} else {
			img_url =
				'https://res.cloudinary.com/dj3akdhb9/image/upload/v1695261911/samples/default-product-image_gqztb6.png';
		}

		if(!descripcion){
			descripcion = '';
		}
		console.log(nombre, categoria, subcategoria, precio, descripcion);


		const queryCategoria =
			'SELECT id_categoria FROM categorias WHERE nombre_categoria = ? AND emailusuario = ?';
		const resultCategoria = await pool.query(queryCategoria, [
			categoria,
			emailUsuario
		]);
		console.log(resultCategoria);
		if (resultCategoria[0].length === 0) {
			return res
				.status(400)
				.json({ message: 'La categoría no existe para este usuario.' });
		}

		const c = resultCategoria[0][0];
		const cSeleccionada = c.id_categoria;

		const querySubCategoria =
			'SELECT id_subcategoria FROM subcategorias WHERE id_categoria = ? AND emailusuario = ? AND nombre_subcategoria = ?';
		const resultSubCategoria = await pool.query(querySubCategoria, [
			cSeleccionada,
			emailUsuario,
			subcategoria
		]);
		if (resultSubCategoria[0].length === 0) {
			const query =
				'INSERT INTO items (img, nombre, id_categoria, precio, emailusuario, id_producto) VALUES (?, ?, ?, ?, ?, ?)';
			const values = [
				img_url,
				nombre,
				cSeleccionada,
				precio,
				emailUsuario,
				id_producto
			];

			await pool.query(query, values);
		} else {
			const sub = resultSubCategoria[0][0];
			const cSubSeleccionada = sub.id_subcategoria;
			const query =
				'INSERT INTO items (img, nombre, id_categoria, id_subcategoria, precio, emailusuario, id_producto, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
			const values = [
				img_url,
				nombre,
				cSeleccionada,
				cSubSeleccionada,
				precio,
				emailUsuario,
				id_producto,
				descripcion
			];

			await pool.query(query, values);
		}

		res.status(201).json({
			message: 'Producto agregado correctamente'
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ err });
	}
};

//ruta para agregar categoria

const crearCategoria = async (req, res) => {
	const emailUsuario = req.email;
	const { nombre_categoria } = req.body;
	const categoriaLower = nombre_categoria.toLowerCase();
	try {
		if(!nombre_categoria){
			return res.status(404).json({
				msg:'debe ingresar categoria'
			})
		}
		// Primero, verifica si ya existe una categoría con el mismo nombre para el usuario dado
		const categoriaExistente =
			'SELECT id_categoria FROM categorias WHERE nombre_categoria = ? AND emailusuario = ?';
		const categoriaExistenteValues = [nombre_categoria, emailUsuario];
		const [categoriaExistenteResult] = await pool.query(
			categoriaExistente,
			categoriaExistenteValues
		);

		if (categoriaExistenteResult.length > 0) {
			return res
				.status(400)
				.json({ message: 'La categoría ya existe para este usuario.' });
		}

		//creo la categoria
		const query =
			'INSERT INTO categorias (nombre_categoria, emailusuario) VALUES (?, ?)';
		const values = [categoriaLower, emailUsuario];

		await pool.query(query, values);
		res.status(201).json({
			message: 'Categoria agregado correctamente'
		});
	} catch (err) {
		res.status(500).json({ error: err });
	}
};

//DELETE borrar categoria

const borrarCategoria = async (req, res) => {
	const emailUsuario = req.query.email;
	const nombre_categoria = req.query.categoria;
	// const {nombre_categoria, emailUsuario } = req.body;

	try {
		//buscar el id de categoria
		const idCategoriaQuery =
			'SELECT id_categoria FROM categorias WHERE nombre_categoria = ? AND emailusuario = ?';
		const resultIdCategoria = await pool.query(idCategoriaQuery, [
			nombre_categoria,
			emailUsuario
		]);

		if (resultIdCategoria[0].length === 0) {
			return res.status(404).json({ error: 'La categoría no existe.' });
		}
		const idCtg = resultIdCategoria[0][0];
		const categoria = idCtg.id_categoria;
		console.log(categoria);
		// Verifica si la categoría existe
		const categoriaExistenteQuery =
			'SELECT * FROM categorias WHERE id_categoria = ?';
		const [categoriaExistenteRows] = await pool.query(categoriaExistenteQuery, [
			categoria
		]);

		if (categoriaExistenteRows.length === 0) {
			return res.status(404).json({ error: 'La categoría no existe.' });
		}

		// Borra todos los productos asociados a la categoría
		const deleteProductosQuery = 'DELETE FROM items WHERE id_categoria = ?';
		await pool.query(deleteProductosQuery, [categoria]);

		// Borra la categoría
		const deleteCategoriaQuery =
			'DELETE FROM categorias WHERE id_categoria = ?';
		await pool.query(deleteCategoriaQuery, [categoria]);

		res.status(200).json({
			message: 'Categoría y productos asociados eliminados con éxito.'
		});
	} catch (err) {
		res.status(500).json({ error: err });
		console.error(err);
	}
};

//DELETE borrar subcategoria
const borrarSubCategoria = async (req, res) => {
	const emailUsuario = req.query.email;
	const nombre_categoria = req.query.categoria;
	const nombre_subcategoria = req.query.subcategoria;

	try {
		//obtengo el id de la categoria
		const queryCategoria =
			'SELECT id_categoria FROM categorias WHERE nombre_categoria = ? AND emailusuario = ?';
		const resultCategoria = await pool.query(queryCategoria, [
			nombre_categoria,
			emailUsuario
		]);
		const idCtg = resultCategoria[0][0];
		const categoria = idCtg.id_categoria;
		console.log(categoria);
		//buscar el id de subcategoria

		const idSubCategoriaQuery =
			'SELECT id_subcategoria FROM subcategorias WHERE nombre_subcategoria = ? AND emailusuario = ? AND id_categoria = ?';
		const resultIdSubCategoria = await pool.query(idSubCategoriaQuery, [
			nombre_subcategoria,
			emailUsuario,
			categoria
		]);
		console.log(resultIdSubCategoria);
		if (resultIdSubCategoria[0].length === 0) {
			return res.status(404).json({ error: 'La subcategoría no existe.' });
		}
		const idSubCtg = resultIdSubCategoria[0][0];
		const subcategoria = idSubCtg.id_subcategoria;
		console.log(subcategoria);

		// Verifica si la subcategoría existe
		const subcategoriaExistenteQuery =
			'SELECT * FROM subcategorias WHERE id_subcategoria = ?';
		const [subcategoriaExistenteRows] = await pool.query(
			subcategoriaExistenteQuery,
			[subcategoria]
		);

		if (subcategoriaExistenteRows.length === 0) {
			return res.status(404).json({ error: 'La subcategoría no existe.' });
		}

		// Borra todos los productos asociados a la subcategoría
		const deleteProductosQuery = 'DELETE FROM items WHERE id_subcategoria = ?';
		await pool.query(deleteProductosQuery, [subcategoria]);

		// Borra la subcategoría
		const deleteSubcategoriaQuery =
			'DELETE FROM subcategorias WHERE id_subcategoria = ?';
		await pool.query(deleteSubcategoriaQuery, [subcategoria]);

		res.status(200).json({
			message: 'Subcategoría y productos asociados eliminados con éxito.'
		});
	} catch (err) {
		res.status(500).json({ error: err });
		console.error(err);
	}
};
//ruta para agregar subcategorias

const crearSubCategoria = async (req, res) => {
	const emailUsuario = req.email;
	const { subcategoria, categoria } = req.body;
	const subcategoriaLower = subcategoria.toLowerCase();

	try {
		// Verifica si la categoría especificada existe para el usuario
		const categoriaExistenteQuery =
			'SELECT id_categoria FROM categorias WHERE nombre_categoria = ? AND emailusuario = ?';
		const categoriaExistenteValues = [categoria, emailUsuario];
		const categoriaExistenteResult = await pool.query(
			categoriaExistenteQuery,
			categoriaExistenteValues
		);
		const idCategoria = categoriaExistenteResult[0][0].id_categoria;

		if (categoriaExistenteResult.length === 0) {
			return res.status(400).json({
				message: 'La categoría especificada no existe para este usuario.'
			});
		}

		//validar que no exista la misma subcategoria para ese usuario

		const subcategoriaExistente = 'SELECT id_subcategoria FROM subcategorias WHERE id_categoria = ? AND emailusuario = ? AND nombre_subcategoria = ?'  ;
		const resultsubExistente = await pool.query(subcategoriaExistente, [idCategoria, emailUsuario, subcategoria]);
		console.log(resultsubExistente)
		const validSubcategoria = resultsubExistente[0].length;
		console.log("lenght", validSubcategoria);
		if(validSubcategoria != 0){
			return res.json({
				msg:'La subcategoria ya existe'
			})
		}

		
		if (req.files) {
			const { tempFilePath } = req.files.img;

			const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

			img_url = secure_url;
		} else {
			img_url =
				'https://res.cloudinary.com/dj3akdhb9/image/upload/v1695261911/samples/default-product-image_gqztb6.png';
		}

		// Inserta la nueva subcategoría en la base de datos
		const insertQuery =
			'INSERT INTO subcategorias (nombre_subcategoria, id_categoria, emailusuario,img_subcategoria) VALUES (?, ?, ?, ?)';
		const insertValues = [subcategoriaLower, idCategoria, emailUsuario, img_url];

		await pool.query(insertQuery, insertValues);
		res.status(201).json({
			message: 'Subcategoría agregada correctamente'
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
};

//ruta actualizar img subcategoria
const actualizarImgSub = async (req, res) => {
	
	const {categoria, subcategoria} = req.body;
	const usuario = req.email;

	try {
		//sacar el id de la caregoria seleccionada
		const idCategoria = await pool.query('SELECT id_categoria FROM categorias WHERE emailUsuario = ? AND nombre_categoria = ?', [usuario,categoria] )
		const id = idCategoria[0][0].id_categoria;
		
		console.log(id, usuario, categoria);
		// Verificar que el elemento pertenezca al usuario autenticado antes de actualizar
		const itemRows = await pool.query(
			'SELECT * FROM subcategorias WHERE id_categoria = ? AND emailusuario = ? AND nombre_subcategoria = ?',
			[id, usuario, subcategoria ]
		);

		//verificar si la subcategoría tiene imagen o no
		const img_sub = itemRows[0][0].img_subcategoria;
		console.log(img_sub);

		if(img_sub == null || img_sub == undefined){
			const { tempFilePath } = req.files.img;
			const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
			img_url = secure_url;
		}
		else{
			const urlImagenVIeja = itemRows[0][0].img_subcategoria;
			const [public_id] = urlImagenVIeja.split('.');
			cloudinary.uploader.destroy(public_id);
			const { tempFilePath } = req.files.img;
			const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
			img_url = secure_url;
		}
		// //BORRAR LA IMAGEN DE CLOUDINARY Y REEMPLEZARLA CON LA NUEVA
		
			
		

		const query = 'UPDATE subcategorias SET img_subcategoria = ? WHERE id_categoria = ? AND emailusuario = ? AND nombre_subcategoria = ?';

		const result = await pool.query(query, [img_url, id, usuario, subcategoria ]);

		res.status(200).json({
			result,
			msg: 'Imagen actualizada'
		})



	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error})
	}
}

// Ruta para actualizar un elemento
const actualizarMenu = async (req, res) => {
	const dataActualizada = req.body;
	const usuarioActualizado = req.email;

	try {
		const id = req.query.id;

		// Verificar que el elemento pertenezca al usuario autenticado antes de actualizar
		const itemRows = await pool.query(
			'SELECT * FROM items WHERE id_producto = ? AND emailusuario = ?',
			[id, usuarioActualizado]
		);

		if (itemRows.length === 0) {
			return res.status(404).json({ message: 'Item not found.' });
		}

		// //BORRAR LA IMAGEN DE CLOUDINARY Y REEMPLEZARLA CON LA NUEVA
		if (req.files) {
			const urlImagenVIeja = itemRows[0][0].img;

			const [public_id] = urlImagenVIeja.split('.');
			cloudinary.uploader.destroy(public_id);
			const { tempFilePath } = req.files.img;

			const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

			img_url = secure_url;
		} else {
			img_url = itemRows[0][0].img;;
		}

		let sql = `UPDATE items SET`;
		let values = [];
		for (const key in dataActualizada) {
			if (key !== usuarioActualizado && dataActualizada.hasOwnProperty(key)) {
				sql += ` ${key} = ?, `;
				console.log(sql);
				values.push(dataActualizada[key]);
				console.log('values', values);
			}
		}
		sql = sql.slice(0, -2);
		sql += `, img = '${img_url}' WHERE id_producto = ?`;
		values.push(id);

		const result = await pool.query(sql, values);
		console.log(result);
		res.status(200).json({ message: 'producto actualizado' });
	} catch (err) {
		res.status(500).json({ error: err });
	}
};

// Ruta para eliminar un elemento
const borrarProducto = async (req, res) => {
	try {
		const id = req.query.id;
		await pool.query('DELETE FROM items WHERE id_producto = ?', [id]);

		res.json({ message: 'Producto eliminado correctamente.' });
	} catch (err) {
		res.status(500).json({ err });
	}
};

// Ruta GET para mostrar todas las categorías
const mostrarCategorias = async (req, res) => {
	const emailUsuario = req.email;
	const query =
		'SELECT nombre_categoria FROM categorias WHERE emailusuario = ?';
	try {
		const result = await pool.query(query, [emailUsuario]);
		const categorias = result[0];

		res.status(200).json({ categorias });
	} catch (error) {
		res.status(500).json({
			error: error,
			msg: 'Error en mostrar categorias'
		});
	}
};

// Ruta GET para mostrar todas las categorías desde el menu
const mostrarCategoriasMenu = async (req, res) => {
	const emailUsuario = req.query.email;
	const query =
		'SELECT nombre_categoria FROM categorias WHERE emailusuario = ?';
	try {
		const result = await pool.query(query, [emailUsuario]);
		const categorias = result[0];

		res.status(200).json({ categorias });
	} catch (error) {
		res.status(500).json({
			error: error,
			msg: 'Error en mostrar categorias'
		});
	}
};

// Ruta GET para mostrar todas las subcategorías
const mostrarsubCategorias = async (req, res) => {
	const emailUsuario = req.email;
	const categoria = req.query.categoria;

	const categoriasquery =
		'SELECT id_categoria FROM categorias WHERE emailusuario = ? AND nombre_categoria= ?';
	const querysubcategoria =
		'SELECT nombre_subcategoria FROM subcategorias WHERE emailusuario = ? AND id_categoria = ?';
	try {
		// primero obtengo el id de la categoria
		const resultCateroria = await pool.query(categoriasquery, [
			emailUsuario,
			categoria
		]);
		const categoriaSeleccionada = resultCateroria[0][0];

		// extraigo el id de la categoria
		const idCategoria = categoriaSeleccionada.id_categoria;

		const resultSubCategoria = await pool.query(querysubcategoria, [
			emailUsuario,
			idCategoria
		]);
		const subcategorias = resultSubCategoria[0];
		console.log(subcategorias);

		res.status(200).json({ subcategorias });
	} catch (error) {
		res.status(500).json({
			error: error,
			msg: 'Error en mostrar subcategorias'
		});
	}
};

// Ruta GET para mostrar todas las subcategorías desde el menu
const mostrarsubCategoriasMenu = async (req, res) => {
	const emailUsuario = req.query.email;
	const categoria = req.query.categoria;

	const categoriasquery =
		'SELECT id_categoria FROM categorias WHERE emailusuario = ? AND nombre_categoria= ?';
	const querysubcategoria =
		'SELECT nombre_subcategoria FROM subcategorias WHERE emailusuario = ? AND id_categoria = ?';
	try {
		// primero obtengo el id de la categoria
		const resultCateroria = await pool.query(categoriasquery, [
			emailUsuario,
			categoria
		]);
		const categoriaSeleccionada = resultCateroria[0][0];

		// extraigo el id de la categoria
		const idCategoria = categoriaSeleccionada.id_categoria;

		const resultSubCategoria = await pool.query(querysubcategoria, [
			emailUsuario,
			idCategoria
		]);
		const subcategorias = resultSubCategoria[0];
		console.log(subcategorias);

		res.status(200).json({ subcategorias });
	} catch (error) {
		res.status(500).json({
			error: error,
			msg: 'Error en mostrar subcategorias'
		});
	}
};

//ruta mostrar pedidos

const mostrarPedidos = async (req, res) => {
	console.log('entro a pedidos');
	const emailUsuario = req.email;
	console.log('email', emailUsuario);

	const query = 'SELECT * FROM pedidos WHERE usuario_email = ?';
	try {
		const result = await pool.query(query, [emailUsuario]);
		console.log(query);
		console.log(result);
		const pedidos = result[0];
		res.status(200).json({
			pedidos
		});
	} catch (error) {
		res.status(500).json({
			error,
			msg: 'error en mostrar los pedidos'
		});
	}
};

//realizar pedido desde el menu
const realizarPedidos = async (req, res) => {
	const { email, mesa } = req.query;

	const { pedido, comentarios, nombre, total } = req.body;

	const query =
		'INSERT INTO pedidos (mesa,pedido, comentarios, nombre, total, usuario_email) VALUES (?, ?, ?, ?, ?, ?)';

	const queryPedidos = `UPDATE usuarios SET cantidad_pedidos = cantidad_pedidos + 1 WHERE email = ?`;

	try {
		const result = await pool.query(query, [
			mesa,
			pedido,
			comentarios,
			nombre,
			total,
			email
		]);
		const resultPedidos = await pool.query(queryPedidos, [email]);
		res.status(200).json({
			msg: 'pedido realizado con exito',
			pedidos: result[0][0]
		});
	} catch (error) {
		res.status(500).json({
			error,
			msg: 'error en realizar el pedido'
		});
	}
};

const liberarPedido = async (req, res) => {
	const { mesa, nombre } = req.query;
	const emailUsuario = req.email;

	const query =
		'DELETE FROM pedidos WHERE mesa = ? AND usuario_email = ? AND nombre = ?';

	try {
		const result = await pool.query(query, [mesa, emailUsuario, nombre]);
		res.status(200).json({
			msg: `pedido de la mesa ${mesa} ha sido borrado`
		});
	} catch (error) {
		res.status(500).json({
			error,
			msg: 'error en borrar pedido'
		});
	}
};

const mostrarPlan = async (req, res) => {
	const email = req.query.email;

	const query = 'SELECT plan FROM usuarios WHERE email = ?';

	try {
		const result = await pool.query(query, [email]);
		const plan = result[0][0].plan;
		res.status(200).json(plan);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: ' no se encontro plan para este usuario'
		});
	}
};

const getChatMenu = (req, res) => {
	res.json({
		msg: 'chat desde el menu'
	});
};

const actualizarEstadoPedido = async (req, res) => {
	const email = req.query.email;
	const mesa = req.body.mesa;

	try {
		const queryEstado ='SELECT estado_pedido FROM pedidos WHERE usuario_email = ? AND mesa = ?';
		const resultEstado = await pool.query(queryEstado, [email, mesa]);
		const pedido = resultEstado[0][0].estado_pedido;
		if(pedido === 0){
			const query ='UPDATE pedidos SET estado_pedido = 1 WHERE usuario_email = ? AND mesa = ?';
			const result = await pool.query(query, [email, mesa])
			 return res.status(200).json({
				result,
				msg: 'en preparacion'
			})
		}else{
			const query ='UPDATE pedidos SET estado_pedido = 0 WHERE usuario_email = ? AND mesa = ?';
			const result = await pool.query(query, [email, mesa])
			 return res.status(200).json({
				result,
				msg: 'sin preparar'
			})
		}
	} catch (error) {
		res.status(500).json({
			error,
			msg: 'error al actualizar estado del pedido'
		})
	}
}
const estadoPedido = async (req, res) => {
    const email = req.query.email;
    const mesa = req.query.mesa;
    console.log("email y mesa", email, mesa);

    try {
        const query = 'SELECT estado_pedido FROM pedidos WHERE usuario_email = ? AND mesa = ?';
        const result = await pool.query(query, [email, mesa]);

        // Verificar si result[0] existe y tiene elementos
        if (!result || result[0].length === 0) {
            return res.status(200).json({
                msg: 'false'
            });
        }

        const pedido = result[0][0].estado_pedido;

        if (pedido === 0) {
            return res.status(200).json({
                msg: 'false'
            });
        } else {
            return res.status(200).json({
                msg: 'true'
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            msg: 'error al actualizar estado del pedido'
        });
    }
};


const estadosAlertas = async (req, res) => {
	const  {mesa} = req.body;
	const email = req.query.email
	
try {
	const camarera = await pool.query(
		'UPDATE pedidos SET camarera = 0 WHERE usuario_email = ? AND mesa = ?',
		[email, mesa]
	);
	console.log(camarera)
	const cuenta = await pool.query(
		'UPDATE pedidos SET cuenta = 0 WHERE usuario_email = ? AND mesa = ?',
		[email, mesa]
	);
	console.log(cuenta)
	res.status(200).json({
		camarera,
		cuenta,
		msg:'alertas reseteadas a false'
	});

} catch (error) {
	res.status(500).json({
		msg: error
	});
	console.error(error)
}


}

const planGet = async (req, res = response) => {
	
	const emailquery = req.query.email;

	const query = 'SELECT plan FROM usuarios WHERE email = ?';

	try {
		const result = await pool.query(query, [emailquery]);
		console.log(result);
		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			res.status(200).json({
				plan: result[0][0].plan
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('error en la peticion');
	}
};
const ImageGet = async (req, res = response) => {
	
	const emailquery = req.query.email;

	const query = 'SELECT img FROM usuarios WHERE email = ?';

	try {
		const result = await pool.query(query, [emailquery]);
		console.log(result);
		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			res.status(200).json({
				img: result[0][0].img
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('error en la peticion');
	}
};


const deleteMessages = async (req, res = response) => {
	const email= req.query.email;

	try {
		const result = await pool.query('DELETE FROM mensajes WHERE usuario_email = ?',[email]);
		res.status(200).json({ message: ' mensajes borrados'});
	} catch (error) {
		res.status(500).json({
			error
		})
	}
}

const estadosMensajes = async (req, res) => {
	const email = req.query.email;
	
	
	try {
		const result = await pool.query('SELECT * FROM mensajes WHERE usuario_email = ? AND estado=?',[email, 0]);
		const mensajes = result[0].length;
		if(mensajes > 0) {
			res.status(200).json({
				msg:'false',
				mensaje: mensajes
			})

		}
		res.status(200).json({
			msg:'todos los mensajes leidos'
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: error
		})
	}
}

const actualizarEstadoMsj = async (req, res) => {
	const email = req.query.email;
	
	
	try {
		const result = await pool.query('UPDATE mensajes SET estado = 1  WHERE usuario_email = ?',[email]);
		
		res.status(200).json({
			msg:'true',
			
		})
	} catch (error) {
		res.status(500).json({
			msg: error
		})
	}
}

module.exports = {
	mostrarMenu,
	agregarProducto,
	actualizarMenu,
	borrarProducto,
	mostrarCategorias,
	mostrarPedidos,
	realizarPedidos,
	liberarPedido,
	crearCategoria,
	crearSubCategoria,
	mostrarsubCategorias,
	borrarCategoria,
	borrarSubCategoria,
	mostrarsubCategoriasMenu,
	mostrarCategoriasMenu,
	mostrarPlan,
	getChatMenu,
	actualizarEstadoPedido,
	estadoPedido,
	estadosAlertas,
	actualizarImgSub,
	planGet,
	deleteMessages,
	ImageGet,
	estadosMensajes,
	actualizarEstadoMsj
};
