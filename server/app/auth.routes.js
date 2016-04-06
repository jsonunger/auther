'use strict';

var router = require('express').Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var User = require('../api/users/user.model');
var secret = require('../secret');

function strategy (token, refreshToken, profile, done) {
  console.log('---', 'in verification callback', profile, profile.emails, '---');
  var userEmail;
  if (profile.emails) userEmail = profile.emails[0].value;
  else userEmail = profile.username+'@faketymcfakeface.com';
  User.findOne({email: userEmail})
  .then(function (user) {
    if (user) {
      done(null,user);
    } else {
      var newUser = new User();
      newUser.email = userEmail;
      newUser.name = profile.displayName;
      if (profile.photos) newUser.photo = profile.photos[0].value;
      newUser[profile.provider] = {
        id: profile.id,
        token: token,
        name: profile.displayName,
        email: userEmail
      };
      newUser.save(err => {
        if (err) done(err);
        else done(null,newUser);
      });
    }
  });
}

passport.use(new GoogleStrategy(secret.google,strategy));

passport.use(new TwitterStrategy(secret.twitter,strategy));

passport.use(new GitHubStrategy(secret.github,strategy));


passport.serializeUser(function (user,done) {
  done(null,user);
});

passport.deserializeUser(function (user,done) {
  done(null,user);
});

router.get('/me', (req,res,next) => {
  if (!req.user) {
    res.send();
  } else {
    req.login(req.user, err => {
      if (err) return next(err);
      return res.status(200).json(req.user);
    });
  }
});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/github', passport.authenticate('github', {scope: 'email'}));

router.get('/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/google', passport.authenticate('google', {scope: 'email'}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;