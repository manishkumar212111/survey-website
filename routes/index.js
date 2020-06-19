var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create-petition', function(req, res, next) {
  res.render('create-petition', { title: 'Express' });
});

module.exports = router;
