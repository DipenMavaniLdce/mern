const app =require('express')()
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dipenMavaniMongoDb:bDognoMinavaMnepid@mern-aiftg.mongodb.net/merntest?retryWrites=true&w=majority',{useNewUrlParser:true})
        .then(() => console.log("object"))
        .catch(err => console.error(err))
app.get('/',(req,res) => {
    res.send("hey buddy wp")
})


app.listen(5000)
