const express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require('../utils/wrapAsync.js');
const Listings = require('../models/listing.js');
const Reviews=require('../models/review.js');
const reviewController=require('../controllers/reviews.js');
const {validateReview,isLoggedIn,isReviewAuthor}=require('../utils/middleware.js');

//Post Review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
  
  //REVIEW-delete ROUTE
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview) );

module.exports=router;
   