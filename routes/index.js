var home = require('../modules/home/home');
var login = require('../modules/login/login');
var common = require('../modules/common/common');
var sales = require('../modules/sales/sales');

//app.use(home);
//app.use(login);
//app.use(sales);

module.exports = function(app){
	app.get('/', home.index);


	app.get('/login', login.index);
	app.post('/auth', login.auth);


	app.get('/sales', sales.index);


	app.get('/sales/customers', sales.customers);


	app.get('/sales/customer/:id', sales.customer);
	app.get('/sales/customerDetails/customer=:id', sales.customerDetails);

	//Quotations
	app.get('/sales/quotations/:custId/:status', sales.customerQuotations);
	//api
	app.get('/list/customers', sales.customersList)
	app.get('/list/customer/customerName=:fieldValue', sales.customersSubList)

	app.get('/custs', sales.custs);

	//Common pages
	app.get('/params', common.params);
	
}