var mongoose = require('mongoose');
//var Q = require('q');
//mongoose.set('debug', true);
var crypto = require('crypto');

var conn = mongoose.connect('mongodb://localhost/SalesManagerDB', {server:{poolSize:3}}, function(err){
    if (err) { 
        console.log("Connection problem: " + err); 
    }
});

/**
 * PhoneType  ['Fixe', 'mobile', ...]
 */
var PhoneTypeSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    phoneType : {type : String, unique : true, trim: true}
});

var PhoneTypeModel = mongoose.model('PhoneType', PhoneTypeSchema);

/*
* AddressType
*/
var AddressTypeSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    addressType : {type : String, unique : true, trim: true}
});

var AddressTypeModel = conn.model('AddressType', AddressTypeSchema);

/*
* Address
*/
var AddressSchema = new mongoose.Schema({
    addressType : {type : String, trim: true},
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

var StatusModel = conn.model('Status', StatusSchema);


/*
 * Industry ['Banque', 'Assurance', 'Tertiaire'...]
 */
var IndustrySchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    industry : {type : String, unique : true, trim: true}
});

var IndustryModel = conn.model('Industry', IndustrySchema);




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
    name : {
      first : {type : String, required : true},
      last : {type : String, required : true}
    },
    phones : [{
        phoneType : {type:String, trim:true},
        number : {type : String, unique: true, trim: true}
    }],
    description : {type : String,  trim: true},
    email : {type : String, trim : true}
});

var Contact = conn.model('Contact', ContactSchema);

/*
* Customers
 */
var CustomerSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    customer_owner : {type: mongoose.Schema.ObjectId, ref:'User'},
    customerCode : {type : String, unique : true, trim: true},
    customerName : {type : String, required : true, trim: true},
    description  : {type : String,  trim: true},
    logo         : {type : String,  trim: true},
    website      : {type : String,  trim: true},
    status       : {type:String, trim:true},
    industry     : {type:String, trim:true},
    gstCode      : {type:String, trim:true},
    bank : {
        account_no : {type:String, trim:true},
        bank_name  : {type:String, trim:true},
        currency   : {type:String, trim:true}
    },
    addresses:[{type: mongoose.Schema.ObjectId, ref:'Address'}],
    contacts:[{type: mongoose.Schema.ObjectId, ref:'Contact'}]
});

var CustomerModel = conn.model('Customer', CustomerSchema);


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
    description : {type : String,  trim: true},
    price : {type:Number, required : true, default : 0},
    quantity : {type:Number, required : true, default : 0},
    amount : {type:Number, required : true, default : 0},
    gst_id : {type: mongoose.Schema.ObjectId, ref:'Gst'},
    quotation : [QuotationSchema]
});

var QuotationLineModel = conn.model('QuotationLine', QuotationLineSchema);

/*
 * Invoice
 */
var QuotationSchema = new mongoose.Schema({
    account_id : {type: mongoose.Schema.ObjectId, ref:'Account'},
    customer_id : {type: mongoose.Schema.ObjectId, ref:'CustomerModel'},
    number : {type : String,  trim: true},
    date : {type : String, required : true},
    reference : {type : String, required : true},
    price : {type:Number, required : true, default : 0},
    amount : {type:String, required : true, default : 0},
    gst : {type:Number, required : true, default : 0},
    total : {type:Number, required : true, default : 0},
    status : {type:String, required : true, default : "pending"}
});

var QuotationModel = conn.model('Quotation', QuotationSchema);

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
    console.log("email="+email+"  - password="+password);
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    //UserModel.findOne({email:email, password:shaSum.digest('hex')}, function(err, doc){
    User.findOne({email:email, password:password}, function(err, doc){
        //callback(null!=doc, userID, accountID);
        callback(null!=doc, doc);
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
        /*
        var output = {accountId:this.account_id, 
            accountName:Account.findOne({_id:this.account_id}).accountName, 
            moduleId: this.module_id, moduleName: ModuleModel.findOne({_id:this.module_id}).moduleName}
        
        var output = {accountId:this.account_id, 
            moduleId: this.module_id}
        emit(this._id, output);
        */
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
    
    //query.where('customer_owner').equals(customer_owner);
    
    query.sort('_id');
    query.select('-addresses -account_id');
    query.populate('customer_owner', 'name');
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
    CustomerModel.findOne({_id:id}, function(err, customer){
        if (err) { 
            promise.error(err);
            return;
        }
        //console.log("customer="+customer);
        customer.populate('addresses').populate('contacts', function(err, customer){
            //console.log("Adresses="+customer.addresses);
            //console.log("contacts="+customer.contacts)
            //callback(null, customer);
            promise.complete(customer);
        })
        
    })
    return promise;
}

/*
module.exports.getCustomer = function(id, callback){
    console.log("Je suis ici...");
    CustomerModel.findOne({_id:id}, function(err, customer){
        if (err) { callback(err, null)}
            //console.log("customer="+customer);
            customer.populate('addresses').populate('contacts', function(err, customer){
                console.log("customer ="+customer);
                
        
      
    })
})
}
*/
module.exports.getCustomers2= function(accountId, fieldName, fieldValue, callback){
    console.log("getCustomers2");
    var customers = new Array();
    if (fieldName && fieldValue){
        var criteria = new RegExp('^'+fieldValue, 'i');
        console.log("getCustomers2 criteria="+criteria);  
        var query = CustomerModel.where(fieldName, criteria).where('account_id').equals(accountId);  
    } else {
        var query = CustomerModel.where('account_id').equals(accountId);
    }
    
    //query.where('customer_owner').equals(customer_owner);
    
    query.sort('_id');
    query.select('-addresses -account_id');
    query.populate('customer_owner', 'name');
    query.exec(function (err, docs) {
        // called when the `query.complete` or `query.error` are called
        // internally
        if (err) { callback(err, null)}
            docs.forEach(function(customer){
                var cust = {};
                cust["customer"]= customer;
                customers.push(cust);
            })
        callback(null, customers);
        //console.log("docs="+docs);
        console.log("customers="+JSON.stringify(customers));
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
module.exports.getRowById = getRowById;
/*
module.exports.GST                  = GSTModel;
module.exports.Status               = StatusModel;
module.exports.Industry             = IndustryModel;
*/
module.exports.AddressType          = AddressTypeModel;
module.exports.PhoneType            = PhoneTypeModel;
/*
module.exports.AddressAccount       = AddressAccount;
module.exports.AddressCustomer      = AddressCustomerModel;

module.exports.Module               = ModuleModel;
module.exports.ModuleAuth           = ModuleAuthModel;
module.exports.Account              = Account;
module.exports.User                 = User;
*/
module.exports.Customer             = CustomerModel;
/*
module.exports.Contact              = ContactModel;
module.exports.Quotation            = QuotationModel;
module.exports.QuotationLine        = QuotationLineModel;
module.exports.Invoice              = InvoiceModel;
module.exports.Invoice              = InvoiceLineModel;
*/
