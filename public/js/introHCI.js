'use strict';

/*var days = require('../days.json')['days'];

// month arrays
var months = ["January","February","March","April","May","June","July","August","October","November","December"];
var mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// some defaults
var month = "Month";
var mon = "Mon";
var date = 1;
var theme = "Awareness Day";
var summary = "Let's be aware of a cause.";
var challenge = "Do something nice for today.";
var participants = 0;
var category = "other";
var day = days[0]; // default data
var orgs = days[0].orgs; // default orgs data*/

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	// your code here
}

/*function setDayData() {
	var d = new Date();

	// get the current Month and Date
	var m = months[d.getMonth()];
	month = m;
	mon = mons[d.getMonth()];
	var n = d.getDate();
	date = n;
	console.log(m + " " + n);

	for(var i = 0; i < days.length; i++ ) {
		// find a matching month
		if(days[i].month == m) {
			var weekBegin = days[i].date - 5;
			var weekEnd = days[i].date + 1;
			console.log("Found a matching month; days[i].date=" + days[i].date + "; Week " + weekBegin + "-" + weekEnd);
			
			// find a day within the same week
			if( days[i].date-4 <= n && n <= days[i].date+2) {
				theme = days[i].theme;
				summary = days[i].summary;
				category = days[i].category;
				day = days[i]; // getting the theme day data
				console.log("   Found a match: " + days[i].month + " " + date);
				break;
			}
		}
	}
}*/

var modal = document.getElementById("myhelpbtn");
var helpbtn = document.getElementById("help");
var span = document.getElementsByClassName("close")[0];

helpbtn.onclick = function(){
	modal.style.display = "block";
}
span.onclick = function(){
	modal.style.display = "none";
}
