'use strict';
const express    = require('express'); 
const fs = require(`fs`);       
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer')
const User = require('./user');

const app        = express();                 

const router = require('./router');

const mongoose   = require('mongoose');
mongoose.connect('url_here');
mongoose.connect("mongodb+srv://admin:1111@cluster0-tmddm.mongodb.net/test?retryWrites=true&w=majority" ,
//"mongodb+srv://admin:1111@cluster0-tmddm.mongodb.net/test?retryWrites=true&w=majority
    { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("Error");
    }
    })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));   
db.once('open', () => console.log('Mongodb connected.'));
// mongoose.connect(connection, { 
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useFindAndModify: true 
// }, () => console.log('mongoose connected！'))
// mongoose.connection.on('error', console.error)


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8888;    

app.use('/api', router);
app.use(cors());

// app.use((req, res, next)=>{
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Resource-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     console.log("requst url = " + req.url);
//     next();
// })

app.get('/', (req, res) => {
    res.json({ message: 'hooray! welcome to server home' });   
    console.log("hello");
});

// app.get('/api/users',  (req, res) => {
//     User.find((err, users) => {
//         if (err) {
//             res.status(500).send(err);
//         }
//         res.status(200).json(users);
//     });
// });

app.listen(port, () => {
                console.log('hello' + port)}
);

app.use(multer({ dest: './upload',
    rename: function (fieldname, filename) {
      return filename;
    },
}).any());
