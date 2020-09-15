var express = require('express');
var router = express.Router();



router.post('/index', function (req, res) {
    console.log("inside");
    console.log("dataaa", req.body);
});