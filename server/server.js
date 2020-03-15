let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let morgan = require("morgan");
let path = require("path");
let fs = require("fs");
let app = express();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));

// For serving files from public dir
app.use(express.static("public"));

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Opening port
app.listen(port, function() {
  console.log(`Staring server at port ${port}`);
});

// POST /login gets urlencoded bodies
app.post("/login", urlencodedParser, function(req, res) {
  console.log(req.body);
  res.redirect("main.html");
//   console.log(req.params.password);
});

// POST /api/users gets JSON bodies
app.post("/api/users", jsonParser, function(req, res) {
  // create user in req.body
});
