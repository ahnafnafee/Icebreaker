let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let morgan = require("morgan");
const bcrypt = require("bcrypt");
var mysql = require("mysql");
var mongo = require("mongodb");
let session = require("client-sessions");
var path = require("path");

let app = express();
const port = process.env.PORT || 8080;

let loggedUser = [];

app.use(
  session({
    username: "",
    cookieName: "session",
    secret: "asdfasdfasdf123",
    duration: 2 * 24 * 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

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
  let sql = "CREATE DATABASE IF NOT EXISTS icebreaker;";
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

    "CREATE TABLE IF NOT EXISTS users (id int not null AUTO_INCREMENT, fullname varchar(255) not null, username varchar(255) not null UNIQUE, password varchar(255) not null, email varchar(255) not null, dob varchar(255) not null, primary key (username))";

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
app.use(bodyParser.urlencoded({ extended: false }));

const users = [];

// GET /index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/About.html"));
});
app.get("/features", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/features.html"));
});
app.get("/contactus", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/contactus.html"));
});
// GET /rlogin
app.get("/rlogin", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/wronglogin.html"));
});

// GET /account
app.get("/account", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/userprofile.html"));
});

// GET /personalinfo
app.get("/personalinfo", (req, res) => {
  let sql = `select * from users where username = "${loggedUser[0]}"`;
  con.query(sql, async (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log("Username queried");
    res.type("application/json");
    res.send(result);
  });
});

// GET /register
app.get("/register", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/register.html"));
});

// POST /register
app.post("/register", async function(req, res, next) {
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
      console.log(users);
      loggedUser.push(req.body.username);
      return res.redirect("/main");
    });
  } catch {
    return res.redirect("/register");
  }
});

// GET /login
app.get("/login", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/login.html"));
});

// POST /login
app.post("/login", async function(req, res) {
  console.log(req.body);
  console.log("POST LOGIN CONN");
  console.log(users);
  let sql = `select * from users where username = "${req.body.username}"`;

  console.log(sql);

  con.query(sql, async (err, results) => {
    if (err) throw err;
    console.log(results);
    if (results === undefined || results.length == 0) {
      return res.redirect("/rlogin");
    }
    let username = results[0].username;
    let password = results[0].password;
    console.log(username);
    console.log(password);
    try {
      if (await bcrypt.compare(req.body.password, password)) {
        res.contentType("application/json");

        loggedUser.push(req.body.username);
         var sesh = req.body.username;
         req.session.username = sesh;
         req.session.msg = "You are logged in";
         console.log(req.session)
         console.log('START HERE' + sesh +'END HERE')
        return res.redirect("/main");

      } else {
        res.send("The email or password is incorrect");
        return res.redirect("/login");
      }
    } catch {
      res.status(500).send();
    }
  });
});

// GET /logout
app.get("/logout", function(req, res) {
  req.session.reset();
  loggedUser.pop();
  console.log("u be log out");
  req.session.msg = "You logged out";
  return res.redirect("/");
});

app.get("/main", function(req, res) {

  if(!req.session.username){
    req.session.msg = 'Please log in to gain access.';
    return res.redirect('/login');
  }

    res.sendFile(path.join(__dirname+'/public/main.html'));

});

app.get("/testsession", (req, res) => {
  console.log(req.session)
});


// Opening port
app.listen(port, function() {
  console.log(`Staring server at port ${port}`);
});
