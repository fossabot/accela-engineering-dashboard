var async = require('async');
var github = require('../services/github-service');
var jenkins = require('../services/jenkins-service');
var vsts = require('../services/vsts-service');
var _ = require('lodash');



function generate(projects, generateCallback) {
  let errors = [];

  function updateVstsBuildData(updateVstsBuildDataCallback) {
    let vstsProjects = projects.filter(project => project.vstsBuild);
    let tasks = vstsProjects
      .map(project => vsts.getBuildStatus.bind(vsts, project));

    async.parallel(tasks, (err, data) => {
      if (err) {
        errors.push(err);
      }

      for (i = 0; i < vstsProjects.length; i++) {
        vstsProjects[i].jenkinsLatestBuildStatus = _.get(data[i], "result");
      }

      return updateVstsBuildDataCallback(null, data);
    });
  }

  function updateVstsRepoData(updateVstsRepoDataCallback) {
    let vstsProjects = projects.filter(project => project.vstsRepo);
    let tasks = vstsProjects
      .map(project => vsts.getPullRequests.bind(vsts, project));

    async.parallel(tasks, (err, data) => {
      if (err) {
        errors.push(err);
      }

      for (i = 0; i < vstsProjects.length; i++) {
        vstsProjects[i].gitHubPullRequestsCount = _.get(data[i], "length");
      }

      return updateVstsRepoDataCallback(null, data);
    });
  }

  function updateGitHubData(updateGitHubDataCallback) {
    let githubProjects = projects.filter(project => project.gitHubRepo);

    let tasks = githubProjects.map(function (project) {
      return github.getProjectGitHubPullRequestInfo.bind(github, project);
    });

    async.parallel(tasks, function (err, data) {
      if (err) {
        errors.push(err);
      }

      for (i = 0; i < githubProjects.length; i++) {
        githubProjects[i].gitHubPullRequestsCount = _.get(data[i], "length");
      }

      return updateGitHubDataCallback(null, data);
    });
  }

  function updateJenkinsData(updateJenkinsDataCallback) {
    let jenkinsProjects = projects.filter(project => project.jenkinsEndpoint);
    let tasks = jenkinsProjects.map(function (project) {
      return jenkins.getJenkinsLatestBuildInfo.bind(jenkins, project);
    });

    async.parallel(tasks, function (err, data) {
      if (err) {
        errors.push(err);
      }

      for (i = 0; i < jenkinsProjects.length; i++) {
        jenkinsProjects[i].jenkinsLatestBuildStatus = _.get(data[i], "result");
      }

      return updateJenkinsDataCallback(null, data);
    });
  }

  async.parallel([
    updateGitHubData,
    updateJenkinsData,
    updateVstsRepoData,
    updateVstsBuildData
  ], function (err, data) {
    if (err) {
      return generateCallback(err);
    }

    let projectsWithInfo = projects.map((project) => {
      project.currentBuildStatusCssClass = project.jenkinsLatestBuildStatus === "FAILURE" ? "danger" : "success";
      project.currentPullRequestCssClass = project.gitHubPullRequestsCount > 5 ? "warning" : "success";
      return project;
    });

    generateCallback(null, {
      projects: projectsWithInfo,
      errors: errors
    });
  });
}

module.exports = {
  generate: generate
}