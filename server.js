var express = require('express'),
    compression = require('compression'),  
    path = require('path'),
    //fs = require('fs'),
    morgan = require('morgan'),    
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

var config = require('./server/config/appSetting'); // get db config file

var app = express();  
var staticRoot = __dirname + '/';
var dbConfig = process.env.DB || config.database;

//setting view
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'client/app/views'));
app.set('view engine', 'ejs');

//set gzip compression
app.use(compression());

console.log(process.env.DB);

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser('secretPassword'));
app.use(session({ 
    secret: config.sessionSecret, 
    resave: true, 
    saveUninitialized: false,
    // using store session on MongoDB using express-session + connect
    store: new MongoStore({
        url: dbConfig,
        collection: 'sessions'
    }),
    cookie: {
        maxAge: 600000 //in milliseconds
    }
})); 

app.set('port', (process.env.PORT || 3000));

//app.use(express.static(staticRoot));
app.use(express.static('node_modules'));
//app.use(express.static('client'));
console.log(path.join(__dirname, "client"))
app.use(express.static(path.join(__dirname, "client")));
// app.use(express.static(path.join(__dirname, "app/scripts")));

// log to console
app.use(morgan('dev'));

// connect to database
mongoose.connect(dbConfig);

app.use(function(req, res, next){
    if(req.path.indexOf('server.js') >= 0 || req.path.indexOf('/config/') >= 0) {
        console.log('EEEEE')
        res.status(404)        // HTTP status 404: NotFound
           .send('Not Found');
        return;
    }
    
    // if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if(accept !== 'html'){
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== ''){
        return next();
    }

    //fs.createReadStream(staticRoot + 'index.html').pipe(res);
    next();
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    // default to plain-text. send()    
});

// bundle our routes
var apiRoutes = express.Router();

apiRoutes.get('/', function (req, res) {
    //res.send('home');
    res.render('index.html');
});

apiRoutes.get('/views/*/*', function (req, res) {            
    //http://localhost:3001/views/user/login
    console.log(req.params[0] + '/' + req.params[1]);
    res.render(req.params[0] + '/' + req.params[1], {req: req});
});

//all routes
app.use('/', apiRoutes);

app.listen(app.get('port'), function() {  
    console.log('app running on port', app.get('port'));
});