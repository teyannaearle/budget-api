const express = require("express");
var moment = require("moment");

const transactions = express.Router();
const transactionsArray = require("../models/transaction");

const validateBody = (req, res, next) => {
  const { name, from, date, amount} = req.body;

  let result = moment(date, "YYYY-MM-DD", true).isValid();

  if (!name || !from || !date || !amount || amount < 0 ) {
    res.status(400).send();
  } else if (result) {
    next();
  } else {
    res.status(400).send();
  }
};

transactions.get("/", (req, res) => {
  res.status(200).json(transactionsArray);
});

transactions.get("/sum", (req, res) => {
  let sum = 0
  for (let transaction of transactionsArray){
    if (transaction.negative){
      sum += (transaction.amount * -1)
    } else {
      sum += (transaction.amount)
    }
  }
  res.status(200).json(sum);
});

transactions.get("/:id", (req, res) => {
  const { id } = req.params;
  const matchesID = (transaction) => transaction.id === Number(id);
  const idx = transactionsArray.findIndex(matchesID);

  if (idx >= 0) {
    res.status(200).json(transactionsArray[idx]);
  } else {
    res.redirect("/404");
  }
});


transactions.post("/", validateBody, (req, res) => {
  if (!req.body.id) {
    if (transactionsArray[0]) {
  
      let id = transactionsArray[transactionsArray.length - 1].id + 1;
      transactionsArray.push({ id: id, ...req.body });
    } else {

      transactionsArray.push({ id: 0, ...req.body });
    }
  } else {

    transactionsArray.push(req.body);
  }

  res.json(transactionsArray[transactionsArray.length - 1]);
});

transactions.delete("/:id", (req, res) => {
  const { id } = req.params;
  const matchesID = (transaction) => transaction.id === Number(id);
  const idx = transactionsArray.findIndex(matchesID);

  if (idx >= 0) {
    transactionsArray.splice(idx, 1);
    res.status(200).json(transactionsArray);
  } else {
    res.redirect("/404");
  }
});

transactions.put("/:id", (req, res) => {
  const { id } = req.params;
  const matchesID = (transaction) => transaction.id === Number(id);
  const idx = transactionsArray.findIndex(matchesID);

  if (idx >= 0) {
    const transactionID = transactionsArray[idx].id;
    transactionsArray[idx] = { id: transactionID, ...req.body};
    res.status(200).json(transactionsArray);
  } else {
    res.redirect("/404");
  }
});

module.exports = transactions;
