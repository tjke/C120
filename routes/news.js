var days = require('../days.json')['days'];
var news = require('../tempNews.json')['value'];

// month arrays
var months = ["January","February","March","April","May","June","July","August","October","November","December"];
var mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// some defaults
var month = "Month";
var mon = "Mon";
var date = 1;
var theme = "Awareness Day";
var summary = "Let's be aware of a cause.";
var query = "awareness day";
var category = "Other";
var color = "#80d4ff";
var darkerColor = "#4dc3ff";
var day = days[0]; // default data


exports.view = function(req, res){
	setDayData();
	convertNewsTime();
	//console.log(day);
	//console.log(news);
	var passData = {
  		"mon": mon,
  		"date": date,
  		"theme": theme,
  		"query": query,
  		"category": category,
  		"news": news,
  		"newsLength": news.length,
  		"color": color,
  		"darkerColor": darkerColor
  	};
  	res.render('news', passData);
};


function setDayData() {
	var d = new Date();
	d.setUTCHours(d.getUTCHours() - 8);
  console.log(d.toLocaleString());

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
			var weekBegin = days[i].da - 5;
			var weekEnd = days[i].da + 1;
			console.log("Found a matching month; days[i].da=" + days[i].da + "; Week " + weekBegin + "-" + weekEnd);
			
			// find a day within the same week
			//if( days[i].da-4 <= n && n <= days[i].da+2) {
			if( days[i].da == n || i == days.length-1) {
				theme = days[i].theme;
				summary = days[i].summary;
				query = days[i].query;
				category = days[i].category;
				color = days[i].color;
				darkerColor = days[i].darkerColor;
				day = days[i]; // getting the theme day data
				console.log("   Found a match: " + days[i].month + " " + days[i].da);
				break;
			}
		}
	}
}

function convertNewsTime() {
	for(var i = 0; i < news.length; i++ ) {
		var newsTime = news[i].datePublished;
		var d = new Date(newsTime);
		newsTime = d.toLocaleString();
		//console.log(newsTime);
		news[i].datePublished = newsTime;
	}
}