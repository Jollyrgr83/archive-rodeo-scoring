var express = require("express");
var router = express.Router();

var model = require("../models/model.js");

router.get("/api/tier", (req, res) => {
    model.allTiers((data) => {
        res.json({tiers: data});
    });
});

router.get("/api/view/:tableName", (req, res) => {
    console.log("tableName", req.params.tableName);
    model.allView(req.params.tableName, (data) => {
        console.log("data", data);
        if (data[0].value) {
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].type === "year") {
                    arr.push({
                        id: data[i].id,
                        name: data[i].value
                    });
                }
            }
            res.json({data: arr});
        }
        else {
            res.json({data: data});
        }
    });
});

router.post("/api/view/", (req, res) => {
    console.log("view POST body: ", req.body);
    model.addView(req.body, (data) => {
        console.log("data", data);
        console.log("data.insertId", data.insertId);
        res.json(data);
    });
});

router.delete("/api/view/", (req, res) => {
    console.log("view DELETE body: ", req.body);
    model.deleteView(req.body, (data) => {
        console.log("data", data);
        res.json(data);
    });
});

// router.get("/", (req, res) => {
//     res.render("index");
// });

// router.get("/year-setup", (req, res) => {
//     model.tierAll((data) => {
//         console.log("data", data);
//         var hbs = {
//             tiers: data
//         };
//         console.log("hbs", hbs);
//         res.render("year-setup", hbs);
//     });
// });

// router.get("/api/year-setup", (req, res) => {
//     model.tierAll((data) => {
//         console.log("data", data);
//         res.json({tiers: data});
//     });
// });

// router.get("/competitor-entry", (req, res) => {
//     model.tierAll((data) => {
//         console.log("data", data);
//         var hbs = {
//             tiers: data
//         };
//         console.log("hbs", hbs);
//         res.render("competitor-entry", hbs);
//     });
// });

// router.get("/score-entry", (req, res) => {
//     // get competitor info for top box and pre-fill event score info if available
//     res.render("score-entry");
// });

// router.get("/reports", (req, res) => {
//     res.render("reports");
// });

// router.get("/instructions", (req, res) => {
//     res.render("instructions");
// });

// router.post("/api/year-setup", (req, res) => {
//     if (req.body.tier != "" && req.body.tier != undefined) {
//         model.addTier(req.body.tier, (data) => {
//             console.log("Tier added: ", data);
//         });
//     }
//     if (isNaN(parseInt(req.body.year))) {
//         return;
//     }
//     else {
//         let dataObj = {
//             year: parseInt(req.body.year),
//             all: []
//         };
//         model.yearAll(dataObj.year, (allData) => {
//             console.log("allData", allData);
//             dataObj.all = [...allData];
//             res.send(dataObj);
//         });
//     }
// });

// router.post("/api/year-setup/add-tier", (req, res) => {
//         let dataObj = {
//             year: parseInt(req.body.year),
//             all: []
//         };
//         model.yearAll(dataObj.year, (allData) => {
//             console.log("allData", allData);
//             dataObj.all = [...allData];
//             res.send(dataObj);
//         });
// });

// router.post("/api/", (req, res) => {
//     model.add(req.body.name, (result) => {
//         res.json({ id: result.insertId });
//     });
// });

// router.put("/api/", (req, res) => {
//     model.update(req.body.id, (result) => {
//         if (result.changedRows === 0) {
//             return res.status(404).end();
//         }
//         else {
//             res.status(200).end();
//         }
//     });
// });

// router.delete("/api/", (req, res) => {
//     console.log("req.body", req.body);
//     model.delete(req.body.id, (result) => {
//         console.log("result", result);
//         if (result.affectedRows === 0) {
//             return res.status(404).end();
//         }
//         else {
//             res.status(200).end();
//         }
//     });
// });

module.exports = router;