// user schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require ("bcryptjs");

const userSchema = new Schema({
 
    firstName:
    {
        type: String,
        required:true
    },

    lastName:
    {
        type: String,
        required:true
    },

    email:
    {
        type: String,
        required:true
    },

    password:
    {
        type: String,
        required:true
    },

    isClerk:
    {
        type: Boolean,
        default: false
    },

    dateCreated:
    {
        type:Date,
        default:Date.now()
    }


});

// right before save is called/executed, whatever specified here is created and executed
// We must use ES5 notation here
userSchema.pre("save", function(next)
{
    // salt -> random generated characters or strings
    bcrypt.genSalt(10)
    .then((salt)=>{

        bcrypt.hash(this.password, salt)
        .then((encryptPassword)=>{
            this.password = encryptPassword;
            next();
        })
        .catch(err=>console.log(`Error occurred when salting ${err}`));
    
    })
    .catch(err=>console.log(`Error when salting ${err}`));

})


const userModel = mongoose.model('User', userSchema); // the name specified here gets converted to lowercase plural

module.exports = userModel;