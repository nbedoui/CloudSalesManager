var mongoose = require('mongoose');
var _ = require("underscore");
//var Q = require('q');
mongoose.set('debug', true);
var crypto = require('crypto');

var conn = mongoose.connect('mongodb://localhost/SalesManagerDB', {server:{poolSize:3}}, function(err){
    if (err) { 
        console.log("Connection problem: " + err); 
    }
});

/**
*  Counter
*/
var CounterSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    Year : {type : String,  required : true, trim: true},
    entity : {type : String,  required : true, trim: true},
    counter : {type : Number, required : true}
})

var Counter = mongoose.model('Counter', CounterSchema);

/*
* Address
*/
var AddressSchema = new mongoose.Schema({
    street : {type : String, trim: true},
    zipCode : {type : String,  trim: true},
    city : {type : String,  trim: true},
    country : {type : String,  trim: true}
});

var Address = conn.model('Address', AddressSchema);


/*
* Account : Compte client SalesManager (Utilisateur de l'application)
*/
var AccountSchema = new mongoose.Schema({
    accountCode : {type : String, unique : true, trim: true},
    accountName : {type : String, required : true, trim: true},
    description : {type : String,  trim: true},
    logo : {type : String,  trim: true},
    website : {type : String,  trim: true},
    status : {type:String, trim:true},
    industry : {type:String, trim:true},
    gstCode : {type:String, trim:true},
    iban : {type:String, trim:true},
    addresses:[{type: mongoose.Schema.ObjectId, ref:'Address'}]
});

var Account = conn.model('Account', AccountSchema);

var ModuleSchema = new mongoose.Schema({
    moduleName : {type : String, unique : true, trim: true}
})

var ModuleModel = conn.model('Module', ModuleSchema);

var ModuleAuthSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    module_id : {type: mongoose.Schema.ObjectId, ref:'ModuleModel'},
    active : {type : Boolean, required : true},
})
var ModuleAuthModel = conn.model('ModuleAuth', ModuleAuthSchema);

/**
* GST (TVA) [5.5, 7, 19.6 ...]
*/
var GSTSchema = new mongoose.Schema({
     account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
     tauxGST : {type : Number, unique : true}
 });

var Gst = conn.model('Gst', GSTSchema);

/*
/*
* Status ['Client', 'Prospect', 'Contact'...]
*/
var StatusSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    status : {type : String, unique : true, trim: true}
});

var Status = conn.model('Status', StatusSchema);


/*
 * Industry ['Banque', 'Assurance', 'Tertiaire'...]
 */
var IndustrySchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    industry : {type : String, unique : true, trim: true}
});

var Industry = conn.model('Industry', IndustrySchema);




/*
* User : Utilisateur de l'application
*/
var UserSchema = new mongoose.Schema({
    email : {type : String, unique : true, trim: true},
    password : {type : String, required : true, trim: true},
    name : {
        first : {type : String, required : true, trim: true},
        last : {type : String, required : true, trim: true}
    },
    active : {type : Boolean, required : true},
    photoUrl : {type:String, trim:true},
    phones : [{
        phoneType : {type:String, trim:true},
        number : {type : String, unique: true, trim: true}
    }],
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'}
});

var User = conn.model('User', UserSchema);
/*
 * Contact
 */
var ContactSchema = new mongoose.Schema({
    firstName : {type : String, required : true, trim : true},
    lastName : {type : String, required : true, trim : true},
    phone : {type:String, trim:true},
    mobile : {type:String, trim:true},
    
    description : {type : String,  trim: true},
    email : {type : String, trim : true}
});

var Contact = conn.model('Contact', ContactSchema);

/*
* Bank
*/
var BankSchema = new mongoose.Schema({
    account_no : {type:String, trim:true},
    bank_name  : {type:String, trim:true},
    currency   : {type:String, trim:true}
}) 
/*
* Customers
 */
var CustomerSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    customerName : {type : String, required : true, trim: true},
    logo        : {type : String,  trim: true},
    description  : {type : String,  trim: true},
    website      : {type : String,  trim: true},
    email        : {type : String,  trim: true},
    phone        : {type : String,  trim: true},
    mobile       : {type : String,  trim: true},
    industry     : {type : String, trim:true},
    gstNumber    : {type : String, trim:true},
    addresses    : [{type : mongoose.Schema.ObjectId, ref:'Address'}],
    contacts     :[{type : mongoose.Schema.ObjectId, ref:'Contact'}]
});

