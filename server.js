var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var expressValidator = require('express-validator');
var connectFlash = require('connect-flash');
const Handlebars = require('handlebars');
//var expressSession = require('express-session');
var session = require("express-session")
var passport = require('passport');
var MongoStore = require("connect-mongo")(session)
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DMARTDB', { useMongoClient: true });
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
//Init app
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',
	expressHandlebars
		({
			extname: 'hbs', defaultLayout: 'layout',
			handlebars: allowInsecurePrototypeAccess(Handlebars)

		}));
app.set('view engine', 'hbs');

//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Set statuc folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: "mysupersecret",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie: { maxAge: null }
	})
)

//Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		return {
			param: param,
			msg: msg,
			value: value
		};
	}
}));

//Connect flash
app.use(connectFlash());

//Global vars
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	res.locals.host = 'http://localhost:' + app.get('port');
	next();
});

app.use('/home', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/cart', require('./routes/products'));
//app.use('/cart', require('./routes/cart'));
//Set Port
app.set('port', 3200);

mongoose.connection.on('error', function (err) {
	console.log('Mongodb is not running.');
	process.exit();
}).on('connected', function () {
	app.listen(app.get('port'), function () {
		console.log('Server started at : http://localhost:' + app.get('port'));
	});
});