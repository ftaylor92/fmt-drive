<!-- Paste this code into an external JavaScript file named: timeFormat.js  -->

/* This script and many more are available free online at
The JavaScript Source :: http://javascript.internet.com
Created by: Sandeep Gangadharan :: http://www.sivamdesign.com/scripts/ */

function sizeClass_get() {
	return this._numObjects;
}

function sizeClass() {
	this._numObjects= 0;
	this.get=sizeClass_get;
	
	this.add= function(num) {
		this._numObjects+= num;
		
		return this._numObjects;
	}
}
var page= new sizeClass();

function formatTime() {
  now = new Date();
  hour = now.getHours();
  min = now.getMinutes();
  sec = now.getSeconds();

  if (document.clock.sivamtime[0].checked) {
    if (min <= 9) {
      min = "0" + min;
    }
    if (sec <= 9) {
      sec = "0" + sec;
    }
    if (hour > 12) {
      hour = hour - 12;
      add = " p.m.";
    } else {
      hour = hour;
      add = " a.m.";
    }
    if (hour == 12) {
      add = " p.m.";
    }
    if (hour == 00) {
      hour = "12";
    }

    document.moon.src="m"+sec%4+".GIF";
    
    document.clock.area.value = page.get();

    document.clock.sivam.value = ((hour<=9) ? "0" + hour : hour) + ":" + min + ":" + sec + add;
  }

  if (document.clock.sivamtime[1].checked) {
    if (min <= 9) {
      min = "0" + min; }
    if (sec <= 9) {
      sec = "0" + sec; }
    if (hour < 10) {
      hour = "0" + hour; }
    document.clock.sivam.value = hour + ':' + min + ':' + sec;
    
    page.add(3);
  }

  setTimeout("formatTime()", 1000);
}

window.onload=formatTime;