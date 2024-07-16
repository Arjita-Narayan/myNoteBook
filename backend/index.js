const connectToMongo = require("./db");
var cors = require("cors");

connectToMongo();

const express = require("express");
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

//Available Routes
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`myNotebook app listening on port http://localhost:${port}`);
});
