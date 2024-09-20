const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const {isLoggedIn, isOwner,validateListing}=require('../utils/middleware.js');
const  listingController=require('../controllers/listing.js');
const multer=require('multer'); //form data parsing to read image files.
const {storage}=require('../cloudConfig.js');
const upload=multer({storage}); 

router.route('/') 
.get( wrapAsync(listingController.home))  //home route
.post(isLoggedIn,upload.single("listing[image]"),validateListing, 
 wrapAsync(listingController.createListing)); //Create route.

router.get("/new",isLoggedIn,listingController.renderNewForm); // new route

router.route('/:id')
.get(wrapAsync(listingController.showListing)) //show route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,
 wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); //delete route

router.get("/:id/edit",isLoggedIn,isOwner,
wrapAsync(listingController.editForm));// edit route

module.exports=router;    
