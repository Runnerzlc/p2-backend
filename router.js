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
        user.superior = req.body.superior;
        
        console.log(user._id)
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
        console.log("superior name", user.superior.name)
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
            console.log("get work5e38cada5094080eff8b3d9b")
            //console.log("superior name: ", user.superior.name)
        });
        console.log("request get all users");
    });

router.get('/userSup/:id', (req, res) => {
        User.findById(req.params.id, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
        console.log("get one user");
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
            User.findByIdAndUpdate(user.superior, { $pull: { subordinates: user._id }
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
        User.countDocuments({$or:[{name: regex}]},function(err,totalCount) {
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"}
            }
            User
                .find({$or:[{name: regex}]},{},query)
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

// function BFS(g, s) {
//     let queue = []; //辅助队列 Q
//     s.color = s.GRAY; //首次发现s涂为灰色
//     s.d = 0; //距离为0
//     queue.push(s); //将s放入队列 Q
//     while (queue.length > 0) { //当队列Q中有顶点时执行搜索
//         let u = queue.shift(); //将Q中的第一个元素移出
//         if (u.edges == null) continue; //如果从当前顶点没有发出边
//         let sibling = u.edges; //获取表示邻接边的链表的头节点
//         while (sibling != null) { //当链表不为空
//             let index = sibling.index; //当前边所连接的顶点在队列中的位置
//             let n = g.getNode(index); //获取顶点
//             if (n.color == n.WHITE) { //如果没有被访问过
//                 n.color = n.GRAY; //涂为灰色
//                 n.d = u.d + 1; //距离加1
//                 n.pi = u; //设置前驱节点
//                 queue.push(n); //将 n 放入队列 Q
//             }
//             sibling = sibling.sibling; //下一条边
//         }
//         u.color = u.BLACK; //当前顶点访问结束 涂为黑色
//     }
// }

module.exports = router;


