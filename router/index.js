var dbserver = require('../dao/dbserver')

//引入邮箱发送方法
var emailserver = require('../dao/emailserver')

module.exports = function (app) {
    app.post('/test', (req, res) => {
        // res.send('aaaatest') 
        dbserver.findUser(res)
    })
    app.post('/mail', (req, res) => {
        console.log(1);
        let mail = req.body.mail
        console.log(mail);
        emailserver.emailSignUp(mail, res)
    })
}