const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const Listings = require('../models/listing.js');
const {listingSchema}=require('../servervalid.js');
const ExpressError=require('../utils/ExpressError.js');
const {isLoggedIn}=require('../utils/middleware.js');
const  listingController=require('../controllers/listing.js');
const multer=require('multer');
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});


const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
   if(error){
    throw new ExpressError(404,error);
   }
   else {
    next();
}
}
 
router.route('/')
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),//validate listing left.
 wrapAsync(listingController.createListing));
// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,wrapAsync(listingController.destroyListing));

// edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editForm));


module.exports=router;    
