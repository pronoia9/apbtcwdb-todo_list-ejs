const express = require('express');
const bodyParser = require('body-parser');
//const https = require('https');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static("public"));

app.get("/", function(req, res) {
  var today = new Date();
  var currentDay = today.getDay();
  var day = "";

  if (currentDay === 6 || currentDay === 0) {
    day = "Weekend";
  } else {
    day = "Weekday";
  }
  res.render('list', {day: day});
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
