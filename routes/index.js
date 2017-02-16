var days = require('../days.json')['days'];

/*
 * GET home page.
 */

exports.view = function(req, res){
	var d = new Date();

	// month array
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";

	// mons array
	var mons = new Array();
	mons[0] = "Jan";
	mons[1] = "Feb";
	mons[2] = "Mar";
	mons[3] = "Apr";
	mons[4] = "May";
	mons[5] = "Jun";
	mons[6] = "Jul";
	mons[7] = "Aug";
	mons[8] = "Sep";
	mons[9] = "Oct";
	mons[10] = "Nov";
	mons[11] = "Dec";

	// get the current Month and Date
	var m = month[d.getMonth()];
	var n = d.getDate();
	console.log(m + " " + n);

	var day = days[0];


	for(var i = 0; i < days.length; i++ ) {
		// find a matching month
		if(days[i].month == m) {
			console.log("Found a matching month; days[i].date=" + days[i].date);
			var weekBegin = days[i].date - 5;
			var weekEnd = days[i].date + 1;
			console.log("Week " + weekBegin + "-" + weekEnd);
			// find a day within the same week
			if( days[i].date-5 <= n && n <= days[i].date+1) {
				var date = days[i].date;
				day = days[i]; // getting the theme day data
				console.log("   Found a match: " + days[i].month + " " + date);
			}
		}
	}
	console.log(day);
  	res.render('index', day);
};