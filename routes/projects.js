var express = require('express');
var router = express.Router();
var projects = require('../config/projects.json');
var jenkinsapi = require('jenkins-api');
var async = require('async');
var GitHubApi = require("github");

var jenkins = jenkinsapi.init("http://boardroom-mm:8080", { strictSSL: false });

var github = new GitHubApi({
  debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  Promise: require('bluebird'),
  followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
  timeout: 5000
});

function getPmaLatestBuildInfo(callback) {
  jenkins.last_build_info('hybrid-pma', function (err, data) {
    if (err) {
      callback(err);
    }

    callback(null, data);
  });
};

function getPmaGitHubPullRequest(callback) {
  github.pullRequests.getAll({ state: "open", repo: "hybrid-pma", owner: "Accela-Inc" }, function (err, data) {
    if (err) {
      callback(err);
    }

    callback(null, data);
  });
}

/* GET projects listing. */
router.get('/', function (req, res, next) {
  github.authenticate({
      type: "basic",
      username: 'info@christesene.com',
      password: 'Cassy143'
  });

  async.parallel([
    getPmaLatestBuildInfo,
    getPmaGitHubPullRequest
  ], function (err, data) {
    if (err) {
      return next(err);
    }

    projects.projects[0].currentBuildStatus = data[0].result;
    projects.projects[0].openPullRequest = data[1].length;

    let viewModel = projects.projects.map((project) => {
      project.currentBuildStatusCssClass = project.currentBuildStatus === "FAILURE" ? "danger" : "success";
      project.currentPullRequestCssClass = project.openPullRequest > 5 ? "warning" : "success";
      return project;
    });

    res.render('projects', {
      nav_active_projects: true,
      projects: viewModel
    });
  });
});

module.exports = router;