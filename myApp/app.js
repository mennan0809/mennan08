var express = require("express");
var path = require("path");
var app = express();
var session = require("express-session");

var includedPlaces = [
  "Paris",
  "Rome",
  "Santorini Island",
  "Inca Trail to Machu Picchu",
  "Bali Island",
  "Annapurna Circuit",
];

var links = ["paris", "rome", "santorini", "inca", "bali", "annapurna"];

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "anyrandomstring",
  })
);

var logged = {
  username: "",
  password: "",
  places: [],
};

var MongoClient = require("mongodb").MongoClient;

var user = null;

app.post("/", function (req, res) {
  var x = req.body.username.toLowerCase();
  var y = req.body.password;
  logged = {
    username: x,
    password: y,
    places: [],
  };
  if (x.toLowerCase() == "admin" && y == "admin") {
    res.render("home");
    req.session.loggedIn = true;
    req.session.user = "admin";
    req.session.save();
  } else {
    MongoClient.connect(
      "mongodb://localhost:27017",
      async function (err, client) {
        if (err) throw err;
        var db = client.db("myDB");
        const existUsername = await db.collection("myCollection").findOne({
          username: logged.username.toLowerCase(),
          password: logged.password,
        });
        if (existUsername) {
          user = await db.collection("myCollection").findOne({
            username: logged.username.toLowerCase(),
            password: logged.password,
          });
          logged.places = user.places;
          res.render("home");
          req.session.loggedIn = true;
          req.session.user = user;
          req.session.save();
        } else {
          res.render("login", { log: "Invalid Username/Password" });
        }
      }
    );
  }
});

app.post("/register", function (req, res) {
  var name = req.body.username.toLowerCase();
  var pass = req.body.password;
  var places = [];
  var data = {
    username: name,
    password: pass,
    places: places,
  };
  MongoClient.connect(
    "mongodb://localhost:27017",
    async function (err, client) {
      if (err) throw err;
      var db = client.db("myDB");
      const existUsername = await db
        .collection("myCollection")
        .findOne({ username: req.body.username.toLowerCase() });
      if (data.username == "" || data.password == "") {
        res.render("registration", { log: "Invalid Username/Password" });
      } else if (existUsername) {
        res.render("registration", { log: "Username Already Taken" });
      } else {
        db.collection("myCollection").insertOne(
          data,
          function (err, collection) {
            if (err) throw err;
          }
        );
        res.redirect("/");
      }
    }
  );
});

app.get("/", function (req, res) {
  res.render("login", { log: "" });
});

app.get("/home", function (req, res) {
  if (req.session.loggedIn) {
    res.render("home");
  } else res.redirect("/");
});

app.get("/registration", function (req, res) {
  res.render("registration", { log: "" });
});

app.get("/hiking", function (req, res) {
  if (req.session.loggedIn) {
    res.render("hiking");
  } else res.redirect("/");
});

app.get("/islands", function (req, res) {
  if (req.session.loggedIn) {
    res.render("islands");
  } else res.redirect("/");
});

app.get("/cities", function (req, res) {
  if (req.session.loggedIn) {
    res.render("cities");
  } else res.redirect("/");
});

app.get("/santorini", function (req, res) {
  if (req.session.loggedIn) {
    res.render("santorini");
  } else res.redirect("/");
});

app.post("/santorini", function (req, res) {
  if (req.session.user == "admin") {
  } else {
    var p = user.places;
    if (!p.includes("santorini")) p.push("santorini");
    req.session.user.places = p;
    req.session.save();
    MongoClient.connect(
      "mongodb://localhost:27017",
      async function (err, client) {
        client
          .db("myDB")
          .collection("myCollection")
          .updateOne(
            { username: req.session.user.username },
            { $set: { places: p } }
          );
      }
    );
  }
});

app.get("/bali", function (req, res) {
  if (req.session.loggedIn) {
    res.render("bali");
  } else res.redirect("/");
});

