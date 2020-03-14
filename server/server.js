let express = require("express");
let bodyParser = require("body-parser");
let request = require('request');
let path = require("path");
let fs = require('fs');
let app = express();
const port = process.env.PORT || 8080;

// For serving files from public dir
app.use(express.static("public"));

// Using body-parser middleware
app.use(bodyParser.json());

// Opening port
app.listen(port, function () {
    console.log(`Staring server at port ${port}`);
});

app.get("/", function(req, res) {
    res.sendFile("./index.html");
})