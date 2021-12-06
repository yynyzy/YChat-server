var dbserver = require('../dao/dbserver')

//用户搜索
exports.getFriend = function (req, res) {
    let data = req.body
    dbserver.getUsers(uid, state, res)
}

//获取最后一条消息
exports.getLastMsg = function (req, res) {
    let data = req.body
    dbserver.getOneMsg(data, res)
}

//汇总一对一消息未读数
exports.unreadMsg = function (req, res) {
    let data = req.body
    dbserver.unreadMsg(data, res)
}

//好友消息已读
exports.updateMsg = function (req, res) {
    let data = req.body
    dbserver.updateMsg(data, res)
}

//按要求获取群列表
exports.getGroup = function (req, res) {
    let uid = req.body.uid
    dbserver.getGroup(uid, res)
}

//按要求获取群消息
exports.getOneGroupMsg = function (req, res) {
    let gid = req.body.gid
    dbserver.getOneGroupMsg(gid, res)
}

//群消息状态修改
exports.updateGroupMsg = function (req, res) {
    let data = req.body
    dbserver.updateGroupMsg(data, res)
}