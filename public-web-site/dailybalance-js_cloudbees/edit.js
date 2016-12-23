//globals
var BASE_URL= "https://mongo-wrapper.herokuapp.com"; // "http://localhost:8080/mongo-wrapper";
var accountName= $.urlParam('accountName');
var password= $.urlParam('password');

/** gets a parameter from the URL 
used to get userName/accountName for this page
**/
$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

function editPaycheck(recurrance, ddate, end401k, endSsn, skipPaycheck, nextPaycheck, contribution401k, ssnTaxes, amount) {
	try {

//alert("ddate: "+ ddate);
//alert("end401k: "+ JSON.stringify(end401k));
//alert("monNum: "+ getShortMonthStr("Mar")); return;

	var check= new paycheckClass();
	//check.paycheck= paycheck;
	check.end401k.setString(end401k);
	check.endSsn.setString(endSsn);
	check.skipPaycheck= Boolean(skipPaycheck);
	check.nextPaycheck= Number(nextPaycheck.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	check.contribution401k= Number(contribution401k.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	check.ssnTaxes= Number(ssnTaxes.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));

	//from EventClass
	check.amount= Number(amount.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	check.recurType= recurrance;
	//alert("ddate2: "+ ddate);
	check.date.setString(ddate);
	//alert("check.date: "+ check.date);
	check.description= "Paycheck";
	check.evtType= "income";
	check.recurPeriodicity= 1;
	
//alert("check.end401k: "+ JSON.stringify(Date(check.end401k)));
//alert("type1: "+ (typeof check.end401k));
	var checkObj= paycheckClassCopy(check);

//alert(JSON.stringify(checkObj));return;

	document.userAccounts.paycheck= checkObj;

	$('.ui-dialog').dialog('close');

	passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$set" : { "paycheck" : document.userAccounts.paycheck } } );

	$.get(passUrl, function(data, txtstatus, xbr){
			//alert("success:"+ document.userAccounts.account.balance);
			//alert("success:"+ document.userAccounts.userName);
			//generateSummary(document.userAccounts.userName);
			generateTable(document.userAccounts.userName, document.userAccounts.password);
	});
	//alert("saved");

	} catch(err) {
		alert("data error "+ err);
	}
}

function editMisc(futureDays, skipAhead, outstanding, presavings, monthlyBudget, weeklyExpenses, weeklyExpensesGas, bankInterest, creditCardInterest) {

	document.userAccounts.misc.futureDays= Number(futureDays);
	document.userAccounts.misc.skipAhead= Number(skipAhead);
	document.userAccounts.misc.outstanding= Number(outstanding.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	document.userAccounts.misc.presavings= Number(presavings.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	document.userAccounts.misc.monthlyBudget= Number(monthlyBudget.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	document.userAccounts.misc.weeklyExpenses= Number(weeklyExpenses.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	document.userAccounts.misc.weeklyExpensesGas= Number(weeklyExpensesGas.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	document.userAccounts.misc.bankInterest= Number(bankInterest.replace(/%/g,""));
	document.userAccounts.misc.creditCardInterest= Number(creditCardInterest.replace(/%/g,""));

	$('.ui-dialog').dialog('close');

	passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$set" : { "misc" : document.userAccounts.misc } } );

	$.get(passUrl, function(data, txtstatus, xbr){
		//alert("success:"+ document.userAccounts.account.balance);
		//alert("success:"+ document.userAccounts.userName);
		//generateSummary(document.userAccounts.userName);
		generateTable(document.userAccounts.userName, document.userAccounts.password);
	});
}

function addAccount(accountName, balance) {
	//alert(accountName);
	//alert(document.userAccounts.account.balance);

	for(acct in document.userAccounts.current.accounts) {
		//alert(document.userAccounts.account[acct]);
		if(document.userAccounts.current.accounts[acct].bankName === accountName) {
			alert(accountName+ " already exists");
			return false;
		}
	}

	var newAccount= new accountClass();
	newAccount.bankName= accountName.replace(/ /g,"_");
	//alert(balance.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	//alert(Number(balance.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""))); return;
	newAccount.balance= Number(balance.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	//alert("edit:"+ document.userAccounts.account.balance);

	document.userAccounts.current.accounts[document.userAccounts.current.accounts.length]= newAccount;
	//alert("length "+ document.userAccounts.account.length);

	passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$push" : { "current.accounts" : newAccount } } );

	$.get(passUrl, function(data, txtstatus, xbr){
		//alert("success:"+ document.userAccounts.account.balance);
		//alert("success:"+ document.userAccounts.userName);
		//generateSummary(document.userAccounts.userName);
		generateTable(document.userAccounts.userName, document.userAccounts.password);
	});

	$('.ui-dialog').dialog('close');
}

function addCreditCard(accountName, balance, bill, dueDate) {try{
	//alert(accountName);
	//alert(document.userAccounts.account.balance);

	for(acct in document.userAccounts.current.creditCards) {
		//alert(document.userAccounts.current.creditCards[acct]);
		if(document.userAccounts.current.creditCards[acct].cardName === accountName) {
			alert(accountName+ " already exists");
			return false;
		}
	}

	var newAccount= new creditCardClass();
	newAccount.cardName= accountName.replace(/ /g,"_");
	newAccount.balance= Number(balance.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	newAccount.bill= Number(bill.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	newAccount.due= dueDate;
	newAccount.lastUpdate= new Date();
	//alert("edit:"+ document.userAccounts.account.balance);

	document.userAccounts.current.creditCards[document.userAccounts.current.creditCards.length]= newAccount;
	//alert("length "+ document.userAccounts.current.creditCards.length);

	passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$push" : { "current.creditCards" : newAccount } } );
	
	$.get(passUrl, function(data, txtstatus, xbr){
		//alert("success:"+ document.userAccounts.account.balance);
		//alert("success:"+ document.userAccounts.userName);
		//generateSummary(document.userAccounts.userName);
		generateTable(document.userAccounts.userName, document.userAccounts.password);
	});

	//setTimeout("generateSummary(document.userAccounts.userName);", 1000);
	//setTimeout("generateTable(document.userAccounts.userName, document.userAccounts.password);", 1000);
	
	$('.ui-dialog').dialog('close');
	//alert("saved");
	} catch(err) {
		alert("data error "+ err);
	}
}

function addBill(billType, recurrance, billName, amount, dueDate, periodicity) { try{
	for(acct in document.userAccounts.budget.bills) {
		//alert(document.userAccounts.budget.bills[acct]);
		if(document.userAccounts.budget.bills[acct].name === billName) {
			alert(accountName+ " already exists");
			return false;
		}
	}

	var newBill= new eventClass();
	newBill.description= billName.replace(/ /g,"_"); 
	newBill.amount= Number(amount.replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	newBill.evtType= billType;
	newBill.recurType= recurrance;
	newBill.date.setString(dueDate);
	newBill.recurPeriodicity= Number(periodicity);
	//alert("edit:"+ document.userAccounts.account.balance);

	document.userAccounts.budget.bills.push(newBill);
	//alert("length "+ document.userAccounts.current.creditCards.length);

	passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$push" : { "budget.bills" : newBill } } );
	
	$.get(passUrl, function(data, txtstatus, xbr){
		//alert("success:"+ document.userAccounts.account.balance);
		//alert("success:"+ document.userAccounts.userName);
		//generateSummary(document.userAccounts.userName);
		generateTable(document.userAccounts.userName, document.userAccounts.password);
	});
	
	//setTimeout("generateSummary(document.userAccounts.userName);", 1000);
	//setTimeout("generateTable(document.userAccounts.userName, document.userAccounts.password);", 1000);
	
	$('.ui-dialog').dialog('close');
	//alert("saved");
	} catch(err) {
		alert("data error "+ err);
	}
}

function generateEditCurrent(type) {
	var pHtml= "";
	//alert(pHtml);
	if(type != "creditCard") {
	for(acct in document.userAccounts.current.accounts) {
		//alert(acct);
		if(undefined === document.userAccounts.current.accounts[acct].balance)	document.userAccounts.current.accounts[acct].balance= 0.0;
		pHtml+= '<div style="width: 500px;" data-role="fieldcontain"><label for="'+document.userAccounts.current.accounts[acct].bankName+'kName">'+document.userAccounts.current.accounts[acct].bankName+':</label><input type="text" name="'+document.userAccounts.current.accounts[acct].bankName+'kName" id="'+document.userAccounts.current.accounts[acct].bankName+'kName" value="'+document.userAccounts.current.accounts[acct].bankName+'" class="'+document.userAccounts.current.accounts[acct].bankName+'kName" />'+
		'<label for="'+document.userAccounts.current.accounts[acct].bankName+'kAmount">Balance:</label><input type="number" name="'+document.userAccounts.current.accounts[acct].bankName+'kAmount" id="'+document.userAccounts.current.accounts[acct].bankName+'kAmount" value="'+document.userAccounts.current.accounts[acct].balance+'" class="'+document.userAccounts.current.accounts[acct].bankName+'kAmount" /></div>';
	}
	}
	if(type != "account") {
	$.each(document.userAccounts.current.creditCards, function(index, cc) { 
		if(undefined === cc.balance)	cc.balance= 0.0;
		pHtml+= '<div style="width: 500px;" data-role="fieldcontain">'+
		'<label for="'+cc.cardName+'cName">'+cc.cardName+':</label><input type="text" name="'+cc.cardName+'cName" id="'+cc.cardName+'cName" value="'+cc.cardName+'" class="'+cc.cardName+'cName" />'+
		'<label for="'+cc.cardName+'cAmount">Balance:</label><input type="number" name="'+cc.cardName+'cAmount" id="'+cc.cardName+'cAmount" value="'+cc.balance+'" class="'+cc.cardName+'cAmount" />'+
		'<label for="'+cc.cardName+'cBill">Next Bill:</label><input type="number" name="'+cc.cardName+'cBill" id="'+cc.cardName+'cBill" value="'+cc.bill+'" class="'+cc.cardName+'cBill" />'+
		'<label for="'+cc.cardName+'cDue">Due Day of Month:</label><input type="number" name="'+cc.cardName+'cDue" id="'+cc.cardName+'cDue" value="'+cc.due+'" class="'+cc.cardName+'cDue" /></div>';
	});
	}

	$('div.editcurrent').html(pHtml);
}

function editCurrent() {
	var $allInputs= $(':input');
	//alert("$allInputs.length"+ $allInputs.length);

	var values = {};
    $allInputs.each(function() {
        values[this.name] = $(this).val();
    });

	//alert(JSON.stringify(values));

	for(var key in values){
		//alert(key + " = "+ values[key]);
		if(key.endsWith("kAmount"))	{ 
			var bName= key.substr(0, key.length-7);
			for(acct in document.userAccounts.current.accounts) {
				//alert("a:"+ document.userAccounts.current.accounts[acct].bankName);
				if(document.userAccounts.current.accounts[acct].bankName === bName && document.userAccounts.current.accounts[acct].balance != values[key]) {
					//alert("changeda");
					document.userAccounts.current.accounts[acct].balance= Number(values[key].replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
				}
			}
		}
		if(key.endsWith("cAmount"))	{ 
			var bName= key.substr(0, key.length-7);
			for(acct in document.userAccounts.current.creditCards) {
				//alert("a:"+ document.userAccounts.current.creditCards[acct].bankName);
				if(document.userAccounts.current.creditCards[acct].cardName === bName && document.userAccounts.current.creditCards[acct].balance != values[key]) {
					//alert("changeda");
					document.userAccounts.current.creditCards[acct].balance= Number(values[key].replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
					document.userAccounts.current.creditCards[acct].lastUpdate= new Date();
				}
			}
		}
		if(key.endsWith("cDue"))	{ 
			var bName= key.substr(0, key.length-4);
			for(acct in document.userAccounts.current.creditCards) {
				//alert("a:"+ document.userAccounts.current.creditCards[acct].bankName);
				if(document.userAccounts.current.creditCards[acct].cardName === bName && document.userAccounts.current.creditCards[acct].due != values[key]) {
					//alert("changeda");
					document.userAccounts.current.creditCards[acct].due= values[key];
				}
			}
		}
		if(key.endsWith("cBill"))	{ 
			var bName= key.substr(0, key.length-5);
			for(acct in document.userAccounts.current.creditCards) {
				//alert("a:"+ document.userAccounts.current.creditCards[acct].bankName);
				if(document.userAccounts.current.creditCards[acct].cardName === bName && document.userAccounts.current.creditCards[acct].bill != values[key]) {
					//alert("changeda");
					document.userAccounts.current.creditCards[acct].bill= Number(values[key].replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
					document.userAccounts.current.creditCards[acct].lastUpdate= new Date();
				}
			}
		}
	}

	for(var key in values){
		if(key.endsWith("kName"))	{
			var bName= key.substr(0, key.length-5); 
			//alert(bName);
			for(acct in document.userAccounts.current.accounts) {
				//alert("n:"+ document.userAccounts.current.accounts[acct].bankName);
				if(document.userAccounts.current.accounts[acct].bankName === bName && document.userAccounts.current.accounts[acct].bankName != values[key]) {
					//alert("changedn");
					if(values[key].length === 0) {
						//alert("delete");
						var indx= positionInArray(document.userAccounts.current.accounts, "bankName", document.userAccounts.current.accounts[acct].bankName);
						document.userAccounts.current.accounts.splice(indx,1);
					} else {
						//alert("delete: "+ values[key]);
						document.userAccounts.current.accounts[acct].bankName= values[key].replace(/ /g,"_");
					}
				}
			}
		}
		if(key.endsWith("cName"))	{
			var bName= key.substr(0, key.length-5); 
			//alert(bName);
			for(acct in document.userAccounts.current.creditCards) {
				//alert("n:"+ document.userAccounts.current.creditCards[acct].bankName);
				if(document.userAccounts.current.creditCards[acct].cardName === bName && document.userAccounts.current.creditCards[acct].cardName != values[key]) {
					//alert("changedn");
					if(values[key].length === 0) {
						var indx= positionInArray(document.userAccounts.current.creditCards, "cardName", document.userAccounts.current.creditCards[acct].cardName);
						document.userAccounts.current.creditCards.splice(indx,1);
					} else {
						document.userAccounts.current.creditCards[acct].cardName= values[key].replace(/ /g,"_");
					}
				}
			}
		}
	}	

	$('.ui-dialog').dialog('close');

	passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$set" : { "current.accounts" : document.userAccounts.current.accounts } } );

	//alert(uuu);
	$.get(passUrl, function(data, txtstatus, xbr){
				//alert("success:"+ document.userAccounts.account.balance);
				//alert("success:"+ document.userAccounts.userName);
				//generateSummary(document.userAccounts.userName);
				//generateTable(document.userAccounts.userName, document.userAccounts.password);
		});
	passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$set" : { "current.creditCards" : document.userAccounts.current.creditCards } } );
	$.get(passUrl, function(data, txtstatus, xbr){
		//alert("success:"+ document.userAccounts.account.balance);
		//alert("success:"+ document.userAccounts.userName);
		//generateSummary(document.userAccounts.userName);
		generateTable(document.userAccounts.userName, document.userAccounts.password);
	});

	//alert("saved");

}

function editBill(billName, bName, bAmount, bRecurrance, bType, bPeriodicity) { try {
	var bAmount= Number($('input[name='+billName+'bAmount]').val().replace(/\$/g,"").replace(/\,/g,"").replace(/ /g,""));
	var bDescription= $('input:text[name='+billName+'bDescription]').val();
	var bPeriodicity= Number($('input[name='+billName+'bPeriodicity]').val());
	var bRecurrance= $('select[name='+billName+'bRecurrance]').val();
	var bType= $('select[name='+billName+'bType]').val();
	var bDate= $('input[name='+billName+'bDate]').val();

	//alert(bAmount+bDescription);
	//alert($('input:text[name=namebName]').val());
	//alert($('input:text[name=namebAmount]').val());
	//alert($('input:text[name=namebAmount]').val());
	$.each(document.userAccounts.budget.bills, function(index, bill) {
		if(bill.description === billName) {
			document.userAccounts.budget.bills[index].description= bDescription;
			document.userAccounts.budget.bills[index].amount= bAmount;
			document.userAccounts.budget.bills[index].recurPeriodicity= bPeriodicity;
			document.userAccounts.budget.bills[index].recurType= bRecurrance;
			document.userAccounts.budget.bills[index].evtType= bType;
			document.userAccounts.budget.bills[index].date.setString(bDate);

		passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$set" : { "budget.bills" : document.userAccounts.budget.bills } } );

		$.get(passUrl, function(data, txtstatus, xbr){
			//alert("success:"+ document.userAccounts.account.balance);
			//alert("success:"+ document.userAccounts.userName);
			//generateSummary(document.userAccounts.userName);
			generateTable(document.userAccounts.userName, document.userAccounts.password);
		});
		}
	});
	alert("saved");

	} catch(err) {
		alert("data error "+ err);
	}
}

function deleteBill(billName) {
	//alert($('input:text[name=billName+"bName"]').val());
	
	//delete bill from bills array
	var indx= positionInArray(document.userAccounts.budget.bills, "description", billName);
	document.userAccounts.budget.bills.splice(indx, 1);	//removes the bill at indx

	//alert("bills len: "+ document.userAccounts.budget.bills.length);
	
	//$.each(document.userAccounts.budget.bills, function(index, bill) {
		//if(bill.description === billName) {
			passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=PUT&accountId="+document.userAccounts._id.$oid+"&jsonData="+ JSON.stringify( { "$set" : { "budget.bills" : document.userAccounts.budget.bills } } );
	
			$.get(passUrl, function(data, txtstatus, xbr){
				//alert("success:"+ document.userAccounts.account.balance);
				//alert("success:"+ document.userAccounts.userName);
				//generateSummary(document.userAccounts.userName);
				generateTable(document.userAccounts.userName, document.userAccounts.password);
			});
		//}
	//});
	alert("deleted.");	
	$('.ui-dialog').dialog('close');
}

function generateEditBills() {
	var pHtml= "";
	//alert(pHtml);
	$.each(document.userAccounts.budget.bills, function(index, bill) { 
		if(undefined === bill.amount)	bill.amount= 0.0;
		var desc= bill.description;
		//alert(JSON.stringify(bill));
		//alert("desc:"+ desc);
		pHtml+= desc;
		pHtml+= '<div style="width: 500px;" data-role="fieldcontain"><label for="'+desc+'bDescription">Name:</label><input type="text" name="'+desc+'bDescription" id="'+desc+'bDescription" value="'+desc+'" class="'+desc+'bDescription" /></div>';

		pHtml+= '<div style="width: 500px;" data-role="fieldcontain"><label for="'+desc+'bDate">Due Date:</label><input type="date" name="'+desc+'bDate" id="'+desc+'bDate" value="'+bill.date.getFormattedString()+'" class="'+desc+'bDate" /></div>';

		pHtml+= '<div style="width: 500px;" data-role="fieldcontain"><label for="'+desc+'bAmount">Amount:</label><input type="number" name="'+desc+'bAmount" id="'+desc+'bAmount" value="'+bill.amount+'" class="'+desc+'bAmount" /></div>';

		pHtml+= '<select name="'+desc+'bType" id="'+desc+'bType" class="'+desc+'bType"><option selected value="bill">Bill</option><option value="income">Income</option><option value="goal">Goal</option><option value="accumulator">Accumulate Savings</option></select>';

		pHtml+= '<div style="width: 500px;" data-role="fieldcontain"><label for="'+desc+'bPeriodicity">every:</label><input type="number" name="'+desc+'bPeriodicity" id="'+desc+'bPeriodicity" value="'+bill.recurPeriodicity+'" class="'+desc+'bPeriodicity" /></div>';

		pHtml+= '<select name="'+desc+'bRecurrance" id="'+desc+'bRecurrance" class="'+desc+'bRecurrance"><option selected value="once">Once</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Bi-Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>';



/*
var name= "$(\'input:text[name=desc+\"bName\"]\').val()";
//alert($('input:text[name=desc+\"bName\"]').val());
var amount= "$(\'input:text[name=desc+\"bAmount\"]\').val()";
var recurrance= "$(\'input:text[name=desc+\"bRecurrance\"]\').val()";
var type= "$(\'input:text[name=desc+\"bType\"]\').val()";
var periodicity= "$(\'input:text[name=desc+\"bPeriodicity\"]\').val()";

		pHtml+= '<button style=\"width: 100px;\" data-inline=\"true\" onclick=\"editBill(\''+desc+'\',\''+name+'\','+'\',\''+amount+'\','+'\',\''+recurrance+'\','+'\',\''+type+'\','+'\',\''+periodicity+'\');return false;\">Edit</button>';*/

		pHtml+= '<button style="width: 100px;" data-inline="true" onclick="editBill('
		pHtml+= '\''+desc+'\');return false;">Edit</button>';
		pHtml+= '<button style="width: 100px;" data-inline="true" onclick="deleteBill('
		pHtml+= '\''+desc+'\');return false;">Delete</button>';
		//alert(pHtml);

		pHtml+= '<hr/>';
	});

	$('div.editbills').html(pHtml);
}
