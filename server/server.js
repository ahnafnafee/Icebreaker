let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let morgan = require("morgan");
const bcrypt = require("bcrypt");
var mysql = require("mysql");
var mongo = require("mongodb");

let app = express();
const port = process.env.PORT || 8080;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Chernobyl01",
  database: "icebreaker"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected!");
});

// Create DB
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE icebreaker";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created");
  });
});

// Create table
app.get("/createUserTable", (req, res) => {
  let sql =
    "CREATE TABLE users (id int AUTO_INCREMENT, fullname varchar(255), username varchar(255), password varchar(255), email varchar(255), dob varchar(255), primary key(id))";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Users table created");
  });
});

app.use(morgan("dev"));

// For serving files from public dir
app.use(express.static("public"));

// use application/json parser
app.use(bodyParser.json());

const users = [];

app.get("/", (req, res) => {
  res.render("index.html");
});

// POST /register
app.post("/register", async function(req, res) {
  console.log(users);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {
      fullname: req.body.fullname,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      dob: req.body.dob
    };
    users.push(user);
    res.contentType("application/json");
    let data = JSON.stringify("main.html");
    res.header("Content-Length", data.length);
    res.end(data);
    res.status(201).send();
  } catch {
    res.status(500).send();
    res.redirect("register.html");
  }
  console.log(users);
});

// POST /login
app.post("/login", async function(req, res) {
  console.log(users);
  const user = users.find(user => user.username === req.body.username);
  if (user == null) {
    return res.status(401).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.contentType("application/json");
      let data = JSON.stringify("main.html");
      res.header("Content-Length", data.length);
      res.end(data);
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
});

// Opening port
app.listen(port, function() {
  console.log(`Staring server at port ${port}`);
});
