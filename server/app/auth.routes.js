'use strict';

var router = require('express').Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../api/users/user.model');

passport.use(new GoogleStrategy({
  clientID: '641756659991-0e57butr5189qmigcq46jrntobonss0l.apps.googleusercontent.com',
  clientSecret: 'N6zbw3EasKEemPcQN0-tm-GJ',
  callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
},
  function (token, refreshToken, profile, done) {
    console.log('---', 'in verification callback', profile, '---');
    User.findOne({email: profile.emails[0].value})
    .then(function (user) {
      if (user) {
        done(null,user);
      } else {
        User.create({email: profile.emails[0].value, name: profile.displayName, google: {
          id: profile.id,
          token: token,
          name: profile.displayName,
          email: profile.emails[0].value
        }}).then(user => {
          done(null,user);
        });
      }
    });
  })
);

passport.serializeUser(function (user,done) {
  done(null,user);
});

passport.deserializeUser(function (user,done) {
  done(null,user);
});

router.get('/me', (req,res,next) => {
  if (!req.session.user) {
    res.send();
  } else {
    res.status(200).json(req.session.user);
  }
});

router.get('/google', passport.authenticate('google', {scope: 'email'}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;