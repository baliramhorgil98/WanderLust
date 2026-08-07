const express = require("express");
const app = express();
const users = require("./Routes/user.js");
const posts = require("./Routes/post.js");
const session = require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption = {
  secret: "mysupersecreatstring", 
  resave: true, 
  saveUninitialized: true
};

app.use(session(sessionOption));
app.use(flash());

//use middleware
app.use((req, res, next) =>{
  res.locals.successMsg=req.flash("success");
  res.locals.errorMsg=req.flash("error");
  next();
});

app.get("/register", (req, res) =>{
  let {name ="anonymous"}=req.query;
  req.session.name=name;
  if(name === "anonymous"){
     req.flash("error", "user not registered");
  }else {
     req.flash("success", "user registered successfully");
  }
 
  res.redirect("/hello");
});

app.get("/hello", (req, res) =>{
  res.render("page.ejs", {name:req.session.name});
});


// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) =>{
//   res.send("test successful");
// });

// const cookieParser=require("cookie-parser");

// app.use(cookieParser("secreatcode"));

// //Signed cookies
// app.get("/getsignedcookies", (req, res) =>{
//   res.cookie("made-in", "India" , {signed:true});
//   res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) =>{
//   console.log(req.signedCookies);
//   res.send("verified");
// });

// //For cookies
// app.get("/getcookies", (req, res) =>{
//   res.cookie("greet", "name"); //name and value pair format
//   res.cookie("madeIn", "india");
//   res.send("sent you some cookies");
// });

// app.get("/", (req, res) =>{
//   console.dir(req.cookies);
//   res.send("Hi I am root");
// });

// app.use("/users", users);
// app.use("/posts", users);

app.listen(3000, () => {
  console.log("server is listening to 3000");
});