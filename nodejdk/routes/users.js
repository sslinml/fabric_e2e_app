// var express = require('express');
// var db = require('./../db.js');
// var router = express.Router();

// router.get('/', function(req, res, next) {
//     var mysqlQuery = 'SELECT * FROM student'
//     db.DBConnection.query(mysqlQuery,function(err,rows,fields){
//         if(err){
//             console.log(err);
//             return;
//         }
//         res.render('user', {students:rows})
//     });
// });

// module.exports = router;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
