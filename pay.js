var mongoose = require('./db'),
    Schema = mongoose.Schema;

var PaySchema = new Schema({
    sender : String,
    receiver : String,
    cost : String,
    message : String,
    paydate : String,
})

module.exports = mongoose.model('Pay',PaySchema);