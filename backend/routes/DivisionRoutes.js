const express = require("express");
const DivisionModel = require("../models/DivisionModel");

const route = express.Router();

//get all events
route.get("/", async(req, res) => {
    const data =await DivisionModel.find().sort({
        createAt:"desc"
    })
    res.json(data)
})

//create
route.post("/create", async (req, res) => {

    DivisionModel.create(req.body)
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

//edit
route.put("/update/:id", (req, res) => {
    if (!req.params.id) {
      return res.status(400).send("Missing URL parameter: Division Name");
    }
    DivisionModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    ).then((doc) => {
        if (!doc) {
          return res.json({ success: false, error: "doex not exists" });
        }
        return res.json({ success: true, doc });
      })
      .catch((err) => {
        res.json({ success: false, message: err });
      });
  });
  
  route.delete("/delete/:id", (req, res) => {
    if (!req.params.id) {
      return res.status(400).send("Missing URL parameter: username");
    }
    DivisionModel.findOneAndRemove({
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