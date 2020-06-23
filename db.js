var mongoose = require('mongoose')

//数据库地址
// DB_URL = 'mongodb://mdbadmin:<pas>@cluster0-shard-00-00-ek9e3.gcp.mongodb.net:27017,cluster0-shard-00-01-ek9e3.gcp.mongodb.net:27017,cluster0-shard-00-02-ek9e3.gcp.mongodb.net:27017/wallet?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
DB_URL = 'mongodb://localhost:27017/wallet';

mongoose.connect(DB_URL);
console.log('connect success');

mongoose.connection.on('disconnected',function(){
    console.log('connect wrong');
})

module.exports = mongoose;