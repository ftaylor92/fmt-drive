//globals
var ONE_DAY= 86400000;
var pSavings= "";
var TTODAY= new Date();
var BASE_PASS_URL= "https://fmt-password.herokuapp.com"; //"http://localhost:8080/password";
var BASE_URL= "https://mongo-wrapper.herokuapp.com"; // "http://localhost:8080/mongo-wrapper";


/**
	main dailybalance function.
	generates daily HTML <table>
	param: accountName userName/accountName
**/
function generateTable(userData, password) {
	//alert("generateTable");
  loadAccounts(function(accountName, password, userData) {
	var pHtml= "";
/*	if(alert3("balance: "+ userData.current.accounts[0].balance)) return;
alert("balance: "+ userData.current.accounts[0].balance);
$.each(userData.budget.bills, function(index, bill) {
	alert("bill: "+ bill.date.getFormattedString());
});*/

	//var pSavings= "<p>"+userData.current.accounts[0].balance+"</p>";
	$('div.summary').html(pHtml);
	
	var today= new Date();
	//alert("today1: "+today.getFormattedString());
	if(userData.misc.skipAhead) {
		today.addDays(userData.misc.skipAhead); //.setDate(today.getDate()+ userData.misc.skipAhead);
	}
	//alert("today2: "+today.getFormattedString());

	var days= 31;
	if(userData.misc.futureDays) {
		days= userData.misc.futureDays;
	}
	//----------TESTING------------
	if(false) {var same= compareEventRecurring(today, userData.budget.bills[1]);
		if(!same) {
			alert(JSON.stringify(userData.budget.bills[1]));
			alert("compare: "+ same+": "+ today.getFormattedString());
		}
	}
	//-----------------------------
	
	preSavings= userData.misc.presavings;
	var lastDay= new Date();	//last day that we're looking ahead
	lastDay.addDays(days);
	//alert(days+"lastDay: "+lastDay.getFormattedString());
	
	pSavings= "";
	var savingsFine= true;
	var firstPaycheck= true;
	var color= "black";
	
	var runningBalance= 0.0;
	var runningBalance= -userData.misc.outstanding;
	$.each(userData.current.accounts, function(index, acct) {
		runningBalance+= acct.balance;
	});
	if(0.0 === runningBalance) {
		$('div.help').html("Start by adding Accounts, Bills, Credit Cards, or Edit Paycheck to see Daily Bank Balances");
	} else {
		$('div.help').html("&nbsp;");
	}
	
	//alert("runningBalance1: "+ runningBalance);
	var firstPaycheckAmt= 0.0;
	var firstPaycheckAmt= userData.paycheck.nextPaycheck;
	var balances= new hiLoClass();
	var defecit= new hiLoClass();
	var surplus= new hiLoClass();
	var cumulativeBalance= 0.0;
	
	//Load Bill
	var events= new Array();
	var savings= new Array();
	var loadBills= function(paycheck, misc, current, budget, events, savings) {
	
		//CreditCards---------------
		$.each(current.creditCards, function(index, creditcrd) {
			var creditcard= creditcrd;
			
			var ccDate= new Date();
			ccDate.setDate(creditcrd.due);
			//alert("ccDate: "+ ccDate.toString());
			//System.out.println("Date: "+ Util.format(ccDate));
			//System.out.println("Date: "+ Util.format(TODAY));
			if(ccDate.valueOf() < TTODAY.valueOf())	ccDate.setMonth(ccDate.getMonth()+ 1);
			//System.out.println("Date: "+ Util.format(ccDate));
			
			//First CC payment
			var cc= new eventClassConstructor("Credit-Card", ccDate, creditcrd.bill, "bill", "once", 1);
			cc.evtType= EVT_TYPE["bill"];
			events.push(cc);
//alert("ccDate1: "+ cc.date.getFormattedString());

			//Second CC payment
			ccDate= ccDate.clone();
			ccDate.setMonth(ccDate.getMonth()+ 1);
			//System.out.println("Date: "+ Util.format(ccDate));
			//System.out.println("ccDate: "+ Util.format(cc.date));
			cc= new eventClassConstructor("Credit-Card", ccDate, creditcard.balance- creditcard.bill, "bill", "once", 1);
			cc.evtType= EVT_TYPE["bill"];
			events.push(cc);
//alert("ccDate2: "+ cc.date.getFormattedString());

			//Subsequent CC payments
			ccDate= ccDate.clone();
			ccDate.setMonth(ccDate.getMonth()+ 1);
			//System.out.println("Date: "+ Util.format(ccDate));
			cc= new eventClassConstructor("Credit-Card", ccDate, 0.0, "bill", "once", 1);
			cc.evtType= "bill";
			events.push(cc);
//alert("ccDate3: "+ cc.date.getFormattedString());
		});
		//-----------------------------
		
		//savings
		var savingsRate= misc.monthlyBudget* 3.0;
		var YESTERDAY= new Date(TTODAY.getTime()- ONE_DAY);	
		var safetyNet= new eventClassConstructor("Three-Month-Expenses", YESTERDAY, savingsRate, "savings", "once", 1);
		savings.push(safetyNet);
		//alert(savings[0].evtType+ "sav: "+ savings[0].description);
		
		//events: bills, accumulator, income, goals
		$.each(budget, function(index, budgetEvent) {
			if(budgetEvent.evtType === "bill" || budgetEvent.evtType === "income") {
				//alert(budgetEvent.description+"budgetEvent.evtType "+budgetEvent.evtType);
				events.push(budgetEvent);
			} else {
				//alert(budgetEvent.description+"budgetEvent.evtType "+budgetEvent.evtType);
				savings.push(budgetEvent);
			}
		});
		
		//Testing
		//Tests.testPrintBills(events, savings);
		
	};
	//alert("savings: "+ savings.length);
	loadBills(userData.paycheck, userData.misc, userData.current, userData.budget.bills, events, savings);


	//Initial Savings Rate
	var savingsRate= calcSavingsRate(today, pSavings, savings, preSavings, TTODAY);
	//alert("pSavings: "+ pSavings);

	pHtml+= "<table border='1'><thead><tr><th>Date</th><th>Balance</th><th>Event</th><th>Over</th><th>Savings</th></tr></thead>\n";
	

	//Go Day-by-Day
	//alert("today: "+today.getFormattedString());
	for(var i= 0; i < days; i++) {
		var eventStr= "";
			
		//get what I should have saved
		//alert("savings: "+ savings.length);
		savingsRate= calcSavingsRate(today, null, savings, preSavings, TTODAY);
		//eventStr+= String.Util.format("(%s) ", Util.format(savingsRate));
		
		//Add and Subtract my running runningBalance
		runningBalance-= userData.misc.weeklyExpenses/ 7.0;
		//alert("runningBalance2: "+ runningBalance);

		//Paycheck-----
		isObjType(userData.paycheck.date, "date");
		if(!isObjType(today, "date"))	alert("today is not a date");
		if(!isObjType(userData.paycheck.date, "date"))	alert("userData.paycheck.date is not a date");
		if(i > 1 && userData.paycheck.isTodayPayday(today)) {
			alert2(today.getFormattedString()+ " today is payday "+ userData.paycheck.date.getFormattedString());
			if(!(firstPaycheck && userData.paycheck.skipPaycheck))	{
				eventStr+= "Paycheck, ";
				if(0.0 == firstPaycheckAmt) {
					var ssnDate= userData.paycheck.endSsn;
					var fourKDate= userData.paycheck.end401k;

					if(today.getMonth() > ssnDate.getMonth() ||
						(today.getMonth() == ssnDate.getMonth() && today.getDate() > ssnDate.getDate()) ) {
							runningBalance+= userData.paycheck.ssnTaxes;
							//alert("runningBalance3: "+ runningBalance);
					}

					if(today.getMonth() > fourKDate.getMonth() ||
						(today.getMonth() == fourKDate.getMonth() && today.getDate() > fourKDate.getDate()) ) {
							runningBalance+= userData.paycheck.contribution401k;
							//alert("runningBalance4: "+ runningBalance);
					}
					//alert(userData.paycheck.amount+ userData.paycheck.amount.constructor.toString()+ " *runningBalance5: "+ runningBalance.constructor.toString()+ runningBalance);
					runningBalance= runningBalance+ userData.paycheck.amount;
					//alert("runningBalance5: "+ runningBalance);
				} else {
					runningBalance+= firstPaycheckAmt;
					//alert("runningBalance6: "+ runningBalance);
				}
				//runningBalance-= Float.parseFloat(pBudget.get("weeklyExpenses"));
				//alert(userData.misc.weeklyExpensesGas+" runningBalance7: "+ runningBalance);
				runningBalance= runningBalance- userData.misc.weeklyExpensesGas;
				//alert(userData.misc.weeklyExpensesGas+" runningBalance7: "+ runningBalance);
			}
			firstPaycheck= false;
		}
		//---------
		
		//Expenses and Income
		$.each(events, function(index, event) {
			//alert("event");
			//System.out.println("compare: "+ event.description+": "+ Util.format(event.date)+ " with "+ Util.format(today));
			if(compareEventRecurring(today, event)) {
				//alert(event.description+" is today: "+ event.date);
				if(event.evtType === "income") {
					runningBalance+= event.amount;
				} else {
					runningBalance-= event.amount;
				}
				//alert("runningBalance8: "+ runningBalance);
				//eventStr+= event.description+","+ Util.format(event.date)+","+ event.recurrance.name()+","+ Util.format(Event.nextOccurance(event.date, event.recurrance, event.recurPeriodicity))+ ", ";
				eventStr+= event.description+", ";
			}
			/*if(datesEqualRecurring(today, event)) {
				eventStr+= event.description+ ", ";
			}*/
			/*if(event.recurring && event.day == today.getDate()) {
				runningBalance-= event.cost;
				eventStr+= event.description+ ", ";
			}*/
			/*if(datesEqual(today, event)) {
				runningBalance-= event.cost;
				eventStr+= event.description+ ", ";
			}*/
		});
		$.each(savings, function(index, sav) {
			if(sav.evtType === "accumulator") {
				//alert("acc2: "+ today.getFormattedString()+sav);
				if(compareEventRecurring(today, sav)) {
					//System.out.printf("matched on %s\n", Util.slashDate.format(today.getTime()));
					//savingsRate+= sav.cost;
					//savFormatter
					pSavings+= formatMoney(sav.amount)+ " for "+sav.description+" on "+ today.getFormattedString()+"<br/>";
				} /*else {
					System.out.printf("%s %d/%d/%d ignored on %s\n", sav.description, sav.month, sav.day, sav.year, Util.slashDate.format(today.getTime()));
				}*/
			}
			if(compareEventRecurring(today, sav)) {
				eventStr+= sav.description+ ", ";
			}
		});
		
		/*if(today.getMaximum(Calendar.DAY_OF_MONTH) == today.getDate() ||
				/*today.getMaximum(Calendar.DAY_OF_MONTH)/2* 15 == today.getDate()) {
			//IRA
			if(ck(budgetProperties, "Traditional-IRA"))	runningBalance-= getF(budgetProperties,"Traditional-IRA")/2.0f;
			eventStr+= "IRA, ";
		}*/
		
		if(runningBalance < savingsRate) {
			savingsFine= false;
		}

		if(today.getDate() == 1) {
					pHtml+= "<tr><td colspan='3'>---"+today.getMonthStr()+"---</td></tr>";
		}
		
		color= (runningBalance > /*0.0f*/savingsRate) ? "black" : "red";
		//alert("date: "+ today.toString());
		//alert("runningBalance9: "+ runningBalance);
		//alert("savingsRate9: "+ savingsRate);
		var oneLine= "<tr><td>"+today.getDayStr()+", "+ today.getDate() +"</td><td style='color: "+ color+ ";'>"+formatMoney(runningBalance)+"</td><td>"+eventStr+"</td><td>"+formatMoney(runningBalance- savingsRate)+"</td><td>"+formatMoney(savingsRate)+"</td></tr>";
		//alert("ln:"+ oneLine);
		pHtml+= oneLine;
		//Util.format(runningBalance), eventStr, Util.format(runningBalance- savingsRate), Util.format(savingsRate));
		//screenOut.printf(webSite ? "<tr><td>%s, %s</td><td style='color: "+ color+ ";'>%s</td><td>%s</td></tr>" : "%s, %s\t\t%s\t%s\n", fDay.Util.format(today.getTime()), fnDay.Util.format(today.getTime()), Util.format(runningBalance), eventStr);

		if(runningBalance > balances.high || 0.0 == balances.high) {
			balances.high= runningBalance;
			balances.whenHigh.setTime(today.getTime());
		}
		if(runningBalance < balances.low || 0.0 == balances.low) {
			balances.low= runningBalance;
			balances.whenLow.setTime(today.getTime());
		}
					
		if(runningBalance < savingsRate) {
			var debt= savingsRate- runningBalance;
			if(defecit.high < debt || defecit.high == 0.0)	{ 
				defecit.high= debt;
				defecit.whenHigh.setTime(today.getTime());
			}
			if(defecit.low  > debt || defecit.low  == 0.0) {	
				defecit.low = debt;
				defecit.whenLow.setTime(today.getTime());
			}
		}
		
		if(runningBalance > savingsRate) {
			var overage= runningBalance- savingsRate;
			if(surplus.high < overage || surplus.high == 0.0)	{ 
				surplus.high= overage;
				surplus.whenHigh.setTime(today.getTime());
			}
			if(surplus.low  > overage || surplus.low  == 0.0) {	
				surplus.low = overage;
				surplus.whenLow.setTime(today.getTime());
			}
		}

		today= new Date(today.getTime() + ONE_DAY);	
		
		if(i < 31) {
			cumulativeBalance+= runningBalance;
		}
	}
	pHtml+= "</table>\n<br/>\n</div>";

	//pHtml+= "<button style=\"width: 50px;\" data-inline=\"true\" onclick=\"incrementAccount($('input:text[name=accountName]').val(), 50);return false;\">Login</button>";
	
	//alert("pHtml: "+ pHtml);


	//---Summary----
	var pSummary= "<hr/>Summary:<br/>";

	var pBankInterest= cumulativeBalance/31.0*userData.misc.bankInterest/100.0;
	//System.out.println("cum: "+ cumulativeBalance+ ","+ userData.misc.bankInterest);
	
	var dailySpending= userData.misc.weeklyExpenses/ 7.0;

	var creditCardTotal= 0.0;
	var creditCardTotalDebt= 0.0;
	$.each(document.userAccounts.current.creditCards, function(index, crd) {
		creditCardTotal+= Number(crd.bill);
		creditCardTotalDebt+= Number(crd.balance);
	});

	var pCreditCardInterest= Number(creditCardTotal)*Number(userData.misc.creditCardInterest)/100.0;
	//alert("pSummary: "+pSummary);

//	pSummary+= "<b>"+ pOver+ "</b>";


	var savingsFine= Boolean(0.0 === defecit.high);
	if(savingsFine) {
		daysInDefecit= surplus.whenLow.getDOY()- TTODAY.getDOY()+ (365* (surplus.whenLow.getFullYear()- TTODAY.getFullYear()));
		newDailySpending= (0 == daysInDefecit) ? dailySpending : dailySpending+ (surplus.low/daysInDefecit);
	} else {
		daysInDefecit= defecit.whenHigh.getDOY()- TTODAY.getDOY()+ (365* (defecit.whenHigh.getFullYear()- TTODAY.getFullYear()));
		newDailySpending= (0 == daysInDefecit) ? dailySpending : dailySpending- (defecit.high/daysInDefecit);
	}
	color= (savingsFine/*(overage-  savingsRate) > 0*/) ? "black" : "red";
	//String savType= savingsFine ? "surplus" : "defecit";
	
	//formatter.format("days %d newDaily %f", daysInDefecit, newDailySpending);
	
	pSummary+= "<p style='font-style:oblique;color:"+ color+ 
		"'>Lowest balance: "+formatMoney(balances.low)+" on "+balances.whenLow.getFormattedString()+", Highest "+formatMoney(balances.high)+" on "+balances.whenHigh.getFormattedString()+" (Defecit between "+formatMoney(defecit.low)+"("+defecit.whenLow.getFormattedString()+") and "+formatMoney(defecit.high)+"("+defecit.whenHigh.getFormattedString()+"); Surplus between "+formatMoney(surplus.low)+"("+surplus.whenLow.getFormattedString()+") and "+formatMoney(surplus.high)+"("+surplus.whenHigh.getFormattedString()+")</p>\n<p><b>new Daily Spending: "+formatMoney(newDailySpending)+"</b></p>\n";
	
	pSavings+= "= (-)"+formatMoney(savingsRate)+" through "+today.getFormattedString()+"<br/>";
	
	//current bank and credit card balances
	var allBalances= 0.0;
	$.each(userData.current.accounts, function(index, acct) {
		allBalances+= acct.balance;
	});
	pSavings+= "+ "+formatMoney(allBalances)+ " (banks)<br/>";
	pSavings+= "<u>- "+formatMoney(creditCardTotalDebt)+ " (creditCards)</u><br/>";
	pSavings+= "="+formatMoney(allBalances- creditCardTotalDebt- savingsRate)+ "<br/>";

	pSummary+= "Bank Interest: "+ formatMoney(pBankInterest)+"<br/>";
	pSummary+= "Credit-Card Interest: "+ formatMoney(pCreditCardInterest)+"<br/>";
	pSummary+= "(Assuming "+formatMoney(dailySpending)+" daily and "+formatMoney(userData.misc.weeklyExpenses)+" weekly expenses)";

	
	$('div.summary').html(pHtml);
	$('div.edits').html(pSavings+pSummary);
  }, document.userAccounts.userName);
}

