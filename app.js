const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path"); // This is for ejs
const methodOverride=require("method-override"); // It is express middleware allow HTML to send PUT, PATCH and DELETE requests
const ejsMate=require("ejs-mate"); // It helps to create template and layout
const wrapAsync=require("./utilities/wrapAsync.js");
const ExpressError=require("./utilities/ExpressError.js");
const {listingSchema}=require("./schema.js"); 

// to create database
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

//to call async main fuction
main()
  .then( ()=>{
    console.log("Connected to DB");
  }).catch((err) =>{
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// This is for the ejs views folder and ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true})); // For the express route
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //To make the template
app.use(express.static(path.join(__dirname, "/public"))); // TO serve the static files

// to create API route
app.get("/", (req, res) =>{
  res.send("Hi, I am root");
});

//validation for schema(Middleware)
const validateListing=(req, res, next)=>{
let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
};

// index route
app.get("/listings", wrapAsync(async (req, res) =>{
  const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  }));

// New Route(CREATE)  
app.get("/listings/new", (req, res)=>{
  res.render("listings/new.ejs");
});

// Show route(READ)
app.get("/listings/:id", wrapAsync(async (req, res) =>{
  let { id } =req.params; // TO extract the id from the obj and store it in id variable
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
}));

// Create route(CREATE)
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
  
  // if(!req.body.listing){
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  const newListing = new Listing(req.body.listing);
  newListing.image = {
    url: req.body.listing.image,
    filename: "listingimage",
  };

  await newListing.save();
  res.redirect("/listings");

})
  // let listing=req.body.listing;
  // console.log(listing);
);

// edit route
app.get("/listings/:id/edit", wrapAsync(async(req, res)=>{
  let { id } =req.params; 
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

// update route (UPDATE)
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;

  req.body.listing.image = {
    url: req.body.listing.image,
    filename: "listingimage",
  };

  await Listing.findByIdAndUpdate(id, req.body.listing);

  res.redirect(`/listings/${id}`);
}));

//delete route (DELETE)
app.delete("/listings/:id", wrapAsync(async (req, res)=>{
  let { id } =req.params;
  let deletedListings= await Listing.findByIdAndDelete(id);
  console.log(deletedListings);
  res.redirect("/listings");
}));

//Create new route
// app.get("/testListing", async(req, res) =>{
//   let samplelisting=new Listing({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"calangute, Goa",
//     country:"India",
//   });

//   await samplelisting.save(); // to save the data in database
//   console.log("sample was saved");
//   res.send("Successful testing");
// });




//ExpressError
app.all("/*splat",(req, res, next)=>{
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next)=>{
  let{statuscode=500, message="Something went wrong!"}=err;
  res.status(statuscode).render("error.ejs",{message});
  // res.status(statuscode).send(message);
});

// Custom error handling middleware
app.use((err, req, res, next )=>{
  res.send("Something went wrong");
});

//server creation
app.listen(8080, () =>{
  console.log("server is listening to port 8080");
});