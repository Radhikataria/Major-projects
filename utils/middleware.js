const Listings = require('../models/listing.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('../servervalid.js');
const Reviews=require('../models/review.js');


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must logged-in before any changes.");
       return res.redirect('/login');
    }
    next(); 
};

module.exports.saveRedirectUrl=(req,res,next)=>{
 
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
    let {id}= req.params;
    let data=await Listings.findById(id);
    if(!data.owner.equals(res.locals.currUser._id)){
       req.flash("error","You are not the owner of this listing!");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
   if(error){
    throw new ExpressError(404,error);
   }
   else {
    next();
}
}
module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
   if(error){
    throw new ExpressError(404,error);
   }
   else {
    next();
}
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Reviews.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this Review!");
        return res.redirect(`/listings/${id}`);
     }
     next();
}
 