var Customer = conn.model('Customer', CustomerSchema);


/*
* InvoiceLine
 */
var InvoiceLineSchema = new mongoose.Schema({
    description : {type : String,  trim: true},
    price : {type:Number, required : true, default : 0},
    quantity : {type:Number, required : true, default : 0},
    amount : {type:Number, required : true, default : 0},
    gst_id : {type: mongoose.Schema.ObjectId, ref:'Gst'},
    invoice : [InvoiceSchema]
});

var InvoiceLineModel = conn.model('InvoiceLine', InvoiceLineSchema);

/*
 * Invoice
 */
var InvoiceSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    customer_id : {type: mongoose.Schema.ObjectId, ref:'CustomerModel'},
    number : {type : String,  trim: true},
    date : {type : Date, required : true},
    price : {type:Number, required : true, default : 0},
    amount : {type:Number, required : true, default : 0},
    gst : {type:Number, required : true, default : 0},
    total : {type:Number, required : true, default : 0},
    edited : {type:Boolean, required : true, default : false},
    Quotation : [QuotationSchema]
});

var InvoiceModel = conn.model('Invoice', InvoiceSchema);

/*
 * QuotationLine
 */
var QuotationLineSchema = new mongoose.Schema({
    product_id : {type: mongoose.Schema.ObjectId, ref:'Product'},
    productName : {type : String,  trim: true},
    productDescription : {type : String,  trim: true},
    productSalesPrice : {type:Number, required : true, default : 0},
    productUnit : {type : String,  trim: true},
    quantity : {type:Number, required : true, default : 0},
    amount : {type:Number, required : true, default : 0},
    productSalesDiscount : {type:Number, required : true, default : 0},
    amountAfterDiscount : {type:Number, required : true, default : 0},
    productGST : {type:Number, required : true, default : 0}
    
});

var QuotationLineModel = conn.model('QuotationLine', QuotationLineSchema);

/*
 * Invoice
 */
var QuotationSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    customer_id : {type: mongoose.Schema.ObjectId, ref:'CustomerModel'},
    customerName : {type : String,  trim: true},
    customerAddress :  {type : String,  trim: true},
    quotation_number : {type : String,  trim: true},
    date : {type : String, required : true,  trim: true},
    reference : {type : String, trim : true},
    
    amount : {type:String, required : true, default : 0},
    discount : {type:Number, required : true, default : 0},
    amountAfterDiscount : {type:Number, required : true, default : 0},
    GST : {type:Number, required : true, default : 0},
    amountAll : {type:Number, required : true, default : 0},
    status : {type:String, required : true, default : "pending"},
    quotation_lines:[QuotationLineSchema]

});

var Quotation = conn.model('Quotation', QuotationSchema);


/*
* Products
*/

var ProductSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    productName : {type : String, unique : true, trim: true},
    productDescription  : {type : String,  trim: true},
    productCostPrice : {type : Number,  trim: true, default : 0},
    productUnit : {type : String,  trim: true},
    productSalesPrice : {type : Number,  trim: true, default : 0},
    productSalesDiscount : {type : Number,  trim: true, default : 0},
    productGST : {type : Number,  trim: true, default : 0},
    productAccount : {type : String,  trim: true},
    productActive : {type : Boolean, required : true, default : true},
    productStock : {type : Number,  trim: true, default : 0},


})

var Product = conn.model('Product', ProductSchema);

var registerCallBack = function(err){
    if (err){
        return console.log(err);
    };
    return console.log('Account was created.');
};

var getCount = function(entity, criteria, callback){
    if (criteria){
        conditions = criteria;
    } else {
        conditions = {};
    }
    console.log("  criteria"+ JSON.stringify(conditions));
    var obj = eval(entity);
    obj.count(conditions, function(err, count){
        if(err){
            callback(err, null);
        } else {
            callback(null, count);
        }
    })

}

