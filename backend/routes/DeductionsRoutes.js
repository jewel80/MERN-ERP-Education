const express = require("express");
const DeductionsModel = require("../models/DeductionsModel");

const route = express.Router();



//create
route.post("/create", async (req, res) => {

    DeductionsModel.create(req.body)
        .then((doc) => {
            res.json({
                success: true,
                doc
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                error: err
            });
        });
});

module.exports = route;