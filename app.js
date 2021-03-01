/////////////////////////////////// MODULES ////////////////////////////////////
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const mongoose = require('mongoose');

const app = express();
////////////////////////////////////////////////////////////////////////////////


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


///////////////////////////////////  MONGODB  //////////////////////////////////
const db = "todoDB";
const url = "mongodb://localhost:27017/" + db;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Create schema
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name missing! Please enter some text."]
  }
});

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "List name missing! Please enter some text."]
  },
  items: [itemsSchema]
});

// Create model based on schema
const Item = mongoose.model('item', itemsSchema);
const List = mongoose.model('list', listSchema);
////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////  /  /////////////////////////////////////
app.get("/", function(req, res) {
  // get the list of items from the database
  Item.find({}, function(err, items) {
    try {
      // if the database is empty, fill it with default documents
      if (items.length === 0) {
        initDefaultList();
        res.redirect("/");
      }
      else {
        res.render('list', { listTitle: "Today", items: items });
      }
    } catch (e) { console.log("** ERROR IN APP.GET('/') **" + e); }
  });
});

app.post("/", function(req, res) {
  const newItem = req.body.newItem;
  const listName = req.body.list;

  try {
    // get new item from user
    const item = new Item ({
      name: newItem
    });

    if (listName === "Today") {
      // add the new item to the collection
      item.save().then(() => console.log("Successfully added an item to the default list: '" + item.name + "'"));

      res.redirect("/");
    }
    else {
      List.findOne({ name: listName }, function(err, list) {
        list.items.push(item);
        list.save();
        res.redirect("/" + listName);
      });
    }
  } catch (e) { console.log("** ERROR IN APP.POST('/') **" + e); }
});
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////  DELETE  ///////////////////////////////////
app.post("/delete", function(req, res) {
  const checkedItem = req.body.id;
  const listName = req.body.list;

  try {
    if (listName === "Today") {
      Item.findByIdAndDelete(checkedItem, function(err) {
        if (!err) {
          console.log("Successfully removed an item from the default list: '" + checkedItem + "'");
          res.redirect("/");
        }
      });
    }
    else {
      List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItem } } }, function(err, list) {
        if (!err) {
          console.log("Successfully removed an item from the list" + listName + ": '" + checkedItem + "'");
          res.redirect("/" + listName);
        }
      });
    }
  } catch (e) { console.log("** ERROR IN APP.POST('/DELETE') **" + e); }
});
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////  :/CUSTOMLIST  ////////////////////////////////
app.get("/:customList", function(req, res) {
  const customList = req.params.customList;

  // Look for an existing document
  List.findOne({ name: customList }, function(err, list) {
    if (!err) {
      if (!list) {
        // If there are no previous lists, create a new list
        const list = new List ({
          name: customList,
          items: getStartingListItems()
        });
        list.save();
        res.redirect("/" + customList);
      }
      else {
        // Show the existing list
        res.render('list', { listTitle: customList, items: list.items });
      }
    }
    else {
      console.log("** ERROR IN APP.GET('/:CUSTOMLIST') **" + err);
      res.redirect("/");
    }
  });
});
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////  ABOUT  ///////////////////////////////////
app.get("/about", function(req, res) {
  res.render('about');
});
////////////////////////////////////////////////////////////////////////////////


app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));


//////////////////////////////////  FUNCTIONS  /////////////////////////////////
function getStartingListItems() {
  // Create default documents
  const item1 = new Item({
    name: "Welcome to your ToDo List!"
  });
  const item2 = new Item({
    name: "Hit the + button to add a new item."
  });
  const item3 = new Item({
    name: "<-- Hit the checkbox to delete an item."
  });
  return [item1, item2, item3];
}

function initDefaultList() {
  // Insert default itemsSchema
  Item.insertMany(getStartingListItems(), function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully added default items to the list.");
    }
  });
}
////////////////////////////////////////////////////////////////////////////////
