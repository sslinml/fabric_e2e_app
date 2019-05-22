var db = require('./db.js');

var mysqlQuery = 'SELECT * FROM person.people'

db.DBConnection.query(mysqlQuery,function (err, res, result){
    if(err){
        console.log(err);
        return;
    }
    var success={
        message:"注册成功"
    };
    res.send(success);
                
});