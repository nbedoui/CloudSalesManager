var express = require('express');
var app = express();
// DB Access
app.model = require('../../models/SalesManagerModels');


exports.params = function(req, res){
	if (req.session.loggedIn){
		res.render(__dirname+'/params.jade');
	} else {
		res.redirect('/login');
	}

};

//TVA
exports.gst = function(req, res){
	if (req.session.loggedIn){
		app.model.getList('GSTModel', req.session.accountId, -1, -1, function(err, result){
            if(!err){
            	console.log("TVA="+result);
                res.render(__dirname+'/GST/gst.jade', {model:result});
            } else
            {
                console.log("Erreur = "+err);
                res.render('../../views/error', {error:err});
            }
        });
	} else {
		res.redirect('/login');
	}


};

//Insert TVA
exports.gstInsert = function(req, res){
	//Update entity
	if (req.session.loggedIn){
		var entity =  req.params.entity;
	    var data = req.body;
	    console.log("data="+JSON.stringify(data));
/*
	    app.model.updateEntity("GSTModel", id, data, function(err, record){
	        if(!err){
	        		console.log("OKOKOKOK");
	                if (record){
	                	console.log("record="+record);
	                    res.send(record);
	                } else {
	                    res.send(404);
	                }
	            } else {
	            	console.log("NOTOK NOTOK NOTOK NOT OK");
	                res.send(500, {error:err});
	            }
	        });
	    } else {
	        res.redirect("/login");
	    }
*/
}
};
//Update TVA
exports.gstUpdate = function(req, res){
	//Update entity
	if (req.session.loggedIn){
		var entity =  req.params.entity;
	    var id = req.params.id;
	    var data = req.body;

	    app.model.updateEntity("GSTModel", id, data, function(err, record){
	        if(!err){
	        		console.log("OKOKOKOK");
	                if (record){
	                	console.log("record="+record);
	                    res.send(record);
	                } else {
	                    res.send(404);
	                }
	            } else {
	            	console.log("NOTOK NOTOK NOTOK NOT OK");
	                res.send(500, {error:err});
	            }
	        });
	    } else {
	        res.redirect("/login");
	    }

};