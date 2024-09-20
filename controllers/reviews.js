const Listings = require('../models/listing.js');
const Reviews=require('../models/review.js');

module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    const ldata= await Listings.findById(id);
    const rdata= new Reviews(req.body.reviews); //data-insertion
    rdata.author=req.user._id;
    ldata.reviews.push(rdata);
    await rdata.save(); 
    await ldata.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyReview=async (req,res)=>{
    const {id,reviewId}= req.params;
    await Listings.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
}