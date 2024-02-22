const express = require('express');
const cron = require('cron');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const { socketController } = require('../sockets/controller');
const {path, join} = require('path');
const reiniciarContadorPedidos = require('../middlerwares/cron');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = require('http').createServer(this.app);
		this.io = require('socket.io')(this.server);
		this.paths = {
			main: '/'
		};
		//middlewares
		this.middelewares();

		//routers
		this.router();

		// Sockets
		this.sockets();

		 // Cronjob para reiniciar el contador de pedidos al principio de cada mes
		 this.initCronJob();
	}

	middelewares() {

		// Middleware para desactivar el almacenamiento en caché a nivel global
				this.app.use((req, res, next) => {
					res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
					res.setHeader('Pragma', 'no-cache');
					res.setHeader('Expires', '0');
					next();
				  });
		//directorio static
		this.app.use(express.static(join(__dirname,'../client/dist')));

		this.app.use(cors());
		this.app.use(morgan('dev'));

		//para obtener datos del front en json
		this.app.use(express.json());

		//subida de imagenes
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: './uploads',
				createParentPath: true
			})
		);
	}
	
	router() {
		this.app.use(this.paths.main, require('../routes/routes'));
	}
	sockets() {
		this.io.on('connection', socketController);
	}

	async initCronJob() {
		// Ejecutar la función al inicio de cada mes a las 00:00
		const tareaCron = new cron.CronJob('0 0 1 * *', async () => {
		  try {
			await reiniciarContadorPedidos();
			console.log('Reinicio mensual del contador de pedidos completado');
		  } catch (error) {
			console.error('Error al reiniciar el contador de pedidos:', error);
		  }
		});
	
		// Iniciar la tarea cron
		tareaCron.start();
	  }
	

	listen() {
		this.server.listen(this.port, () => {
			console.log('listening on port', this.port);
		});
	}
}

module.exports = Server;
