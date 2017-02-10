var express = require('express');
var router = express.Router();
var projects = require('../config/projects.json');
var _ = require("lodash");

/* GET projects listing. */
router.get('/', function(req, res) {
  let viewModel = projects.projects.map((project) => {
    project.currentBuildStatusCssClass = project.currentBuildStatus === "Passing" ? "success" : "danger";
    project.currentPullRequestCssClass = project.openPullRequest > 5 ? "warning" : "success";
    return project;
  });

  res.render('projects', {
    nav_active_projects: true,
    projects: viewModel
  });
});

module.exports = router;