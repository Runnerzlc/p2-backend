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
        //let path = Upload(req.body.avatarUrl);
        var user = new User();
        user.avatarUrl= req.body.avatarUrl
        //user.avatarUrl.contentType = `image/png`;      
        user.name = req.body.name;
        user.rank = req.body.rank;   
        user.gender = req.body.gender;
        user.selectDate = req.body.selectDate;
        user.phone = req.body.phone;
        user.email = req.body.email;
        user.superior = req.body.superior;
        
        console.log("body content",req.body.avatarUrl)
        console.log("image content",req.body.avatarUrl)
        console.log("name content",req.body.name)
        user.save(  (err) => {
            if (err) {
                res.status(501).send(err);
            };
           
            res.status(200).json({ message: 'user created!' });
        });
        User.findByIdAndUpdate(user.superior, { $push: { subordinates: user._id } 
        },(err) => {
            if (err) {
                res.status(501).send(err);
            }}
        );
        User
        .findById(user._id)
        .populate('superior')
       // console.log("superior name", user.superior.name)
        console.log("requst create user")
    });
// get all users
router.get('/users', (req, res) => {
        User
        .find()
        .populate('superior')
        .exec((err, users) => {
            if (err) {
                res.status(500).send(err);
            }
            //users.suprerior = User.findById( users.suprerior,`name`),exec(callback);
            res.status(200).json(users);
            //console.log("get work",users)
            //console.log("superior name: ", user.superior.name)
        });
        console.log("request get all users");
    });
// get all superior
router.get('/usersup/:id', (req, res) => {4
    const _id  = req.params.id
    console.log("id test", _id)
	// when we add a new army
	if (_id == 0) {
		User
			.find()
			.select('name')
			.exec((err, user) => {
				if (err) {
					console.log(err);
					res.status(500).json(err);
				}
				else {
					res.status(200).json(user);
				}
			});
	}
	// when we edit a existed army
	else {
		User
			.findById(_id)
			.populate('subordinates')
			.exec((err, user) => {
				if (err) {
					console.log(err);
					res.status(500).json(err);
				}
				else {
                    console.log("id test", _id)
					let unValid = [{ '_id': user._id, 'name': user.name }];
					let traArray = user.subordinates;
					findValidSup(unValid, traArray, res);
				}
			});
	}
});
// get one user
router.get('/user/:id', (req, res) => {
        User
        .findById(req.params.id)
        .populate('superior')
        .exec ((err, user) => {
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
            user.avatarUrl= req.body.avatarUrl     
            user.name = req.body.name;
            user.rank = req.body.rank;   
            user.gender = req.body.gender;
            user.selectDate = req.body.selectDate;
            user.phone = req.body.phone;
            user.email = req.body.email;
            User.findByIdAndUpdate( user.superior, { $pull: { subordinates: req.params.id}
            }   ,(err) => {
                if (err) {
                    res.status(501).send(err);
                }}
             )
            user.superior = req.body.superior;
            console.log(req.params.id);
            user.save(  (err) => {
                if (err) {
                    res.status(501).send(err);
                };
                //User.findByIdAndUpdate( req.body.suprerior, {$push: {subordinates: user._id}});
                res.status(200).json({ message: 'user edit!' });
            });

            User.findByIdAndUpdate(user.superior, { $push: { subordinates: req.params.id }
            },(err) => {
                if (err) {
                    res.status(501).send(err);
                };
                // res.status(200).json({ message: 'superior subordinates edit' });
                console.log('superior subordinates edit');
            });

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
            if (user.superior !== undefined){
                User.findByIdAndUpdate(user.superior, { $pull: { subordinates: user._id }
                },(err) => {
                    if (err) {
                        res.status(501).send(err);
                    }}
                )
            }
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
    var query = {};
    var response = {};
    if (req.query.search) {
        var regex = new RegExp(req.query.search)
    };
    if(pageNo < 0 || pageNo === 0) {
            response = {"error" : true,"message" : "invalid page number, should start with 1"};
            return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    // Find some documents
    if (regex !== undefined) {
        User.countDocuments({$or:[{name: regex}]},function(err,totalCount) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"}
            }
            User
                .find({$or:[{name: regex}]},{},query)
                .sort(req.query.sort)
                .populate('superior')
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
                //.sort(req.query.sort)
                .populate('superior')
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

const findValidSup = (unValid, traArray, res) => {
	if (traArray.length > 0) {
		let currentId = traArray.shift();
		User
			.findById(currentId)
			.populate('subordinates')
			.exec((err, result) => {
				if (err) {
					console.log(err);
					return;
				}
				else {
					unValid.push({ '_id': result._id, 'name': result.name });
					traArray = [...traArray, ...result.subordinates];
					findValidSup(unValid, traArray, res);
				}
			});
	}
	else {
		User
			.find()
			.select('name')
			.exec((err, user) => {
				let validSup = user.filter(user => {
					let isValid = true;
					for (let i = 0; i < unValid.length; i++) {
						if (JSON.stringify(unValid[i]) === JSON.stringify(user)) {
							console.log("hello");
							isValid = false;
							break;
						}
					}
					return isValid;
				});
				console.log(validSup);
				res.status(200).json(validSup);
			});
	}
}

const Upload = multer({ dest: './upload',
rename: function (fieldname, filename) {
  return filename;
},
}).any();



module.exports = router;


