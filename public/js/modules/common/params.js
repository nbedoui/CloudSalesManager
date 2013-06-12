$(document).ready(function (){
	var showMessage = function(msg){
		//show an error message
		$('#error').text(msg);
		$('#error').show('fast');
		//setTimeout( "jQuery('#error').hide();",3000 );
		
		setTimeout(function(){
			//$('#error').hide('slow');
			$('#error').text("fini");
			console.log("Fini");
		}, 3000);  //The message is displayed for 5 sec
	
	}

	//Generic function for sending data to the server
	var sendData = function(entity, method, url, data, callback){
		var entity = entity;
		$.ajax({
				type: method,
				url:url,
				data:data,
				success: function(data, textStatus, xhr){
					console.log("update data ok : "+textStatus);
					callback(null, textStatus);
					//window.location.href="/params/"+entity;
				},
				error: function(xhr, textStatus, error){
					var msg ="Impossible de modifier l'élément sélectionné : ";
					switch (xhr.status) {
						case 404: {
							msg += "Problème de connexion avec le serveur";
							break;
						}
						case 500: {
							var responseText = $.parseJSON(xhr.responseText);
							var error = responseText.error;
							msg += error.name+" : "+error.errmsg;
							break;
						}
					}
					callback(error, msg);
				}
				});

	}

		//Insert data

		var insertData = function(){
			var dataString = $('form').serialize()
				console.log("Enregistrer les données..."+dataString);
				var entity = $("#table").attr("entity");
				var url = '/params/insert/'+entity;
				sendData(entity, 'POST', url, dataString, function(err, msg){
					if(err){
						console.log("Erreur="+err.name+" - msg:"+msg);
						showMessage(msg);
					} else {
						console.log("OK - msg:"+msg);
						window.location.href="/params/"+entity;
					}
				});
		}

		$("#submit").on('click', function(e){
				e.preventDefault();
				insertData();
		})

		$("#addItem").on('webkitspeechchange', function(e){
				e.preventDefault();
				insertData();
		})
		
		//Delete document
		$(".delete").on('click', function(e){
				e.preventDefault();
				var id = e.currentTarget.id;
				var dataString = "_id="+id;
				console.log("Supprimer de l'enreg..."+dataString);
				var entity = $("#table").attr("entity");
				var url = '/params/delete/'+entity;
				sendData(entity, 'DELETE', url, dataString, function(err, msg){
					if(err){
						console.log("Erreur="+err.name+" - msg:"+msg);
					} else {
						console.log("OK - msg:"+msg);
						window.location.href="/params/"+entity;
					}
				});
				
				/*
				sendData('gst', 'POST', url, dataString, function(err, msg){
					if(err){
					console.log("Erreur="+err.name+" - msg:"+msg);
					} else {
						console.log("OK - msg:"+msg);
					}
					});
				*/
			})
		//Update data
		var updateData = function(editId){
				var el = $("#"+editId);
				var entity = $("#table").attr("entity");
				var name = el.attr("name");
				var value=el.val();
				var dataString = name+'='+value;
				var url = '/params/update/'+entity+'/'+editId;
				console.log('entity = '+entity+' - dataString: '+dataString);
				sendData(entity, 'POST', url, dataString, function(err, msg){
					if(err){
						console.log("Erreur="+err.name+" - msg:"+msg);
					} else {
						console.log("OK - msg:"+msg);
						window.location.href="/params/"+entity;
					}
				});


		}
		$(".edit").on('focus', function(e) {
			console.log("Focus");
			e.preventDefault();
			var id = e.currentTarget.id;
			$(".edit").removeAttr("x-webkit-speech");
			$("#"+id).attr("x-webkit-speech", "x-webkit-speech");

		});

		$(".edit").on('webkitspeechchange', function(e){
			var id = e.currentTarget.id;
			updateData(id);
		})

		
		$(".edit").on('keypress', function(e) {
			console.log("e.keyCode="+e.keyCode);
			//e.preventDefault();
			if (e.keyCode == 13) {
				var id = e.currentTarget.id;
				updateData(id);
				
				
			}
		});
		
});