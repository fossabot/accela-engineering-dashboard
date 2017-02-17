var express = require('express');
var router = express.Router();

router.get('/:projectId', function (req, res, next) {
  let result = {
    projectId: parseInt(req.params.projectId, 10),
    numberOfPullRequests: 4
  };

  res.send(JSON.stringify(result));
});

module.exports = router;