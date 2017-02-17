var express = require('express');
var _ = require('lodash');
var jenkins = require('../../services/jenkins-service');
var projects = require('../../config/projects.json').projects;
var router = express.Router();

router.get('/:buildId', function (req, res, next) {
  let buildId = parseInt(req.params.buildId, 10);
  let project = _.filter(projects, { builds: [{ id: buildId }] })[0];
  let build = project.builds.find(x => x.id === buildId);

  switch (build.type) {
    case 'jenkins':
      jenkins.getJenkinsLatestBuildInfo(build.jenkinsEndpoint, build.jenkinsJobName, function (err, data) {
        if (err) {
          return next(err)
        }

        let status = {
          status: data.result === 'SUCCESS' ? 'passing' : 'failing',
          runDate: new Date(data.timestamp),
          duration: data.duration,
          id: parseInt(req.params.buildId, 10)
        };

        if (data.changeSet && data.changeSet.items) {
          status.changes = data.changeSet.items.map(
            x => {
              return {
                comment: x.comment,
                commitId: x.commitId
              };
            }
          )
        }

        // if you want to attach all of the build data to the response object
        // status.buildInfo = data;

        res.send(JSON.stringify(status));
      });
      break;

    default:
      return next(err)

  }
});

module.exports = router;