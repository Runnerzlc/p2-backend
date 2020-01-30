'use strict';
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors       = require('cors');

// 2nd part -- connect database and add data table
var User     = require('./userschema.js');

var mongoose   = require('mongoose');

const connectionString = "mongodb+srv://lyzlalala:19950518@cluster0-ylkrx.mongodb.net/project1?retryWrites=true&w=majority"
mongoose.set('useNewUrlParser', true);
const options = {
    keepAlive: 1,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };

mongoose.connect(connectionString,options).then(()=>console.log('DB Connected'));

router.post('/bears', (req, res) => {
    var User = new User();      
    User.FirstName = req.body.FirstName;  
    User.LastName = req.body.LastName;
    User.age = req.body.age;
    bear.save(  err => {
        if (err) {
            res.status(501).send(err);
        };
        res.status(200).json({ message  : 'Bear created!' });
    });
    
});

router.get('/bears', (req, res) => {
    Bear.find((err, bears) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(bears);
    });
});

router.get('/bears/:bear_id', (req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {
        if (err) {
            res.send(err);
        }
        res.json(bear);
    });
});

router.put('/bears/:bear_id', (req, res) => {
    Bear.findById(req.params.bear_id, (err, bear) => {

        if (err) {
            res.send(err);
        }
        bear.name = req.body.name;
        bear.sex = req.body.sex;
        bear.age = req.body.age;
        bear.save(err =>  {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Bear updated!' });
        });

    });
});

router.delete('/bears/:bear_id', (req, res) => {
    Bear.remove({
        _id: req.params.bear_id
    }, (err, bear) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    });
});

module.exports = router;
