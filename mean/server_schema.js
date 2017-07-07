var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
   // MongoClient = require('mongodb').MongoClient,
    engines = require('consolidate'),
    assert = require('assert'),
    //ObjectId = require('mongodb').ObjectID,
    mongoose = require('mongoose'),
    userModel = require('./models/schemauser');


   // url = 'mongodb://localhost:27017/simplemean';

    mongoose.connect('mongodb://localhost:27017/simplemean');
//app.use(bodyParser.urlencoded({ extended: false })); //cmplsryapp.use(bodyParser.json()); //cmplsry
app.use(express.static(__dirname + "/public/"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
app.get('/crud', function (req, res) {
   res.sendFile( __dirname + "/" + "/public/add.html" );
})
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render("error_template", { error: err});
}

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

//MongoClient.connect(process.env.MONGODB_URI || url,function(err, db){
    //assert.equal(null, err);
    //console.log('Successfully connected to MongoDB.');

    var records_collection = db.collection('schemas');//userModel;;

    app.get('/records', function(req, res, next) {
        // console.log("Received get /records request");
        userModel.find({},function(err, records){
            if(err) throw err;

            if(records.length < 1) {
                console.log("No records found.");
            }

            // console.log(records);
            res.json(records);
        });
    });

    app.post('/records', function(req, res, next){
        console.log(req.body);
        var userModel1 = new userModel(req.body);  
       
        userModel1.save(function (err, createdTodoObject) {  
            if (err) {
                throw err;
            }
            // This createdTodoObject is the same one we saved, but after Mongo
            // added its additional properties like _id.
            res.json(createdTodoObject);
        });
    });

    app.delete('/records/:id', function(req, res, next){
        var id = req.params.id;
        console.log("delete " + id);
        userModel.findByIdAndRemove(id, function (err, todo) {  
        // We'll create a simple object to send back with a message and the id of the document that was removed
            // You can really do this however you want, though.
           
            res.json(todo);
        });
       /* records_collection.deleteOne({'_id': new ObjectId(id)}, function(err, results){
            console.log(results);
            res.json(results);
        });*/
    });

    app.put('/records/:id', function(req, res, next){
        var id = req.params.id;

        userModel.findById(id, function (err, todo) {  
            // Handle any possible database errors
            if (err) {
                res.status(500).send(err);
            } else {
                // Update each attribute with any possible attribute that may have been submitted in the body of the request
                // If that attribute isn't in the request body, default back to whatever it was before.
                
                 todo.name = req.body.name,
                todo.email= req.body.email,
                todo.phone= req.body.phone

                // Save the updated document back to the database
                todo.save(function (err, todo) {
                    if (err) {
                        res.status(500).send(err)
                    }
                    res.json(todo);
                });
            }
        });


       /* records_collection.updateOne(
            {'_id': id},
            { $set: {
                'name' : req.body.name,
                'email': req.body.email,
                'phone': req.body.phone
                }
            }, function(err, results){
                console.log(results);
                res.json(results);
        });*/
    });

    app.use(errorHandler);
    var server = app.listen(8085, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    })
//})
