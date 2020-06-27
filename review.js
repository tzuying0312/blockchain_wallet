var mongoose = require('./db'),
    Schema = mongoose.Schema;

var ReviewSchema = new Schema({
    name : String,
    star : String,
    comment : String,
    reviewdate : String,
})

module.exports = mongoose.model('review',ReviewSchema);