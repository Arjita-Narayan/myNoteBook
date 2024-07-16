const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mynotebook");
    console.log("connected to mongodb successfully");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
//different code from youtube due to updation issue
