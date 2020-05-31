var orm = require("../config/orm.js");

var model = {
    allTiers: (cb) => {
        orm.selectAllTiers((res) => {
            cb(res);
        });
    }
    // yearAll: (year, cb) => {
    //     orm.selectAllYear(year, (res) => {
    //         cb(res);
    //     });
    // },
    // tierAll: (cb) => {
    //     orm.selectAllTiers((res) => {
    //         cb(res);
    //     });
    // },
    // addTier: (tierName, cb) => {
    //     orm.addOneTier(tierName, (res) => {
    //         cb(res);
    //     });
    // }
};

module.exports = model;