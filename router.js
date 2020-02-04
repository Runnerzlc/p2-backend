'use strict';
const express  = require('express');        
const fs = require(`fs`);
const multer = require('multer')
const router = express.Router();     
const cors = require("cors");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require('./user');

router.all("*", cors());

router.get('/', (req, res) => {
    res.json({ message: 'server working' });   
});

//create user
router.post('/user', (req, res) => {
        var user = new User();
        // user.avatar.data = fs.readFileSync(req.files.userPhoto.path);
        // user.avatar.contentType = `image/png`;      
        user.name = req.body.name;
        user.rank = req.body.rank;   
        user.gender = req.body.gender;
        user.startDate = req.body.startDate;
        user.phone = req.body.phone;
        user.email = req.body.email;
        user.suprerior = req.body.suprerior;
        
        console.log(user._id)
        user.save(  (err) => {
            if (err) {
                res.status(501).send(err);
            };
           
            res.status(200).json({ message: 'user created!' });
        });
        User.findByIdAndUpdate(user.suprerior, { $push: { subordinates: user._id } 
        },(err) => {
            if (err) {
                res.status(501).send(err);
            }}
         )
    
        console.log("requst create user")
    });
// get all users
router.get('/users', (req, res) => {
        User.find((err, users) => {
            if (err) {
                res.status(500).send(err);
            }
            //users.suprerior = User.findById( users.suprerior,`name`),exec(callback);
            res.status(200).json(users);
        });
        console.log("request get all users");
    });

router.get('/user/:id', (req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
        console.log("get one user");
    });
//edit user
router.put('/user/:id', (req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                res.send(err);
            }
            // user.avatar.data = fs.readFileSync(req.files.userPhoto.path);
            // user.avatar.contentType = `image/png`;      
            user.name = req.body.name;
            user.rank = req.body.rank;   
            user.gender = req.body.gender;
            user.startDate = req.body.startDate;
            user.phone = req.body.phone;
            user.email = req.body.email;
            User.findByIdAndUpdate( user.suprerior, { $pull: { subordinates: req.params.id}
            }   ,(err) => {
                if (err) {
                    res.status(501).send(err);
                }}
             )
            user.suprerior = req.body.suprerior;
            console.log(req.params.id);
            user.save(  (err) => {
                if (err) {
                    res.status(501).send(err);
                };
                //User.findByIdAndUpdate( req.body.suprerior, {$push: {subordinates: user._id}});
                res.status(200).json({ message: 'user edit!' });
            });

            User.findByIdAndUpdate(user.suprerior, { $push: { subordinates: req.params.id }
            },(err) => {
                if (err) {
                    res.status(501).send(err);
                }}
             )

        });
        console.log("request edit user")
    });
//delete user
router.delete('/user/:id', (req, res) => {
        //let id = req.params._id
        User.findById(req.params.id, (err, user) => {
            if (err) {
                res.send(err);
            }
            //user._id = req.params.id
            User.findByIdAndUpdate(user.suprerior, { $pull: { subordinates: user._id }
            },(err) => {
                if (err) {
                    res.status(501).send(err);
                }}
             )
        
        });
        User.deleteOne({
            _id: req.params.id, 
        }, (err, user) => {
            if (err) {
                res.send(err);
            }
            // else{
            //     res.json(user)
            // }
            //else is for test
            res.json({ message: 'Successfully deleted' });
            
        });
        console.log("request delete user")
    });


router.get('/users/:pageNo/',(req,res) => {
    var pageNo = parseInt(req.params.pageNo)
    var size = 5;
    var query = {}
    if (req.query.keyword) {
        var regex = new RegExp(req.query.keyword)
    };
    if(pageNo < 0 || pageNo === 0) {
            response = {"error" : true,"message" : "invalid page number, should start with 1"};
            return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    // Find some documents
    if (regex !== undefined) {
        User.countDocuments({$or:[{name: regex}, {LastName: regex}, {Sex: regex}]},function(err,totalCount) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"}
            }
            User
                .find({$or:[{FirstName: regex}, {LastName: regex}, {Sex: regex}]},{},query)
                .sort(req.query.sort)
                .exec((err,data) => {
                // Mongo command to fetch all data from collection.
                    if (err) {
                        response = {"error" : true,"message" : "Error fetching data"};
                    } else {
                        var totalPages = Math.ceil(totalCount / size)
                        response = { data, "totalPages": totalPages, "pageNo": pageNo, "hasPrev": pageNo === 1 ? false : true, 
                                    "hasNext": pageNo === totalPages ? false : true, "totalCount": totalCount };
                    }
                    res.json(response);
                })
        });
    } else  {
        User.countDocuments({},function(err,totalCount) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"}
            }
            User
                .find({},{},query)
                .sort(req.query.sort)
                .exec((err,data) => {
                // Mongo command to fetch all data from collection.
                    if (err) {
                        response = {"error" : true,"message" : "Error fetching data"};
                    } else {
                        var totalPages = Math.ceil(totalCount / size)
                        response = { data, "totalPages": totalPages, "pageNo": pageNo, "hasPrev": pageNo === 1 ? false : true, 
                                    "hasNext": pageNo === totalPages ? false : true, "totalCount": totalCount };
                    }
                    //console.log(data);
                    res.json(response);
                })
        });
    }
});

module.exports = router;


