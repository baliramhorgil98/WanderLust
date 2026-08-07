const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer'); //The multer is used to parse form data
const {storage}=require("../cloudConfig.js");
const upload=multer({storage}); 


// use of router.route for index route & create route
router.route("/")
.get(wrapAsync(listingController.index))
.post( 
   isLoggedIn,
   
   upload.single('listing[image]'), //This is for multer
   validateListing,
   wrapAsync(listingController.createListing)
);

// New Route(CREATE)  
router.get("/new", isLoggedIn,listingController.renderNewForm);

//use of router.route for 
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// index route
// router.get("/", wrapAsync(listingController.index));



// Show route(READ)
// router.get("/:id", wrapAsync(listingController.showListing));

// Create route(CREATE)
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// update route (UPDATE)
// router.put("/:id", 
//   isLoggedIn, 
//   isOwner,
//   validateListing, 
//   wrapAsync(listingController.updateListing));

//delete route (DELETE)
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;