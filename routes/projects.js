var express = require('express');
var projects = require('../config/projects.json');
var viewModelService = require('../services/project-list-view-model-service');
var router = express.Router();

router.get('/', function (req, res) {
  let viewModel = viewModelService.generate(projects.projects, function (err, viewModel) {
    if (err) {
      throw err;
    }

    res.render('projects', {
      nav_active_projects: true,
      projects: viewModel.projects,
      errors: viewModel.errors
    });
  });
});

module.exports = router;