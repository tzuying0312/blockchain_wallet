
var express = require('express');
var app = express();
var userSchema = require('./routes/user');
var PaySchema = require('./routes/pay');
var CourseshareSchema = require('./routes/course_share');
var QuestionnaireSchema = require('./routes/questionnaire');
var ForgotSchema = require('./routes/forgot');
var ReserveSchema = require('./routes/reserve');
var ReviewSchema = require('./routes/review');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');


//連接本地數據庫
var DB_URL = 'mongodb://localhost:27017/wallet'
// var DB_URL = 'mongodb+srv://gingerfan:ginger94090@cluster0-zigdt.gcp.mongodb.net/mywallet?retryWrites=true&w=majority'
mongoose.connect(DB_URL);

app.use(function (req, res, next) {
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    next();
  });

//解析表單數據
app.use(bodyParser.urlencoded({extended:true}))

/*插入數據函數*/
function insert(name,psw,email,academy,grade,identity){
    //數據格式
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hour = dateObj.getHours()   
    var minute =dateObj.getMinutes() 

    var newdate = year + "/" + month + "/" + day + ' '+ hour +":"+ minute;
    console.log(newdate)
    var user =  new userSchema({
                username : name,
                userpsw : psw,
                email : email,
                academy : academy,
                grade : grade,
                identity : identity,
                logindate : newdate
            });
    user.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}


/*註冊頁面數據接收*/
app.post('/register', function (req, res) {
  //先查詢有沒有這個user
  var UserName = req.body.username;
  var UserPsw = req.body.password;
  var email = req.body.email;
  var academy = req.body.academy;
  var grade = req.body.grade;
  var identity = req.body.identity;

  //通過帳號驗證
  var updatestr = {username: UserName};
    if(UserName == ''){
       res.send({status:'success',message:false}) ;
    }
    res.setHeader('Content-type','application/json;charset=utf-8')
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            if(obj.length == 0){
                //如果查無數據。就將帳戶密碼插入數據庫
                insert(UserName,UserPsw,email,academy,grade,identity); 
                //返回數據到前端
                res.send({status:'success',message:true}) 
            }else if(obj.length !=0){
                res.send({status:'success',message:false}) 
            }else{
                res.send({status:'success',message:false}) 
            }
        }
    })  
});

/*登入處理*/
app.post('/login', function (req, res, next) {
  //先查詢有沒有這個user
  console.log("req.body"+req.body);
  var UserName = req.body.username;
  var UserPsw = req.body.password;
  //通过账号密码搜索验证
  var updatestr = {username: UserName,userpsw:UserPsw};
  //處理跨域問題
    userSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            if(obj.length == 1){
                console.log('登入成功');
                res.send({status:'success',message:true,data:obj}); 
            }else{
                console.log('請註冊帳號'); 
                res.send({status:'success',message:false}); 
            }
        }
    })
});

// setting get data
app.get('/setting/:user',function(req,res){
    var user_name =  req.params.user;
    console.log(user_name)

    userSchema.find({'username':user_name}, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log(data)
            var data_send = data
            console.log(data_send[0])
            res.send(JSON.stringify(data_send))
        }
    })
})

/*插入數據函數*/
function insertpay(sender,receiver,cost,message){
    //數據格式
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hour = dateObj.getHours()   
    var minute =dateObj.getMinutes() 

    var newdate = year + "/" + month + "/" + day + ' '+ hour +":"+ minute;
    console.log(newdate)
    var pay =  new PaySchema({
                sender : sender,
                receiver : receiver,
                cost : cost,
                message : message,
                paydate : newdate
            });
    pay.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}
app.get('/pay/inrecord/:user',function(req,res){
    var updatestra = {'receiver': req.params.user};
    // var updatestrb = {'sender': req.params.user};
    PaySchema.find(updatestra, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log(data)
            var data_send = data
            console.log(data_send[0])
            res.send(JSON.stringify(data_send))
        }
    })
})

app.get('/pay/outrecord/:user',function(req,res){
    var updatestrb = {'sender': req.params.user};
    PaySchema.find(updatestrb, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log(data)
            var data_send = data
            console.log(data_send[0])
            res.send(JSON.stringify(data_send))
        }
    })
})

app.get('/course_share',function(req,res){
    console.log('hihi')
    CourseshareSchema.find({}, function(err, data) {
        if (!err) { 
            console.log(data);
            var data_send = data
            console.log(data_send[0])
            res.send(JSON.stringify(data_send))
          
        }
        else {
            throw err;
        }
    });
});

