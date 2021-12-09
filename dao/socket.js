module.exports = function (io) {
    io.on('connection', (socket) => {

        socket.on('login', (id) => {
            console.log(id)
            socket.emit('msg', id)
        })

    })
}


