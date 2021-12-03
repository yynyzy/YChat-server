var bcrypt = require('bcryptjs');

//生成hash
exports.encryption = function (e) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(e, salt);
    return hash
}

//解密hash
exports.verification = function (e, hash) {
    let verify = bcrypt.compareSync(e, hash);
    return verify
}


