var express = require("express");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var apiRoutes = require("./controllers/api-controller.js");
var htmlRoutes = require("./controllers/html-controller.js");

app.use(apiRoutes);
app.use(htmlRoutes);

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});