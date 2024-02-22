const mysql = require('mysql2/promise');


//equivalente a create connection, conecto a la base de datos


const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}

const pool = mysql.createPool(config);

// Manejar eventos de error
pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});

// Verificar si hay errores durante la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error al obtener la conexión de la base de datos:', err);
    } else {
        console.log('Base de datos conectada');
        connection.release(); // Liberar la conexión después de usarla
    }
});
  

module.exports = pool;