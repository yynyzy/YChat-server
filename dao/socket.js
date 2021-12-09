module.exports = function (io) {
    var users = {}

    io.on('connection', (socket) => {

        socket.on('login', (id) => {
            socket.name = id
            users[id] = socket.id
            socket.emit('msg', socket.id)

        })

        //用户一对一消息发送
        socket.on('msg', (msg, fromId, toId) => {
            console.log(msg);
            socket.emit('msg', msg)
        })


        //用户离开
        socket.on('disconnecting', () => {
            if (users.hasOwnProperty(socket.name)) {
                delete users[socket.name]
                console.log(socket.id + '离开');
            }
        })

    })
}


