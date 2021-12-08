var mongoose = require('mongoose');

const db = require('../config/db')

var Schema = mongoose.Schema
//用户表
var UserSchema = new Schema({
    name: { type: String },
    psw: { type: String },
    email: { type: String },
    sex: { type: String, default: 'asexual' },
    birth: { type: Date },
    phone: { type: Number },
    explain: { type: String },
    imgurl: { type: String, default: '/user/user.png' },
    time: { type: Date }
})

//好友表
var FriendSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    friendID: { type: Schema.Types.ObjectId, ref: 'User' },
    state: { type: String },
    markname: { type: String },
    time: { type: Date },
    lastTime: { type: Date }

})
//一对一消息表
var MessageSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    friendID: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    types: { type: String },
    time: { type: Date },
    state: { type: Number }
})
//群表
var GroupSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    imgurl: { type: String, default: 'group.png' },
    time: { type: Date },
    notice: { type: String }
})
//群成员表
var GroupUserSchema = new Schema({
    groupID: { type: Schema.Types.ObjectId, ref: 'Group' },
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    tip: { type: Number, default: 0 },
    time: { type: Date },
    lastTime: { type: Date },
    shied: { type: Number }
})

//群消息表
var GroupMsgSchema = new Schema({
    groupID: { type: Schema.Types.ObjectId, ref: 'Group' },
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    types: { type: String },
    time: { type: Date }
})
module.exports = db.model('User', UserSchema)
module.exports = db.model('Friend', FriendSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupUser', GroupUserSchema)
module.exports = db.model('GroupMsg', GroupMsgSchema)