app.post('/course_share',function(req,res){

    var write_user = req.body.write_user;
    var course_name = req.body.course_name;
    var course_teacher = req.body.course_teacher;
    var course_message = req.body.course_message;
    var department = req.body.department;
    var grade = req.body.grade;
    var rating =req.body.rating;
    var diffcult = req.body.diffcult;
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hour = dateObj.getHours()   
    var minute =dateObj.getMinutes() 

    var newdate = year + "/" + month + "/" + day + ' '+ hour +":"+ minute;
    console.log(newdate)

    var courseshare =  new CourseshareSchema({
        write_user : write_user,
        course_name: course_name, 
        course_teacher: course_teacher, 
        course_message:course_message, 
        department:department, 
        grade:grade,
        sharedate: newdate,
        rating:rating,
        diffcult:diffcult,
    });
    console.log(courseshare)
    courseshare.save(function(err,res){
        if(err){
            console.log(err);

        }
        else{
            console.log(res);
            // res.send({status:'success',message:true})
        }
    })
    res.send({status:'success',message:true})


});

/*轉帳頁面數據接收*/
app.post('/pay', function (req, res) {
  //處理跨域的問題
  res.setHeader('Content-type','application/json;charset=utf-8')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  //先查詢有沒有這個user
  var sender = req.body.sender;
  var receiver = req.body.receiver;
  var cost = req.body.cost;
  var message = req.body.message;
  //通過帳號驗證
  var updatestr = {sender: sender};
    PaySchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            insertpay(sender,receiver,cost,message); 
            res.send({status:'success',message:true})
        }
    })

  });

/*插入數據函數*/
function insertforgot(email){
    //數據格式
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hour = dateObj.getHours()   
    var minute =dateObj.getMinutes() 
    var newdate = year + "/" + month + "/" + day + ' '+ hour +":"+ minute;
    console.log(newdate)
    var forgot =  new ForgotSchema({
                user_email : email,
                application_date : newdate
            });
    forgot.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}

/*註冊頁面數據接收*/
app.post('/forgot', function (req, res) {
    //處理跨域的問題
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    //先查詢有沒有這個user
    var user_email = req.body.email;
    var updatestr = {user_email: user_email};
    ForgotSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            insertforgot(user_email); 
            res.send({status:'success',message:true})
        }
    })
});


/*插入數據函數*/
function insertreserve(name,room,startDateTime,cancel){
    //數據格式
    var reserve =  new ReserveSchema({
        name : name,
        room : room,
        startDateTime : startDateTime,
        cancel : cancel
     });
    reserve.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}

app.get('/reserve/:room', function(req, res){
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    var room =  req.params.room;
    var name = req.query.name;
    var startDateTime = req.query.start;
    var cancel = req.query.cancel;
    var NewArray = new Array();
    var NewArray = room.split("m");
    var all_room = ['雙溪D509-完成室','雙溪D509-未來室','雙溪D509-藍沙發','雙溪D509-現在室','城中5615'];
    room = all_room[NewArray[1]-1];
    var timeArray = new Array();
    var timeArray = startDateTime.split("(");
    startDateTime = timeArray[0];
    var updatestr = {startDateTime: startDateTime};
    ReserveSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            insertreserve(name,room,startDateTime,cancel); 
            res.send({status:'success',message:true})
        }
    })
  });

app.get('/res_rec/:user',function(req,res){
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    var updatestr = {'name': req.params.user};
    ReserveSchema.find(updatestr, null, {sort: {startDateTime: -1}},function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            console.log(data)
            var data_send = data
            res.send(JSON.stringify(data_send))
        }
    })
})

/*插入數據函數*/
function insertreview(name,star,comment){
    //數據格式
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hour = dateObj.getHours()   
    var minute =dateObj.getMinutes() 
    var newdate = year + "/" + month + "/" + day + ' '+ hour +":"+ minute;
    console.log(newdate)
    var review =  new ReviewSchema({
                name : name,
                star : star,
                comment :comment,
                reviewdate : newdate
            });
    review.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}


/*註冊頁面數據接收*/
app.post('/review', function (req, res) {
  //處理跨域的問題
  res.setHeader('Content-type','application/json;charset=utf-8')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  //先查詢有沒有這個user
  var name = req.body.name;
  var star = req.body.star;
  var comment = req.body.comment;
  var updatestr = {name: name};
  ReviewSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            insertreview(name,star,comment);
            res.send({status:'success',message:true})
        }
    })
});

/*插入數據函數*/
function insertquestionnaire(name,title,url){
    //數據格式
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var hour = dateObj.getHours()   
    var minute =dateObj.getMinutes() 
    var newdate = year + "/" + month + "/" + day + ' '+ hour +":"+ minute;
    console.log(newdate)
    var questionnaire =  new QuestionnaireSchema({
                name : name,
                title : title,
                url : url,
                application_date : newdate
            });
    questionnaire.save(function(err,res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
        }
    })
}


/*註冊頁面數據接收*/
app.post('/que', function (req, res) {
  //處理跨域的問題
  res.setHeader('Content-type','application/json;charset=utf-8')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  //先查詢有沒有這個user
  var name = req.body.name;
  var title = req.body.title;
  var url = req.body.url;
  var updatestr = {name: name};
  QuestionnaireSchema.find(updatestr, function(err, obj){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            insertquestionnaire(name,title,url);
            res.send({status:'success',message:true})
        }
    })
});

var server = app.listen(process.env.PORT || 1993, function() {
    var port = server.address().port;
    console.log('server connect port :', port);
});



