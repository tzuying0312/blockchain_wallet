
var express = require('express');
var app = express();
var userSchema = require('./user');
var PaySchema = require('./pay');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');


//連接本地數據庫
var DB_URL = 'mongodb://localhost:27017/wallet'
mongoose.connect(DB_URL);

//解析表單數據
app.use(bodyParser.urlencoded({extended:true}))

/*插入數據函數*/
function insert(name,psw,email,academy,grade,identity){
    //數據格式
    var user =  new userSchema({
                username : name,
                userpsw : psw,
                email : email,
                academy : academy,
                grade : grade,
                identity : identity,
                logindate : new Date()
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
  //處理跨域的問題
  res.setHeader('Content-type','application/json;charset=utf-8')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
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
    res.setHeader('Content-type','application/json;charset=utf-8')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    
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


/*插入數據函數*/
function insertpay(sender,receiver,cost,message){
    //數據格式
    var pay =  new PaySchema({
                sender : sender,
                receiver : receiver,
                cost : cost,
                message : message,
                paydate : new Date()
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


var server = app.listen(1993,function(){
    console.log('server connect');
})