const express =require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const cookieParser =require('cookie-parser')
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(cookieParser())
const config = require('./config/keys')
const {User} = require('./model/user');
const {auth} = require('./middleware/auth')

mongoose.connect(config.mongoUri,{useNewUrlParser: true ,useUnifiedTopology: true })
        .then(() => console.log("object"))
        .catch(err => console.error(err))

app.get('/api/users/logout',auth,(req,res) => {
    User.findOneAndUpdate({'_id' : req.user._id} , {token : ''},(err,doc) => {
        if(err){
            return res.json({success : false , err})
        }
        return res.status(200).send({
            success : true
        })
    })
})

app.get('/',(req,res) => {
    console.log("object")
    res.send("hey buddy wp")
})

app.post('/api/users/register',(req,res) => {
    
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json(doc);
    });
   
})

app.post('/api/users/login',(req,res) =>{

    User.findOne({email : req.body.email},(err , user) =>{
        if(!user){
            return res.status(404).json({
                loginSuccess : false,
                message : "auth failed email not found"
            })
        }

        user.comparePassword(req.body.password,(err,isMatch) => {
            if(err){
                return res.status(500).send(err)
            }
            if(!isMatch){
                return res.json({
                    loginSuccess : false,
                    message : "wrong password"
                })
            }
            user.generateToken((err,user) => {
                if(err){
                    return res.status(400).send(err)
                }
                res.cookie("x_auth" , user.token)
                    .status(200)
                    .json({
                        loginSuccess : true
                    })
            })

        })


    })


})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server runnig at port ${port}`)
})

