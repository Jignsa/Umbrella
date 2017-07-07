const express = require('express')
const app = express() // Node.js web application framework 
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
// set the view engine to ejs
app.set('view engine', 'ejs');

var bodyParser = require('body-parser'); //parses information from POST
var mongoose = require('mongoose'); //like eloqnt and mongodb like db::
var crudDemo = require('./models/reg');
var demoSchema = require('./models/demoSchema');

//db connection
var conn_str = 'mongodb://Ankita:ankita%40123@cluster0-shard-00-00-u2qnz.mongodb.net:27017,cluster0-shard-00-01-u2qnz.mongodb.net:27017,cluster0-shard-00-02-u2qnz.mongodb.net:27017/rail?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
mongoose.connect(conn_str);

var db = mongoose.connection;
var dbCollection = db.collections;
//console.log(dbCollection);

mongoose.connection.once('connected', function() {
    console.log("Connected to database .....!!")
});


mongoose.connection.on('error', function(err) {
    // Do something
    if (err) {
        console.log(err);
    }
});
app.use(bodyParser.urlencoded({ extended: false })); //cmplsry
app.use(bodyParser.json()); //cmplsry
app.use(express.static('upload'));

app.get('/anki', function(req, res) {
    res.send('Hello Ankiee..!!')
})


app.get('/hello', function(req, res) {
    res.end('Hello ..!!')
})

//html form

app.get('/', function(req, res, next) {
    res.sendfile('form.html');
});

app.post('/myaction', function(req, res) {
    console.log(req.body.name, '---', req.body.password);


    var post = new crudDemo({
        name: req.body.name,
        password: req.body.password
    });

    post.save(function(err, res) {
        if (err) {
            return err;
        } else {
            console('Data inserted successfully');
        }

    });
    res.end('Data insrted succesfully..!!');
});



app.get('/view1', function(req, res) {
    console.log(res);
    crudDemo.find(function(response) {
        console.log(response);
        // let response = res;
    })
    response.render('pages/display', {
        response: response
    });
});


app.get('/view', function(req, res) {

    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
    crudDemo.find(function(response) {
        console.log(response);
        console.log('hr');
    })
    res.render('pages/display', {
        response: response
    });
});
app.listen(4000);