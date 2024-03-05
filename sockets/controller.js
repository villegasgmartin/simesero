const TicketControl = require('../models/ticket-control');
const { Usuarios } = require('../models/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');
const cron = require('cron');
const { response } = require('express');
const pool = require('../database');

const usuarios = new Usuarios();
const ticketControl = new TicketControl();

const socketController = (socket, io) => {


	socket.on('connect',  ({ room }) => {
		socket.to(room).emit('estado-actual', ticketControl.ultimos4);
		socket.emit('tickets-pendientes', ticketControl.mesas.length);
		socket.to(room).emit('tickets-pendientes', ticketControl.mesas.length);
		
	});

	socket.on('join-room',async ({ room }) => {
		socket.join(room); // Unir el socket a la sala especificada
		console.log('sala', room);
	
		if(!socket.recovered){
			try {
				const result = await pool.query('SELECT * FROM mensajes WHERE id>=? AND usuario_email = ?',
				 [socket.handshake.auth.serverOffset ?? 0, room])
				
				 

				 result[0].forEach( row =>{
					mensaje = {
						mesa: row.mensaje,
						mensaje: row.mesa,
						fecha: row.hora,
					}
					socket.emit('crearMensaje', mensaje,row.id.toString() );
					
				 })

			} catch (error) {
				console.error(error);
			}
		}
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

		socket.on('crearMensaje', async(data, callback) => {
			console.log('data', data);
			
			let persona = usuarios.getPersona(socket.id);
			console.log('persona', persona);
			let mensaje = crearMensaje(data.mesa, data.mensaje);

			try {
				const query = 'INSERT INTO mensajes (usuario_email, mensaje, mesa, hora) VALUES ( ?, ?, ?,?)';
				result = await pool.query(query, [data.email, data.mesa, data.mensaje, mensaje.fecha])
				console.log('result', result);
			} catch (error) {
				return console.error('error', error);
			}
			console.log('result1', result[0].insertId.toString());

			socket.to(data.email).emit('crearMensaje', mensaje,result[0].insertId.toString() );
			console.log(mensaje);
			callback(mensaje);
		});
		
		 
		socket.on('disconnect', () => {
			let personaBorrada = usuarios.borrarPersona(socket.id);

			
		});

		socket.on('borrar-alertas', ({userEmail}, callback) => {
			console.log(userEmail);
			ticketControl.borrarAlertasPorEmail(userEmail);
			
		})

		
	
};

module.exports = {
	socketController
};
