if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}



//E X P R E S S

const express=require('express');
let app= express();
const path=require('path');
const mongoose=require('mongoose');
const dbURL=process.env.ATLASDB_URL;

const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');

const rlisting=require('./routes/rlisting.js');
const rreview=require('./routes/rreview.js');
const ruser=require('./routes/ruser.js');

const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600, //session update after 24 hours.
});
store.on("error",()=>{
    console.log("Error in Mongo-Session Store.",err)
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly: true,
    },
}

//connection

let port=3030;
app.listen(port,()=>{
    console.log(`Application is listening on ${port} `);
});

//M O N G O O S E

async function main(){
    await mongoose.connect(dbURL);
}

main().then((res)=>{console.log("Connected to DB")})
.catch((err)=>{console.log(err);} );

app.get("/",(req,res)=>{
    console.log("Root is Working.");
    res.send("Root is Working.")
});
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currUser=req.user;

    next();
});

app.use('/listings',rlisting);
app.use('/listings/:id/reviews',rreview);
app.use('/',ruser);

//Error Handler

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found !"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong..."}=err;
    res.render("error.ejs",{message});
    // res.status(status).send(message);

})
