var jenkinsapi = require('jenkins-api');

function getJenkinsLatestBuildInfo(project, callback) {
  var jenkins = jenkinsapi.init(project.jenkinsEndpoint, { strictSSL: false });

  return jenkins.last_build_info(project.jenkinsJobName, function (err, data) {
    if (err) {
      console.log(err);
    }

    return callback(null, data);
  });
}

module.exports = {
  getJenkinsLatestBuildInfo: getJenkinsLatestBuildInfo
}