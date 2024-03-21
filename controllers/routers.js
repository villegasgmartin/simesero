const { response } = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../database');
const { validationResult } = require('express-validator');
const {generarJWT, generarJWTPassword} = require('../middlerwares/generar-jwt');
const emailer = require('./nodemailer');
const path = require('path');
const fs = require('fs-extra');

//controllers y services payments
//rutas payments

// const PaymentService = require("../services/paymentServices");
const {
	nuevaPassword,
	sendEmail,
	confirmarPlan,
	confirmarPago,
	nuevoValoresCorreo,
	cancelarsuscripcion
} = require('./nodemailer');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

//ruta get del home
const homeGet = (req, res = response) => {
	res.json('home');
};
//get de la pagina de agregar cuenta como administrador
const loginAdminGet = (req, res = response) => {
	res.sendFile(path.join(__dirname, '..','../client/dist/admin-boss.html'));
};
//ruta POST  crear cuenta administrador

const postCrearAdmin = async (req, res = response) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).send(error);
	}

	let { img, name, email, password } = req.body;

	//verificar si el correo existe
	const searchEmail =
		'SELECT COUNT(*) AS count FROM administradores WHERE email = ?';
	const result = await pool.query(searchEmail, [email]);

	if (result[0][0].count > 0) {
		return res.status(200).json({ msg: `email existente` });
	}

	if (req.files) {
		const { tempFilePath } = req.files.img;

		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		img_url = secure_url;
	} else {
		img_url =
			'https://res.cloudinary.com/dj3akdhb9/image/upload/v1695818870/samples/placeholder_profile_jhvdpv.png';
	}

	//encriptar password
	const salt = bcrypt.genSaltSync();
	password = bcrypt.hashSync(password, salt);

	//guardar en base de datos

	const query = `INSERT INTO administradores (img, name, email, password ) VALUES (?, ?, ?, ? )`;
	try {
		const result = await pool.query(query, [img_url, name, email, password]);
		const response = {
			message: 'Administrador creado correctamente',
			redirectTo: '/'
		};
		res.status(200).json(response);
	} catch (error) {
		console.log(error);
		res.status(400).send('Error al obtener datos');
	}
};


//post validad email existente admin
const postEmailExistenteAdmin = async (req, res = response) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).send(error);
	}

	let { email} = req.body;

	//verificar si el correo existe
	const searchEmail =
		'SELECT COUNT(*) AS count FROM administradores WHERE email = ?';
	

	try {
		const result = await pool.query(searchEmail, [email]);

		if (result[0][0].count > 0) {
			return res.status(200).json({ msg: `email existente` });
		}else{
			return res.status(200).json({msg:'Ok'})
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('error server');
	}
};
//post validad email existente local
const postEmailExistentelocal = async (req, res = response) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).send(error);
	}

	let { email } = req.body;

	//verificar si el correo existe
	const searchEmail = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';

	//verificar si el correo existe en admins
	const searchEmailAdmin =
		'SELECT COUNT(*) AS count FROM administradores WHERE email = ?';
	
	

	try {
		const result = await pool.query(searchEmail, [email]);
		const resultadmin = await pool.query(searchEmailAdmin, [email]);

		if (result[0][0].count > 0) {
			return res.status(200).json({
				msg: `existente`
			});
		}
		if (resultadmin[0][0].count > 0) {
			return res.status(200).json({ msg: `existente` });
		}
		else{
			return res.status(200).json({msg:'Ok'})
		}

	} catch (error) {
		console.log(error);
		res.status(500).send('error server');
	}
};

