var mongoose = require('./db'),
    Schema = mongoose.Schema;

    var CourseaskSchema = new Schema({
        write_user: String,
        course_name: String, 
        course_teacher: String, 
        course_askmessage:String, 
        department:String, 
        grade:String,
        askdate: String,
    })
    
    module.exports = mongoose.model('CouseAsk',CourseaskSchema);