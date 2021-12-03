var dbserver = require('../dao/dbserver')

//引入邮箱发送方法
var emailserver = require('../dao/emailserver')

module.exports = function (app) {
    app.post('/test', (req, res) => {
        // res.send('aaaatest') 
        dbserver.findUser(res)
    })
    app.post('/mail', (req, res) => {
        console.log(req.body);
        let mail = req.body.mail
        emailserver.emailSignUp(mail, res)
    })
}