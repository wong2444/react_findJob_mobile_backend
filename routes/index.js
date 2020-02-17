const express = require('express');
const router = express.Router();
const {userModel, chatModel} = require('../db/models')
const md5 = require("blueimp-md5")
const filter = {password: 0, __v: 0}
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/register', (req, res) => {
    const {username, password, type} = req.body
    userModel.findOne({username}, (err, user) => {
        if (user) {
            return res.send({code: "1", msg: "用戶已存在"})
        }
        new userModel({username, type, password: md5(password)}).save((err, user) => {

            const data = {username, type, _id: user._id}
            res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7}) // 持久化 cookie, 浏览器会保存在本地文件
            res.send({code: 0, data})

        })
    })

})

router.post('/login', (req, res) => {
    const {username, password} = req.body
    userModel.findOne({username, password: md5(password)}, filter, (err, user) => {
        if (user) {
            res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
            res.send({code: 0, data: user})
        } else {
            res.send({code: 1, msg: '用戶名或密碼不正確'})
        }
    })
})

router.post('/update', (req, res) => {
    const userid = req.cookies.userid
    if (!userid) {
        return res.send({code: 1, msg: '請先登錄'})
    }
    const user = req.body
    userModel.findByIdAndUpdate({_id: userid}, user, (err, oldUser) => {
        if (!oldUser) {
            res.clearCookie('userid')
            res.send({code: 1, msg: '請先登錄'})
        } else {
            const {_id, username, type} = oldUser
            const data = Object.assign(user, {_id, username, type})//對象合併
            res.send({code: 0, data})
        }
    })
})

router.get('/user', (req, res) => {
    const userid = req.cookies.userid
    if (!userid) {
        return res.send({code: 1, msg: '請先登錄'})
    }
    userModel.findOne({_id: userid}, filter, (err, user) => {
        res.send({code: 0, data: user})
    })
})

router.get('/userlist', (req, res) => {
    const {type} = req.query

    if (!type) {
        return res.send({code: 1, msg: '請先登錄'})
    }
    userModel.find({type}, filter, (err, userList) => {
        console.log(userList)
        res.send({code: 0, data: userList})
    })
})


router.get('/msglist', (req, res) => {
    let users = {}
    const userid = req.cookies.userid
    // console.log(userid)
    userModel.find({}, filter, (err, userList) => {
        userList.forEach(user => {
            users[user._id] = {"username": user.username, 'avatar': user.avatar}
        })
    })
    chatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
        // 返回包含所有用户和当前用户相关的所有聊天消息的数据
        res.send({code: 0, data: {users, chatMsgs}})
    })
})

router.post('/readmsg', (req, res) => {
    let {from} = req.body

    const to = req.cookies.userid

    console.log(to)
    chatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
        // console.log('/readmsg', doc)
        res.send({code: 0, data: {count: doc.nModified, from, to}}) // 更新的数量
    })


})


module.exports = router;
