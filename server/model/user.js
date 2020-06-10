const mongoose = require('mongoose')
const bcrypt =require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})


userSchema.pre("save", function(next){
    var user = this

    if(user.isModified("password")){
        bcrypt.genSalt(10,function(err,salt){
            if(err) {
                return next(err)
            }
    
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) {
                    return next(err)
                }  
                console.log(hash)
                user.password = hash  
                next()
            })
        })
    } else {
        next()
    }
    
    

})


userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err){
            return cb(err)
        }
        cb(err,isMatch)
    })


}


userSchema.methods.generateToken= function(cb){
    var user = this
    var token = jwt.sign(user._id.toHexString(),'secret')
    user.token = token

    user.save(function(err , user){
        if(err){
            return  cb(err)
        }
        cb(null,user)
    })
}

userSchema.statics.findByToken = function(token , cb){

    jwt.verify(token,'secret',function(err,decode){
        User.findOne({'_id' : decode ,'token' : token},function(err ,user){
            if(!user){
                return cb(err)
            }
            cb(null,user)
        })

    })

}

const User = mongoose.model('users',userSchema)

module.exports = {User}