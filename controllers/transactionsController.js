const express = require("express");
var moment = require("moment");

const transactions = express.Router();
const transactionsArray = require("../models/transaction");

const validateBody = (req, res, next) => {
  const { name, from, date, amount} = req.body;

  let result = moment(date, "YYYY-MM-DD", true).isValid();

  if (!name || !from || !date || !amount ) {
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
  // let copy = req.body
  // if (copy.negative){
  //   copy.amount = copy.amount * -1
  // }

  // if (!copy.id) {
  //   if (transactionsArray[0]) {
  //     let id = transactionsArray[transactionsArray.length - 1].id + 1;
  //     transactionsArray.push({ id: id, ...copy.body });
  //   } else {
  //     transactionsArray.push({ id: 0, ...copy.body });
  //   }
  // } else {
  //   transactionsArray.push(copy.body);
  // }
  if (req.body.negative){
    req.body.amount = req.body.amount * -1
  }


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
    if (req.body.negative){
      req.body.amount = req.body.amount * -1
    }
    transactionsArray[idx] = { id: transactionID, ...req.body};
    res.status(200).json(transactionsArray);
  } else {
    res.redirect("/404");
  }
});

module.exports = transactions;
