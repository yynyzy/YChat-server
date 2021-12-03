var dbmodel = require('../model/dbmodel')
var bcrypt = require('../model/bcrypt')

var User = dbmodel.model('User')

exports.buildUser = function (name, mail, pwd, res) {

    let password = bcrypt.encryption(pwd)

    let data = {
        nam,
        email: mail,
        psw: password,
        time: new Date()
    }
    let user = new User(data)
    user.save(function (err, result) {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    })

}

//匹配用户表元素个数
exports.countUserValued = function () {
    let wherestr = {}

    wherestr[type] = data

    User.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200)
        }
    })
}