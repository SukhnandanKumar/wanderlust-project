const { required } = require('joi');
const mongoose=require('mongoose')
const schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema=new schema({
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose);// => it add by default--> Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
                                  // =>Additionally, Passport-Local Mongoose adds some methods to your Schema.
module.exports = mongoose.model('User', userSchema);