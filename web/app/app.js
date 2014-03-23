// Module dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

// Express environment setup
var app = express();
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname+'/public/bower_components'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Mongodb setup
mongoose.connect('mongodb://localhost/masters');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  //connection is opened
});

//Make schema and model for a 'paper'
var PaperSchema = mongoose.Schema({
    KEYNO: String,
    HISTORY: String,
    CODEN: String,
    REFRENCE: String,
    YEAR: String,
    AUTHORS: String,
    TITLE: String,
    KEYWORDS: String,
    SELECTRS: String
    }, { collection : 'NSR' });
var Paper = mongoose.model('Paper', PaperSchema)

//Setup for yearly summaries
var years = [];
for(i=1896; i<=1902; i++) { years.push(i.toString()) } 
var results = [];
Paper.aggregate( 
  { $match: { YEAR: { $in: years } } }, 
  { $group: { _id: "$YEAR", total: { $sum: 1 } } }, 
  { $sort: { _id: 1 } },
  { $project : {_id : 0, label : "$_id", value : "$total"} },
  function(err, summary) {
    results = summary;
    console.log(results);
  }
);

//Routes
app.get('/yearSummary', function(req, res){
  res.send(results)
});

app.get('/', function(req, res){
  Paper.find({ KEYNO: /^1896/ }, function (err, docs) {
    if (err) return console.error(err);
    res.render('index', {
      title: 'Papers in 1896',
      papers: docs
    });
  }); 
});

app.get('/count', function(req, res){
    res.render('year', {
      title: 'Papers Per Year',
      years: results
    });
}); //end /count route


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
