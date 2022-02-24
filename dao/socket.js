let dbserver = require('./dbserver')

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
            //修改好友最后通讯时间
            dbserver.upFriendLastTime({ uid: fromId, fid: toId });
            //存储一对一消息
            dbserver.insertMsg(fromId, toId, msg.message, msg.types)

            if (users[toId]) {
                socket.to(users[toId]).emit('backmsg', msg, fromId, 0)
            }
            socket.emit('msg', msg, toId, 1)
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


