var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');
var users = require('./routes/projects');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({ defaultLayout: 'single', extname: '.hbs' }));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use("/systemjs.config.js", express.static(__dirname + '/systemjs.config.js'));

app.use('/', routes);
app.use('/projects', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;