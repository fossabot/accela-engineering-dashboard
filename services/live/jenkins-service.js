var jenkinsapi = require('jenkins-api');

function getJenkinsLatestBuildInfo(jenkinsEndpoint, jenkinsJobName, callback) {
  var jenkins = jenkinsapi.init(jenkinsEndpoint, { strictSSL: false });

  return jenkins.last_build_info(jenkinsJobName, callback);
}

module.exports = {
  getJenkinsLatestBuildInfo: getJenkinsLatestBuildInfo
}