var express = require('express');
var app = express();
// DB Access
app.model  = require('../../models/SalesManagerModels');
/*
console.log("dir="+__dirname);
app.set('views', __dirname);
app.set('view engine', 'jade');
*/

exports.index = function(req, res){
    res.render(__dirname+'/login.jade');
};

exports.logout = function(req, res){
    req.session.loggedIn = false;
    req.session.userId = null;
    res.redirect('/login');
    res.end();
}
exports.auth = function(req, res){
    console.log("Auth - name="+req.session.name);
    
    var email = req.param('email', null);
    var password = req.param('password', null);
    console.log('login request (email='+email+' - password='+password+')');
    if (null == email || email.length < 1 || null == password || password.legth < 1){
        res.send(400);
        return;
    }
    app.model.login(email, password, function(err, doc){
        if (err || !doc){
            res.redirect('/login');
            return;
        } else {
        if (!doc.active){
            console.log("Authentification echouée..");
            res.redirect('/login');
            return;
        }
        console.log('login was successful');
        //console.log()

        var userID = doc._id;
        var accountID = doc.account_id;
        var firstName = doc.name.first;
        var lastName = doc.name.last;
        console.log("UserID:"+userID+" - accountId="+accountID);
        console.log("firstName:"+firstName+" - lastname="+lastName);
        console.log("Inside auth name="+req.session.name);
        
        req.session.loggedIn = true;
        req.session.userId = userID;
        req.session.accountId = accountID;
        req.session.firstname = firstName;
        req.session.lastname = lastName;
        console.log("userId="+req.session.userId+" - firstName="+req.session.firstname+" - lastName="+req.session.lastname);
        
        res.redirect('/');
        }
    });


   
	
};