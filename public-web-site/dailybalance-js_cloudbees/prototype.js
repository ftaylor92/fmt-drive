Date.prototype.getDOY = function() {
	var onejan = new Date(this.getFullYear(),0,1);
	return Math.ceil((this - onejan) / 86400000);
} 

Date.prototype.addDays = function(days) {
	this.setTime(this.getTime()+Number(days)*86400000);
	//return this;
}

Date.prototype.clone = function() {
	var newDate= new Date();

	newDate.setMonth(this.getMonth());
	newDate.setDate(this.getDate());
	newDate.setFullYear(this.getFullYear());

	return newDate;
}

function pad2(number) {
     return (number < 10 ? '0' : '') + number
}

function alert2(msg) {
	if(false) alert(msg);
}

function alert3(msg) {
	if(false) alert(msg);

	return false;
}

Date.prototype.getFormattedString= function() {
	//alert("this.getFullYear(): "+ this.getFullYear());
	//return (pad2(this.getMonth()+1))+"/"+pad2(this.getDate())+"/"+this.getFullYear();
	return this.getFullYear()+"-"+(pad2(this.getMonth()+1))+"-"+pad2(this.getDate());
}

Date.prototype.setString= function(str) {
	//alert("str: "+ str);
	var monStr= str.substring(5,7);
	var dayStr= str.substring(8,10);
	if(0 == parseInt(monStr))	monStr= str.substring(6,7);
	if(0 == parseInt(dayStr))	dayStr= str.substring(9,10);

	var newDate= new Date();
	newDate.setMonth(parseInt(monStr)-1);
	//alert("monStr: "+ monStr);
	//alert("parseInt(monStr): "+ parseInt(monStr));
	//alert("month: "+ newDate.getMonth());
	//alert("parseInt(dayStr): "+ parseInt(dayStr));
	//alert("dayStr: "+ dayStr);
	newDate.setDate(parseInt(str.substring(8,10)));
	//alert("parseInt(str.substring(0,4)): "+ parseInt(str.substring(0,4)));
	newDate.setFullYear(parseInt(str.substring(0,4)));

	if(!newDate.getFullYear() === str.substring(0,4) || newDate.getFullYear() < 1900 || newDate.getFullYear() > 3000)	throw(str+" is not valid date format yyyy-mm-dd");
	else {
		this.setMonth(parseInt(monStr)-1);
		this.setDate(parseInt(dayStr));
		this.setFullYear(parseInt(str.substring(0,4)));
	}
}

Date.prototype.getMonthStr= function() {
	var month=new Array();
	month[0]="January";
	month[1]="February";
	month[2]="March";
	month[3]="April";
	month[4]="May";
	month[5]="June";
	month[6]="July";
	month[7]="August";
	month[8]="September";
	month[9]="October";
	month[10]="November";
	month[11]="December";
	return month[this.getMonth()]; 
}

getShortMonthStr= function(str) {
	var month=new Array();
	month[0]="Jan";
	month[1]="Feb";
	month[2]="Mar";
	month[3]="Apr";
	month[4]="May";
	month[5]="Jun";
	month[6]="Jul";
	month[7]="Aug";
	month[8]="Sep";
	month[9]="Oct";
	month[10]="Nov";
	month[11]="Dec";
	return int(month[str]); 
}

Date.prototype.getDayStr= function() {
	var day_name=new Array();
	day_name[0]="Sunday"
	day_name[1]="Monday"
	day_name[2]="Tuesday"
	day_name[3]="Wednesday"
	day_name[4]="Thursday"
	day_name[5]="Friday"
	day_name[6]="Saturday"
	return day_name[this.getDay()]; 
}

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

String.prototype.toDate = function() {
	var dt= new Date();
	var dtStr= this.toString();
	if("/" === dtStr.match("/")) {	//12/15/2010
		//alert("dt: "+ dtStr);
		var monStr= dtStr.substring(0,2);
		var dayStr= dtStr.substring(3,5);
		if(0 == parseInt(monStr))	monStr= dtStr.substring(1,2);
		if(0 == parseInt(dayStr))	dayStr= dtStr.substring(4,5);

		dt.setMonth(parseInt(dtStr.substring(0,2)- 1));
		dt.setDate(parseInt(dtStr.substring(3,5)));
		dt.setFullYear(parseInt(dtStr.substring(6,10)));
	} else if("GMT" === dtStr.match("GMT")) {	//Tue Mar 12 2013 03:17:32 GMT-0400 (EDT) 
		throw(dtStr+" is not valid date format mm/dd/yyyy");
	} else {	//2012-01-15T11:54:22.253Z
		//alert("dt2: "+ dtStr);
		var monStr= dtStr.substring(5,7);
		var dayStr= dtStr.substring(8,10);
		if(0 == parseInt(monStr))	monStr= dtStr.substring(6,7);
		if(0 == parseInt(dayStr))	dayStr= dtStr.substring(9,10);

		dt.setDate(parseInt(dtStr.substring(8,10)));
		dt.setMonth(parseInt(dtStr.substring(5,7)- 1));
		dt.setFullYear(parseInt(dtStr.substring(0,4)));
	}

	return dt;
};

String.prototype.endsWith = function(str)
{return (this.match(str+"$")==str)}

String.prototype.endsWith = function(str)
{return (this.match(str+"$")==str)}

eventClass.prototype.getAccumulation= function(day) {
	var acc= 0.0;

	var thisDate= this.date.clone();
	//alert("acc4: "+ thisDate.getFormattedString());
	//lastDay.add(Calendar.DATE, days);
	while(compare(thisDate, day) <= 0) {
		//alert("acc1: "+ thisDate.getFormattedString());
		//System.out.printf("Accumulation: %s, %s, %s\n", this.description, DailyBalance.slashDate.format(today.getTime()), DailyBalance.slashDate.format(lastDay.getTime()));
		if(compareEventRecurring(thisDate, this)) {
			acc+= this.amount;
		}
		//alert(this.recurType+ "acc2: "+ thisDate.getFormattedString());
		thisDate= nextOccurance(thisDate, this.recurType, this.recurPeriodicity);
		//alert("getAcc: "+ thisDate.getFormattedString());
	}
	
	return acc;
}

/**
	returns the position in array of an element in array with attribute of field who's value is val
**/
function positionInArray(array, field, val) {
	var idx= -1;
	$.each(array, function(index, element) {
		if(eval("element."+field+"===\'"+val+"\'")) idx= index;
	});
	
	return idx;
}
