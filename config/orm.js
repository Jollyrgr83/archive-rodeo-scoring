var connection = require("../config/connection.js");

var orm = {
    selectAllTiers: (cb) => {
        var queryString = `SELECT * FROM tiers;`;
        connection.query(queryString, (err, result) => {
            if (err) throw err;
            cb(result);
        });
    },
    selectAllView: (tableName, cb) => {
        var queryString = `SELECT * FROM ${tableName};`;
        connection.query(queryString, (err, result) => {
            if (err) throw err;
            cb(result);
        });
    },
    addOneView: (body, cb) => {
        if (body.titleName === "Years") {
            var queryString = `INSERT INTO ${body.titleName.toLowerCase()} (type, value) VALUES ("year", ${parseInt(body.itemName)});`;
        }
        else if (body.titleName === "Tiers") {
            var queryString = `INSERT INTO ${body.titleName.toLowerCase()} (name, team) VALUES ('${body.itemName}', ${body.teamStatus});`;
        }
        else {
            var queryString = `INSERT INTO ${body.titleName.toLowerCase()} (name) VALUES ('${body.itemName}');`;
        }
        connection.query(queryString, (err, result) => {
            if (err) throw err;
            cb(result);
        });
    },
    deleteOneView: (body, cb) => {
        var queryString = `DELETE FROM ${body.titleName.toLowerCase()} WHERE id = ${body.id};`;
        connection.query(queryString, (err, result) => {
            if (err) throw err;
            cb(result);
        });
    }
};

module.exports = orm;