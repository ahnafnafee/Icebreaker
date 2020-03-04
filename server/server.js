var express = require("express");
var bodyParser = require("body-parser");
var request = require('request');
var path = require("path");
var fs = require('fs');
var app = express();

var fs = require('fs');
var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded( { extended: false }))

app.listen(8080);

app.get("/", function(req, res) {
    res.sendFile("./index.html");
})