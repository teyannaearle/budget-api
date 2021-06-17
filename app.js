//Dependencies
const transactionsController = require("./controllers/transactionsController")
const express = require("express");
const cors = require("cors")

const app = express();
// const cors = cors();

//___________________
//Middleware
//___________________

app.use(express.json()); // returns middleware that only parses JSON

// this allows any app/site from anywhere access your API. This is a great way to start to get things up and running. Later, add restrictions, as needed.
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Budgeting App - API");
});

app.use("/transactions", transactionsController)

app.get("*", (req, res) => {
  res.status(404).send("Page not Found")
})


module.exports = app