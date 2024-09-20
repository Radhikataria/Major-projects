const User=require('../models/user.js');

module.exports.renderSignUpForm=(req,res)=>{
    res.render('users/signup.ejs');
 }
module.exports.signup=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const data=new User({username,email});
        let registeredUser=await User.register(data,password); //data save
        req.login(registeredUser,(err)=>{ //when user signed-up then he will be logged-in using req.login()
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
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back!");
    let redirectUrl=res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
    // console.log("",redirectUrl);
}
module.exports.logout=(req,res,next)=>{ 
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged-out!");
        res.redirect("/listings");

    });
}