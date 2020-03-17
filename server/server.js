let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let morgan = require("morgan");
const bcrypt = require("bcrypt");
var mysql = require("mysql");
var mongo = require("mongodb");
let session = require("client-sessions");

let app = express();
const port = process.env.PORT || 8080;

app.use(session({
  cookieName: "session",
  secret: 'asdfasdfasdf123',
  duration: 15*60*1000,
  activeDuration: 5*60*1000,
}));

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

// Delete DB
app.get("/deletedb", (req, res) => {
  let sql = "DROP DATABASE icebreaker";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database deleted");
  });
});

// Create table users
app.get("/createusertable", (req, res) => {
  let sql =
    "CREATE TABLE users (id int not null AUTO_INCREMENT, fullname varchar(255) not null, username varchar(255) not null, password varchar(255) not null, email varchar(255) not null, dob varchar(255) not null, primary key (id))";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Users table created");
  });
});

// Drop table users
app.get("/deleteusertable", (req, res) => {
  let sql = "DROP TABLE users";
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Users table deleted");
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
    let sql = `insert into users (fullname, username, password, email, dob) values ("${req.body.fullname}", "${req.body.username}", "${hashedPassword}", "${req.body.email}", "${req.body.dob}")`;
    con.query(sql, async (err, result) => {
      if (err) throw err;
      console.log(result);
      console.log("User added");
    });

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
  let sql = `select * from users where username = "${req.body.username}"`;

  console.log(sql);

  con.query(sql, async (err, results) => {
    if (err) throw err;
    console.log(results);
    if (results === undefined || results.length == 0) {
      return res.status(401).send("Cannot find user");
    }
    let username = results[0].username;
    let password = results[0].password;
    console.log(username);
    console.log(password);
    try {
      if (await bcrypt.compare(req.body.password, password)) {
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
});

// Opening port
app.listen(port, function() {
  console.log(`Staring server at port ${port}`);
});
