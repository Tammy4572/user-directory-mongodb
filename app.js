const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');

var dbCall = function (db, callback) {
    var collection = db.collection('users').find().toArray(function (err, result) {
        callback(result);
    })
};

const application = express();

application.engine('mustache', mustacheExpress());
application.set('views' , './views');
application.set('view engine', 'mustache');

application.use('/public', express.static('./public'));
application.use(bodyParser.urlencoded());

application.get('/', function(request, response){
    MongoClient.connect("mongodb://localhost:27017/newdb", function(err, db) {
        assert.equal(err, null);
        dbCall(db, function (result) {
            var model = { users: result};
            var countries = [];
            for (var i = 0; i < model.users.length; i++) {
                if (countries.indexOf(model.users[i].address.country) === -1) {
                    countries.push(model.users[i].address.country);
                    console.log(model.users);
                }
            }
            response.render('index', { users: result, countries: countries});
        })
    })
});

application.post('/country', function( request, response) {
    var country = request.body.country;
    MongoClient.connect("mongodb://localhost:27017/newdb", function (err, db) {
        db.collection('users').find({"address.country" : country}).toArray(function (err, result) {
            var model = {users: result};
            var countries = [];
            for (var i = 0; i < model.users.length; i++) {
                if (countries.indexOf(model.users[i].address.country) === -1) {
                    countries.push(model.users[i].address.country);
                }
            }
             response.render('index', { users: result, countries: countries});
        })
    })
});

application.get('/employed', function(request, response) {
    MongoClient.connect("mongodb://localhost:27017/newdb", function (err, db) {
        db.collection('users').find({ job: {$ne: null}}).toArray(function(err, result){
        var model = { users: result };
        var countries = [];
        for (var i = 0; i < model.users.length; i++) {
            if (countries.indexOf(model.users[i].address.country) === -1) {
                countries.push(model.users[i].address.country);
            }
        }
        response.render('index', { users: result, countries: countries});
    })
    })
});

application.get('/available', function(request, response) {
    MongoClient.connect("mongodb://localhost:27017/newdb", function (err, db) {
        db.collection('users').find({ job: null}).toArray(function(err, result) {
            var model = {users: result};
            var countries = [];
            for (var i = 0; i < model.users[i].length; i++) {
                if (countries.indexOf(model.users[i].address.country) === -1) {
                    countries.push(model.users[i].address.country);
                }
            }
            response.render('index', { users: result, countries: countries});
        })
    })
});

application.get('/:id', function(request, response){
    var id = parseInt(request.params.id);
    MongoClient.connect("mongodb://localhost:27017/newdb", function(err, db){
        db.collection('users').find({ id: id}).toArray(function (err, result) {
            response.render('profile', result[0]);
        })
    })
});

application.listen(3000, 'localhost');