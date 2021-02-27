const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');

const app = express();

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  let day = currentDate();
  res.render('list', { day: day, items: items });
});

app.post("/", function(req, res) {
  item = req.body.newItem;
  console.log("Post request received: '" + item + "'");
  if (item !== "") {
    items.push(item);
  }

  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));

function currentDate() {
  let today = new Date();
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  return today.toLocaleDateString("en-US", options);
}
