var mongoose = require('./db'),
    Schema = mongoose.Schema;

var QuestionnaireSchema = new Schema({
    name : String,
    title : String,
    url : String,
    application_date : String,
})

module.exports = mongoose.model('questionnaire',QuestionnaireSchema);