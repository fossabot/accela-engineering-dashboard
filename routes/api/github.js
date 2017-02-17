var express = require('express');
var github = require('../../services/github-service');
var projects = require('../../config/projects.json').projects;
var router = express.Router();

router.get('/:projectId', function (req, res, next) {
  let projectId = parseInt(req.params.projectId, 10);

  let project = projects.find(x => x.id === projectId);

  github.getProjectGitHubPullRequestInfo(project.gitHubRepo, project.gitHubOwner, function(err, data) {
    let result = {
    projectId: projectId,
    numberOfPullRequests: data.length
  };

  res.send(JSON.stringify(result));
  });
});

module.exports = router;