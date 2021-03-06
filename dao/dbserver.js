var dbmodel = require('../model/dbmodel')
var bcrypt = require('../dao/bcrypt')
var jwt = require('../dao/jwt')

var User = dbmodel.model('User')
var Friend = dbmodel.model('Friend')
var Group = dbmodel.model('Group')
var GroupUser = dbmodel.model('GroupUser')
var Message = dbmodel.model('Message')
var GroupMsg = dbmodel.model('GroupMsg')

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
exports.countUserValued = function (data, type, res) {
    let wherestr = {}
    wherestr[type] = data
    User.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//用户验证
exports.userMatch = function (data, pwd, res) {
    let wherestr = { $or: [{ 'name': data }, { 'email': data }] };
    let out = { 'name': 1, 'imgurl': 1, 'psw': 1 }

    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result == '') {
                res.send({ status: 400 })
                res.end();
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

//搜索用户
exports.searchUser = function (data, res) {
    let wherestr
    if (data == 'YChat') {
        wherestr = {}
    } else {
        wherestr = { $or: [{ 'name': { $regex: data } }, { 'email': { $regex: data } }] }
    }
    let out = {
        'name': 1,
        'email': 1,
        'imgurl': 1
    }
    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//判断是否为好友
exports.isFriend = function (uid, fid, res) {
    let wherestr = { 'userID': uid, 'friendID': fid, 'state': 0 }

    Friend.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result) {
                res.send({ status: 200 })
            } else {
                res.send({ status: 400 })
            }
        }
    })
}

//搜索群
exports.searchGroup = function (data, res) {
    let wherestr
    if (data == 'YChat') {
        wherestr = {}
    } else {
        wherestr = { 'name': { $regex: data } }
    }
    let out = {
        'name': 1,
        'imgurl': 1
    }
    Group.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//判断是否在群内
exports.isInGroup = function (uid, fid, res) {
    let wherestr = { 'userID': uid, 'groupID': gid }

    GroupUser.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result) {
                res.send({ status: 200 })
            } else {
                res.send({ status: 400 })
            }
        }
    })
}

