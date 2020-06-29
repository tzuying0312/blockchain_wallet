var mongoose = require('./db'),
    Schema = mongoose.Schema;

    var CourseshareSchema = new Schema({
        write_user: String,
        course_name: String, 
        course_teacher: String, 
        course_message:String, 
        department:String, 
        grade:String,
        sharedate: String,
        rating:String,
        diffcult:String
    })
    
    module.exports = mongoose.model('CouseShare',CourseshareSchema);