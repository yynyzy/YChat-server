var dbmodel = require('../model/dbmodel')
var bcrypt = require('../dao/bcrypt')
var jwt = require('../dao/jwt')

var User = dbmodel.model('User')

exports.buildUser = function (name, mail, pwd, res) {

    let password = bcrypt.encryption(pwd)

    let data = {
        name,
        email: mail,
        psw: password,
        time: new Date()
    }
    let user = new User(data)
    user.save(function (err, result) {
        if (err) {
            res.send({ status: 500 })

        } else {
            res.send({ status: 200, result })

        }
    })

}

//匹配用户表元素个数
exports.countUserValued = function () {
    let wherestr = {}

    wherestr[type] = data

    User.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })

        } else {
            res.sendStatus({ status: 200, result })

        }
    })
}

//用户验证
exports.userMath = function (data, pwd, res) {
    let wherestr = { $or: [{ 'name': data }, { 'email': data }] };
    let out = { 'name': 1, 'imgurl': 1, 'psw': 1 }

    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result == '') {
                res.send({ status: 400 })

            }
            result.map(function (e) {
                const pwdMatch = bcrypt.verification(pwd, e.psw)
                if (pwdMatch) {
                    let token = jwt.generateToken(e._id)
                    let back = {
                        id: e._id,
                        name: e.name,
                        imgurl: e.imgurl,
                        token: token
                    }
                    res.send({ status: 200, back })
                } else {
                    res.send({ status: 400 })

                }
            })


        }
    })
}