/**
	main dailybalance function.
	generates summary HTML <table>
	param: accountName userName/accountName
**/

function calcSavingsRate(day, savFormatter, savings, preSavings, today) {

	//alert("day: "+ );
	var savingsRate= Number(preSavings);
	
	if(null != savFormatter)	pSavings+= "Savings:<br/>"+formatMoney(preSavings)+ " for pre-savings\n"+"<br/>";	//+=

	$.each(savings, function(index, sav) {
		if(sav.evtType === "savings") {
			savingsRate+= sav.amount;
			if(null != savFormatter)	pSavings+= formatMoney(sav.amount)+ " for "+sav.description+"<br/>";
		} else if(sav.evtType === "accumulator") {
			
			accumulatedPastCosts= sav.getAccumulation(day);
			//alert("acc3: ");
			savingsRate+= accumulatedPastCosts;
			if(null != savFormatter) {
				alert2("accumulatedPastCosts: "+accumulatedPastCosts);
				pSavings+= formatMoney(accumulatedPastCosts)+ " for "+sav.description+ " on "+ TTODAY.getFormattedString()+"<br/>";	}
			
		} else if(sav.evtType === "goal"){
///alert("sav: "+sav.date.getFormattedString());
///return 0.0;
			var dSavs= dailySavingSum(day, sav);
			savingsRate+= dSavs;
			if(null != savFormatter)	{
				//alert("acc5: "+ day.getFormattedString()+JSON.stringify(sav));
				//alert("dSavs: "+dSavs);
				pSavings+= formatMoney(dSavs)+" of "+formatMoney(sav.amount)+" for "+sav.description+" on "+nextOccuranceAfterDate(TTODAY, sav).getFormattedString()+"<br/>";
			}
		} else {
			alert(sav.evtType+" Bill erroneously in Savings: "+ sav.description);
		}
	});
	if(null != savFormatter)	pSavings+= "= "+ formatMoney(savingsRate)+"<br/>";
	if(null != savFormatter)	pSavings+= "+<br/>";
	
	//alert("savFormatter: "+ pSavings);
	alert2("savingsRate1: "+ savingsRate);
	//alert("acc3: ");
	return savingsRate;
}

