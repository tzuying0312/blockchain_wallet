var mongoose = require('./db'),
    Schema = mongoose.Schema;

var Question_userSchema = new Schema({
    name : String,
    date : String,
})

module.exports = mongoose.model('question_user',Question_userSchema);