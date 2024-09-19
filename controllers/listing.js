
const Listings = require('../models/listing.js');

module.exports.index=async (req,res)=>{
    const info= await Listings.find({}); 
    res.render("home.ejs",{info});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
}
module.exports.showListing=async (req,res)=>{
    let {id}= req.params;
    const info= await Listings.findById(id)
    .populate({path:'reviews',populate:{
            path:'author'
        },
    }).populate('owner'); 
    if(!info){
        req.flash("error","Listing you requested for does not exist.");
        res.redirect("/listings");
    }
    res.render("show.ejs",{info});
};
module.exports.createListing=async (req,res)=>{
     let url= req.file.path;
     let filename=req.file.filename;
     const info=new Listings(req.body.listing);
     info.owner=req.user._id; 
     info.image={url,filename};
     await info.save();
     req.flash("success","New Listing Created!");
     res.redirect("/listings");
    
 };
 module.exports.editForm=async (req,res)=>{
    let {id}= req.params;
    const data= await Listings.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exist.");
        res.redirect("/listings");
    }
    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250,e_blur:95");
    res.render("edit.ejs", {data,originalImageUrl}) ;
}
module.exports.updateListing=async (req,res)=>{
    let {id}= req.params;
    let data=await Listings.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    if(typeof req.file !=="undefined"){
        let url= req.file.path;
        let filename=req.file.filename;
        data.image={url,filename};
        await data.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
    
}
module.exports.destroyListing=async (req,res)=>{
    let {id}= req.params;
    const del= await Listings.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}