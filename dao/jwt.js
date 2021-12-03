var jwt = require('jsonwebtoken');
var secret = 'yanyinuo';

exports.generateToken = function (e) {
    let payload = { id: e, time: new Date() }
    let token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 * 120 })

    return token
}

exports.vertifyToken = function (e) {
    let payload = jwt.verify(e, secret)
    return payload
}