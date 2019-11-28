var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var entries = require('./routes/entries');
var validate = require('./middleware/validate');
var register = require('./routes/register');
var login = require('./routes/login');
var messages = require('./middleware/messages');
var user = require('./middleware/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))
app.use(user)
app.use(messages)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/post', entries.formVerification)
app.get('/post', entries.form);
app.post('/post', entries.submit)
app.get('/entries', entries.list)
app.use('/register', register.formVerification)
app.get('/register', register.form)
app.post('/register', register.submit)
app.use('/login', login.formVerification)
app.get('/login', login.form)
app.post('/login', login.submit)
app.get('/logout', login.logout)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
