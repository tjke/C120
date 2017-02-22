'use strict';

// gathering HTML elements
var dateHTML = document.getElementById("date");
var themeHTML = document.getElementById("theme");

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
var days; // array of data
//var day = days[0]; // default data
//var orgs = days[0].orgs; // default orgs data

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	// firebase stuff
	var daysRef = firebase.database().ref().child("days");
	daysRef.on("child_added", snap => {
		days = snap.val();
		console.log(days);
	});
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	setDayData();
	/*database.on('value', function(datasnapshot) {
		console.log(datasnapshot);
	});*/
}

function setDayData() {
	var d = new Date();

	// get the current Month and Date
	var m = months[d.getMonth()];
	month = m;
	mon = mons[d.getMonth()];
	var n = d.getDate();
	date = n;
	console.log(m + " " + n);
	dateHTML.innerText = m + " " + n;

	/*var firebaseRef = firebase.database().ref();
	var themeText = themeHTML.value;
	firebaseRef.push().set*/

	/*for(var i = 0; i < days.length; i++ ) {
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
	}*/
}
