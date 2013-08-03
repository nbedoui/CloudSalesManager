(function($){
	
	Backbone.Model.prototype.idAttribute = '_id';

	var customersView;

	//Models 
	var Customer = Backbone.Model.extend({
		urlRoot:'/list/customers',
		logo:'/images/client_company_large.png'
	});

	var CustomersList = Backbone.Collection.extend({
		model : Customer,
		url : '/list/customers'
	});

	var customers = new CustomersList();

	//Views
	var CustomerView = Backbone.View.extend({
		tagName : 'li',
		events : {
			'click .card':'selectCard',
            'click .customerDetails':'customerDetails'
		},
		customerDetails : function(e){
			e.preventDefault();
			console.log("customerDetails...");
			var id = e.currentTarget.id;
			//var idCustomer = id.split('-')[1];
			var idCustomer = id;
			console.log(" idCustomer:"+idCustomer);
			window.location.href="/sales/customerInfos/"+idCustomer;
		},
		selectCard : function(e){
			e.preventDefault();
			var _parent = $(e.currentTarget).parent();
			var idCustomer = _parent.attr('id');
			$(".tile.wcard").removeClass('selected');
			console.log(" idCustomer:"+idCustomer);
			$("#"+idCustomer).toggleClass("selected");
		},
		initialize : function(){
			this.template = _.template($('#customer-template').html());
		},
		render : function(){
			var data = this.model.toJSON();
			this.$el.append(this.template({model: data}));
			this.$el.attr('id', data._id);
            return this;
		}
	})

	var CustomersView = Backbone.View.extend({
		model: customers,
		el : $('#customers-container'),
		perPage : 10,
		events : {
			'click #search':'searchCustomer',
			'keypress #searchFieldValue':'searchCustomerEdit',
			'click #homeBtn':'command',
			'click #searchBtn':'command',
            'click #addBtn':'command',
            'click #prevBtn':'command',
            'click #nextBtn':'command'

		},
		initialize : function(){
			var self =this;
			this.options.page=1;
			this.fetch('');
		},
		fetch : function(params){
			var self = this;

			this.model.fetch(
				{
					data:$.param(params),
					type: 'POST',
					success: function(){ 
						self.count = self.model.models.length;
						self.maxPages = Math.ceil(parseInt(self.count, 10) / parseInt(self.perPage, 10));
						self.render();

					},
					error: function(){
						console.log('Cannot retrive models from server');
					}
				})

		},
		render: function(){
			
			var customers = this.model.models;
			
			var startPos = (this.options.page-1)*this.perPage;
			var endPos = Math.min(startPos + this.perPage, this.count);
			console.log("startPos="+startPos+" endPos="+endPos);
			var self = this;
			$("#customers-list").html('');
			for (var i = startPos; i < endPos; i++){
				var customerView = (new CustomerView({model: customers[i]})).render().el;
			    $("#customers-list").append(customerView);
			};

			if (this.options.page == this.maxPages){
                	this.disableBtn("#nextBtn");
                }
			return this;
		},
		enableBtn : function(id){
			if ($(id).hasClass("disabled")){
                $(id).removeClass("disabled");
            }
		},
		disableBtn : function(id){
			if (! $(id).hasClass("disabled")){
                $(id).addClass("disabled");
            }
		},
        command : function(e){
        	var idBtn = arguments[0].currentTarget.id;
                    
            switch(idBtn) {
                case "searchBtn" : {
                	console.log("Search...");
                	$("#searchPanel").toggle("slow");
                }
                break;
                case "addBtn" : {
                	console.log("Ajouter un client");
                	window.location.href = '/sales/newCustomer';
                }
                break;
                case "prevBtn" : {
                	if (this.options.page > 1){
                		this.options.page -=1;	
                		this.render();
                		this.enableBtn("#nextBtn");
                		if (this.options.page == 1){
                			this.disableBtn("#prevBtn");
                		}
                	} 
                }
                break;
                case "nextBtn" : {
                	if (this.options.page < this.maxPages){
                		this.options.page +=1;
                		this.enableBtn("#prevBtn");	
                		this.render();
                		if (this.options.page == this.maxPages){
                			this.disableBtn("#nextBtn");
                		}
                	} 
                    
                }
                break;
            }
        },
        searchCustomer : function(e){
        	console.log("Search?...");
        	var self = this;
        	var fieldName = $("#searchFieldName").val();
        	var fieldValue = $("#searchFieldValue").val();
        	var searchParams = '';
            if (fieldValue){
                console.log("fieldName="+fieldName+" = fieldValue="+fieldValue);
                searchParams = {'fieldName':fieldName, 'fieldValue':fieldValue}
                //this.fetch("/list/Customers/"+fieldName+"/"+fieldValue);
                this.fetch(searchParams);
            } 
        },
        searchCustomerEdit : function(e){
        	if (e.keyCode == 13) {
        		e.preventDefault();
        		this.searchCustomer();
        	}
        }
	});
	$(document).ready(function(){
		customersView = new CustomersView();
		Backbone.history.start({pushState: true});
	})
})(jQuery);