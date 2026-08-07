const mongoose = require("mongoose");
const initData = require("./data.js"); // to require data
const Listing = require("../models/listing.js"); // to require listing.js file

// to create database and establish connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//to call async main fuction
main()
  .then(() => {
    console.log("Connected to DB");
  }).catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// to initialise data
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj) =>({
    ...obj,
    owner:"6a6b6b96b20bde51a93cd04e",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
}

initDB(); // to call the function