//ruta post del usuario, validad usuario antes de entrar al dashboard del local o administrador
const loginUsuario = async (req, res = response) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).send(error);
	}

	const { email, password } = req.body;

	const query = 'SELECT * FROM usuarios WHERE email = ?';
	const queryAdmin = 'SELECT * FROM administradores WHERE email = ? ';

	//verificar si ya hizo la cuenta pero no realizo el pago
	const emailRegistrado = 'select * from usuarios where email = ?';
	const resultEmailRegistrado = await pool.query(emailRegistrado, [email]);

	if (resultEmailRegistrado[0].length > 0) {
		const emailReg = resultEmailRegistrado[0][0];
		if (resultEmailRegistrado[0].length > 0 && emailReg.status == 0) {
			return res.status(200).json({
				msg: `suspendido`
			});
		}
		if (resultEmailRegistrado[0].length > 0 && emailReg.pagoConfirmado == 0) {
			return res.status(200).json({
				msg: `pago`
			});
		}
	}

	try {
		const resultGeneral = await pool.query(query, [email]);
		const resultAdmin = await pool.query(queryAdmin, [email]);

		const resultGeneralLength = resultGeneral[0].length;
		const resultAdminLength = resultAdmin[0].length;

		if ((resultGeneralLength === 0) & (resultAdminLength === 0)) {
			return res.status(200).json({ msg: 'email' });
		}

		//validad si es admin o usuario
		let user;
		let msg;

		if (resultGeneralLength != 0) {
			user = resultGeneral[0][0];
			msg = 'local';
			//validad si el primer pago esta confirmado
			if (user.pagoConfirmado === 0) {
				return res.status(404).redirect('/');
			}
			//validar el estado, si es falso, el usuario esta supendido y no puede ingresar
			if (user.status === 0) {
				return res.status(404).redirect('/');
			}
		} else {
			user = resultAdmin[0][0];
			msg = 'admin';
		}

		console.log(user);

		//validad clave
		const validPassword = bcrypt.compareSync(password, user.password);

		//generar token
		const token = await generarJWT(user.email);

		if (validPassword) {
			const response = {
				token,
				msg,
				usuario: user
			};
			res.status(200).json(response);
		} else {
			return res.status(200).json({ msg: 'password' });
		}
	} catch (error) {
		console.error('Error al ejecutar la consulta: ', error);
		return res.status(500).json({ message: 'Error en el servidor' });
	}
};

//ruta crear usuario
const postUsuario = async (req, res = response) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).send(error);
	}

	let {
		img,
		name,
		storeName,
		email,
		password,
		address,
		cp,
		plan,
		date,
		telefono,
		pais,
		localidad,
		tipo,
		comentario
	} = req.body;

	//verificar si ya hizo la cuenta pero no realizo el pago
	const emailRegistrado = 'select * from usuarios where email = ?';
	const resultEmailRegistrado = await pool.query(emailRegistrado, [email]);

	if (resultEmailRegistrado[0].length > 0) {
		const emailReg = resultEmailRegistrado[0][0];
		if (resultEmailRegistrado[0].length > 0 && emailReg.pagoConfirmado == 0) {
			return res.status(404).json({
				msg: `el mail ${email} ya esta registrado, por favor realiza el pago de la suscripcion para poder acceder al dashboard, contactase al siguiente mail contacto@simesero.com`
			});
		}
	}

	//verificar si el correo existe
	const searchEmail = 'SELECT COUNT(*) AS count FROM usuarios WHERE email = ?';
	const result = await pool.query(searchEmail, [email]);

	if (result[0][0].count > 0) {
		return res.status(404).json({
			message: `existente`
		});
	}
	//verificar si el correo existe en admins
	const searchEmailAdmin =
		'SELECT COUNT(*) AS count FROM administradores WHERE email = ?';
	const resultadmin = await pool.query(searchEmailAdmin, [email]);

	if (resultadmin[0][0].count > 0) {
		return res.status(200).json({ msg: `existente` });
	}
	//agregar imagen
	if (req.files) {
		const { tempFilePath } = req.files.img;

		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		img_url = secure_url;
	} else {
		img_url =
			'https://res.cloudinary.com/dj3akdhb9/image/upload/v1695818870/samples/placeholder_profile_jhvdpv.png';
	}

	//encriptar password
	const salt = bcrypt.genSaltSync();
	password = bcrypt.hashSync(password, salt);

	// determinar dia de alta
	let dia = new Date().getDate();
	let mes = new Date().getMonth();
	let year = new Date().getFullYear();
	date = `${dia}/ ${mes}/ ${year}`;
	//guardar en base de datos

	const query = `INSERT INTO usuarios (img, name, storeName, email, password, address, cp, plan, date, telefono, pais, localidad, tipo, comentario ) VALUES (?, ?, ?, ?, ? , ? , ? , ?, ?, ?, ? , ? , ? , ? )`;

	try {
		const result = await pool.query(query, [
			img_url,
			name,
			storeName,
			email,
			password,
			address,
			cp,
			plan,
			date,
			telefono,
			pais,
			localidad,
			tipo,
			comentario
		]);
		if(plan === "basic"){
						const planBasic = await pool.query('UPDATE usuarios SET pagoConfirmado = 1 WHERE email = ?', [email])
					}
		
		res.status(200).json('usuario creado');

		//  PaymentInstance.getSubscriptionLink(req, res);
	} catch (error) {
		console.log(error);
		res.status(400).send('error en obtener datos');
	}
};

