const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URl = "mongodb+srv://ranbirpratapsinghbhatia_db_user:F3WrG7ekMUC4kwWY@cluster0.6s4uwyz.mongodb.net/wanderlust?retryWrites=true&w=majority";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "69a9bbad671c760d54bee5c3"
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
