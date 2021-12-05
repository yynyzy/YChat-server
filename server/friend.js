var dbserver = require('../dao/dbserver')

//用户搜索
exports.applyFriend = function (req, res) {
    let data = req.body
    dbserver.applyFriend(data, res)
}

//更新好友状态
exports.updateFriendState = function (req, res) {
    let data = req.body
    dbserver.updateFriendState(data, res)

}