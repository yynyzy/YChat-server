var dbserver = require('../dao/dbserver')

//用户搜索
exports.getFriend = function (req, res) {
    let data = req.body
    dbserver.getUsers(uid, state, res)
}