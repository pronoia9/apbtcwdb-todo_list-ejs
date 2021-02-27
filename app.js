const express = require('express');
const bodyParser = require('body-parser');
//const https = require('https');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static("public"));

app.get("/", function(req, res) {
  var today = new Date();
  var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  var day = today.toLocaleDateString("en-US", options);


  res.render('list', { day: day });
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
