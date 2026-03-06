const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const Listing = require("../models/listing");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapToken });
const MONGO_URl = "mongodb+srv://ranbirpratapsinghbhatia_db_user:F3WrG7ekMUC4kwWY@cluster0.6s4uwyz.mongodb.net/wanderlust?retryWrites=true&w=majority";

mongoose.connect(MONGO_URl);

async function updateListings() {
  const listings = await Listing.find({ });

  for (let listing of listings) {
    try {
      const response = await geocoder
        .forwardGeocode({
          query: `${listing.location}, ${listing.country}`,
          limit: 1,
        })
        .send();

      if (!response.body.features.length) {
        console.log(`No location found for: ${listing.title}`);
        continue;
      }

      const geoData = response.body.features[0].geometry;

      listing.geometry = geoData;
      await listing.save();

      console.log(`Updated: ${listing.title}`);
    } catch (err) {
      console.log(`Failed for: ${listing.title}`, err.message);
    }
  }

  console.log("All old listings updated!");
  mongoose.connection.close();
}

updateListings();