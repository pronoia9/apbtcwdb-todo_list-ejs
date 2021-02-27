const express = require('express');
const bodyParser = require('body-parser');
//const https = require('https');

const app = express();

//app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  var today = new Date();
  var currentDay = today.getDay();

  if (currentDay === 6 || currentDay === 0) {
    res.write("<h1>Yay it's the weekend!</h1>");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running...");
});
