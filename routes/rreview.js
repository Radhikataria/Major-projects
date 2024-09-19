const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const Listings = require('../models/listing.js');
const Reviews=require('../models/review.js');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../utils/middleware.js');

//Review route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const ldata= await Listings.findById(id);
    const rdata= new Reviews(req.body.reviews); //data-insertion
    rdata.author=req.user._id;
    console.log(rdata);
    ldata.reviews.push(rdata);
    await rdata.save(); 
    await ldata.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
    
  }));
  
  //REVIEW-delete ROUTE
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async (req,res)=>{
      const {id,reviewId}= req.params;
      await Listings.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
      await Reviews.findByIdAndDelete(reviewId);
      req.flash("success","Review deleted!");
      res.redirect(`/listings/${id}`);
  }) );

  module.exports=router;
  