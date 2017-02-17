var liveJenkinsService = require("./live/jenkins-service");
var mockJenkinsService = require("./mocks/jenkins-service");
var config = require("../config/app.json");

module.exports = config.useMocks ? mockJenkinsService : liveJenkinsService;