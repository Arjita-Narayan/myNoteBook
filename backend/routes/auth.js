const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
require('dotenv').config();
//require('dotenv').config({ path: './backend/.env' });




//const JWT_SECRET = "Harryisagoodb$oy";
const JWT_SECRET = process.env.JWT_SECRET;


//ROUTE1:Create a user using:POST "/api/auth/createuser".No login required
router.post(
  "/createuser",
  //validation below using express-validator
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    //If there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      // console.log(user);
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists",
        });
      }
      //changing storing of password into bcrypt form
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);

      //create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      //JWT web token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      //returns authetication token to user
      success = true;
      res.json({ success, authtoken });

      //   .then((user) => res.json(user))
      //   .catch(
      //     (err) => {
      //       console.log(err);
      //       res.json({
      //         error: "Please enter a unique value for email",
      //         message: err.message,
      //       });
      //     }
      //     console.log(req.body);
      //     const user = User(req.body);
      //     user.save();
      //   );
    } catch (error) {
      console.error(error.message);
      console.log(error);
      res.status(500).send("Internal Server error");
    }
  }
);
//ROUTE2:authenticate a user using:POST "/api/auth/login".No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please use correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please use correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      //console.log(JWT_SECRET);
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ authtoken, success });
    } catch (error) {
      console.error(error.message);
      console.log(error);
      res.status(500).send("Internal Server error");
    }
  }
);

//ROUTE3:Get loggedin user details using:POST "/api/auth/getuser".login required

// router.post("/getuser", fetchuser, async (req, res) => {
//   try {
//     userId = req.user.id;
//     const user = await User.findById(userId).select("-password");
//     res.send(user);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server error");
//   }
// });
module.exports = router;
