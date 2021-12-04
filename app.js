const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('./dao/jwt')
const app = express()

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");

    if (req.method.toLowerCase() == 'options') {
        res.sendStatus(200);  //让options尝试请求快速结束
    }
    else
        next();
});
app.use(bodyParser.json());

app.use(function (req, res, next) {
    if (typeof (req.body.token) !== undefined) {
        let token = req.body.token
        let tokenMatch = jwt.vertifyToken(token)
        console.log('及时' + tokenMatch);
    } else {
        next()
    }
})

require('./router/index')(app)


//404
app.use(function (req, res, next) {
    let err = new Error('NOT FOUND')
    err.status = 404
    next(err)
})
//错误页面
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send(err.message)
})


app.listen(3000, console.log("服务已启动"))