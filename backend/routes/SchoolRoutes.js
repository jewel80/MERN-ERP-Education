const express = require("express");
const SchoolModel = require("../models/SchoolModel");
const bcrypt = require("bcrypt");
const { login, changePassword } = require("../middlewares/validate");
const { role } = require("../middlewares/variables");

const route = express.Router();

//find user by id
route.get("/", async (req, res) => {
  await SchoolModel.findOne({ role: role.Admin })
    .then((user) => {
      if (user) {
        return res.json(user);
      } else {
        return res.json({ success: false, error: "User does not exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ success: false, error: "WRONG error" });
    });
});



module.exports = route;
