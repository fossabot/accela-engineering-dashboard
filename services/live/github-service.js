var GitHubApi = require("github");
var config = require("../../config/app.json");

var github = new GitHubApi({
  debug: false,
  protocol: "https",
  host: "api.github.com",
  Promise: require('bluebird'),
  followRedirects: false,
  timeout: 5000
});

github.authenticate({
  type: "token",
  token: config.gitHubTokenPre + config.gitHubTokenPost,
});

function getProjectGitHubPullRequestInfo(gitHubRepo, gitHubOwner, callback) {
  github.pullRequests.getAll({ state: "open", repo: gitHubRepo, owner: gitHubOwner }, callback);
}

module.exports = {
  getProjectGitHubPullRequestInfo: getProjectGitHubPullRequestInfo
}