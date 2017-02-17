var liveVstsService = require("./live/vsts-service");
var mockVstsService = require("./mocks/vsts-service");
var config = require("../config/app.json");

let hasProperConfig = !!process.env.VSTS_URI && !!process.env.VSTS_KEY;

if (!hasProperConfig) {
  console.log("You need the proper VSTS keys. Using mock data for now");
}

module.exports = config.useMocks || !hasProperConfig ? mockVstsService : liveVstsService;