//用户详情
exports.userDetail = function (id, res) {
    let wherestr = { '_id': id }
    let out = { 'psw': 0 }
    User.findOne(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//用户信息修改
function update(data, update, res) {
    User.findByIdAndUpdate(data, update, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//用户信息修改
exports.userUpdate = function (data, res) {
    let updatestr = {}
    if (typeof (data.pwd) != 'undefined') {
        User.find({ '_id': data.id }, { 'psw': data.pwd }, function (err, result) {
            if (err) {
                res.send({ status: 500 })
            } else {
                if (result == '') {
                    res.send({ status: 400 })
                }
                result.map(function (e) {
                    const pwdMatch = bcrypt.verification(data.pwd, e.psw)
                    if (pwdMatch) {
                        if (data.type == 'psw') {
                            let password = bcrypt.encryption(data.data)
                            updatestr[data.type] = password
                            update(data.id, updatestr, res)
                        } else {
                            updatestr[data.type] = data.data
                            User.countDocuments(updatestr, function (err, result) {
                                if (err) {
                                    res.send({ status: 500 })
                                } else {
                                    if (result == 0) {
                                        update(data.id, updatestr, res)
                                    } else {
                                        res.send({ status: 300 })
                                    }
                                }
                            })

                        }
                    } else {
                        res.send({ status: 400 })
                    }
                })
            }
        })
    } else if (data.type == 'name') {
        updatestr[data.type] = data.data
        User.countDocuments(updatestr, function (err, result) {
            if (err) {
                res.send({ status: 500 })
            } else {
                if (result == 0) {
                    update(data.id, updatestr, res)
                } else {
                    res.send({ status: 300 })
                }
            }
        })


    } else {
        updatestr[data.type] = data.data
        update(data.id, updatestr, res)
    }
}
//获取好友昵称
exports.getMarkName = function (data, res) {
    let wherestr = { 'userID': data.uid, 'friendID': data.fid }
    let out = { 'markname': 1 }
    Friend.findOne(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//修改好友昵称
exports.friendMarkName = function (data, res) {
    let wherestr = { 'userID': data.uid, 'friendID': data.fid }
    let updatestr = { 'markname': data.name }
    Friend.updateOne(wherestr, updatestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//好友操作
//添加好友
exports.buildFriend = function (uid, fid, state) {
    let data = {
        userID: uid,
        friendID: fid,
        state: state,
        time: new Date(),
        lastTime: new Date(),
    }
    let friend = new Friend(data)

    friend.save(function (err, result) {
        if (err) {
            console.log('申请好友表出错');
        } else {
            // res.send({ status: 200 })
        }
    })
}

//好友最后通讯时间
exports.upFriendLastTime = function (data) {
    let wherestr = {
        $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }]
    }
    let updatestr = { 'lastTime': new Date() }

    Friend.updateMany(wherestr, updatestr, function (err, result) {
        if (err) {
            console.log('更新好友最后通讯时间出错');
            // res.send({ status: 500 })
        } else {
            // res.send({ status: 200 })
        }
    })
}

//添加一对一消息
exports.insertMsg = function (uid, fid, msg, type, res) {
    let data = {
        userID: uid,
        friendID: fid,
        message: msg,
        types: type,
        time: new Date(),
        state: 1
    }
    let message = new Message(data)

    message.save(function (err, result) {
        if (err) {
            if (res) {
                res.send({ status: 500 })
            }
        } else {
            if (res) {
                res.send({ status: 200 })
            }
        }
    })
}

//好友申请
exports.applyFriend = function (data, res) {
    let wherestr = { 'userID': data.uid, 'friendID': data.fid }
    const { buildFriend, upFriendLastTime, insertMsg } = this
    Friend.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result == 0) {

                buildFriend(data.uid, data.fid, 2)
                buildFriend(data.fid, data.uid, 1)
            } else {
                upFriendLastTime(data)
                upFriendLastTime(data)
            }
            insertMsg(data.uid, data.fid, data.msg, 0, res)
        }
    })
}

//更新好友状态
exports.updateFriendState = function (data, res) {
    let wherestr = {
        $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }]
    }

    Friend.updateMany(wherestr, { 'state': 0 }, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}
//拒绝或删除好友
exports.deleteFriend = function (data, res) {
    let wherestr = {
        $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }]
    }

    Friend.deleteMany(wherestr, { 'state': 0 }, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//按要求获取好友列表
exports.getUsers = function (data, res) {
    let query = Friend.find({})
    //查询条件
    query.where({ 'userID': data.uid, 'state': data.state })
    //查找FriendID 关联的user对象
    query.populate('friendID')
    //排序方式，最后通讯时间
    query.sort({ 'lastTime': -1 })
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return {
                id: ver.friendID._id,
                name: ver.friendID.name,
                markname: ver.markname,
                imgurl: ver.friendID.imgurl,
                lastTime: ver.lastTime,
                type: 0
            }
        })
        res.send({ status: 200, result: result })
    }).catch(function (err) {
        res.send({ status: 500 })
    })

}

//按要求获取一条一对一消息
exports.getOneMsg = function (data, res) {
    let query = Message.findOne({})
    //查询条件
    query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] })
    //排序方式，最后通讯时间
    query.sort({ 'time': -1 })
    query.exec().then(function (ver) {
        let result = {
            message: ver.message,
            time: ver.time,
            types: ver.types
        }

        res.send({ status: 200, result: result })
    }).catch(function (err) {
        res.send({ status: 500 })
    })

}

