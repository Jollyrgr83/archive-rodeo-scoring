var express = require("express");
var router = express.Router();

var model = require("../models/model.js");

router.get("/", (req, res) => {
    res.render("index", {title: "Annual Lineworkers Rodeo Scoring"});
});

router.get("/view", (req, res) => {
    res.render("view", {title: "View/Edit Database Options"});
});

router.get("/year", (req, res) => {
    let hbsYearObj = {arrays: [{title: "Year Setup", years: [], tiers: []}]};
    model.getAllFromOneTable("years", (data) => {
        hbsYearObj.arrays[0].years = [...data];
        model.getAllFromOneTable("tiers", (data) => {
            hbsYearObj.arrays[0].tiers = [...data];
            res.render("year", hbsYearObj);
        });
    });
});

router.get("/competitors", (req, res) => {
    let hbsYearObj = {arrays: [{title: "Add/Edit Competitors", years: [], tiers: []}]};
    model.getAllFromOneTable("years", (data) => {
        hbsYearObj.arrays[0].years = [...data];
        model.getAllFromOneTable("tiers", (data) => {
            hbsYearObj.arrays[0].tiers = [...data];
            res.render("competitors", hbsYearObj);
        });
    });
});

router.get("/score", (req, res) => {
    let hbsYearObj = {arrays: [{title: "Score Entry", years: [], tiers: []}]};
    model.getAllFromOneTable("years", (data) => {
        hbsYearObj.arrays[0].years = [...data];
        model.getAllFromOneTable("tiers", (data) => {
            hbsYearObj.arrays[0].tiers = [...data];
            res.render("score", hbsYearObj);
        });
    });
});

router.get("/reports", (req, res) => {
    let hbsYearObj = {arrays: [{title: "View/Print Reports", years: [], tiers: []}]};
    model.getAllFromOneTable("years", (data) => {
        hbsYearObj.arrays[0].years = [...data];
        model.getAllFromOneTable("tiers", (data) => {
            hbsYearObj.arrays[0].tiers = [...data];
            res.render("reports", hbsYearObj);
        });
    });
});

module.exports = router;