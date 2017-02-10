var GitHubApi = require("github");

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
  token: "2a037ebc08fc1b0287059d3437e5625d75284e6a",
});

function getProjectGitHubPullRequestInfo(project, callback) {
  github.pullRequests.getAll({ state: "open", repo: project.gitHubRepo, owner: project.gitHubOwner }, function (err, data) {
    if (err) {
      callback(err);
    }

    callback(null, data);
  });
}



module.exports = {
  getProjectGitHubPullRequestInfo: getProjectGitHubPullRequestInfo
}