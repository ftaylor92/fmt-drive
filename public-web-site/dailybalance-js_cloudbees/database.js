//globals
var BASE_URL= "https://mongo-wrapper.herokuapp.com"; // "http://localhost:8080/mongo-wrapper";

function insert(dbName, values) {
}

function retrieve(dbname, name) {
}

/** gets a parameter from the URL 
used to get userName/accountName for this page
**/
$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

/**
increments number of hits in database's hitCount field.
**/
function incrementHits() {
	//gets all documents, but include only hitCount fields
	var accountName= $.urlParam('accountName');
	var password= $.urlParam('password');
	var passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=GET";
	//alert("incrementHits, pre-get"+ passUrl);
	$.get(passUrl, function(data, txtstatus, xbr) {
	//alert("incrementHits, .get() success: "+data);  
	var jData= eval(data);
	//alert("jData.id: "+jData.status+jData);		
	if(jData.length > 0) {

		for(row in jData) {
			var hits= new Object();
			hits.$set= new Object();
	
			//get hit count field value and increment it
			if(!jData[row].hitCount) {
				hits.$set.hitCount= 1;
				continue;
			} else {
				hits.$set.hitCount= jData[row].hitCount;
				hits.$set.hitCount++;
			}

			//set hitCount field to incremented value where _id == current-id
			passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+jData[row]._id.$oid+"&jsonData="+ JSON.stringify( hits );
			//alert("incrementHits-if, pre-get"+ passUrl);
			$.get(passUrl, function(data, txtstatus, xbr) { 
				//alert("incrementHits-if, .get() success: "+data);  
			});
		}
	} else {
		alert("no increment data");
	}
	});	
}