var pagesNumber = function(entity, criteria, linePerPage, callback){
    console.log("  criteria"+ JSON.stringify(criteria));
    /*
    var obj = eval(entity);
    obj.count(criteria, function(err, count){
        if(err){
            console.log("");
            callback(err, null);
        } else {
            var pages = Math.ceil(count / linePerPage);
            console.log("Pages: %d ", pages);
            callback(null, pages);
        }
    })
    */

    getCount(entity, criteria, function(err, count){
        if(err){
            console.log("");
            callback(err, null);
        } else {
            var pages = Math.ceil(count / linePerPage);
            console.log("Pages: %d ", pages);
            callback(null, pages);
        }
    })
}

module.exports.changePassword = function(accountId, newpassword){
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    User.update({_id:accountId}, {$set: {password:hashedPassword}}, {upset:false},
      function changePasswordCallback(err){
          console.log('Change password done for account ' + accountId);
      });
};

module.exports.login = function(email, password, callback){
    console.log("Login --- email="+email+"  - password="+password);
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    //UserModel.findOne({email:email, password:shaSum.digest('hex')}, function(err, doc){
    User.findOne({email:email, password:password}, function(err, doc){
        if (err || !doc) {
            console.log("Erreur="+err);
            callback(err, null)
        } else {
            console.log("doc="+doc);
            callback(null, doc);
        }
        //callback(null!=doc, userID, accountID);
        
    });
};

var register = function(email, password, firstName, lastName){

}

