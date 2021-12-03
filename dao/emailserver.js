var nodemailer = require('nodemailer');

//引入证书文件
var credentials = require('../config/credentials')

//创建传输方式
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: credentials.qq.user,
        pass: credentials.qq.pass
    }
})

exports.emailSignUp = function (email, res) {
    //发生信息内容
    let options = {
        from: '1601530253@qq.com',
        to: email,
        subject: '感谢你在YChat注册',
        html: '<span>YChat欢迎你的加入！<a href="https://localhost:8080/">点击</a></span>',
    }

    //发送邮件
    transporter.sendMail(options, function (err, msg) {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.send('邮箱发送成功！');
            console.log('邮箱发送成功！');
        }
    })
}