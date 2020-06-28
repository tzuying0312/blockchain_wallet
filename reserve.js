
var mongoose = require('./db'),
Schema = mongoose.Schema;

var ReserveSchema = new Schema({
    name : String,
    room : String,
    startDateTime : String,
    cancel :String,
})

module.exports = mongoose.model('reserve',ReserveSchema);