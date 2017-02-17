'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var core = require('./src/Core'); 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//security : set some http headers (Strict-Transport-Security, X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Content-Security-Policy)

//app.use(helmet());

//Core 
(new core(app)).run();  

app.listen(8000,function(){
	console.log("Application started ...");
})

module.exports = app;