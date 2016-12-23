//globals
/** accountName/userName. **/
var EVT_TYPE= {bill:0, income:1, savings:2, goal:3, accumulator:4};
var RECUR_TYPE= {daily:0, weekly:1, biweekly:2, monthly:3, yearly:4, once:5, never:6};
var BASE_PASS_URL= "https://fmt-password.herokuapp.com"; //"http://localhost:8080/password";
var BASE_URL= "https://mongo-wrapper.herokuapp.com"; // "http://localhost:8080/mongo-wrapper";

//var accountName;
/** all info and accounts for current user **/
document.userAccounts= new Object();
document.userAccounts.userName= "unknown";
document.userAccounts.current= null;
document.userAccounts.budget= null;
document.userAccounts.paycheck= null;
document.userAccounts.misc= null;

/** gets a parameter from the URL 
used to get userName/accountName for this page
**/
$.urlParamb = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

var cloudBeesAlert= false;
/**
loads account info, then calls genTableFunction().
param: genTableFunction function to set HTML <table>
param: accountName userName/accountName
**/
function loadAccounts(genTableFunction, accountName) {
	//alert("loadAccounts -23");
	var accountName= "undef";
	var password= "undef";
try{
	accountName= $.urlParamb('accountName');
	password= $.urlParamb('password');
	//alert("loadAccounts -34: "+ password);
	//jjj();
}
catch(e){
	alert("accountName and password URL params have to be set");
	//alert(e);
}
	if(null === document.userAccounts || null === document.userAccounts.current) {
		//alert("current not set");
var passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&site=dailybalance-js&password="+password+"&action=GET";
		//mongoUrl+= '&q={"username":\"';
		//mongoUrl+= accountName;
		//mongoUrl+= '\"}';
		//alert(mongoUrl);
		//alert("loadAccounts, pre-get"+ passUrl);
		var request = $.ajax({
			url: passUrl,
			type: "GET"
		});
		
		request.fail(function(jqXHR, textStatus) {
			if(!cloudBeesAlert) {
				cloudBeesAlert= true;
				alert("CloudBees webservice warming up, please refresh page and try again in a minute...");
			} else {
				alert( "data failed to load, refresh page to try again.  error: " + textStatus );
			}
		});
		
		request.done(function(data, txtstatus, xbr){
				//alert("loadAccounts, .get() success: "+data);  
				var jData= eval(data);
				//alert("jData.status: "+jData.status+jData);		
				//alert(jData.length);			
				if(jData.length > 0) {
					//alert("first: "+ JSON.stringify(jData[1]));
					//alert("usernameParam: "+ accountName);
					var found= false;
					$.each(jData, function(index, data) { 
						if(data.username != undefined && data.username === accountName) {
							found= true;
							//alert("username: "+ data.username);
							document.userAccounts= data;
							//document.userAccounts.userName= accountName;
							if(undefined === document.userAccounts.current)	document.userAccounts.current= new currentClass();
							if(undefined === document.userAccounts.budget)	document.userAccounts.budget= new budgetClass();
							if(undefined === document.userAccounts.paycheck)	document.userAccounts.paycheck= new paycheckClass();
							if(undefined === document.userAccounts.misc)	document.userAccounts.misc= new miscClass();

							reformData();

							genTableFunction(accountName, password, document.userAccounts);
						}
					});
					if(!found) {
						alert(accountName+ " not found");
					} else {
						//alert(accountName+ " found");
					}
	 			} else {
					alert("current not found");
				}
			});
	} else {
		//alert("current is set");
		genTableFunction(accountName, password, document.userAccounts);
	}
}

