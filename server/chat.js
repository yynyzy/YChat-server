var dbserver = require('../dao/dbserver')

//用户搜索
exports.msg = function (req, res) {
    let data = req.body
    dbserver.msg(data, res)
}