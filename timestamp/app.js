var express = require("express")
var app = express()
// html stuff
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/now", (req, res, next) => {
  let time = new Date().toString()
  req.time = time
  next()
}, (req, res) => {
  res.json({"time": req.time})
})
// adds key, value pairs to ereq.params object
// url for, /:k1/v1/:k2/v2
app.get("/:word/echo", (req, res) => {
  let word = req.params.word
  res.json({"echo": word})
})

module.exports = app