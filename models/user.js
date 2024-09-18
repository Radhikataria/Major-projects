const passportLocalMongoose=require('passport-local-mongoose');
const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
});
userSchema.plugin(passportLocalMongoose);
const user=mongoose.model("user",userSchema);
module.exports=user;