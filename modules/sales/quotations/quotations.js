var express = require('express');
var app = express();
//var async = require("async");
// DB Access
app.model = require('../../../models/SalesManagerModels');


exports.index = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/quotations.jade');
	} else {
		res.redirect('/login');
	}

}

exports.newQuotation = function(req, res){
    if (req.session.loggedIn){
        res.render(__dirname+'/quotation.jade');
    } else {
        res.redirect('/login');
    }

}

exports.quotationsList = function(req, res){
    if (req.session.loggedIn){
        console.log("accountid="+req.session.accountId);
        
        app.model.getQuotations(req.session.accountId, null, null, function(err, result){
            if(!err){
                //console.log(result);
                res.send(result);
            } else
            {
                console.log("Erreur = "+err);
                res.render('../../views/error', {error:err});
            }
        });
    } else {
        res.redirect('/login');
    }
    
    
}