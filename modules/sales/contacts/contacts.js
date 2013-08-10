var express = require('express');
var app = express();
var async = require("async");
// DB Access
app.model = require('../../../models/SalesManagerModels');


exports.getContactByCustomerId = function(req, res){
    if (req.session.loggedIn){
        var customerId = req.body.custId;
        console.log("**********************************")
        console.log("Get contact customerId:"+customerId);

        
        app.model.getSubDocument("Customer", customerId, "contacts", function(err, doc){
                                
            if(err){
                console.log("Erreur :"+err);
                res.send(500, {error:err});
                console.log("**********************************")
            } else {
                console.log("contact = "+ doc);
                res.send(doc);
                console.log("**********************************")
            }
        });
        
    } else {
        res.redirect("/login");
    }

}

exports.updateContact = function(req, res){
    var _id = req.params.id;
    var customerId = req.params.custId;
    var data = req.body;
    console.log("**********************************")
    console.log("Update Contact _id:"+_id+"- data="+JSON.stringify(data));
    app.model.updateDocument("Contact", _id, data, function(err, doc){
        if(err){
            console.log("Erreur :"+err);
            res.send(500, {error:err});
            console.log("**********************************")
        } else {
            res.redirect("/sales/customerInfos/"+customerId);
            console.log("**********************************")
        }
    });
}


exports.insertContact = function(req, res){

    var customerId = req.params.custId;
    var data = req.body;
    console.log("**********************************")
    console.log("Insert Contact customer_id:"+customerId+" - data="+JSON.stringify(data));
    //data.account_id=req.session.accountId;
    app.model.insertDocument("Contact", data, function(err, contact){
        if(err){
            console.log("Erreur :"+err);
            res.send(500, {error:err});
        } else {
            app.model.Customer.update({_id:customerId}, {"$push":{contacts:contact._id}}, function(err, numberAffected, raw){
                if(err){
                    console.log("Erreur :"+err);
                    res.send(500, {error:err});
                } else {
                    res.redirect("/sales/customerInfos/"+customerId);
                }
            });
        }
    });
    
}

exports.deleteContact = function(req, res){

    var _id = req.params.id;
    var customerId = req.params.custId;
    console.log("**********************************")
    console.log("Delete Contact customer_id:"+customerId);
    
    app.model.Customer.findById(customerId, function(err, customer){
        if (err){
            console.log("Erreur : "+err);
            res.send(500, {error:err})
        } else 
        {
            customer.contacts.pull(_id);
            app.model.deleteDocument("Contact", _id, function(err){
            	if (err){
		            console.log("Erreur : "+err);
		            res.send(500, {error:err})
		        } else 
		        {
			        customer.save(function(err){
			            if (err){
			                console.log("Erreur : "+err);
			                res.send(500, {error:err})
			            } else {
			                res.redirect("/sales/customerInfos/"+customerId);
			            }
			        })
			    }
       		});
		}
        
    });

}