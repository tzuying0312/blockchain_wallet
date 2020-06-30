var mongoose = require('./db'),
    Schema = mongoose.Schema;

var PaySchema = new Schema({
    name : String,
    url : String,
    application_date : String,
})

module.exports = mongoose.model('questionnaire',PaySchema);