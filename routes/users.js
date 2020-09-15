var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

var User = require('../models/user');

//Get Register
router.get('/register', function (req, res) {
    res.render('register');
});

// router.get('/cart', function (req, res) {
//     res.render('cart');
// });

// router.post('/cart', function (req, res) {
//     console.log("inside----");

// });



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD
    }
});



//User Register
router.post('/register', function (req, res) {
    console.log("dtat", req.body);
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'User is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Passord required').notEmpty();
    req.checkBody('confirm_password', 'Password mismatch').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password
        });
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (user) {
                req.flash('error_msg', 'User Already Exist');
                res.redirect('/users/register');
            } else {
                User.createUser(newUser, function (err, user) {
                    if (err) throw err;
                    console.log(user);
                });
                var mailOptions = {
                    from: process.env.AUTH_USER,
                    to: req.body.email,
                    subject: 'DMART STORE LOGIN credentials',
                    html: `<h1>Hi User your Username:${req.body.username} and Password: ${req.body.password}</h1> <h4>Thank you for Register!..</h4>`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                req.flash('success_msg', 'Email is sent to mail-id !! ,You are registered and can now login');

                res.redirect('/users/login');
            }
        });
    }
});

//Get Login
router.get('/login', ensureAuthenticated, function (req, res) {
    res.render('login');
});


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid Password' });
                }
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

//User Login
router.post('/login', passport.authenticate('local', { successRedirect: '/home/index', failureRedirect: '/users/login', failureFlash: true }), function (req, res) {
    res.redirect('/home/index');
});

//User Logout
router.get('/logout', function (req, res, next) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/home/index');
    } else {
        return next();
    }
}
module.exports = router;