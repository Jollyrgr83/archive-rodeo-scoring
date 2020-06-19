const orm = require("../config/orm.js");

const model = {
    getAllFromOneTable: (table_name, cb) => {
        orm.selectAllFromOneTable(table_name, res => cb(res));
    },
    getAllCompetitorsByYear: (year, cb) => {
        orm.selectAllCompetitorsByYear(year, res => cb(res));
    },
    getOneCompetitorByID: (competitor_id, cb) => {
        orm.selectOneCompetitorByID(competitor_id, res => cb(res));
    },
    getTeamBooleanByTierID: (tier_id, cb) => {
        orm.selectTeamBooleanByTierID(tier_id, res => cb(res));
    },
    getAllYearSetupData: (year_id, cb) => {
        orm.selectAllYearSetupData(year_id, res => cb(res));
    },
    getCompetitorScores: (competitor_id, year_id, cb) => {
        orm.selectScoresByCompetitor(competitor_id, year_id, res => cb(res));
    },
    getScoreReconciliation: (year_id, cb) => {
        orm.selectAllScoreReconciliation(year_id, res => cb(res));
    },
    getAllTiersEventsByYearID: (year_id, cb) => {
        orm.selectAllTiersEventsByYearID(year_id, res => cb(res));
    },
    getAllScoresByYearID: (year_id, cb) => {
        orm.selectAllScoresByYearID(year_id, res => cb(res));
    },
    getAllNamesByYearID: (year_id, cb) => {
        orm.selectAllNamesByYearID(year_id, res => cb(res));
    },
    addCategory: (body, cb) => {
        orm.insertOneCategory(body, res => cb(res));
    },
    addEvent: (body, cb) => {
        orm.insertOneEvent(body, res => cb(res));
    },
    addTier: (body, cb) => {
        orm.insertOneTier(body, res => cb(res));
    },
    addCompetitor: (body, cb) => {
        orm.insertOneCompetitor(body, res => cb(res));
    },
    addScore: (body, cb) => {
        orm.insertOneScore(body, res => cb(res));
    },
    updateCategory: (body, cb) => {
        orm.updateOneCategory(body, res => cb(res));
    },
    updateCompetitor: (body, cb) => {
        orm.updateOneCompetitor(body, res => cb(res));
    },
    updateCompetitorScores: (arr, cb) => {
        orm.updateScoresByCompetitor(arr, res => cb(res));
    },
    deleteCategory: (body, cb) => {
        orm.deleteOneCategory(body, res => cb(res));
    },
    deleteEvent: (event_id, tier_id, year_id, cb) => {
        orm.deleteOneEvent(event_id, tier_id, year_id, res => cb(res));
    },
    deleteTier: (body, cb) => {
        orm.deleteOneTier(body, res => cb(res));
    },
    deleteCompetitor: (body, cb) => {
        orm.deleteOneCompetitor(body, res => cb(res));
    }
};

module.exports = model;