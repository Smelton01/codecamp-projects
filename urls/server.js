require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require("body-parser")
const URL =  require("url").URL
require('dotenv').config();
mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

app.use(bodyParser.urlencoded({extended: false}))

const urlSchema = mongoose.Schema({
  url: String,
  number: Number
})

let Urlz = mongoose.model("Urlz", urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// Generate random integer
const rando = (max) => {
  return Math.floor(Math.random()*max)
}

// Check if entered url is valid
const validate = (url) =>{
  try {
    let check = new URL(url)
    return (check.protocol.match(/^https?/) !== null)
  } catch (e) {
    console.log(e)
    return false
  }
}

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.route("/api/shorturl/:url?").get((req,res) => {
  let host = req.params.url
  let index = host.match(/\d+$/)[0]
  let doc = Urlz.findOne({"number": index} , (err,data) => {
    if (err || !data) {
      res.status(404).json({error: "URL not found"})
      return false
    }
    let result = data.url
    res.status(301).redirect(result)
  })
}).post((req, res) => {
  let host = req.body.url
  if (!host || !validate(host)) return res.status(400).json({error: "invalid url"})
 
  let id = rando(999)
  let update = {url: host, number: id}
  
  Urlz.findOneAndUpdate({url:host}, update, {
    new: true, 
    upsert: true,
    useFindAndModify: false
  }, (err, data) => {
    if(err) console.log(err)
    res.json({original_url: host, short_url: id})
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
