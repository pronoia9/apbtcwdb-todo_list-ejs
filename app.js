/////////////////////////////////// MODULES ////////////////////////////////////
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');

const date = require(__dirname + '/date.js');

const app = express();
////////////////////////////////////////////////////////////////////////////////


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


///////////./////////////////////////// / //////////////////////////////////////
app.get("/", function(req, res) {
  res.render('list', { listTitle: date.getDate(), items: items });
});

app.post("/", function(req, res) {
  item = req.body.newItem;
  console.log("Post request received: '" + item + "'");

  if (item !== "") {
    if (req.body.list === "Work") {
      workItems.push(item);
      res.redirect("/work");
    }
    else {
      items.push(item);
      res.redirect("/");
    }
  }
});
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////// WORK /////////////////////////////////////
app.get("/work", function(req, res) {
  res.render('list', { listTitle: "Work List", items: workItems });
});

app.post("/work", function(req, res) {
  let item = req.body.newItem;
  if (item !== "") {
    workItems.push(item);
  }

  res.redirect("/work");
});
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////// ABOUT ////////////////////////////////////
app.get("/about", function(req, res) {
  res.render('about');
});
////////////////////////////////////////////////////////////////////////////////


app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
