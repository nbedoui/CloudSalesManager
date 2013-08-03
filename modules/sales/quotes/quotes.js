var express = require('express');
var app = express();
var utils=require('../../../models/utils');
//var async = require("async");
// DB Access
app.model = require('../../../models/SalesManagerModels');

var moment = require('moment');
exports.index = function(req, res){
	if (req.session.loggedIn){

		res.render(__dirname+'/quotes.jade');
	} else {
		res.redirect('/login');
	}

}

exports.newQuote = function(req, res){
    if (req.session.loggedIn){

        var current_date = new Date();
        
        var dateOfDay =  moment(current_date).format("YYYY-MM-DD");
        var quote_number =  "(TEMP "+moment(current_date).format("YYYYMMDDHHmmssSSS")+")";
        console.log("date :"+dateOfDay);

        res.render(__dirname+'/Quote.jade', {"currentDate":dateOfDay, "quote_number":quote_number});
    } else {
        res.redirect('/login');
    }

}



exports.saveQuote = function(req, res){
    if (req.session.loggedIn){
        console.log("Save quote...");

        var data = req.body;
        var year = (new Date()).getFullYear();
        var criteria = {};
        criteria["Year"] = year;
        criteria["entity"] = "Quote";
        criteria["account_id"] = req.session.accountId;
        app.model.getCounter(criteria, function(err, counter){
            if(err){
                console.log("Erreur ="+err);
            } else {
                var _counter = counter.counter;
                _counter += 1; 
                _counter = utils.pad(_counter);
                console.log("Counter="+_counter);

                app.model.insertDocument('Quotation', data, function(err, quote){
                    if(err){
                        console.log('Erreur ='+ err);
                        res.send(500);
                    } else {
                        console.log("Quote="+quote);
                        res.send(quote);
                    }
                })
            }
        })

        console.log("Critère="+ JSON.stringify(criteria));

        
        //res.render(__dirname+'/newQuote.jade', {"currentDate":dateOfDay, "quote_number":quote_number});
    } else {
        res.redirect('/login');
    }

}

exports.quotesList = function(req, res){
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