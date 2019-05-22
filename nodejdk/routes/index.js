var express = require('express');
var db = require('./../db.js');
var router = express.Router();
var wjg = require('./controller.js');

router.get('/', function(req, res) {
    return wjg.index(req, res);

});

router.get('/block', function(req, res) {
    return wjg.block(req, res);
    
});

router.post('/block', function(req, res) {
    return wjg.doblock(req, res);
    
});

router.get('/query', function(req, res) {
    return wjg.query(req, res);
    
});

router.post('/query', function(req, res) {
    var function_name = 'query'
    return wjg.get_fabric(req, res, function_name);
    
});

router.get('/invoke', function(req, res) {
    return wjg.invoke(req, res);
    
});
router.post('/invoke', function(req, res) {
    var function_name = 'invoke'
    return wjg.input_fabric(req, res, function_name);
    
});

router.get('/logreg', function(req, res) {
    return wjg.logreg(req, res);

});

router.post('/logreg/login', function(req, res) {
    return wjg.dologin(req, res);

});

// router.get('/reg', function(req, res) {
//     return wjg.reg(req, res);
    
// });

router.post('/logreg/reg', function(req, res) {
    return wjg.doreg(req, res);
    
});


// router.post('/', function(req, res) {
//     return wjg.add(req, res);
    
// });

// router.get('/users', function(req, res) {
//     return wjg.query(req, res);
    
// });


module.exports = router;