app.post("/bali", function (req, res) {
  if (req.session.user == "admin") {
  } else {
    var p = user.places;
    if (!p.includes("bali")) p.push("bali");
    req.session.user.places = p;
    req.session.save();
    MongoClient.connect(
      "mongodb://localhost:27017",
      async function (err, client) {
        client
          .db("MyDB")
          .collection("myCollection")
          .updateOne(
            { username: req.session.user.username },
            { $set: { places: p } }
          );
      }
    );
  }
});

app.get("/rome", function (req, res) {
  if (req.session.loggedIn) {
    res.render("rome");
  } else res.redirect("/");
});

app.post("/rome", function (req, res) {
  if (req.session.user == "admin") {
  } else {
    var p = user.places;
    if (!p.includes("rome")) p.push("rome");
    req.session.user.places = p;
    req.session.save();
    MongoClient.connect(
      "mongodb://localhost:27017",
      async function (err, client) {
        client
          .db("myDB")
          .collection("myCollection")
          .updateOne({ username: user.username }, { $set: { places: p } });
      }
    );
  }
});

app.get("/paris", function (req, res) {
  if (req.session.loggedIn) {
    res.render("paris");
  } else res.redirect("/");
});

app.post("/paris", function (req, res) {
  if (req.session.user == "admin") {
  } else {
    var p = user.places;
    if (!p.includes("paris")) p.push("paris");
    req.session.user.places = p;
    req.session.save();
    MongoClient.connect(
      "mongodb://localhost:27017",
      async function (err, client) {
        client
          .db("myDB")
          .collection("myCollection")
          .updateOne({ username: user.username }, { $set: { places: p } });
      }
    );
  }
});

app.get("/inca", function (req, res) {
  if (req.session.loggedIn) {
    res.render("inca");
  } else res.redirect("/");
});

app.post("/inca", function (req, res) {
  if (req.session.user == "admin") {
  } else {
    var p = user.places;
    if (!p.includes("inca")) p.push("inca");
    req.session.user.places = p;
    req.session.save();
    MongoClient.connect(
      "mongodb://localhost:27017",
      async function (err, client) {
        client
          .db("myDB")
          .collection("myCollection")
          .updateOne({ username: user.username }, { $set: { places: p } });
      }
    );
  }
});

app.get("/annapurna", function (req, res) {
  if (req.session.loggedIn) {
    res.render("annapurna");
  } else res.redirect("/");
});

app.post("/annapurna", function (req, res) {
  if (req.session.user == "admin") {
  } else {
    var p = user.places;
    if (!p.includes("annapurna")) p.push("annapurna");
    req.session.user.places = p;
    req.session.save();
    MongoClient.connect(
      "mongodb://localhost:27017",
      async function (err, client) {
        client
          .db("myDB")
          .collection("myCollection")
          .updateOne({ username: user.username }, { $set: { places: p } });
      }
    );
  }
});

app.get("/wanttogo", function (req, res) {
  if (req.session.user == "admin") {
    res.render("wanttogo", { places: [] });
  } else if (req.session.loggedIn) {
    res.render("wanttogo", { places: req.session.user.places });
  } else res.redirect("/");
});

app.get("/searchresults", function (req, res) {
  if (req.session.loggedIn) {
    res.render("searchresults", { results: [] });
  } else res.redirect("/");
});

app.get("/search", function (req, res) {
  if (req.session.loggedIn) {
    res.render("searchresults", { results: [] });
  } else res.redirect("/");
});

app.post("/search", function (req, res) {
  var searchword = req.body.Search;
  var found = [];
  for (var i = 0; i < 6; i++) {
    if (includedPlaces[i].toLowerCase().includes(searchword.toLowerCase()))
      found.push({ place: includedPlaces[i], link: links[i] });
  }
  if (found.length == 0)
    res.render("searchresults", {
      message: "No Destinations Found!",
      results: [],
    });
  else {
    res.render("searchresults", {
      message: "Destinations Found:",
      results: found,
    });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
