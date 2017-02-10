var express = require('express');
var async = require('async');
var projects = require('../config/projects.json');
var github = require('../services/github-service');
var jenkins = require('../services/jenkins-service');
var router = express.Router();
var _ = require('lodash');

function updateGitHubData(callback) {
  let tasks = projects.projects.map(function (project) {
    return github.getProjectGitHubPullRequestInfo.bind(github, project);
  });

  async.parallel(tasks, function (err, data) {
    for (i = 0; i < projects.projects.length; i++) {
      projects.projects[i].gitHubPullRequestsCount = _.get(data[i], "length");
    }

    return callback(null, data);
  });
}

function updateJenkinsData(callback) {
  let tasks = projects.projects.map(function (project) {
    return jenkins.getJenkinsLatestBuildInfo.bind(jenkins, project);
  });

  async.parallel(tasks, function (err, data) {
    for (i = 0; i < projects.projects.length; i++) {
      projects.projects[i].jenkinsLatestBuildStatus = _.get(data[i], "result");
    }

    return callback(null, data);
  });
}

router.get('/', function (req, res) {
  async.parallel([
    updateGitHubData,
    updateJenkinsData
  ], function (err, data) {
    if (err) {
      return res.render('error');
    }

    let viewModel = projects.projects.map((project) => {
      project.currentBuildStatusCssClass = project.jenkinsLatestBuildStatus === "FAILURE" ? "danger" : "success";
      project.currentPullRequestCssClass = project.gitHubPullRequestsCount > 5 ? "warning" : "success";
      return project;
    });

    res.render('projects', {
      nav_active_projects: true,
      projects: viewModel
    });
  });
});

module.exports = router;