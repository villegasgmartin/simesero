const path = require('path');
const fs   = require('fs');

class Ticket {
    constructor( mesa, email ) {
        this.mesa = mesa;
        this.email = email;
    }
}



class TicketControl {


    constructor() {
       
        this.ultimaMesa   = 0;
        this.hoy      = new Date().getDate(); // 11
        this.mesas  = [];
        this.ultimos4 = {};

        this.init();
    }
  


    get toJson() {
        return {
            ultimaMesa: this.ultimaMesa,
            hoy: this.hoy,
            mesas: this.mesas,
            ultimos4: this.ultimos4,
        }
    }

    init() {
        const { hoy, mesas, ultimaMesa, ultimos4 } = require('../db/data.json');
        if ( hoy === this.hoy ) {
            this.mesas  = mesas;
            this.ultimaMesa   = ultimaMesa;
            this.ultimos4 = ultimos4;
        } else {
            // Es otro dia
            this.guardarDB();
        }
    }

    // Nuevo método para agregar eventos a una sala específica
    agregarEventoSala(email, evento) {
        
        if (!this.ultimos4[email]) {
            this.ultimos4[email] = [];
        }
        this.ultimos4[email].unshift(evento);

        if (this.ultimos4[email].length > 10) {
            this.ultimos4[email].splice(-1, 1);
        }

        this.guardarDB();
    }



    guardarDB() {

        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );

    }

   
   


    siguiente(mesa, email) {
        this.ultimo = mesa ;
        const ticket = new Ticket( this.ultimo, email );
        this.mesas.push( ticket );

        this.guardarDB();
        return 'Mesa ' + ticket.mesa;
    }


    // Nuevo método para solicitar atención de la camarera
    llamarCamerera(email, mesa) {
        const horaActual = new Date();
        const hora = horaActual.getHours();
        const minutos = horaActual.getMinutes(); 

        const ticket = this.mesas.shift(); // this.tickets[0];
        ticket.mesa = hora + ':' + minutos + ' Mesero/a a Mesa ' + mesa;
        
        this.agregarEventoSala(email, ticket.mesa);

        this.guardarDB();
 
        console.log(ticket.mesa)
        return ticket;
    }
    
    // Nuevo método para enviar la cuenta
    guardarPedirCuenta(email, mesa, nombre, metodo, dividir, comment) {
        const ticket = new Ticket(mesa, email);
        ticket.nombre = nombre;
        ticket.metodo = metodo;
        ticket.dividir = dividir;
        ticket.comment = comment;
        this.mesas.push(ticket);
        this.guardarDB();
        return ticket;
    }


    // Nuevo método para pedir cuenta
    pedirCuenta(mesa, nombre, email, metodo, dividir, comment) {
        
        // const ticket = this.mesas.shift(); // this.tickets[0];
        // ticket.mesa = `Cuenta en mesa ${mesa}, ${nombre}`; 

        // this.ultimos4.unshift( ticket.mesa);

        // if ( this.ultimos4.length > 4 ) {
        //     this.ultimos4.splice(-1,1);
        // }

        // this.agregarEventoSala(email, ticket.mesa);
        const horaActual = new Date();
        const hora = horaActual.getHours();
        const minutos = horaActual.getMinutes(); 
        const ticket = this.mesas.shift();
        ticket.mesa = `${hora}:${minutos} Cuenta en mesa ${mesa} \n ${nombre}, ${metodo}, ${dividir}, ${comment}`;

        this.agregarEventoSala(email, ticket.mesa);

        this.guardarDB();

        console.log(ticket.mesa)
        return ticket;
    }


}



module.exports = TicketControl;