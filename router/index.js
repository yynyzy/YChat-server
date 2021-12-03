var dbserver = require('../dao/dbserver')

//引入邮箱发送方法
var emailserver = require('../dao/emailserver')
var signup = require('../server/signup')
var signin = require('../server/signin')

module.exports = function (app) {
    app.post('/test', (req, res) => {
        // res.send('aaaatest') 
        dbserver.findUser(res)
    })
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
    //token 测试
    app.get('/signin/test', (req, res) => {
        signin.test(req, res)
    })
}