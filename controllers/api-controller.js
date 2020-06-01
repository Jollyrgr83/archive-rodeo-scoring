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