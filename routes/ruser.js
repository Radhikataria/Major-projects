const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport=require('passport');
const {saveRedirectUrl}=require('../utils/middleware.js');

router.route('/signup')
.get((req,res)=>{
    res.render('users/signup.ejs');
 })
.post(wrapAsync(async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const data=new User({username,email});
        let registeredUser=await User.register(data,password);
        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect('/listings');

        });
       
    }catch(err){
        req.flash("error","user already registered!");
        res.redirect('/signup');
    }
}));
    
router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:'/login',failureFlash:true}),
    async(req,res)=>{
        req.flash("success","Welcome Back!");
        let redirectUrl=res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
   });

//LOGOUT
router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged-out!");
        res.redirect("/listings");

    });
})
module.exports=router;