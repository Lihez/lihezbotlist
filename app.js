var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
const session = require('express-session');
var setting = require('./setting.json');
const bot = require('./bot.js')

var connection = mysql.createConnection({
  host     : setting.sql.host,
  user     : setting.sql.user,
  password : setting.sql.password,
  database : setting.sql.database
});

connection.connect((err)=> {
  if (err){
      throw err;
  }
  console.log('MySQL veritabanına başarıyla bağlanıldı.'); 
});

module.exports = {con:connection};

var indexRouter = require('./routes/index');
var errorRouter = require('./routes/error');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1)
app.use(session({
  secret: 'xAfeA23rop3mer3onrua3ebgrj3nr42kj3',
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/error', errorRouter);
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