var dbserver = require('../dao/dbserver')
var email = require('../dao/emailserver')
//用户注册
exports.signUp = function (req, res) {
    let name = req.body.name
    let mail = req.body.mail
    let pwd = req.body.pwd

    email.emailSignUp(mail, res)

    dbserver.buildUser(name, mail, pwd, res)
}

//用户邮箱是否注册
exports.judgeValue = function (req, res) {
    let data = req.body.data
    let type = req.body.type
    dbserver.countUserValued(data, type, res)
}