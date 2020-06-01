var orm = require("../config/orm.js");

var model = {
    allTiers: (cb) => {
        orm.selectAllTiers((res) => {
            cb(res);
        });
    },
    allView: (tableName, cb) => {
        orm.selectAllView(tableName, (res) => {
            cb(res);
        });
    },
    addView: (body, cb) => {
        orm.addOneView(body, (res) => {
            cb(res);
        });
    },
    deleteView: (body, cb) => {
        orm.deleteOneView(body, (res) => {
            cb(res);
        });
    }
};

module.exports = model;