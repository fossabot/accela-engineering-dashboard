var liveGitHubService = require("./live/github-service");
var mockGitHubService = require("./mocks/github-service");
var config = require("../config/app.json");

module.exports = config.useMocks ? mockGitHubService : liveGitHubService;