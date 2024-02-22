const { response } = require('express');
const pool = require('../database');

// Crea una función para reiniciar el contador de pedidos
const reiniciarContadorPedidos= async ()=> {

  const query = 'UPDATE usuarios SET cantidad_pedidos = 0';      
    
    try {
        
        await pool.query(query);
        console.log('Reinicio de contador de pedidos completado');
    } catch (err) {
         console.error('Error al reiniciar el contador de pedidos:', err);
    }    
 
}

module.exports = reiniciarContadorPedidos;