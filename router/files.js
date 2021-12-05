//引入附件上传插件
var multer = require("multer");
var mkdir = require("../dao/mkdir");


//控制文件储存
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let url = req.body.url
        mkdir.mkdirs('../data/' + url, err => {
            console.log(err);
        })
        cb(null, './data/' + url)
    },
    filename: function (req, file, cb) {
        let name = req.body.name
        //正则匹配后缀名
        let type = file.originalname.replace(/.+\./, ".")
        cb(null, name + type)
    }
})

var upload = multer({ storage: storage })

module.exports = function (app) {
    //前端文件上传
    app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
        let data = req.files[0].filename
        res.send(data)
    })
}