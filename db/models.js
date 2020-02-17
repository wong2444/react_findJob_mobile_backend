const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/find-job', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
//取得連接對象
const conn = mongoose.connection
//綁定連接完成的監聽
conn.on('connected', () => {
    console.log('connect success')
})
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    avatar: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 工资
})
// 2.2. 定义 Model(与集合对应, 可以操作集合)
const userModel = mongoose.model('user', userSchema)
// 2.3. 向外暴露 Model
exports.userModel = userModel


// 定义 chats 集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的 id
    to: {type: String, required: true}, // 接收用户的 id
    chat_id: {type: String, required: true}, // from 和 to 组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type: Boolean, default: false}, // 标识是否已读
    create_time: {type: Number} // 创建时间
})
// 定义能操作 chats 集合数据的 Model
const chatModel = mongoose.model('chat', chatSchema)
// 向外暴露 Model
exports.chatModel = chatModel
