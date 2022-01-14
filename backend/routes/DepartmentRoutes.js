const express = require("express");
const DepartmentsModel = require("../models/DepartmentsModel");
const {
    stringtoLowerCase
} = require("../middlewares/utils");
const route = express.Router();


//Get
route.get("/", async(req, res) => {
    const data =await DepartmentsModel.find().sort({
        createAt:"desc"
    })
    res.json(data)
})

//create
route.post("/create", async(req, res) => {
    let body = req.body;

    let code = stringtoLowerCase(body.name);

    const departExist = await DepartmentsModel.findOne({
        code: code,
    });
    if (departExist) {
        return res.json({
            success: false,
            error: "Department already exist"
        });
    }

    DepartmentsModel.create({
            ...body,
            code: code,
        })
        .then((doc) => {
            console.log(doc);
            res.json({
                success: true,
                doc
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: false,
                message: "failed"
            });
        });
});


module.exports = route;