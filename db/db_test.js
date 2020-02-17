const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
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

const userSchma = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    avatar: {type: String}
})

const UserModel = mongoose.model('user', userSchma)

function testSave() {
    const userModel = new UserModel({username: 'Alan', password: md5('123'), type: 'boss'})
    console.log(userModel, 'sssss')
    userModel.save((err, user) => {
        console.log(user)
    })
}

// testSave()

function testFind() {
    //查不到結果返回[]
    UserModel.find({}, (err, users) => {
        console.log(users)
    })
    //查不到結果返回null
    UserModel.findOne({_id: '5e29be439530ec4fb82b8d04'}, (err, user) => {
        console.log(user)
    })

}

// testFind()

function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5e29be439530ec4fb82b8d04'}, {username: 'jack'}, (err, res) => {
        console.log(res)//返回未更新前的數據
    })
}

// testUpdate()

function testDel() {
    UserModel.remove({_id: "5e29be439530ec4fb82b8d04"}, (err, res) => {
        console.log(res)// { n: 1, ok: 1, deletedCount: 1 }
        //失敗返回 { n: 0, ok: 1, deletedCount: 0 }
    })
}
// testDel()
