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

mongoose.connect(config.mongoUri,{useNewUrlParser: true ,useUnifiedTopology: true })
        .then(() => console.log("object"))
        .catch(err => console.error(err))



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


app.listen(5000)