/**
persists user object in database.
**/
function setUserObject(accountName, obj) {
	var passUrl= BASE_URL+ "/rest/mongolab?username="+accountName+"&password="+obj.password+"&action=POST&role=user&jsonData="+ JSON.stringify( obj );

	$.get(passUrl, function(data, txtstatus, xbr){ 
		//alert("setUserObject, .get() success: "+data);  
		var jData= eval(data);
		//alert("jData.status: "+jData.status+jData);		
		if( jData.status === "success" || (typeof jData.message === 'undefined' || !jData.message || -1 != jData.message.indexOf("no username")) ) {
			alert("Account Created!"); 
		} else {
			alert("Account Already Exists: "+ jData.status+": "+jData.message);
		}
	});
}

/**
returns new user object.
**/
function getUserObject(accountName, password, objType) {
	var user= new Object();
	user.username= accountName;
	user.password= password;
	user.current= new currentClass();
	user.paycheck= new paycheckClass();
	user.misc= new miscClass();
	user.budget= new budgetClass();
	user.current.accounts[0]= new accountClass();

	return user;
}

function budgetClass() {
	this.bills= new Array();
	this.events= new Array();
}

function currentClass() {
	this.creditCards= new Array();
	this.accounts= new Array();
}

/** account class. **/
function accountClass() {
	this.bankName= "unkBank";
	this.balance= 0.0;
}

function paycheckClass() {
	//this.paycheck= 0.0;
	this.end401k= new Date();
	this.endSsn= new Date();
	this.skipPaycheck= false;
	this.nextPaycheck= 0.0;
	this.contribution401k= 0.0;
	this.ssnTaxes= 0.0;
	//from EventClass
	this.date= new Date();
	this.amount= 0.0;
	this.recurType= "monthly";
	this.description= "Paycheck";
	this.evtType= "income";
	this.recurPeriodicity= 1;
}

paycheckClass.prototype.isTodayPayday= function(today) {
	if(this.amount == 0.0)	return false;
	//System.out.println(DailyBalance.format(today)+ " paycheck: "+ this.recurrance.name()+", "+ DailyBalance.format(this.date));

	if(!isObjType(this.date, 'date'))	alert("this.date is not date: "+ this.date);
	//else alert("good date: "+ this.date.toString());
	//alert("today: "+ today.toString());
	
	return compareEventRecurring(today, this);
	//return today.get(Calendar.DAY_OF_WEEK) == this.date.get(Calendar.DAY_OF_WEEK) ;
};

function isObjType(obj, type) {
	//alert(obj.constructor.toString());
	//alert(obj.constructor.toString().match(string/i));
	var mtch= null;
	switch(type) {
		case 'string': mtch= obj.constructor.toString().match(/string/i); break;
		case 'date': mtch= obj.constructor.toString().match(/date/i); break;
		default: mtch= obj.constructor.toString().match('/'+type+'/i'); break;
	}
	return mtch != null;
}

function paycheckClassCopy(obj) {
	var check= new paycheckClass();
	//check.paycheck= obj.paycheck;
	//alert("check.date: "+ obj.date.toString());
	
	//alert("check.date: "+ check.date.toString());
//alert("type: "+ typeof obj.end401k);
//alert("obj.end401k.toString(): "+ (obj.end401k).toString());
//alert("obj.end401k.toString().toDate(): "+ obj.end401k.toString().toDate());
	check.end401k= new Date(obj.end401k.toString()); //.toDate();
//alert("type3: "+ typeof check.end401k);
//	alert("paycheckClassCopy: "+ JSON.stringify(check.end401k));
	check.endSsn= new Date(obj.endSsn.toString()); //.toDate();
	check.skipPaycheck= Boolean(obj.skipPaycheck);
	check.nextPaycheck= Number(obj.nextPaycheck);
	check.contribution401k= Number(obj.contribution401k);
	check.ssnTaxes= Number(obj.ssnTaxes);

	//from EventClass
	check.date= new Date(obj.date.toString()); //.toDate();
	check.amount= Number(obj.amount);
	check.recurType= obj.recurType;
	check.description= "Paycheck";
	check.evtType= "income";
	check.recurPeriodicity= 1;
	
	return check;
}