function generateSummaryDeprecated(accountName) {
	//alert("accountName: "+ accountName);

	loadAccounts(function(accountName, userData) {
		//alert("load:"+ document.userAccounts.account.balance);
		var pHtml= "<p>current balance: "+document.userAccounts.current.accounts[0].balance+"</p>";
		$('div.summary').html(pHtml);
	}, userData.userName);
}

/** returns whether an account exists.
	blocking-api
**/
function accountExists(accountName, password, yesFunction, noFunction) {
	var passUrl= BASE_PASS_URL+ "/rest/password?username="+accountName+"&site=dailybalance-js&password="+password+"&action=GET";

    $.get(passUrl,function(data, txtstatus, xbr){
		//alert("accountExists, .get() success: "+data);  
		var jData= eval(data);
		//alert("jData.status: "+jData.status+jData);			
		if(jData.status === "success" || (typeof jData.message === 'undefined' || !jData.message || -1 != jData.message.indexOf("no username"))) {
			//alert("role: "+ jData.role);
			//alert("status: "+ jData.status + ": "+ jData.message);

			if(jData.role === "user") {  
				yesFunction();
			} else {
				//alert(accountName+ " Created: "+ jData.message);
				noFunction();
			}

		} else {
			noFunction();	//alert(accountName+ " not found");
			//alert("error-accountExists: "+ jData.status);
		}
	});
}

