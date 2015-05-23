$(document).ready(function() {
	fillIndexTable();

	$('#btnToGetData').on('click', getData);

	$('#showAllRequests a').on('click', fillTableAll);

	$('#apiList table tbody').on('click', 'td a.apiRequest', fillTableSingleItem);

	$('#apiList table tbody').on('click', 'td a.delButton', deleteEntry);

});

function fillIndexTable() {
	// Used to number data requests
	var counter = 0;
	// Used to fill index table row
  var tableIndex = '';

  // Get database items
  $.getJSON( '/teststorage', function( data ) {
  	// Iterate through database items and create a table with associated ids
  	$.each(data, function(i, val) {
	  	tableIndex += '<tr>';
	  	tableIndex += '<td><a href="" class="apiRequest" rel="' + counter + '">Data Request ' + counter + ', ID: ' + this._id + '</a></td>';
	  	tableIndex += '<td><a href="" class="delButton" rel="' + this._id + '">Delete</td>';
	  	tableIndex += '</td>';

	  	$('#apiList table tbody').html(tableIndex);
		  counter++;
  	});
  });
};

function fillTableSingleItem(event) {
	event.preventDefault();
	// Clear the content table
	$('#apiInfo tr').remove();
	// Get the id of the clicked item
	var singleId = $(this).attr('rel');
	var tableContent = '';
	// Access the database information
	$.getJSON('/teststorage', function( data ) {
		// Iterate through the database objects
 		$.each(data, function(i, val) {
 			// If we find the item we are looking for
 			if(singleId === i.toString()) {
	 			tableContent += '<tr>';
			  	tableContent += '<td>' + i + '</td>';

			  	// This will allow us to parse the object, regardless of the
			  	// 		depth of its items
			  	function recurseParse(obj) {

			  		for(var key in obj) {
			  			// If the value of the current key is an object, we'll
			  			//		need to iterate through that as well
			  			if(typeof obj[key] === 'object' && obj !== null) {
			  				tableContent += '<td>' + key + '</td>';
			  				recurseParse(obj[key]);
			  			} else {
			  				tableContent += '<tr>';
			  				tableContent += '<td>' + key + '</td>';
			  				tableContent += '<td>' + obj[key] + '</td>';
			  			}
			  		}
			  	}

			  	// On the first iteration, if the value is an object, parse 
			  	//		recursively
			  	if(typeof val === 'object' && val !== null) {
			  		recurseParse(val);
			  	} else {
			  		tableContent += '<td>' + val + '</td>';
			  	}

			  	tableContent += '</tr>'; 
				$('#apiInfo table tbody').html(tableContent);
			}
 		});
	});
};


function fillTableAll(event) {
	event.preventDefault();
	// Make sure the index table is still displayed
 	fillIndexTable();
	// Used to create the table content of all database content
  var tableContent = '';
  var obj;
  $.getJSON( '/teststorage', function( data ) {

  	$.each(data, function(i, val) {
	  	obj = data;

	  	tableContent += '<tr>';
	  	tableContent += '<td>' + i + '</td>';
		 
		 	// This will allow us to parse the object, regardless of the
		  // 		depth of its items
	  	function recurseParse(obj) {
	  		for(var key in obj) {
	  			if(typeof obj[key] === 'object' && obj !== null) {
	  				tableContent += '<td>' + key + '</td>';
	  				recurseParse(obj[key]);
	  			} else {
	  				tableContent += '<td>' + key + '</td>';
	  				tableContent += '<td>' + obj[key] + '</td>';
	  			}
	  		}
	  	}

	  	if(typeof val === 'object' && val !== null) {
	  		recurseParse(val);
	  	} else {
	  		tableContent += '<td>' + val + '</td>';
	  	}
	  	tableContent += '</tr>'; 
  	});

  	$('#apiInfo table tbody').html(tableContent);
  });
};


function getData(event) {
	var obj;
	var url = $('fieldset input#inputApiLocale').val();

	// Get JSON from location provided
	$.getJSON( url, function( data ) {
		obj = data;
		// Post the object to our database
		if(obj.constructor === Array) {
			
			// Iterate through the response array and add each object to the database
			alert("Adding an array of objects to database");
			for(var i = 0; i < data.length; i++) {
				obj = data[i];
				$.ajax({
					type: 'POST',
					data: obj,
					url: '/teststorage/',
					dataType: 'JSON'
				}).done(function(response) {
					if(response.msg === '') {
						$('fieldset input#inputApiLocale').val('');
					}
				})
			}
		} else {
			// Post the single object to our database
			$.ajax({
				type: 'POST',
				data: obj,
				url: '/teststorage/',
				dataType: 'JSON'
			}).done(function(response) {
				if(response.msg === '') {

					$('fieldset input#inputApiLocale').val('');
				} else {
					alert('Error: ' + response.msg);
				}
			});
		}
	fillIndexTable();
	});
}

function deleteEntry(event) {
	event.preventDefault();

	$.ajax({
		type: 'DELETE',
		url: '/teststorage/deleteentry/' + $(this).attr('rel')
	}).done(function( response ) {
		if (response.msg === '') {
		} else {
			alert('Error: ' + response.msg);
		}

		fillIndexTable();
	});
};
