const connectToMongo = require("./db");
var cors = require("cors");

connectToMongo();

const express = require("express");
const app = express();
require('dotenv').config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json());

//Available Routes
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

//const JWT_SECRET = "Harryisagoodb$oy";
const JWT_SECRET = process.env.JWT_SECRET;


app.listen(port, () => {
  //console.log(JWT_SECRET);
  console.log(`myNotebook app listening on port http://localhost:${port}`);
});