/**
logs user in.
called when user clicks "Login" button.
param: accountName accountName/userName for account
**/
function login(accountName, password) {
	$('div.accountFeedback').html('<p>verifying account...</p>');
	if(!($("#hacker").is(":checked") && $("#malicious").is(":checked"))) {
		setTimeout("$('div.accountFeedback').html('<p style=\"color: red;\">No Hackers or Malicious Actions Permitted!</p>')", 500);
		return false;
	}

	accountExists(accountName, password, function(){window.location = './summary.htm?accountName='+ accountName+'&password='+ password;}, function(){$('div.accountFeedback').html('<p style=\"color: red;\">Account not found');})
	/*if(accountExists(accountName, password)) {
		//alert('going to login');
		window.location = './daily.htm?accountName='+ accountName;
	} else {
		$('div.accountFeedback').html('<p style=\"color: red;\">Account not found');
	}*/
}

/**
	creates an account.
	called when user clicks on "Crerate Account" button.
	param: accountName accountName/userName for account
**/
function createAccount(accountName, password) {
	$('div.accountFeedback').html('<p>verifying account...</p>');

	if(!($("#hacker").is(":checked") && $("#malicious").is(":checked"))) {
		setTimeout("$('div.accountFeedback').html('<p style=\"color: red;\">No Hackers or Malicious Actions Permitted!</p>')", 500);
		return;
	}

	accountExists(accountName, password, function(){
		$('div.accountFeedback').html('<p style=\"color: red;\">Account Name already in use.  Please try another');
		//setTimeout("$('div.accountFeedback').html('<p style=\"color: red;\">Account Name already in use.  Please try another')", 500);
	}, function(){
		uuu= "$('div.accountFeedback').html('<p style=\"color: darkgreen;\">Successfully created account, '+accountName+'!<br/>Bookmark this url to quick account access: <a href=\"./daily.htm?accountName='+accountName+'\">./daily.htm?accountName='+accountName+'</a></p>')";
		//setTimeout(uuu, 500);
	
		jsObj= getUserObject(accountName, password, "balance");
		setUserObject(accountName, jsObj);

		uuu= "login(\'"+accountName+"\', \'"+password+"\')";
		setTimeout(uuu, 5000);
	});
}

