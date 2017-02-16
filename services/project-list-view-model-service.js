var async = require('async');
var github = require('../services/github-service');
var jenkins = require('../services/jenkins-service');
var _ = require('lodash');



function generate(projects, generateCallback) {
  function updateGitHubData(updateGitHubDataCallback) {
    let tasks = projects.map(function (project) {
      return github.getProjectGitHubPullRequestInfo.bind(github, project);
    });

    async.parallel(tasks, function (err, data) {
      for (i = 0; i < projects.length; i++) {
        projects[i].gitHubPullRequestsCount = _.get(data[i], "length");
      }

      return updateGitHubDataCallback(null, data);
    });
  }

  function updateJenkinsData(updateJenkinsDataCallback) {
    let tasks = projects.map(function (project) {
      return jenkins.getJenkinsLatestBuildInfo.bind(jenkins, project);
    });

    async.parallel(tasks, function (err, data) {
      for (i = 0; i < projects.length; i++) {
        projects[i].jenkinsLatestBuildStatus = _.get(data[i], "result");
      }

      return updateJenkinsDataCallback(null, data);
    });
  }

  async.parallel([
    updateGitHubData,
    updateJenkinsData
  ], function (err, data) {
    if (err) {
      return generateCallback(err);
    }

    let viewModel = projects.map((project) => {
      project.currentBuildStatusCssClass = project.jenkinsLatestBuildStatus === "FAILURE" ? "danger" : "success";
      project.currentPullRequestCssClass = project.gitHubPullRequestsCount > 5 ? "warning" : "success";
      return project;
    });

    generateCallback(null, viewModel);
  });
}

module.exports = {
  generate: generate
}