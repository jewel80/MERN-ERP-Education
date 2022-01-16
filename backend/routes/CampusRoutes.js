const express = require("express");
const CampusModel = require("../models/CampusesModel");

const route = express.Router();

//get all events
route.get("/", async (req, res) => {
    const docs = await CampusModel.find().sort({
        createdAt: "desc",
    });
    res.json(docs);
});

//search event by name

//get one by id
route.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send("Missing URL parameter: username");
    }
    await CampusModel.findOne({
            _id: req.params.id
        })
        .then((docs) => {
            if (docs) {
                return res.json({
                    success: true,
                    docs
                });
            } else {
                return res.json({
                    success: false,
                    error: "Does not exists"
                });
            }
        })
        .catch((err) => {
            return res.json({
                success: false,
                error: "Server error"
            });
        });
});

//create
route.post("/create", async (req, res) => {
    let body = req.body;

    //create id
    CampusModel.create(body)
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
                error: "something went wrong"
            });
        });
});

//edit
route.put("/update/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).send("Missing URL parameter: username");
    }
    CampusModel.findOneAndUpdate({
                _id: req.params.id,
            },
            req.body, {
                new: true,
            }
        )
        .then((doc) => {
            if (!doc) {
                return res.json({
                    success: false,
                    error: "does not exists"
                });
            }
            return res.json({
                success: true,
                doc
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                error: "Failed to edit"
            });
        });
});

//delete
route.delete("/delete/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).send("Missing URL parameter: username");
    }
    CampusModel.findOneAndRemove({
            _id: req.params.id,
        })
        .then((doc) => {
            res.json(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = route;