/**
 * returns how much to save per day depending on savings goal.
 * @param bill
 * @param day
 * @param event
 * @return daily savings rate
 */
function dailySavingSum(day, event) {
///	alert("dly: "+ event.date.getFormattedString());
///	return 0.0;
	//if(event.year != 0) {
		eventDate= nextOccuranceAfterDate(day, event);
		//var prevDate= nextOccuranceRightBeforeDate(day, event);
		//alert(day.getFormattedString()+ "eventDate: "+ eventDate);
		if(event.evtType === "goal") {
			//System.out.printf("eventDate: %s\n", Util.format(event.date));
			//System.out.printf("eventDate: %s\n", Util.format(eventDate));
			//System.out.printf("today: %s\n", Util.format(day));
		}
		var daysUntilBill= parseInt( (eventDate.getTime() - day.getTime()) / (1000 * 60 * 60 * 24));
		//alert("daysUntilBill: "+ daysUntilBill);
		//alert(event.date.getFormattedString() +" - "+ day.getFormattedString())
		//if(event.evtType === "goal")	System.out.printf("daysUntilBill(%s): %d %s %d\n", event.description, daysUntilBill, event.recurrance.name(), event.recurPeriodicity);
		var period= 365.0;
		if(event.recurType === "monthly") {
			period= 30.0* event.recurPeriodicity;
		}
		if(daysUntilBill > 365) {
			period= daysUntilBill+ 1;
		}
		/*if(daysUntilBill > 3650) {
			period= daysUntilBill+ (3650/2);
		}*/
		
		var sum= event.amount*((parseFloat(period-daysUntilBill))/period);
		//alert("sum: "+ sum);
		return sum;
		
	//}
	
	//return 0;
}