function miscClass() {
	this.futureDays= 31;	//days
	this.skipAhead= 0;		//days
	this.outstanding= 0.0;
	this.presavings= 0.0;
	this.monthlyBudget= 0.0;
	this.weeklyExpenses= 0.0;
	this.weeklyExpensesGas= 0.0;
	this.bankInterest= 0.0;
	this.creditCardInterest= 0.0;
}

function creditCardClass() {
	this.due= 15;	//new Date();
	this.cardName= "unk";
	this.lastUpdate= new Date();
	this.balance= 0.0;
	this.bill= 0.0;
}

function creditCardClassCopy(obj) {
	var cc= new creditCardClass();
	//alert("cc.due"+ obj.due.toString());
	cc.due= obj.due;	//new Date(obj.due.toString());
	//alert("cc.date"+ cc.due.toString());
	cc.cardName= obj.cardName;
	cc.lastUpdate= obj.lastUpdate.toString().toDate();
	cc.balance= Number(obj.balance);
	cc.bill= Number(obj.bill);
	
	return cc;
}

function eventClass() {
	this.date= new Date();
	this.description= "unk";
	this.amount= 0.0;
	this.evtType= "bill";
	this.recurType= "monthly";
	this.recurPeriodicity= 1;
}

function eventClassConstructor(desc, date, amount, evtType, recurType, periodicity) {
	var evt= new eventClass();
	//alert("evt.date "+ date);
	evt.date= date; //.toString().toDate();	//evt.date= new Date(date.toString());
	//alert("evt.date "+ evt.date.toString());
	evt.description= desc;
	evt.amount= Number(amount);
	//alert("evtType: "+ evtType);
	evt.evtType= evtType;
	//alert("evtType: "+ evt.evtType);
	evt.recurType= recurType;
	evt.recurPeriodicity= Number(periodicity);
	
	return evt;
}

function eventClassCopy(obj) {
	var evt= new eventClass();

	//evt.date= new Date(obj.date.toString());
	evt.date= obj.date.toString().toDate();
	evt.description= obj.description;
	evt.amount= Number(obj.amount);
	evt.evtType= obj.evtType; //EVT_TYPE[obj.evtType];
	evt.recurType= obj.recurType; //RECUR_TYPE[obj.recurType];
	evt.recurPeriodicity= Number(obj.recurPeriodicity);
	
	return evt;
}

function hiLoClass() {
	this.low= 0.0;
	this.high= 0.0;
	this.whenLow= new Date();
	this.whenHigh= new Date();
}

/**
sets userName/accountName in global variable.
**/
function setUserName(uname) {
	//alert(uname);
	document.userAccounts.userName= uname;
}
function getUserName() {
	//alert(uname);
	return document.userAccounts.userName;
}

/** Navigates to pages using Javascript.
**/
function gotoPage(pageName, accountName, password) {
	//if(pageName === "summary") {
		switch(pageName) {
			case "summary":
				//alert(pageName);
				//alert(accountName);
				window.location = './summary.htm?accountName='+ accountName+"&password="+ password;
			break;
			default:
				window.location = './'+pageName+'.htm?accountName='+ accountName+"&password="+ password;
			break;
		}
	//}
	
	//return false;
}

function getUserNameParam() {
	//alert(uname);
	return $.urlParam('accountName');
}

//};

//user: 	public static enum keys{user, username, password, usingGoogle, usingSimpleDB, usingFiles};
//

/**
 * returns 1 if date1 is after date2.
 * returns -1 is date1 is before date2.
 * returns 0 if they are on the same day.
 * @param date1
 * @param date2
 * @return see above
 **/
function compare(date1, date2) {
	//alert("com: "+ date1.getFormattedString()+date2);
	if(date1.getFullYear() > date2.getFullYear())	return 1;
	if(date1.getFullYear() < date2.getFullYear())	return -1;
	if(date1.getMonth() > date2.getMonth())	return 1;
	if(date1.getMonth() < date2.getMonth())	return -1;
	if(date1.getDate() > date2.getDate())	return 1;
	if(date1.getDate() < date2.getDate())	return -1;
	
	return 0;
}

