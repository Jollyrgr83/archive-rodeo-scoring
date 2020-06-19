const express = require("express");
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 8080;
const app = express();
const apiRoutes = require("./controllers/api-controller.js");
const htmlRoutes = require("./controllers/html-controller.js");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(apiRoutes);
app.use(htmlRoutes);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});
