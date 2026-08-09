if(process.env.NODE_ENV != "production"){ // This is for env file should not be uploaded on the server while deploying the project
  require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); // This is for ejs
const methodOverride = require("method-override"); // It is express middleware allow HTML to send PUT, PATCH and DELETE requests
const ejsMate = require("ejs-mate"); // It helps to create template and layout
const ExpressError = require("./utilities/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");


// // to create API route
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


const listingRouter= require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const { constrainedMemory } = require("process");

const dbUrl=process.env.ATLASDB_URL;

//to call async main fuction
main()
  .then(() => {
    console.log("Connected to DB");
  }).catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// This is for the ejs views folder and ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // For the express route
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //To make the template
app.use(express.static(path.join(__dirname, "/public"))); // TO serve the static files

//MongoStore for session storage in database
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchafter:24 * 3600,
});

store.on("error", ()=>{
  console.log("error in MONGO SESSION STORE", err);
});

//for sessions
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()  + 7  * 24 * 60 * 60 * 1000,
    maxAge:7  * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//middleware to authenticate User
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for flash
app.use((req, res, next) =>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  // console.log(res.locals.success);
  next();
});

//Demo user for authentication
// app.get("/demouser",  async(req, res) =>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"college-student",
//   });
  
//   let registeredUser=await User.register(fakeUser, "helloworld"); //helloworld is password here
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter); //This one line contain the all above routes inforamtion in listing.js file
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//Home route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//ExpressError
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Something went wrong!" } = err;
  res.status(statuscode).render("error.ejs", { message });
  // res.status(statuscode).send(message);
});

//server
const PORT=process.env.PORT || 8080;

//server creation
app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});