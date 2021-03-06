var days = require('../days.json')['days'];
var news = require('../tempNews.json')['value'];
var trophies = require('../trophies.json')['trophies'];

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
var challenge = "Do something nice for today.";
var participants = 0;
var category = "Other";
var color = "#80d4ff";
var darkerColor = "#4dc3ff";
var day = days[0]; // default data
var orgs = days[0].orgs; // default orgs data
var passData; // data to pass and render


// Home page view
exports.view = function(req, res){
	setDayData();
	passData['showAlternate'] = true;
  res.render('index', passData);
};

// Home page B view
exports.view2 = function(req, res){
	setDayData();
  passData['showAlternate'] = false;
  res.render('index', passData);
};


// Challenge page view
exports.viewChallenge = function(req, res){
	setDayData();
	res.render('challenge',passData);
};

// Organizations page view
exports.viewOrgs = function(req, res){
	setDayData();
	res.render('organizations',passData);
};

// News page view
exports.viewNews = function(req, res){
	setDayData();
	convertNewsTime();
	res.render('news',passData);
};

// Trophies page view
exports.viewTrophies = function(req, res){
	setDayData();
	res.render('trophies',passData);
};

// Login page view
exports.viewLogin = function(req, res){
	setDayData();
	res.render('login',passData);
};

// Calendar page view
exports.viewCalendar = function(req, res){
	setDayData();
	res.render('calendar',passData);
};

// History page view
exports.viewHistory = function(req, res){
	setDayData();
	res.render('history',passData);
};


// extracting data from today's date
function setDayData() {
	var d = new Date();
	d.setUTCHours(d.getUTCHours() - 8);
  //console.log(d.toLocaleString());

	// get the current Month and Date
	var m = months[d.getMonth()];
	month = m;
	mon = mons[d.getMonth()];
	var n = d.getDate();
	date = n;
	//console.log(m + " " + n);

	for(var i = 0; i < days.length; i++ ) {
		// find a matching month
		if(days[i].month == m) {
			var weekBegin = days[i].da - 5;
			var weekEnd = days[i].da + 1;
			//console.log("Found a matching month; days[i].da=" + days[i].da + "; Week " + weekBegin + "-" + weekEnd);
			
			// find a day within the same week
			//if( days[i].da-4 <= n && n <= days[i].da+2) {
			if( days[i].da == n || i == days.length-1) {
				theme = days[i].theme;
				query = days[i].query;
				summary = days[i].summary;
				challenge = days[i].challenge;
				category = days[i].category;
				color = days[i].color;
				darkerColor = days[i].darkerColor;
				day = days[i]; // getting the theme day data
				//console.log("   Found a match: " + days[i].month + " " + days[i].da);
				orgs = days[i].orgs;
				break;
			}
		}
	}

	// data to pass and render
	passData = {
		"month": month,
		"mon": mon,
		"date": date,
		"theme": theme,
		"query": query,
		"summary": summary,
		"challenge": challenge,
		"participants": participants,
		"category": category,
		"orgs": orgs,
		"news": news,
		"trophies": trophies,
		"color": color,
		"darkerColor": darkerColor
  };
}

// convert the time from news into a string
function convertNewsTime() {
	for(var i = 0; i < news.length; i++ ) {
		var newsTime = news[i].datePublished;
		var d = new Date(newsTime);
		newsTime = d.toLocaleString();
		//console.log(newsTime);
		news[i].datePublished = newsTime;
	}
}