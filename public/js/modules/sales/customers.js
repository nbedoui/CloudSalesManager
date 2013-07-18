(function($){
	
	Backbone.Model.prototype.idAttribute = '_id';

	var customersView;

	//Models 
	var Customer = Backbone.Model.extend({
		urlRoot:'/list/customers',
		logo:'/images/customer.png'
	});

	var CustomersList = Backbone.Collection.extend({
		model : Customer,
		url : '/list/customers'
	});

	var customers = new CustomersList();

	//Views
	var CustomerView = Backbone.View.extend({
		tagName : 'div',
		events : {
			'click .flip':'flip',
			'click .roll':'flip',
            'click .card':'selectCard',
            'click .customerDetails':'customerDetails'
		},
		customerDetails : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idCustomer = id.split('-')[1];
			console.log(" idCustomer:"+idCustomer);
			window.location.href="/sales/customerDetails/"+idCustomer+"/infos";
		},
		selectCard : function(e){
			e.preventDefault();
			var _parent = $(e.currentTarget).parent();
			var idCustomer = _parent.attr('id');
			$(".tile.wcard").removeClass('selected');
			console.log(" idCustomer:"+idCustomer);
			$("#"+idCustomer).toggleClass("selected");
		},
		flip : function(e){
			e.preventDefault();
			var id = e.currentTarget.id;
			var idCustomer = id.split('-')[1];
			console.log("id="+id+" idCustomer:"+idCustomer);
			$("#card-"+idCustomer).toggleClass("flipped");
		},
		initialize : function(){
			this.template = _.template($('#customer-template').html());
		},
		render : function(){
			var colors = ["#F3B200", "#77B900", "#2572EB", "#AD103C", "#632F00", "#B01E00", "#C1004F", "#7200AC", "#4617B4",
						  "#006AC1", "#008287", "#199900", "#00C13F", "#FF981D", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF",
						  "#4294DE", "#008E8E", "#7BAD18", "#C69408", "#DE4AAD", "#00A3A3"] 
			var data = this.model.toJSON();
			this.$el.append(this.template({model: data}));
			this.$el.attr('id', data._id);
            this.$el.addClass("tile wcard high");
            var index = Math.floor(Math.random()*24);
            color = colors[index]; 
            this.$el.css("background", color);
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
            'click #deleteBtn':'command',
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
            var idCustomer = $(".mediumListIconTextItem.selected").attr('id');
                    
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
                case "deleteBtn" : {
                    console.log("Delete customer id="+idCustomer);
                    //window.location.hash = 'customer/'+idCustomer;
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