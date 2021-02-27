const express = require('express');
const bodyParser = require('body-parser');
//const https = require('https');

const app = express();

//app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  //res.sendFile(__dirname + "/index.html");
  res.write(weekend());
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running...");
});


function weekend () {
  var today = new Date();
  var currentDay = today.getDay();
  if (currentDay === 6 || currentDay === 0) {
    return "<h1>Yay it's the weekend!</h1>";
  }
  else {
    return "<h1>Boo! I have to work!</h1>";
  }
}
