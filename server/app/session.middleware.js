'use strict';

var router = require('express').Router(),
  session = require('express-session');

router.use(session({
  secret: 'qwerty',
  duration: 30*60*1000,
  activeDuration: 5*60*1000
}));

module.exports = router;