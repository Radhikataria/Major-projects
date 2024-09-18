const express=require('express');
const router=express.Router({mergeParams:true});
const ExpressError=require('../utils/ExpressError.js');
const {reviewSchema}=require('../servervalid.js');
const wrapAsync=require('../utils/wrapAsync.js');
const Listings = require('../models/listing.js');
const Reviews=require('../models/review.js');


const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
   if(error){
    throw new ExpressError(404,error);
   }
   else {
    next();
}
}

//Review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const ldata= await Listings.findById(id);
    const rdata= new Reviews(req.body.reviews); //data-insertion
    ldata.reviews.push(rdata);
    await rdata.save();
    await ldata.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
    
  }));
  
  //REVIEW-delete ROUTE
 router.delete("/:reviewId",wrapAsync(async (req,res)=>{
      const {id,reviewId}= req.params;
      await Listings.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
      const rdata= await Reviews.findByIdAndDelete(reviewId);
      req.flash("success","Review deleted!");
      res.redirect(`/listings/${id}`);
  }) );

  module.exports=router;
  