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
    required: [true, "Item name missing! Please enter some text."]
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
      } else {
        res.render('list', { listTitle: "Today", items: items });
      }
    } catch (e) { console.log("** ERROR IN APP.GET('/') **" + e); }
  });
});

app.post("/", function(req, res) {
  try {
    // get new item from user
    const item = new Item ({
      name: req.body.newItem
    });

    // add the new item to the collection
    item.save().then(() => console.log("Successfully added an item:   '" + item.name + "'"));

    res.redirect("/");
  } catch (e) { console.log("** ERROR IN APP.POST('/') **" + e); }
});
////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////  DELETE  ///////////////////////////////////
app.post("/delete", function(req, res) {
  // get the _id of the item
  const checkedItem = req.body.checkbox;

  Item.findByIdAndDelete(checkedItem, function(err) {
    if (err) {
      console.log("** ERROR IN APP.POST('/DELETE') **" + err);
    }
    else {
      console.log("Successfully removed an item: '" + checkedItem + "'");
    }
    res.redirect("/");
  });
});
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////  :/CUSTOMLIST  ////////////////////////////////
app.get("/:customList", function(req, res) {
  const customList = req.params.customList;

  //initCustomList(customList);
  List.findOne({name: customList}, function(err, list) {
    if (!err) {
      if (!list) {
        console.log("List '" + customList + "' does not exist!");

        // Create a new list
        const list = new List ({
          name: customList,
          items: getLoremIpsumListItems()
        });
        list.save();
        res.redirect("/" + customList);
      }
      else {
        console.log("List '" + customList + "' found!");

        // Show an existing list
        res.render('list', { listTitle: customList, items: list.items });
      }
    }
    else {
      console.log("** ERROR IN APP.GET('/:CUSTOMLIST') **" + err);
      res.redirect("/");
    }
  });
});

app.post("/:customList", function(req, res) {
  // let item = req.body.newItem;
  // if (item !== "") {
  //   workItems.push(item);
  // }
  //
  // res.redirect("/work");
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

function getLoremIpsumListItems() {
  // Create default documents
  const item1 = new Item({
    name: "Lorem ipsum dolor sit amet"
  });
  const item2 = new Item({
    name: "Consectetur adipiscing elit"
  });
  const item3 = new Item({
    name: "Duis id erat congue"
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

function initCustomList(customName) {
  const list = new List ({
    name: customName,
    items: getLoremIpsumListItems()
  });
  list.save();

  // List.findOne({name: customList}, function(err, list) {
  //   if (!err) {
  //     if (!list) {
  //       console.log("List '" + customList + "' does not exist!");
  //
  //       // Create a new list
  //       const list = new List ({
  //         name: customList,
  //         items: getLoremIpsumListItems()
  //       });
  //       list.save();
  //     }
  //     else {
  //       console.log("List '" + customList + "' found!");
  //
  //       // Show an existing list
  //       res.render('list', { listTitle: customList, items: list.items });
  //     }
  //   }
  //   else {
  //     console.log("** ERROR IN APP.GET('/:CUSTOMLIST') **" + err);
  //     res.redirect("/");
  //   }
  // });
}
////////////////////////////////////////////////////////////////////////////////
