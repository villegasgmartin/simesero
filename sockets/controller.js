const TicketControl = require('../models/ticket-control');
const { Usuarios } = require('../models/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');
const cron = require('cron');
const { response } = require('express');
const pool = require('../database');

const usuarios = new Usuarios();
const ticketControl = new TicketControl();

const socketController = (socket, io) => {
	socket.on('connect', ({ room }) => {
		socket.to(room).emit('estado-actual', ticketControl.ultimos4);
		socket.emit('tickets-pendientes', ticketControl.mesas.length);
		socket.to(room).emit('tickets-pendientes', ticketControl.mesas.length);
	});

	socket.on('join-room', ({ room }) => {
		socket.join(room); // Unir el socket a la sala especificada
		console.log('sala', room);
	});

	//socket llamar camarera

	socket.on('llamar-camarera', (usuario, callback) => {
		const salaLlamarCamarera = usuario.email + '-llamar-camarera';

		// Unir el socket a la sala correspondiente
		socket.join(salaLlamarCamarera);

		console.log('Usuario llamar camarera', usuario);
		const siguiente = ticketControl.siguiente(usuario.mesa, usuario.email);
		callback(siguiente);

		if (!usuario.mesa) {
			return callback({
				ok: false,
				msg: 'La mesa es obligatoria'
			});
		}
		// Actualizar el estado del pedido en la base de datos
		pool.query(
			'UPDATE pedidos SET camarera = 1 WHERE usuario_email = ? AND mesa = ?',
			[usuario.email, usuario.mesa],
			(error, results) => {
			  if (error) {
				console.error('Error al actualizar el estado del pedido:', error);
				// Puedes manejar el error y enviarlo al cliente si es necesario
			  }
			}
		  );
		  

		
		const ticket = ticketControl.llamarCamerera(usuario.email, usuario.mesa);
		console.log('ticket de ticket control', ticket);

		socket.to(salaLlamarCamarera).emit('estado-actual', ticketControl.ultimos4);
		socket.emit('tickets-pendientes', ticketControl.mesas.length);
		socket
			.to(salaLlamarCamarera)
			.emit('tickets-pendientes', ticketControl.mesas.length);

		if (!ticket) {
			callback({
				ok: false,
				msg: 'No hay Alertas pendientes'
			});
		} else {
			callback({
				ok: true,
				ticket
			});
		}
	});
	//socket pedit cuenta

	socket.on('pedir-cuenta', (usuario, data, callback) => {
		const salaPedirCuenta = usuario.email + '-pedir-cuenta';

		// Unir el socket a la sala correspondiente
		socket.join(salaPedirCuenta);

		const { nombre, metodo, dividir, comment } = data;
		console.log({ nombre, metodo, dividir });

		const respuesta = ticketControl.guardarPedirCuenta(
			usuario.email,
			usuario.mesa,
			nombre,
			metodo,
			dividir,
			comment
		);

		
  
 // Actualizar el estado 'cuenta' en la base de datos
 pool.query(
	'UPDATE pedidos SET cuenta = 1 WHERE usuario_email = ? AND mesa = ?',
	[usuario.email, usuario.mesa],
	(error, results) => {
	  if (error) {
		console.error('Error al actualizar el estado de la cuenta:', error);
		// Puedes manejar el error y enviarlo al cliente si es necesario
	  }
	}
  );

  setTimeout(() => {
	console.log('pasaron 10 seg')
  }, 10000);

		callback(respuesta);

		const ticket = ticketControl.pedirCuenta(
			usuario.mesa,
			nombre,
			usuario.email,
			metodo,
			dividir,
			comment
		);
		console.log('ticket de ticket control', ticket);

		socket.to(salaPedirCuenta).emit('estado-actual', ticketControl.ultimos4);
		socket.emit('tickets-pendientes', ticketControl.mesas.length);
		socket
			.to(salaPedirCuenta)
			.emit('tickets-pendientes', ticketControl.mesas.length);
	});

	// chat por restaurant

		socket.on('entrarChat', (data, callback) => {
			console.log('data', data);

			if (!data.mesa || !data.email) {
				return callback({
					error: true,
					mensaje: 'El nombre/sala es necesario'
				});
			}

			socket.join(data.email);
			console.log('joined', data.email);
			usuarios.agregarPersona(socket.id, data.mesa, data.email);

			socket
				.to(data.email)
				.emit('listaPersona', usuarios.getPersonasPorSala(data.email));

			callback(usuarios.getPersonasPorSala(data.email));
		});

		socket.on('crearMensaje', (data, callback) => {
			console.log('data', data);
			let persona = usuarios.getPersona(socket.id);
			console.log('persona', persona);
			let mensaje = crearMensaje(data.mesa, data.mensaje);
			socket.to(data.email).emit('crearMensaje', mensaje);
			console.log(mensaje);
			callback(mensaje);
		});
		// socket.on('disconnect', (usuario) => {
		// 	console.log('datadesconect', usuario);
		// 	let personaBorrada = usuarios.borrarPersona(usuario.id);
		// 	console.log('personaBorrada', personaBorrada);
		// 	if (personaBorrada) {
		// 		io.to(personaBorrada.email).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.email));
		// 	}
		//  });
		 
		socket.on('disconnect', () => {
			let personaBorrada = usuarios.borrarPersona(socket.id);

			
		});

	// 	// Mensajes privados
	// 	socket.on('mensajePrivado', (data) => {
	// 		let persona = usuarios.getPersona(socket.id);
	// 		socket
	// 			.to(data.para)
	// 			.emit('mensajePrivado', crearMensaje(persona.mesa, data.mensaje));
	// 	});
};

module.exports = {
	socketController
};
