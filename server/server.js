let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let morgan = require("morgan");
let app = express();
const port = process.env.PORT || 8080;

app.use(morgan("dev"));

// For serving files from public dir
app.use(express.static("public"));

// use application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get("/", (req, res) => {
  res.render("index.html");
});

// POST /login gets urlencoded bodies
app.post("/login", function(req, res) {

  if (req.body.user == "abc" && req.body.pass == "1234") {
    res.contentType("application/json");
    let data = JSON.stringify("main.html");
    res.header("Content-Length", data.length);
    res.end(data);
  } else {
    res.sendStatus(401);
  }
});

// Opening port
app.listen(port, function() {
  console.log(`Staring server at port ${port}`);
});
