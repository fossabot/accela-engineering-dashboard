var express = require('express');
var router = express.Router();
var projects = require('../config/projects.json');

/* GET projects listing. */
router.get('/', function(req, res) {
  res.render('projects', {
    projects: projects.projects
  });
});

module.exports = router;