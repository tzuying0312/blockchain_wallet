var mongoose = require('./db'),
    Schema = mongoose.Schema;

var ForgotSchema = new Schema({
    user_email : String,
    application_date : String,
})

module.exports = mongoose.model('forgot',ForgotSchema);