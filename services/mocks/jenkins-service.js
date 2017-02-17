var mockJenkinsBuildStatus = require('../../example-responses/jenkins-build-status.json');

function getJenkinsLatestBuildInfo(jenkinsEndpoint, jenkinsJobName, callback) {
  setTimeout(function () {
    callback(null, mockJenkinsBuildStatus);
  }, 250);
}

module.exports = {
  getJenkinsLatestBuildInfo: getJenkinsLatestBuildInfo
}