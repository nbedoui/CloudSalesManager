(function($){
	
	Backbone.Model.prototype.idAttribute = '_id';

	var customersView;

	//Models 
	
	//Views
	var CustomerWebSite = Backbone.View.extend({
		tagName : 'li',
		events : {
			'click .card':'selectCard',
            'click .customerDetails':'customerDetails'
		},
		initialize : function(){
			this.template = _.template($('#customerWebsite-template').html());
		},
		render : function(){
			this.$el.append(this.template());
			 this.$el.addClass("fields");
			//this.$el.attr('id', data._id);
            return this;
		}
	})

	var CustomerWebSites = Backbone.View.extend({
		el : $('#clientcompany_web_address'),
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
			this.render();
		},
		render: function(){
			
			var self = this;
			$("#websites").html('');
			for (var i = 0; i < 3; i++){
				var customerWebSite = (new CustomerWebSite()).render().el;
			    $("#websites").append(customerWebSite);
			};

			if (this.options.page == this.maxPages){
                	this.disableBtn("#nextBtn");
                }
			return this;
		}
	});
	$(document).ready(function(){
		customerWebSites = new CustomerWebSites();
		Backbone.history.start({pushState: true});
	})
})(jQuery);