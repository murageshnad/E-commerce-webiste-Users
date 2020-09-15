var express = require('express');
var router = express.Router();
var Cart = require("../models/cart")


var Product = require("../models/product")
var Order = require("../models/order");




router.get('/index', ensureAuthenticated, function (req, res, next) {
    var successMsg = req.flash("success")[0]
    var cart = new Cart(req.session.cart);
    Product.find(function (err, docs) {
        // console.log("doc", docs);
        var productChunks = []
        var chunkSize = 4;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize))
        }
        res.render("index", {
            totalQty: cart.totalQty,
            title: "DMART",
            products: productChunks,
        })
    })
})
//Get Homepage






router.post("/add-to-cart/:id", function (req, res, next) {
    let count = 0;
    console.log(count);
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {})
    req.session.cart = cart;

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect("/home/index")
        }
        cart.add(product, product.id);
        count++;
        req.session.cart = cart;
        let value = { cart: cart };
        //res.json(value);
        // res.render('user_list', {user_data: value});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        console.log("dtat", JSON.stringify(value));
        res.end(JSON.stringify(value));
        console.log(count);
        req.flash('success_msg', 'Product Added Successfully');
        res.redirect("/home/index");
    });
});


router.get("/add-cart/:id", function (req, res, next) {
    var productId = req.params.id
    var cart = new Cart(req.session.cart ? req.session.cart : {})

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect("/home/index")
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect("/home/cart");
    })
})



router.get("/reduce/:id", function (req, res, next) {
    var productId = req.params.id
    var cart = new Cart(req.session.cart ? req.session.cart : {})

    cart.reduceByOne(productId)
    req.session.cart = cart
    res.redirect("/home/cart")
})

router.get("/remove/:id", function (req, res, next) {
    var productId = req.params.id
    var cart = new Cart(req.session.cart ? req.session.cart : {})

    cart.removeItem(productId)
    req.session.cart = cart
    res.redirect("/home/cart");
})

router.get("/cart", function (req, res, next) {
    if (!req.session.cart) {
        return res.render("cart", {
            products: null
        })
    }
    var cart = new Cart(req.session.cart)
    res.render("cart", {
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
    });
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}
module.exports = router;