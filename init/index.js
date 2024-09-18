const mongoose=require('mongoose');
const initData=require('./data.js'); // where db data saved.
const Listing=require('../models/listing.js'); //where schema defined.

// to connect mongoDB
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((res)=>{console.log('DB CONNECTED');})
.catch((err)=>{console.log(err)});

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'66c74fa96561655ace7395b7'}));
    await Listing.insertMany(initData.data);
    console.log("Data initialized.");
}

initDB();  //function call


