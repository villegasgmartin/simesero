const crearMensaje = (mesa, mensaje) => {

    const dia = new Date();
    const hora = `${dia.getHours()}:${dia.getMinutes()}`

    return {
        mesa: "Mesa : " + mesa,
        mensaje,
        fecha: hora,
    };

}

module.exports = {
    crearMensaje
}