//ruta de agradecimiento despues del pago

const gracias = (req, res) => {
	res.sendFile(path.join(__dirname, '..','../client/dist/gracias.html'));
};


const confimarPago = async (req, res) => {
	const emailAdmin = req.email;

	const email = req.body.email;

	const query = 'UPDATE usuarios SET pagoConfirmado = true WHERE email = ?';
	try {
		const result = await pool.query(query, [email]);
		confirmarPago(email);
		res.status(200).json({
			message: ' Confirmacion de pago realizada, mail mandado al cliente'
		});
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};

//ruta para mostrar los usuarios

const mostrar = async (req, res) => {
	const query = 'SELECT * FROM usuarios';
	try {
		const result = await pool.query(query);
		res.json(result[0]);
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};

//ruta para mostrar los usuarios a confirmar pago

const mostrarUsuarioConfirmar = async (req, res) => {
	const query = 'SELECT * FROM usuarios where pagoConfirmado = 0';
	try {
		const result = await pool.query(query);
		res.json(result[0]);
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};
const mostrarUsuarioConfirmarPlan = async (req, res) => {
	const query = 'SELECT * FROM usuarios where pagoCambioPlan = 0';
	try {
		const result = await pool.query(query);
		res.json(result[0]);
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};

//ruta para mostrar usuario por estado

const mostrarUsuarioPorEstado = async (req, res) => {
	let { status } = req.body;
	if (status === 'activo') {
		status = 1;
	} else {
		status = 0;
	}
	const query = 'SELECT * FROM usuarios WHERE status =?';
	try {
		const result = await pool.query(query, [status]);
		res.json(result[0]);
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};

//ruta get para el dashboard local
const dashboardLocal = async (req, res) => {
	const email = req.email;
	const emailQuery = req.query.email;
	const query = 'SELECT * FROM usuarios WHERE email = ?';

	try {
		const result = await pool.query(query, [emailQuery]);
		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			res.status(200).json({
				usuario: result[0][0],
				msg: 'local',
				emailQuery
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('error en la peticion');
	}
};

//ruta get admin dashboard
const adminGet = async (req, res = response) => {
	const email = req.email;
	const query = 'SELECT * FROM administradores WHERE email = ?';

	try {
		const result = await pool.query(query, [email]);
		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			res.status(200).json({
				usuario: result[0][0],
				msg: 'admin'
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('error en la peticion');
	}
};

//ruta get configuracion

//ruta get admin dashboard
const configGet = async (req, res = response) => {
	const email = req.email;
	const emailquery = req.query.email;

	const query = 'SELECT * FROM usuarios WHERE email = ?';

	try {
		const result = await pool.query(query, [emailquery]);
		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			res.status(200).json({
				usuario: result[0][0]
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).send('error en la peticion');
	}
};

//ruta para suspender cuenta en dashboard del admin

const suspenderCuenta = async (req, res) => {
	const { email } = req.body;

	const query = 'UPDATE usuarios SET status = false WHERE email = ?';

	try {
		const result = await pool.query(query, [email]);

		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			res.send(`el cliente ${email} a sido suspendido`);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('error en la suspencion de cuenta');
	}
};

//ruta para activar cuenta en dashboard del admin

const activarCuenta = async (req, res) => {
	const { email } = req.body;

	const query = 'UPDATE usuarios SET status = true WHERE email = ?';

	try {
		const result = await pool.query(query, [email]);

		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			res.send(`el cliente ${email} a sido activado`);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('error en la suspencion de cuenta');
	}
};

//mandar mail para recuperar clave
const recuperarClave = async (req, res) => {
	const { email } = req.body;
	console.log(email);

	const query = 'SELECT * FROM usuarios WHERE email = ?';
	const queryAdmin = 'SELECT * FROM administradores WHERE email = ?'

	try {
		const emailRecuperar = await pool.query(query, [email]);
		const emailRecuperarAdmin = await pool.query(queryAdmin, [email]);
		console.log(emailRecuperar[0])
		console.log(emailRecuperarAdmin[0])
		if (emailRecuperar[0].length === 0 && emailRecuperarAdmin[0].length === 0) {
			return res
				.status(404)
				.json({ message: 'Correo electrónico no encontrado' });
		}
		if(emailRecuperar[0].length === 0 && emailRecuperarAdmin[0].length > 0){
			const mail = emailRecuperarAdmin[0][0];
			correo = mail.email;	
		}
		if(emailRecuperar[0].length > 0 && emailRecuperarAdmin[0].length === 0){
			const mail = emailRecuperar[0][0];
			correo = mail.email;
		}
		console.log(correo);
		//generar token
		const token = await generarJWTPassword(correo);

		nuevaPassword(token, correo);
		res.status(200).json({
			message:
				' Se ha enviado una emails con los pasos seguir para actualizar la clave',
				token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json('error al mandar mail');
	}
};

//actualizar clave

const newPassword = async (req, res) => {
	const email= req.email;
	let { password } = req.body;
	console.log(email, password);

	//encriptar clave
	const salt = bcrypt.genSaltSync();
	password = bcrypt.hashSync(password, salt);

	//validar desde donde viene los usuarios
	const queryValidarUsuario = 'SELECT * FROM usuarios WHERE email = ?';
	const queryValidarAdmin = 'SELECT * FROM administradores WHERE email = ?'
	const queryUsuario = 'UPDATE usuarios SET password = ? WHERE email = ?';
	const queryAdmin = 'UPDATE administradores SET password = ? WHERE email = ?';

	try {
		const usuarios = await pool.query(queryValidarUsuario, email);
		const administradores = await pool.query(queryValidarAdmin, email);

		if (usuarios[0].length > 0) {
			const result = await pool.query(queryUsuario, [password, email]);
			console.log(result);
			return res.status(200).json({ msg: 'ok Usuario' });
		} 
		if(administradores[0].length > 0){
			const result = await pool.query(queryAdmin, [password, email]);
			console.log(result);
			 return res.status(200).json({ msg: 'ok Admin' });
		}
		res.status(404).json({ msg: 'Usuario no encontrado' });
	} catch (error) {
		console.log(error);
		return res.status(500).send('error en cambio de password');
	}
};

const actualizarDatos = async (req, res) => {
	const dataActualizada = req.body;
	const usuarioActualizado = req.email;
	console.log("usuario", usuarioActualizado);

	try {
		let sql = `UPDATE usuarios SET`;
		let values = [];
		for (const key in dataActualizada) {
			if (key !== usuarioActualizado && dataActualizada.hasOwnProperty(key)) {
				sql += ` ${key} = ?, `;
				console.log(sql);
				values.push(dataActualizada[key]);
				console.log(values);
			}
		}
		sql = sql.slice(0, -2);
		sql += ` WHERE email = ?`;
		values.push(usuarioActualizado);

		const result = await pool.query(sql, values);
		console.log(result);
		res.status(200).json({ message: 'usuario actualizado' });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			msg: 'error en la actualizacion de usuario'
		});
	}
};

//ruta cambiar de plan usuario

const mejorarPlan = async (req, res) => {
	const email = req.email;

	console.log("email actualice", email);
	const query2 = 'UPDATE usuarios SET pagoCambioPlan = 0 WHERE email = ?';
	
	try {		
		const result2 = await pool.query(query2, [email]);
		console.log(result2)
		const response = {
			msg: 'Plan actualizado, el administrador confirmara el pago para darle acceso a nuevas opciones'
		};
		res.status(200).json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json('error en actualizar plan');
	}
};

//ruta para confirmar pago por cambio de plan
// ruta confirmar pago
const confimarPagoPlan = async (req, res) => {
	const emailAdmin = req.email;
	const {email, plan} = req.body;

	console.log("email:", email, "plan:", plan)
	
const queryPlan = 'UPDATE usuarios SET plan = ? WHERE email =?';
	const query = 'UPDATE usuarios SET pagoCambioPlan = 1 WHERE email = ?';
	try {
		const result = await pool.query(query, [email]);
		const resultPlan = await pool.query(queryPlan, [plan, email]);

		console.log(result);
		confirmarPlan(email);
		res.status(200).json({
			msg: ' Confirmacion de cambio de plan realizada, mail mandado al cliente'
		});
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};

//borrar usuario de lista de cambiar plan
const borrarUsuarioLista = async (req, res) => {
	const emailAdmin = req.email;
	const {email} = req.body;

	console.log("email:", email)
	
	
	const query = 'UPDATE usuarios SET pagoCambioPlan = 1 WHERE email = ?';
	try {
		const result = await pool.query(query, [email]);
		res.status(200).json({
			msg: ' usuario eliminado de tabla'
		});
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};
//actualizar valores de planes
const nuevosValores = async (req, res) => {
	const dataActualizada = req.body;
	const usuarioAdmin = req.email;

	const query2 = 'SELECT * FROM planes';
	const query3 = 'SELECT email FROM usuarios';
	const query4 = 'SELECT * from planes';

	try {
		const resultEmails = await pool.query(query3);
		const email = resultEmails[0];

		//actulizar solos los campos que se pusieron
		let sql = `UPDATE planes SET`;
		let values = [];
		for (const key in dataActualizada) {
			if (key !== usuarioAdmin && dataActualizada.hasOwnProperty(key)) {
				sql += ` ${key} = ?, `;
				console.log(sql);
				values.push(dataActualizada[key]);
				console.log(values);
			}
		}
		sql = sql.slice(0, -2);

		const result = await pool.query(sql, values);
		const planes = result[0].affectedRows;

		if (planes === 0) {
			//actulizar solos los campos que se pusieron
			let sql2 = `INSERT INTO planes `;
			let values2 = [];
			for (const key in dataActualizada) {
				if (key !== usuarioAdmin && dataActualizada.hasOwnProperty(key)) {
					sql += ` ${key} = ?, `;
					console.log(sql);
					values.push(dataActualizada[key]);
					console.log(values);
				}
			}
			sql = sql.slice(0, -2);

			const resultEmails = await pool.query(query3);
			const email = resultEmails[0];

			const nuevosPlanes = await pool.query(sql2, values2);

			// for (let i = 0; i < email.length; i++) {
			// 	console.log('mail a mandar', email[i].email);
			// 	nuevoValoresCorreo(
			// 		email[i],
			// 		nuevosPlanes.standard,
			// 		nuevosPlanes.premium
			// 	);
			// 	i++;
			// }
			res.status(201).json({
				nuevosPlanes
			});
		} else {
			const planesActulizados = await pool.query(query2);
			// const standard = planesActulizados[0][0].standard;
			// const premium = planesActulizados[0][0].premium;
			// const resultEmails = await pool.query(query3);
			// const email = resultEmails[0];
			// for (let i = 0; i < email.length; i++) {
			// 	console.log('mail a mandar', email[i].email);
			// 	nuevoValoresCorreo(email[i].email, standard, premium);
			// }

			res.status(200).json(planesActulizados[0][0]);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('error en la actualizacion de planes');
	}
};

//Get planes
const mostrarPlanes = async (req, res) => {
	const query = 'SELECT * FROM planes';
	try {
		const result = await pool.query(query);
		res.json(result[0][0]);
	} catch (error) {
		console.log(error, 'error en obtener datos');
	}
};



//actualizar imagen admin
const cambiarImagenAdmin = async (req, res) => {
	const email = req.email;
	console.log(email);
	let newImagen = req.body;

	const query = 'UPDATE administradores SET img = ? WHERE email = ?';

	try {
		// Verificar que el elemento pertenezca al usuario autenticado antes de actualizar
		const adminRow = await pool.query(
			'SELECT * FROM administradores WHERE email = ?',
			[email]
		);

		const urlImagenVIeja = adminRow[0][0].img;

		const [public_id] = urlImagenVIeja.split('.');
		cloudinary.uploader.destroy(public_id);

		//agregar imagen a cloudinary para obterner url
		const { tempFilePath } = req.files.newImagen;
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		newImagen = secure_url;

		const result = await pool.query(query, [newImagen, email]);
		console.log(result);
		res.status(200).json('imagen admin actualizada');
	} catch (error) {
		console.log(error, 'error en actualizar image');
	}
};

const cambiarImagenLocal = async (req, res) => {
	const email = req.email;

	let newImagen = req.body;

	const query = 'UPDATE usuarios SET img = ? WHERE email = ?';

	try {
		// Verificar que el elemento pertenezca al usuario autenticado antes de actualizar
		const adminRow = await pool.query(
			'SELECT * FROM usuarios WHERE email = ?',
			[email]
		);

		const urlImagenVIeja = adminRow[0][0].img;

		const [public_id] = urlImagenVIeja.split('.');
		cloudinary.uploader.destroy(public_id);

		//agregar imagen a cloudinary para obterner url
		const { tempFilePath } = req.files.newImagen;
		const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

		newImagen = secure_url;

		const result = await pool.query(query, [newImagen, email]);
		console.log(result);
		res.status(200).json('imagen local actualizada');
	} catch (error) {
		console.log(error, 'error en actualizar imagen');
	}
};

const getChatLocal = async (req, res) => {
	const email = req.query.email;

	const query1 = 'select pagoCambioPlan from Usuarios where email= ? ';
	const query2 = 'select plan from Usuarios where email= ? ';

	try {
		const result1 = await pool.query(query1, [email]);
		const result2 = await pool.query(query2, [email]);
		const pago = result1[0][0].pagoCambioPlan;
		const plan = result2[0][0].plan;

		if (pago == 0 || plan != 'premium') {
			return res.status(400).json({
				msg: 'Mejore su plan para poder acceder a esta opcion'
			});
		}

		res.status(200).json({
			msg: 'accedio al chat'
		});
	} catch (error) {
		console.log(error, 'error');
		res.status(500).json({
			msg: 'error al ingresar al chat'
		});
	}
};

const cancelarPlan = async (req, res) => {
	const email = req.email;

	const query = 'UPDATE usuarios SET status = false WHERE email = ?';

	try {
		const result = await pool.query(query, [email]);

		if (result.length === 0) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		} else {
			cancelarsuscripcion(email);
			res.json(`ok`);
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('error en la suspencion de cuenta');
	}

	
};

module.exports = {
	homeGet,
	loginUsuario,
	dashboardLocal,
	postUsuario,
	mostrar,
	suspenderCuenta,
	activarCuenta,
	newPassword,
	actualizarDatos,
	mostrarUsuarioPorEstado,
	nuevosValores,
	// PaymentController,
	recuperarClave,
	mostrarPlanes,
	adminGet,
	configGet,
	postCrearAdmin,
	loginAdminGet,
	// receiveWebhook,
	gracias,
	confimarPago,
	mostrarUsuarioConfirmar,
	mejorarPlan,
	confimarPagoPlan,
	cambiarImagenAdmin,
	cambiarImagenLocal,
	mostrarUsuarioConfirmarPlan,
	getChatLocal,
	cancelarPlan,
	postEmailExistenteAdmin,
	postEmailExistentelocal,
	borrarUsuarioLista
};