var BAD_YEAR= 1900;

/**
 * compares two dates.
 * @param today date, Calendar
 * @param recurringEvent another date, Event
 * @return whether the two dates are equal
 **/
 function compareEventRecurring(today, recurringEvent) {

	if(undefined === today || null === today)	return false;
	
	if(0 == compare(today, recurringEvent.date))	return true;
	if(recurringEvent.event == "once")	return false;
	if(recurringEvent.date.getFullYear() == BAD_YEAR)	return false;
	alert2("recurringEvent.date: "+ recurringEvent.date.getFormattedString());
	var nextDate= recurringEvent.date.clone();
	//System.out.println(recurringEvent.description);
	//System.out.println("--------\n"+ DailyBalance.format(today)+","+DailyBalance.format(nextDate));
	var i= 0;
	while(-1 != compare(today, nextDate)) {	//until we've gone past today
		alert2((compare(today, nextDate)===0)+ today.getFormattedString()+ " compare "+ nextDate.getFormattedString()+","+JSON.stringify(recurringEvent));

		if(0 == compare(today, nextDate))	return true;

		nextDate= nextOccurance(nextDate, recurringEvent.recurType, recurringEvent.recurPeriodicity);
		if(++i > 1000)	{ 
			alert("too many iterations "+ i); 
			alert2((compare(today, nextDate)===0)+ today.getFormattedString()+ " compare "+ nextDate.getFormattedString()+","+JSON.stringify(recurringEvent));
			break; 
		}
	}
	//System.out.println("--------");
	
	return false;
}

function nextOccuranceRightBeforeDate(today, recurringEvent) {
///var log= "";
	var nextDate= recurringEvent.date.clone();
	var prevDate= nextDate.clone();
	//System.out.println(recurringEvent.description);
	//System.out.println("--------\n"+ DailyBalance.format(today)+","+DailyBalance.format(nextDate));
	var i= 0;
	while(-1 != compare(today, nextDate)) {	//until we've gone past today
		//System.out.println(DailyBalance.format(today)+","+DailyBalance.format(nextDate));
		//System.out.println(recurringEvent.toString());
///log+= "nextDate: "+nextDate.getFormattedString()+"<br/>";
		prevDate= nextDate.clone();
		nextDate= nextOccurance(nextDate, recurringEvent.recurType, recurringEvent.recurPeriodicity);
		if(++i > 1000)	{
///$('div.logger').html(log);
			alert("too much"); 
			break;
		}
	}

///alert("logger"); 
///$('div.logger').html(log);
	return prevDate;
}

function nextOccuranceAfterDate(today, recurringEvent) {
///var log= "";
	var nextDate= recurringEvent.date.clone();
	//System.out.println(recurringEvent.description);
	//System.out.println("--------\n"+ DailyBalance.format(today)+","+DailyBalance.format(nextDate));
	var i= 0;
	while(-1 != compare(today, nextDate)) {	//until we've gone past today
		//System.out.println(DailyBalance.format(today)+","+DailyBalance.format(nextDate));
		//System.out.println(recurringEvent.toString());
///log= ""+nextDate.getFormattedString()+""+ log;
		nextDate= nextOccurance(nextDate, recurringEvent.recurType, recurringEvent.recurPeriodicity);
		if(++i > 1000)	{ 
			///$('div.logger').html(log);
			alert("too much: "+ log);
			break;
		}
	}

///alert("logger2"); 
///$('div.logger').html(log);	
	return nextDate;
}

