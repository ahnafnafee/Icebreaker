let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");
let morgan = require("morgan");
let bcrypt = require("bcrypt");
let mysql = require("mysql");
let session = require("client-sessions");
let path = require("path");
let fs = require("fs");
let multer = require("multer");

let app = express();
const port = process.env.PORT || 8080;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  },
  fileFilter: fileFilter
});

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

// Create table users
app.get("/createusertable", (req, res) => {
  let sql =
    "CREATE TABLE IF NOT EXISTS users (fullname varchar(255) not null, username varchar(255) not null UNIQUE, password varchar(255) not null, email varchar(255) not null, dob varchar(255) not null, primary key (username))";

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Users table created");
  });
});

// Create table users
app.get("/createuserinfotable", (req, res) => {
  let sql =
    "CREATE TABLE IF NOT EXISTS userinfo (username varchar(255) not null UNIQUE, userdesc varchar(255), userdp varchar(255) not null, primary key (username))";

  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("UserInfo table created");
  });
});

app.use(morgan("dev"));

// For serving files from public dir
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// use application/json parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = [];

app.post("/tests", upload.array("imgArr", 5), (req, res, next) => {
  const files = req.files;

  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  for (var i = 0; i < files.length; i++) {
    let img = fs.readFileSync(req.files[i].path);
    let encode_img = img.toString("base64");
    var finalImg = {
      contentType: req.files[i].mimetype,
      path: req.files[i].path,
      image: new Buffer(encode_img, "base64")
    };
    console.log(req.files[i]);
  }

  console.log(req);
  console.log(req.files);
  console.log(req.body);
});

// userdp:: req.file.path

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
  if (!req.session.username) {
    req.session.msg = "Please log in to gain access.";
    return res.redirect("/login");
  }
  res.sendFile(path.join(__dirname + "/public/userprofile.html"));
});

// GET /personalinfo
app.get("/personalinfo", (req, res) => {
  let sql = `select * from users where username = "${req.session.username}"`;
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
      let sesh = req.body.username;
      req.session.username = sesh;
      req.session.msg = "You are logged in";
      console.log(users);
      return res.redirect("/register2");
    });
  } catch {
    return res.redirect("/register");
  }
});

// GET /register2
app.get("/register2", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/regfinish.html"));
});

// POST /reg1
app.post("/reg1", upload.single("userDp"), (req, res, next) => {
  console.log(req);
  console.log(req.file);
  console.log(req.body);
  let sesh = req.session.username;
  console.log(sesh);

  let sql = `insert into userinfo (username, userdesc, userdp) values ("${sesh}", "${req.body.userDesc}", "/uploads/${req.file.filename}")`;

  con.query(sql, async (err, results) => {
    if (err) throw err;
    console.log(results);
    console.log(1);
    if (results === undefined || results.length == 0) {
      console.log(2);
      return res.redirect("/");
    }
    console.log(3);
    return res.redirect("/main");
  });
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

        let sesh = req.body.username;
        req.session.username = sesh;
        req.session.msg = "You are logged in";
        console.log(req.session);
        console.log("START HERE" + sesh + "END HERE");
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
  req.session.msg = "User logged out";
  return res.redirect("/");
});

// GET /main
app.get("/main", function(req, res) {
  console.log(req.session.username);
  if (!req.session.username) {
    req.session.msg = "User needs to be logged in";
    return res.redirect("/login");
  }

  res.sendFile(path.join(__dirname + "/public/main.html"));
});

app.get("/testsession", (req, res, next) => {
  console.log(req.session);
  next();
});

// Opening port
app.listen(port, function() {
  console.log(`Staring server at port ${port}`);
});
