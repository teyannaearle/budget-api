const express = require("express")
const transactions = express.Router()
const transactionsArray = require ("../models/transaction")

// const transactionIdNumber = 0
// let testNum = 0

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

transactions.post("/", (req, res) => {
    // testNum += 1
    // let body = {...req.body, id: testNum}
    transactionsArray.push(req.body)


    // res.status(200).json(transactionsArray)
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