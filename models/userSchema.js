const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    cpassword:{
        type:String,
        required:true,
        minlength:6
    }
    // tokens:[
    //     {
    //         token:{
    //             type:String,
    //             required:true,
    //         }
    //     }
    // ]
})


const USER = new mongoose.model('users',userSchema)
module.exports = USER