module.exports.forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Account.findOne({email: email}, function findAccount(err, doc){
        if (err) {
            // Email address is not a valid user
            callback(false);
        } else {
            var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
            resetPasswordUrl += '?account=' + doc._id;
            smtpTransport.sendMail({
                from: 'thisapp@example.com',
                to: doc.email,
                subject: 'SalesManager Password Request',
                text: 'Click here to reset your password: ' + resetPasswordUrl
            }, function forgotPasswordResult(err) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    });
};

//Get invoices / Quotes numbers
module.exports.getCounter = function(criteria, callback){
    var query = Counter.findOne(criteria, 'counter', function(err, counter){
            if (err) {
                console.log("Erreur :"+err);
                callback(err, null);
            } else {
                console.log("Counter ="+ counter);
                callback(null, counter);
            }
    });
}

module.exports.getList = function(entity, accountId, page, count, callback){
    console.log("Récupération des informations concernant l'entité :"+entity);
    var obj = eval(entity);
    var ins = new obj();
    var query = obj.find({account_id:accountId}, function(err){
        if(err){
            console.log("ici erreur....");
            callback(err, null);
        } else {
            if ((page >= 0) && (count >= 0)){
                query.limit(count);
                query.skip((page-1)*count+1);
            }
            query.sort('_id');
            query.exec(function (err, docs) {
                    // called when the `query.complete` or `query.error` are called
                    // internally
                if (err) { 
                    console.log("err="+err);
                    callback(err, null)
                } else {
                    callback(null, docs);
                }
                //console.dir(docs);
            });
        }    
    });
}


module.exports.getReferenceList = function(entity, accountId, callback){
    console.log("Récupération des informations concernant l'entité :"+entity);
    var obj = eval(entity);
    var ins = new obj();
    var query = obj.find({account_id:accountId}, function(err, doc){
        if(err){
            console.log("ici erreur....");
            callback(err, null);
        } else {
            callback(null, doc);
        }    
    });
}

module.exports.getListWithCriteria = function(entity, criteria, callback){
    //console.log("Récupération des informations concernant l'entité :"+entity);
    console.log("entity="+entity+" - criteria="+JSON.stringify(criteria));
    

    var obj = eval(entity);
    var query = obj.find(criteria);
    query.sort('_id');
    query.exec(function (err, docs) {
        // called when the `query.complete` or `query.error` are called
        // internally
        if (err) { callback(err, null)}
        callback(null, docs);
        //console.dir(docs);
    });
}

module.exports.getListWithTextCriteria = function (entity, accountId, fieldName, fieldValue, callback){
    //console.log("Récupération des informations concernant l'entité :"+entity);
    console.log("entity="+entity+" - fieldName="+fieldName+" - fieldValue="+fieldValue);
    
    var obj = eval(entity);
    var criteria = new RegExp('^'+fieldValue, 'i');
    console.log("criteria="+criteria);
    var query = obj.where(fieldName,criteria).where('account_id').equals(accountId);
    query.sort('_id');
    query.exec(function (err, docs) {
        // called when the `query.complete` or `query.error` are called
        // internally
        if (err) { callback(err, null)}
        callback(null, docs);
        //console.dir(docs);
    });
}
module.exports.getModuleList = function(accountId, callback){
    var moduleList = new Array(); 
    ModuleAuthModel.find({account_id:accountId, active:true}, function(err, moduleAuth){
                if (err){
                    console.log("Erreur ="+err);
                } else {
                    console.log("moduleAuth="+moduleAuth);
                    var counter = 0;
                    var MaxItem = moduleAuth.length;
                    moduleAuth.forEach(function(m){
                        ModuleModel.findOne({_id:m.module_id}, function(err2, module){
                            ++counter;
                            moduleList.push(module.moduleName);
                            if(MaxItem == counter) {
                                callback(null, moduleList);
                            }
                        })
                    });
                    console.log("Modules : ");
                    moduleList.forEach(function(m){
                        console.log(m.module);
                    });
                }
    } );
}

function mapreduce(){
    var o = {};
    o.map = function(){
        for (var i in this.account_id){
            key = {account: this.account_id[i]};
            value = {modules : [this.module_id]};
            emit(key, value);
        }
        
    }
    o.reduce = function(k, values){
        var module_list = {modules:[]};
        for (var i in values){
            module_list.models = values[i].modules.concat(module_list.modules);
        }
        return module_list;
    }

    ModuleAuthModel.mapReduce(o, function(err, results){
        if (err){
            console.log("erreur="+err)
        } else {
           console.log(results); 
        }
    })
}
module.exports.getCustomers= function(accountId, fieldName, fieldValue, callback){

    if (fieldName && fieldValue){
        var criteria = new RegExp('^'+fieldValue, 'i');
        console.log("criteria="+criteria);  
        var query = CustomerModel.where(fieldName, criteria).where('account_id').equals(accountId);  
    } else {
        var query = CustomerModel.where('account_id').equals(accountId);
    }
    
    query.sort('_id');
    query.select('-addresses -account_id');
    query.exec(function (err, docs) {
        // called when the `query.complete` or `query.error` are called
        // internally
        if (err) { callback(err, null)}
        callback(null, docs);
        console.log(docs);
    });

}

getCustomerAddresses = function(customerId, callback){

    var query = AddressCustomer.where('customer_id').equals(customerId);
    query.sort('_id');
    query.exec(function (err, docs) {
        // called when the `query.complete` or `query.error` are called
        // internally
        if (err) { 
            console.log("Erreur="+err);
            callback(err, null)}
        callback(null, docs);
        //console.dir(docs);
    });

}

getRowById = function(entity, id, callback){
    var obj = eval(entity);
    console.log("Id="+id);
    obj.findById(id, function(err, docs){
            if (err) { callback(err, null)}
        callback(null, docs);
    })
    
}

//Update entity
module.exports.getDocument = function(entity, id, callback){
   
    console.log("entity="+entity+"  id="+id);
    var obj = eval(entity);
    obj.findById(id, function (err, doc) {
        if(!err){
            callback(null, doc);
        } else {
            callback(err, null);
        }
    });    
    
}

module.exports.getSubDocumentById = function(entity, subdoc, id, callback){
    
    console.log("id="+id);
    var criteria = {};
    criteria[subdoc+"._id"] = id;
    var obj = eval(entity);
    var _subDoc = null;
    obj.findOne(criteria, function(err, doc){
       if(!err){
            var subDocs = doc[subdoc];
            subDocs.forEach(function(subDoc){
                if (subDoc._id == id){
                    _subDoc = subDoc;
                    return;
                }
            });
            callback(null, _subDoc);
        } else {
            console.log("Erreur="+err);
            callback(err, null);
        } 
    })
}

module.exports.getSubDocument = function(entity, parentId, subdoc,  fieldName, fieldValue, callback){
    
    console.log("parentId="+parentId);
    console.log(fieldName+" = "+fieldValue);
    var obj = eval(entity);
    var _subDoc = null;
    obj.findById(parentId, function(err, doc){
       if(!err){
            var subDocs = doc[subdoc];
            subDocs.forEach(function(subDoc){
                if (subDoc[fieldName] == fieldValue){
                    _subDoc = subDoc;
                    return;
                }
            });
            callback(null, _subDoc);
        } else {
            console.log("Erreur="+err);
            callback(err, null);
        } 
    })
}

module.exports.updateSubDocument = function(entity, id, subdoc, idSub, data, callback){

    var criteria = {};
    criteria["_id"] = id;
    criteria[subdoc] = idSub;
    console.log("criteria="+JSON.stringify(criteria));
    console.log("entity="+entity+"  id="+id+"  data="+JSON.stringify(data));
    var obj = eval(entity);
    //console.log("Entity : "+obj);
    obj.update(criteria, {$set:data}, function (err, doc) {
        if(!err){
            console.log("doc="+doc);
            callback(null, doc);
        } else {
            console.log("Erreur="+err);
            callback(err, null);
        }
    });
        
}
//Update entity
module.exports.updateDocument = function(entity, id, data, callback){
   
    console.log("entity="+entity+"  id="+id+"  data="+JSON.stringify(data));
    var obj = eval(entity);
    obj.findByIdAndUpdate(id, {$set:data}, function (err, doc) {
        if(!err){
            callback(null, doc);
        } else {
            callback(err, null);
        }
    });    
    
}

//Insert new record
module.exports.insertDocument = function(entity, data, callback){
        console.log("entity="+entity+"  data="+JSON.stringify(data));
        console.log("Add item...");
        var obj = eval(entity);
        var ins = new obj(data);
        ins.save(function(err, ins){
            if (!err) {
                callback(null, ins);
            } else {
                callback(err, ins);
            }

        });
}

//Delete Entity
module.exports.deleteDocument = function(entity, id, callback){
        console.log("Delete Document "+entity+"  id="+id);
        var obj = eval(entity);
        obj.findByIdAndRemove(id, function (err) {
            if(!err){
                callback(null);
            } else {
                callback(err);
            }
        });
}

module.exports.getCustomer = function(id, callback){
    var promise = new mongoose.Promise;
    if (callback) promise.addBack(callback);
    Customer.findOne({_id:id}, function(err, customer){
        if (err) { 
            promise.error(err);
            return;
        }
        console.log(" ++++++ Customer ="+customer);
        customer.populate('contacts', function(err, customer){
            promise.complete(customer);
        })
        
    })
    return promise;
}

module.exports.getCustomerInfos = function(id, callback){
    //Customer.findOne({_id:id}).populate('contacts').populate('addresses', function(err, customer){
    Customer.findOne({_id:id}).populate('contacts').populate('addresses').exec(function(err, customer){
        if (err) {
            callback(err, null);
        } else {
            console.log("=====> customer Infos :"+customer);
            callback(null, customer);
        }
    })
}

module.exports.getCustomers2= function(accountId, fieldName, fieldValue, callback){
    console.log("getCustomers2");
    //var customers = new Array();
    if (fieldName && fieldValue){
        var criteria = new RegExp('^'+fieldValue, 'i');
        //console.log("getCustomers2 criteria="+criteria);  
        var query = Customer.where(fieldName, criteria).where('account_id').equals(accountId);  
    } else {
        var query = Customer.where('account_id').equals(accountId);
    }
    
    query.sort('customerName');
    query.select('_id customerName website email phone mobile addresses logo industry');
    query.populate('addresses');
    query.exec(function (err, docs) {
        if (err) { 
            callback(err, null)
        } else {
            callback(null, docs);

        } 
                    
    });

}

module.exports.getCustomerDetails = function(id, callback){
    var details = {};
    var q = QuotationModel.count({customer_id:id, status:'pending'});
    var promise = q.exec();
    promise.addBack(function (err, count){
        details["QuotationPending"]=count;
        //console.log("details="+JSON.stringify(details));
    })

    var q = QuotationModel.count({customer_id:id, status:'transformed'});
    var promise = q.exec();
    promise.addBack(function (err, count){
        details["QuotationTransformed"] = count;
        //console.log("details="+JSON.stringify(details));
    })

    var q = QuotationModel.count({customer_id:id, status:'ejected'});
    var promise = q.exec();
    promise.addBack(function (err, count){
        details["QuotationEjected"] = count;
        //console.log("details="+JSON.stringify(details));
    })

    var q = CustomerModel.findOne({_id:id});
    var promise = q.exec();
    promise.addBack(function (err, customer){
        details["Customer"] = customer;
        //console.log("details="+JSON.stringify(details));
    })
    .then(function(){
        //var json = JSON.parse(details);
        callback(null, details);
        //console.log("details="+JSON.stringify(details));
    })


   
}

//Products
module.exports.getProducts= function(accountId, fieldName, fieldValue, active, callback){
    console.log("getProducts");
    //var customers = new Array();
    if (fieldName && fieldValue){
        var criteria = new RegExp('^'+fieldValue, 'i');
        //console.log("getCustomers2 criteria="+criteria);  
        var query = Product.where(fieldName, criteria).where('productActive').equals(active).where('account_id').equals(accountId);  
    } else {
        var query = Product.where('productActive').equals(active).where('account_id').equals(accountId);
    }
    
    query.sort('productName');
    query.select('_id productName productName productDescription productSalesPrice productActive');
    query.exec(function (err, docs) {
        if (err) { 
            callback(err, null)
        } else {
            callback(null, docs);

        } 
                    
    });

}

//Products
module.exports.getProductNameList= function(accountId, fieldValue, callback){
    console.log("getProductNameList");
    //var customers = new Array();
    if (fieldValue){
        var criteria = new RegExp('^'+fieldValue, 'i');
        console.log(" criteria="+criteria);  
        var query = Product.where("productName", criteria).where('productActive').equals(true).where('account_id').equals(accountId);  
    } else {
        var query = Product.where('productActive').equals(true).where('account_id').equals(accountId);
    }
    
    query.sort('productName');
    query.select('_id productName');
    query.exec(function (err, docs) {
        if (err) { 
            callback(err, null)
        } else {
            callback(null, docs);

        } 
                    
    });

}

//Code lists
module.exports.getCustomerNameList= function(accountId, fieldValue, callback){
    console.log("getCustomerNameList");
    //var customers = new Array();
    if (fieldValue){
        var criteria = new RegExp('^'+fieldValue, 'i');
        console.log(" criteria="+criteria);  
        var query = Customer.where("customerName", criteria).where('account_id').equals(accountId);  
    } else {
        var query = Customer.where('account_id').equals(accountId);
    }
    
    query.sort('customerName');
    query.select('_id customerName');
    query.exec(function (err, docs) {
        if (err) { 
            callback(err, null)
        } else {
            callback(null, docs);

        } 
                    
    });

}

var getQuotes= function(accountId, callback){
    //console.log("getCustomers2");
    var quotations = new Array();
    var query = model.Quotation.where('account_id').equals(accountId);
    
    
    query.sort('_id');
    query.select('_id number date reference total status customer_id');
    query.populate('customer_id', 'customerName customerCode');
    query.exec(function (err, docs) {
        //console.log("quotations="+docs);
        // called when the `query.complete` or `query.error` are called
        // internally
        
        if (err) { 
                callback(err, null)
        } else {
            docs.forEach(function(quotation){
                console.log("Customer = "+quotation.customer_id)
            })
            callback(null, docs);
        }
        //console.log("docs="+docs);
        //console.log("customers="+JSON.stringify(customers));
    });

}

module.exports.getRowById = getRowById;
/*
module.exports.GST                  = GSTModel;
module.exports.Status               = StatusModel;
module.exports.Industry             = IndustryModel;
module.exports.AddressAccount       = AddressAccount;
module.exports.AddressCustomer      = AddressCustomerModel;

module.exports.Module               = ModuleModel;
module.exports.ModuleAuth           = ModuleAuthModel;
module.exports.Account              = Account;
module.exports.User                 = User;
*/
module.exports.Customer             = Customer;
/*
module.exports.Contact              = ContactModel;
module.exports.Quotation            = QuotationModel;
module.exports.QuotationLine        = QuotationLineModel;
module.exports.Invoice              = InvoiceModel;
module.exports.Invoice              = InvoiceLineModel;
*/
