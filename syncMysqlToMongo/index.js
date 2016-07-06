var mysqlHelper = require('./lib/mysqlHelper');
var mongoHelper = require('./lib/mongoHelper');

var resourcesModel = mongoHelper.ResourcesModel;

mysqlHelper.getConnection(function(err, connection) {
   connection.query('SELECT * FROM ?? WHERE `isbn`=?', ['ercse_yk_resource','04'], function(err, rows) {
       if(err) throw err;
       rows.forEach(function(item) {
           resourcesModel
            .update({"general.description": item.desc}, {"properties.province": [item.province]}, {"properties.city": [item.city]})
            .where('general.id', item.vendorResId) 
            .exec(function(err, result) {
                if(err) throw err;
                console.log(result);
            });
       });
   });
   
   connection.end();
});