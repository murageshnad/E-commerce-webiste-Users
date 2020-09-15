var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cart = require("../models/cart")
var nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD
    }
});


var Product = require("../models/product")
var Order = require("../models/order");

var Shipping = require("../models/shipping");



router.get('/details', (req, res) => {
    res.render("cart", {

    });
});

router.post('/details', function (req, res) {
    console.log("inside");
    console.log("data-=-", req.body);

    res.redirect('/users/login');

});

router.get('/success', (req, res) => {
    let obj = {};
    if (!req.session.cart) {
        return res.render("cart", {
            products: null
        });
    }
    var cart = new Cart(req.session.cart)
    var totalPrice = cart.totalPrice;
    var user = new User(req.params.id);
    var id = user._id;

    User.findOne({ "isAdmin": "false" }, function (err, users) {
        obj.user = users.name;
        obj.email = users.email;
        var mailOptions = {
            from: process.env.AUTH_USER,
            to: obj.email,
            subject: ' About DMART User shopping',
            html: `<h3>Hi Admin, The User:${obj.user} has purchased the products and the Total Price is ${totalPrice}</h3>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


    });

    res.render("success", {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice
    });
});

router.post('/success', (req, res) => {

    res.redirect("/cart/success");



});



router.get('/shipping', (req, res) => {
    res.render('shipping');
});

router.post('/shipping', (req, res) => {
    var image = {};
    image['name'] = req.body.name;
    image['mobile'] = req.body.mobile;
    image['pincode'] = req.body.pincode;
    image['address'] = req.body.address;
    image['city'] = req.body.city;
    image['state'] = req.body.state;

    router.addImage(image, (err, docs) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
        req.flash('success_msg', 'Address Saved..');

        res.redirect('/cart/success');

    });

});

router.addImage = function (image, callback) {
    Shipping.create(image, callback);
};

module.exports = router;