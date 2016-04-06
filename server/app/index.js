'use strict'; 

var app = require('express')();
var path = require('path');
var User = require('../api/users/user.model');
var passport = require('passport');

app.use(require('./logging.middleware'));

app.use(require('./session.middleware'));

// app.use(function (req, res, next) {
//   console.log('session', req.session);
//   next();
// });

app.use(passport.initialize());

app.use(passport.session());

// app.use(function (req, res, next) {
//   console.log('user', req.user);
//   next();
// });

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

app.use('/auth', require('./auth.routes'));

app.post('/login', (req,res,next) => {
  User.findOne({email: req.body.email, password: req.body.password}).then(user => {
    if (user) {
      req.login(user, err => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
      // req.session.user = user;
      // res.status(200).json(user);
    } else {
      res.sendStatus(401);
    }
  })
  .catch(next);
});

app.post('/logout', (req,res,next) => {
  if (!req.user) {
    res.sendStatus(400);
  } else {
    req.logout();
    res.sendStatus(201);
  }
});

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;