/**
 * returns how much to save per day depending on savings goal.
 * @param bill
 * @param today
 * @param event
 * @return daily savings rate
 */
function dailySavings(bill, today, event) {
	if(event.date.getFullYear() != 0) {
		var daysUntilBill= (Integer)( (event.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
		return bill/daysUntilBill;
	}
	
	return 0;
}

function fakeData() {
	var dbData='[ { "_id" : { "$oid" : "4fb72b33e4b0d10d5eee2038"} , "hitCount" : 448} , { "_id" : { "$oid" : "4fd15037e4b06cfe854612eb"} , "budget" : { "bills" : [ { "date" : "2012-02-10T10:11:37.130Z" , "description" : "IRA" , "amount" : "99.92" , "evtType" : "bill" , "recurType" : "weekly" , "recurPeriodicity" : "1"} , { "date" : "2011-04-06T09:42:42.165Z" , "description" : "CellPhone" , "amount" : "87.91" , "evtType" : "bill" , "recurType" : "monthly" , "recurPeriodicity" : "1"} , { "date" : "2011-04-06T09:55:53.006Z" , "description" : "nstarElectric" , "amount" : "30.0" , "evtType" : "bill" , "recurType" : "monthly" , "recurPeriodicity" : "1"} , { "date" : "2011-12-26T10:56:43.165Z" , "description" : "XMas" , "amount" : "200.0" , "evtType" : "bill" , "recurType" : "yearly" , "recurPeriodicity" : "1"} , { "date" : "2011-04-06T09:57:41.333Z" , "description" : "cellPhoneGoal" , "amount" : "87.91" , "evtType" : "goal" , "recurType" : "monthly" , "recurPeriodicity" : "1"} , { "date" : "2011-02-04T11:00:55.823Z" , "description" : "Haircut" , "amount" : "50.0" , "evtType" : "bill" , "recurType" : "monthly" , "recurPeriodicity" : "3"} , { "date" : "2012-01-01T11:01:42.743Z" , "description" : "AAAGoal" , "amount" : "53.0" , "evtType" : "goal" , "recurType" : "yearly" , "recurPeriodicity" : "1"} , { "date" : "2012-12-10T11:22:19.058Z" , "description" : "holidaysVacation" , "amount" : 1400 , "evtType" : "goal" , "recurType" : "yearly" , "recurPeriodicity" : 1} , { "date" : "2011-04-01T10:22:59.289Z" , "description" : "Rent" , "amount" : 1550 , "evtType" : "bill" , "recurType" : "monthly" , "recurPeriodicity" : 1} , { "date" : "2010-01-01T11:23:49.040Z" , "description" : "newCar" , "amount" : 2000 , "evtType" : "accumulator" , "recurType" : "yearly" , "recurPeriodicity" : 1} , { "date" : "2011-12-25T11:53:27.052Z" , "description" : "XMasGoal" , "amount" : 200 , "evtType" : "goal" , "recurType" : "yearly" , "recurPeriodicity" : 1} , { "date" : "2012-01-01T11:54:22.253Z" , "description" : "AAA" , "amount" : 53 , "evtType" : "bill" , "recurType" : "yearly" , "recurPeriodicity" : 1}] , "events" : [ ]} , "current" : { "accounts" : [ { "bankName" : "Fidelity" , "balance" : 11004}] , "creditCards" : [ { "due" : "22" , "cardName" : "AmEx" , "lastUpdate" : "2012-06-12T02:29:46.306Z" , "balance" : 973 , "bill" : 626} , { "due" : "9" , "cardName" : "Chase" , "lastUpdate" : "2012-06-12T02:29:46.306Z" , "balance" : 0 , "bill" : 0}]} , "misc" : { "futureDays" : 7 , "skipAhead" : 0 , "outstanding" : 0 , "presavings" : 0 , "monthlyBudget" : 2157.97 , "weeklyExpenses" : 463.2 , "weeklyExpensesGas" : 80 , "bankInterest" : 0.16 , "creditCardInterest" : 1} , "password" : "undef" , "paycheck" : { "end401k" : "2012-12-30T10:08:14.000Z" , "endSsn" : "2012-12-30T10:08:14.000Z" , "skipPaycheck" : false , "nextPaycheck" : 0 , "contribution401k" : 0 , "ssnTaxes" : 0 , "date" : "2012-06-15T09:08:14.000Z" , "amount" : 2168.71 , "recurType" : "biweekly" , "description" : "Paycheck" , "evtType" : "income" , "recurPeriodicity" : 1} , "username" : "ftaylor92"} ]';
	var dbObj= eval(dbData);
	document.userAccounts= dbObj[0];
	document.userAccounts.paycheck= new paycheckClassCopy(document.userAccounts.paycheck);
	//alert(dbObj[0].budget.bills[0].recurStr);
	reformData();
}

function reformData() {
	document.userAccounts.paycheck= new paycheckClassCopy(document.userAccounts.paycheck);
	//alert(document.userAccounts.paycheck.date);
	
	$.each(document.userAccounts.current.creditCards, function(index, creditcrd) {
		document.userAccounts.current.creditCards[index]= new creditCardClassCopy(creditcrd);
	});
	
	$.each(document.userAccounts.budget.bills, function(index, bill) {
		//alert("pre-bill: "+ bill.date);
		//alert("pre-bill: "+ bill.date.toDate().getFormattedString());
		document.userAccounts.budget.bills[index]= new eventClassCopy(bill);
		//alert("post-bill: "+ document.userAccounts.budget.bills[index].date.toString());
		//alert("post-bill: "+ document.userAccounts.budget.bills[index].date.getFormattedString());
	});
	
	/*if(isObjType(document.userAccounts.current.creditCards[0].lastUpdate, "string")) {
		//alert(userData.current.creditCards[0].lastUpdate.toString());
		document.userAccounts.current.creditCards[0].lastUpdate= document.userAccounts.current.creditCards[0].lastUpdate.toDate();
		if(isObjType(document.userAccounts.current.creditCards[0].lastUpdate, "date")) {
			alert("cc0.lastUpdate is a Date: "+ document.userAccounts.current.creditCards[0].lastUpdate.toString());
		} else { alert("Not a Date"); }
	} else { 
		//alert("cc0.lastUpdate Not a String"); 
	}*/
}