function nextOccurance(date, recurType, step) { 
	var nextDate= date.clone();
	if(nextDate.getFullYear() === BAD_YEAR)	nextDate= TTODAY;
	
	if(0 === Number(step))	{
		alert("step: "+ Number(step));
		step= 1;
	}
	
	
	alert2("recurType: "+ recurType);
	switch(recurType) {
		case "once":
		default:
			//alert("add century");
			nextDate.setFullYear(nextDate.getFullYear()+ 100);
			//return nextDate;
			break;
		case "daily":
			nextDate.addDays(Number(step));
			//alert(step+ " nextDate-daily:"+ nextDate.getFormattedString());
			//return nextDate;
			break;
		case "weekly":
			nextDate.addDays(7* Number(step));
			//return nextDate;
			break;
		case "biweekly":
			nextDate.addDays(14* Number(step));
			//return nextDate;
			break;
		case "bimonthly":
			//alert(step+ "nextDate-initial:"+ nextDate.getFormattedString()+","+(nextDate.getMonth()));
			
			var dayOfMonth= nextDate.getDate();
			if(dayOfMonth >= 15) {
				nextDate.setMonth(nextDate.getMonth()+ Number(step));
				nextDate.setDate(1);
			} else {
				nextDate.setDate(15);
			}	
			//alert("nextDate-ret:"+ nextDate.getFormattedString());
			//return nextDate;
			break;
		case "monthly":
			//alert(step+ "nextDate-initial:"+ nextDate.getFormattedString()+","+(nextDate.getMonth()));
			nextDate.setMonth(nextDate.getMonth()+ Number(step));
			//alert("nextDate-ret:"+ nextDate.getFormattedString());
			//return nextDate;
			break;
		case "yearly":
			//alert("nextDate-init:"+ nextDate.getFormattedString());
			nextDate.setFullYear(nextDate.getFullYear()+ Number(step));
			//alert("nextDate-ret:"+ nextDate.getFormattedString());
			//return nextDate;
			break;
	}
	
	return nextDate;
}

function prevOccurance(date, recurType, step) {
	prevDate= date
	
	if(0 == step)	{
		alert("step: "+ step);
		step= 1;
	}
	
	switch(recurType) {
		case "once":
		default:
			nextDate.setFullYear(newDate.getFullYear()- 100);
			return nextDate;
			//break;
		case "daily":
			nextDate= new Date(newDate.getDate()- step);
			return nextDate;
			//break;
		case "weekly":
			nextDate= new Date(newDate.getDate()- 7* step);
			return nextDate;
			//break;
		case "biweekly":
			nextDate= new Date(newDate.getDate()- 14* step);
			return nextDate;
			//break;
		case "bimonthly":
			var dayOfMonth= nextDate.getDate();

			if(dayOfMonth < 15) {
				nextDate.setMonth(newDate.getMonth()- step);
				nextDate.setDate(15);
			} else {
				nextDate.setDate(1);
			}
			return nextDate;
			//break;
		case "monthly":
			nextDate.setMonth(newDate.getMonth()- step);
			return nextDate;
			//break;
		case "yearly":
			nextDate.setFullYear(newDate.getFullYear()- step);
			return nextDate;
			//break;
	}
	
	//return nextDate;
}

function formatMoney(n_value) {

// validate input
if (isNaN(Number(n_value)))
return 'ERROR';

// save the sign
var b_negative = Boolean(n_value < 0);
n_value = Math.abs(n_value);

// round to 1/100 precision, add ending zeroes if needed
var s_result = String(Math.round(n_value*1e2)%1e2 + '00').substring(0,2);

// separate all orders
var b_first = true;
var s_subresult;
while (n_value > 1) {
s_subresult = (n_value >= 1e3 ? '00' : '') + Math.floor(n_value%1e3);
s_result = s_subresult.slice(-3) + (b_first ? '.' : ',') + s_result;
b_first = false;
n_value = n_value/1e3;
}
// add at least one integer digit
if (b_first)
s_result = '0.' + s_result;

// apply formatting and return
return b_negative
? '-$' + s_result
: '$' + s_result;
}
