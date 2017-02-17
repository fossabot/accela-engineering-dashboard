var express = require('express');
var _ = require('lodash');
var jenkins = require('../../services/jenkins-service');
var vsts = require('../../services/vsts-service');
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
          return res.status(500).send(JSON.stringify(err));
        }

        let status = {
          status: data.result === 'SUCCESS' ? 'passing' : 'failing',
          runDate: new Date(data.timestamp),
          duration: data.duration,
          id: buildId
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

    case "vsts":
      
      vsts.getBuildStatus(build.vstsProject, build.vstsBuild, (err, data) => {
        if (err) {
          console.log(err);
          res.send(JSON.stringify({}));
          return;
        }
        
        let status = {
          status: data.status,
          runDate: data.runDate,
          duration: data.duration,
          id: buildId,
          changes: data.changes
        };

        res.send(JSON.stringify(status));
      });
      break;
    default:
      return next({
        message: "Unknown build type"
      });

  }
});

module.exports = router;