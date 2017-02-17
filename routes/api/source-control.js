var express = require('express');
var github = require('../../services/github-service');
var projects = require('../../config/projects.json').projects;
var router = express.Router();

router.get('/:projectId', function (req, res, next) {
  let projectId = parseInt(req.params.projectId, 10);
  let project = projects.find(x => x.id === projectId);
  let sourceControl = project.sourceControl;

  switch (sourceControl.type) {
    case 'github':
      github.getProjectGitHubPullRequestInfo(sourceControl.gitHubRepo, sourceControl.gitHubOwner, function (err, data) {
        if (err) {
          res.send(JSON.stringify({}));
          console.log(err);
          return;
        }

        let result = {
          projectId: projectId,
          numberOfPullRequests: data.length
        };

        // if you want to attach all of the github data to the response object
        // result.githubstuff = data;

        res.send(JSON.stringify(result));
      });
      break;
    case 'vsts':
      let result = {
        projectId: projectId,
        numberOfPullRequests: 0
      };

      res.send(JSON.stringify(result));
      break;
    default:
      return next({
        message: "Unknown source control type"
      });
  }
});

module.exports = router;