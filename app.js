const express = require('express')
const app = express()

app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "*");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
});

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