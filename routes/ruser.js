const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport=require('passport');
const {saveRedirectUrl}=require('../utils/middleware.js');
const userController=require("../controllers/user.js");

router.route('/signup') 
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup));
    
router.route("/login") 
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:'/login',failureFlash:true}),userController.login);

//LOGOUT
router.get('/logout',userController.logout);

module.exports=router;