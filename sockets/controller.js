

const socketController = (socket) => {

	

    // socket.on('conectado', () => {
       
	// 	console.log('se conecto al servidor en linea');
       
    //     socket.broadcast.emit( 'mensajes');

    // }); 

	socket.on("mensaje", (mensaje) => {
		//io.emit manda el mensaje a todos los clientes conectados al chat
		console.log(mensaje);
		socket.broadcast.emit( 'mensajes',mensaje);
	});
	socket.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });


    // Mensajes privados
    socket.on('mensajePrivado', data => {

        // let persona = usuarios.getPersona(client.id);
        //client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
		client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje('nombre', 'data.mensaje'));
    });


    socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
        
		socket.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		socket.to(data.to).emit("callAccepted", data.signal)
	})

   


}



module.exports = {
    socketController
}
