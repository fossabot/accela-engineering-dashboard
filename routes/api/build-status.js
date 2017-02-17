var express = require('express');
var router = express.Router();

router.get('/:buildId', function (req, res, next) {
  let status = {
    status: 'passing',
    runDate: new Date(),
    id: parseInt(req.params.buildId, 10)
  };

  res.send(JSON.stringify(status));
});

module.exports = router;