//汇总一对一消息未读数
exports.unreadMsg = function (data, res) {
    let wherestr = { 'userID': data.fid, 'friendID': data.uid, 'state': 1 }
    Message.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//好友消息已读
exports.updateMsg = function (data, res) {
    //修改条件
    let wherestr = { 'userID': data.uid, 'friendID': data.fid, 'state': 1 }

    let updatestr = { 'state': 0 }
    Message.countDocuments(wherestr, updatestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//新建群
function insertGroupUser(data) {
    var groupuser = new GroupUser(data)

    groupuser.save(function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            console.log('添加群成员成功');
        }
    })
}
exports.createGroup = function (data, res) {
    //修改条件
    let groupData = {
        userID: data.uid,
        name: data.name,
        imgurl: data.imgurl,
        time: new Date(),
    }
    var group = new Group(groupData)
    group.save(function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            console.log(data, "1");
            Group.find({ 'userID': data.uid, 'name': data.name }, { '_id': 1 }, function (err, result) {
                if (err) {
                    res.send({ status: 500 })
                } else {
                    //添加新成员到列表
                    result.map(function (gid) {
                        //添加群主入群
                        let udata = {
                            groupID: gid._id,
                            userID: data.uid,
                            time: new Date(),
                            lastTime: new Date()
                        }
                        //加入
                        insertGroupUser(udata)

                        //添加好友入群
                        for (let i = 0; i < data.user.length; i++) {
                            let fdata = {
                                groupID: gid._id,
                                userID: data.user[i],
                                time: new Date(),
                                lastTime: new Date()
                            }
                            insertGroupUser(fdata)
                        }
                    })
                    res.send({ status: 200, result })
                }
            })

        }
    })

}

//添加群成员
// exports.insertGroupUser = function (id, res) {
//     var groupuser = new GroupUser(data)

//     groupuser.save(function (err, result) {
//         if (err) {
//             res.send({ status: 500 })
//         } else {
//             console.log('添加群成员成功');
//         }
//     })
// }


//按要求获取群列表
exports.getGroup = function (id, res) {
    //id 为用户所在的群
    let query = GroupUser.find({})

    query.where({ 'userID': id })
    //查找 userID 关联的user对象
    query.populate('groupID')
    query.sort({ 'lastTime': -1 })
    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return {
                id: ver.groupID._id,
                name: ver.groupID.name,
                markname: ver.name,
                imgurl: ver.groupID.imgurl,
                lastTime: ver.lastTime,
                tip: ver.tip,
                type: 1
            }
        })
        res.send({ status: 200, result: result })
    }).catch(function (err) {
        res.send({ status: 500 })
    })
}

//按要求获取群消息
exports.getOneGroupMsg = function (gid, res) {
    let query = GroupMsg.findOne({})
    //查询条件
    query.where({ $or: { 'groupID': gid } })
    query.populate('userID')
    //排序方式，最后通讯时间
    query.sort({ 'time': -1 })
    query.exec().then(function (ver) {
        let result = {
            message: ver.message,
            time: ver.time,
            types: ver.types,
            name: ver.userId.name
        }

        res.send({ status: 200, result: result })
    }).catch(function (err) {
        res.send({ status: 500 })
    })
}

//群消息状态修改
exports.updateGroupMsg = function (data, res) {
    //修改条件
    let wherestr = { 'userID': data.uid, 'groupID': data.gid }
    //修改内容
    let updatestr = { 'tip': 0 }
    Message.updateOne(wherestr, updatestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//分页获取一对一聊天数据
exports.msg = function (data, res) {
    var skipNum = data.nowPage * data.pageSize
    let query = Message.find({})
    query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] })
    query.sort({ 'time': -1 })

    query.populate('userID')

    query.skip(skipNum)
    query.limit(data.pageSize)

    query.exec().then(function (e) {
        let result = e.map(function (ver) {
            return {
                id: ver.id,
                message: ver.message,
                types: ver.types,
                time: ver.time,
                fromId: ver.userID._id,
                imgurl: ver.userID.imgurl
            }
        })
        res.send({ status: 200, result })
    }).catch(function (err) {
        res.send({ status: 500 })
    })

}
