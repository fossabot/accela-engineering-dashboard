var mockGitHubInfo = require('../../example-responses/github-pull-requests.json');

function getProjectGitHubPullRequestInfo(gitHubRepo, gitHubOwner, callback) {
  setTimeout(function () {
    callback(null, mockGitHubInfo);
  }, 250);
}

module.exports = {
  getProjectGitHubPullRequestInfo: getProjectGitHubPullRequestInfo
}