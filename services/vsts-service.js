var liveVstsService = require("./live/vsts-service");
var mockVstsService = require("./mocks/vsts-service");
var config = require("../config/app.json");

module.exports = config.useMocks ? mockVstsService : liveVstsService;