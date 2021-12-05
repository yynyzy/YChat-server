var dbmodel = require('../model/dbmodel')
var bcrypt = require('../dao/bcrypt')
var jwt = require('../dao/jwt')

var User = dbmodel.model('User')
var Friend = dbmodel.model('Friend')
var Group = dbmodel.model('Group')
var GroupUser = dbmodel.model('GroupUser')

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
            res.send({ status: 200, result })

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
                    console.log(pwdMatch);
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
            res.send({ status: 200 })
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
exports.buildFriend = function (uid, fid, state, res) {
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
exports.upFriendLastTime = function (uid, fid) {
    let wherestr = { 'userID': uid, 'friendID': fid };
    let updatestr = { 'lastTime': new Date() }

    Friend.updateOne(wherestr, updatestr, function (err, result) {
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
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//好友申请
exports.applyFriend = function (data, res) {
    let wherestr = { 'userID': data.uid, 'friendID': data.fid }
    console.log(this.buildFriend);
    Friend.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result == 0) {
                this.buildFriend(data.uid, data.fid, 2)
                this.buildFriend(data.fid, data.uid, 1)
            } else {
                this.upFriendLastTime(data.uid, data.fid)
                this.upFriendLastTime(data.fid, data.uid)
            }
            this.insertMsg(data.uid, data.fid, data.msg, 0, res)
        }
    })
}