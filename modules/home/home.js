
var express = require('express');
var fs = require('fs');
var app = express();

// DB Access
app.model = require('../../models/SalesManagerModels');

exports.index = function(req, res){
	console.log("locale="+req.locale);
    if (req.session.loggedIn){
        //console.log('Appel de la page principale..')
        fs.readFile(__dirname+'/locals/fr.json', function(err, data){
            console.log("data="+data);
            app.model.getModuleList(req.session.accountId, function(err, moduleList){
                console.log("moduleList="+moduleList);
                res.render(__dirname+'/home.jade', {moduleList:moduleList, local:data});
             });
                
            })
        
    } else {
        res.redirect('/login');
    }
    
};