var dbserver = require('../dao/dbserver')

//引入邮箱发送方法
var emailserver = require('../dao/emailserver')
var signup = require('../server/signup')
var signin = require('../server/signin')
var search = require('../server/search')
var user = require('../server/userdetail')
var friend = require('../server/friend')

module.exports = function (app) {
    app.post('/mail', (req, res) => {
        let mail = req.body.mail
        emailserver.emailSignUp(mail, res)
    })

    //注册页面
    app.post('/signup/add', (req, res) => {
        signup.signUp(req, res)
    })

    //用户邮箱是否注册
    app.post('/signup/judge', (req, res) => {
        signup.judgeValue(req, res)
    })

    //登录页面
    //登录
    app.post('/signin/match', (req, res) => {
        signin.signIn(req, res)
    })

    //搜索页面
    app.post('/search/user', (req, res) => {
        search.searchUser(req, res)
    })
    app.post('/search/isFriend', (req, res) => {
        search.isFriend(req, res)
    })
    app.post('/search/group', (req, res) => {
        search.group(req, res)
    })
    app.post('/search/isInGroup', (req, res) => {
        search.isInGroup(req, res)
    })

    //用户详情
    //详情
    app.post('/user/detail', (req, res) => {
        user.userDetail(req, res)
    })
    app.post('/user/update', (req, res) => {
        user.userUpdate(req, res)
    })
    app.post('/user/updatemarkname', (req, res) => {
        user.friendMarkName(req, res)
    })
    app.post('/user/getmarkname', (req, res) => {
        user.getMarkName(req, res)
    })

    //好友操作
    //申请好友
    app.post('/friend/applyfriend', (req, res) => {
        friend.applyFriend(req, res)
    })
    //更新好友状态
    app.post('/friend/updateFriendState', (req, res) => {
        friend.updateFriendState(req, res)
    })








    //token 测试
    app.post('/signin/test', (req, res) => {
        res.send('token正确')
    })

}