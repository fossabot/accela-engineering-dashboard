var mockBuilds = require('../../example-responses/vsts-build-statuses.json');
var mockPullRequests = require('../../example-responses/vsts-pull-requests.json');

function getBuildStatus(vstsProject, vstsBuild, callback) {
  setTimeout(function () {
    callback(null, mockBuilds);
  }, 250);
}

function getPullRequests(vstsProject, vstsRepo, callback) {
  setTimeout(function () {
    callback(null, mockPullRequests);
  }, 250);
}

module.exports = {
  getPullRequests: getPullRequests,
  getBuildStatus: getBuildStatus
};
