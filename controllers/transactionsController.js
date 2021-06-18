const express = require("express")
var moment = require('moment');

var uuid = require('uuid')

const transactions = express.Router()
const transactionsArray = require ("../models/transaction")


const validateBody = (req, res, next) => {
    const { name, from, date, amount} = req.body
    
    let result = moment(date, 'YYYY-MM-DD',true).isValid();

    if (!name || !from || !date || !amount ) {
        res.status(400).send()
    } else if (result){
        next()
    } else {
        res.status(400).send()
    }

}

transactions.get("/" , (req, res) => {
    res.status(200).json(transactionsArray)
})

transactions.get("/:id", (req,res) => {
    const { id } = req.params
    const matchesID = (transaction) => transaction.id === Number(id)
    const idx = transactionsArray.findIndex(matchesID)

    if (idx >= 0){
        res.status(200).json(transactionsArray[idx])
    } else {
        res.redirect("/404")
    }

})

transactions.post("/", validateBody, (req, res) => {
    if (!req.body.id){
        let id = uuid.v4()
        transactionsArray.push({id: id, ...req.body})
    } else {
        transactionsArray.push(req.body)
    }
    
    res.json(transactionsArray[transactionsArray.length -1])
})

transactions.delete("/:id", (req, res) => {
    const { id } = req.params
    const matchesID = (transaction) => transaction.id === Number(id)
    const idx = transactionsArray.findIndex(matchesID)

    if (idx >= 0){
        transactionsArray.splice(idx,1)
        res.status(200).json(transactionsArray)
    } else {
        res.redirect("/404")
    }
})

transactions.put("/:id", (req, res) => {
    const { id } = req.params
    const matchesID = (transaction) => transaction.id === Number(id)
    const idx = transactionsArray.findIndex(matchesID)

    if (idx >=0){
        const transactionID = transactionsArray[idx].id
        transactionsArray[idx] = {...req.body, id: transactionID}
        res.status(200).json(transactionsArray)
    } else {
        res.redirect("/404")
    }

})

module.exports = transactions