var dbserver = require('../dao/dbserver')
var jwt = require('../dao/jwt')
//登录
exports.signIn = function (req, res) {
    let data = req.body.data
    let pwd = req.body.pwd

    dbserver.userMath(data, pwd, res)
}


exports.test = function (req, res) {
    let token = req.body.token
    let jg = jwt.vertifyToken(token)

    res.send(jg)
}