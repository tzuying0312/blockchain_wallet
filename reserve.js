
var mongoose = require('./db'),
Schema = mongoose.Schema;

var ReserveSchema = new Schema({
    name : String,
    email : String,
    room : String,
    startDateTime : String,
    endDateTime : String,
    cancel :String,
})

module.exports = mongoose.model('reserve',ReserveSchema);