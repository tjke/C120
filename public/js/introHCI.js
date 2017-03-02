'use strict';

// might use for firebase stuff
var firebaseRef = firebase.database();

// month arrays
var months = ["January","February","March","April","May","June","July","August","October","November","December"];
var mons = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// some defaults
var month = "Month";
var mon = "Mon";
var m = 0;
var date = 1;
var theme = "Awareness Day";
var summary = "Let's be aware of a cause.";
var challenge = "Do something nice for today.";
var category = "Other";
var data; // array of data
var newsJson;
var clickedIn = false; // resetted every time Challenge page has been loaded

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

//Function that is called when the document is ready.
function initializePage() {
	setDayData();
	$.get("trophies/", getProgress);
	//$.get("trophies/", getChallengeHistory);

	// linking whole div buttons
	$(".navbar-btn-home").click(redirectHome);
	$(".navbar-btn-challenge").click(redirectChallenge);
	$(".navbar-btn-organizations").click(redirectOrganizations);
	$(".navbar-btn-news").click(redirectNews);
	$(".navbar-btn-trophies").click(redirectTrophies);
	$(".calendar-btn").click(redirectCalendar);

	// defining click listeners
	$("#signup-btn").click(signup);
	$("#login-btn").click(login);
	$("#help-btn").click(displayHelp);
	$(".close").click(displayHelp);
	$(".donate-btn").click(donateClick);
	$("#completed-btn").click(greyButton);
	$("#completed-btn").click(updateCount);
}


// does error checking when Sign Up button is clicked
function signup(e) {
	var signupMessageHTML = document.getElementById("signupMessage");
	var user = document.getElementById("signupUser").value;
	var pass = document.getElementById("signupPassword").value;
	var mail = document.getElementById("signupEmail").value;

	// sign up fields are all filled
	if(user != "" && pass != "" && mail != "") {
		console.log("Reading from Sign Up " + user + ": " + pass + " (" + mail + ")");
		var accountRef = firebaseRef.ref('accounts/' + user);
		accountRef.on('value', function(snapshot) {
			var out = snapshot.val();
			// check if username has been taken
			if( out != null) {
				signupMessageHTML.innerHTML = "<font color=red>The username</font> " + user + " <font color=red>has been taken!</font>";
			}
			else {
				// check if valid email
				if( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) ) {
					// account created successfully	
					writeUserData(user,pass,mail);
					signupMessageHTML.innerHTML = "<font color=green>An account has been registered for</font> "
						+ user + " <font color=green>at</font> " + mail + "<br>";
				}
				else {
					// invalid email
					signupMessageHTML.innerHTML = "<font color=red>Please enter a valid email of the format</font> name@email.com";
				}
			}
		});	
	}
	// empty input fields errors
	else {
		var signupErrorMessage = "";
		if( user == "" ) {
			signupErrorMessage = "You must enter a username!<br>";
		}
		if( pass == "" ) {
			signupErrorMessage += "You must enter a password!<br>";
		}
		if( mail == "" ) {
			signupErrorMessage += "You must enter an email!<br>";
		}
		signupMessageHTML.innerHTML = "<font color=red>" + signupErrorMessage + "</font>";
	}	
}

// add new account to the firebase database
function writeUserData(user, pass, mail) {
	console.log("writeUserData(): sending new account to firebase");
	firebaseRef.ref('accounts/' + user).set({
		email: mail,
		name: user,
		password: pass
	});
}

// does error checking when Login button is clicked
function login(e) {
	var loginMessageHTML = document.getElementById("loginMessage");
	var user = document.getElementById("loginUser").value;
	var pass = document.getElementById("loginPassword").value;
	
	// login fields are all filled
	if(user != "" && pass != "") {
		var accountRef = firebaseRef.ref('accounts/' + user);
			accountRef.on('value', function(snapshot) {
				var out = snapshot.val();
				// check if username is in the database
				if( out == null) {
					loginMessageHTML.innerHTML = "<br><font color=red>The username</font> "
						+ user + " <font color=red>is not registered!</font>";
				}
				else {
					var passRef = firebaseRef.ref('accounts/' + user + '/password');
					passRef.on('value', function(snapshot) {
						var checkPass = snapshot.val();
						// passwords don't match in database
						if( pass != checkPass ) {
							loginMessageHTML.innerHTML = "<br><font color=red>Incorrect password!</font>";
						}
						// login success
						else {
							console.log("Login credentials are correct.");
							loginMessageHTML.innerHTML = "<br><font color=green>You are now logged in!</font>";
							updateTrophy(2); // login10
							// redirect to Home
							window.location.href = "/";
						}
					});
				}
		});
	}
	// empty input fields errors
	else {
		var loginErrorMessage = "";
		if( user == "" ) {
			loginErrorMessage = "<br>You must enter a username!";
		}
		if( pass == "" ) {
			loginErrorMessage += "<br>You must enter a password!";
		}
		loginMessageHTML.innerHTML = "<font color=red>" + loginErrorMessage + "</font>";
	}	
}


// displays the Help documentation
function displayHelp(e){
	var modal = document.getElementById("myhelp");
	var helpbtn = document.getElementById("help-btn");
	var span = document.getElementsByClassName("close")[0];
	//console.log(modal.style.display);
	if (modal.style.display !== "block"){
		modal.style.display = "block";
	}
	else if (modal.style.display === "block"){
		modal.style.display = "none";
	}
}

// makes whole divs linkable
function redirectHome(e) {
	window.location.href = "/"; 
}
function redirectChallenge(e) {
	window.location.href = "/challenge"; 
}
function redirectOrganizations(e) {
	window.location.href = "/organizations"; 
}
function redirectNews(e) {
	window.location.href = "/news"; 
}
function redirectTrophies(e) {
	window.location.href = "/trophies"; 
}
function redirectCalendar(e) {
	window.location.href = "/calendar";
}

// set today's date
function setDayData() {
	var d = new Date();
	d.setUTCHours(d.getUTCHours() - 8);
  console.log(d.toLocaleString());

	// get the current Month and Date
	m = d.getMonth();
	month = months[m];
	mon = mons[d.getMonth()];
	var n = d.getDate();
	date = n;
	data = month + " " + date;
	var dayOfWeek = d.getDay();
	var newDate = date;
	console.log(data + ", dayOfWeek=" + dayOfWeek);
	
	/*if( dayOfWeek == 0 ) {
		newDate = date - 2;
	}
	else if( dayOfWeek < 5) {
		newDate = date + (5-dayOfWeek);
	}
	else if( dayOfWeek > 5) {
		newDate = date - (dayOfWeek - 5);
	}
	data = month + " " + newDate;*/
	console.log("Getting theme from date " + data);
}


// greys out the Challenge Completed button
function greyButton(e){
	e.preventDefault();
	document.getElementById("completed-btn").disabled = true;
}

// display the number of participants for Challenge page
function displayParticipants() {
	// get category of the theme
	category = $("#partUpdateMessage").text();
	$("#partUpdateMessage").hide();

	var participantsHTML = document.getElementById("displayCount");
	var partNum = 0;
	var participantsRef = firebaseRef.ref('challenges/' + data + '/count');
	participantsRef.on('value', function(snapshot) {
		partNum = snapshot.val();
		if( partNum == null ) {
			participantsHTML.innerHTML = "0";
		}
		else {
			participantsHTML.innerHTML = partNum.toLocaleString();
		}
	});
}

// updates the participants count number for the server and for display
function updateCount(e) {
	var newCount = 0;
	console.log("clickedIn="+clickedIn);
	if( clickedIn == false ) {
		var countRef = firebaseRef.ref('challenges/' + data + '/count');
		countRef.transaction(function(count) {
			newCount = (count || 0) + 1;
			return newCount;
		});

		console.log("Updating count for " + data + " to " + newCount);
		var extraTrophy = categoryCheck(category);
		var partMessageHTML = document.getElementById("partUpdateMessage");
		partMessageHTML.innerHTML = "You have completed today's challenge!"
			+ extraTrophy 
			+ "<br>Check tomorrow to see another challenge.";
		$("#partUpdateMessage").show();
		updateTrophy(0); // challenges10
		//challengeToTrophy(0);
	}
	clickedIn = true;
}

// check theme category and update corresponding trophy
function categoryCheck(cat) {
	var retString = "";
	var extraString = "<br>You have completed a";
	if( cat == "Animal" ) {
		updateTrophy(3);
		//challengeToTrophy(3);
		retString = extraString + "n " + category + " challenge!";
	}
	else if( cat == "Environment") {
		updateTrophy(4);
		//challengeToTrophy(4);
		retString = extraString + "n " + category + " challenge!";
	}
	else if( cat == "Health") {
		updateTrophy(5);
		//challengeToTrophy(4);
		retString = extraString + " " + category + " challenge!";
	}
	else if( cat == "Kindness" ) {
		updateTrophy(6);
		//challengeToTrophy(6);
		retString = extraString + " " + category + " challenge!";
	}
	else if( cat == "LGBT") {
		updateTrophy(7);
		//challengeToTrophy(7);
		retString = extraString + " " + category + " challenge!";
	}
	return retString;
}

// click listener for when Donate button is clicked
function donateClick(e) {
	updateTrophy(1); // donate10
}


// load Trophies progress data
function getProgress(result) {
	var trophiesRef = firebaseRef.ref('trophies');
	trophiesRef.on('value', function(snapshot) {
		console.log("numTrophies=" + snapshot.numChildren());

		// clear to prevent extra appending
		$(".media").html("");

		// iterate by the number of children in the trophies list
		for( var i = 0; i < snapshot.numChildren(); i++ ) {
			// defaults
			var title = "Trophy";
			var description = "Description";
			var progress = 0;
			var imageURL = "/images/trophy.png";

			var titleRef = firebaseRef.ref('trophies/' + i + '/title');
			titleRef.once('value', function(titleSnapshot) {
				title = titleSnapshot.val();
			});
			var descriptionRef = firebaseRef.ref('trophies/' + i + '/description');
			descriptionRef.once('value', function(descripSnapshot) {
				description = descripSnapshot.val();
			});
			var imageRef = firebaseRef.ref('trophies/' + i + '/image');
			imageRef.once('value', function(imageSnapshot) {
				imageURL = imageSnapshot.val();
			});
			var progressRef = firebaseRef.ref('trophies/' + i + '/progress');
			progressRef.once('value', function(progSnapshot) {
				progress = progSnapshot.val();
			});

			// scale progress to percentage and out of 10
			var prog10 = progress*10;
			if( prog10 > 100 ) {
				prog10 = 100;
				progress = 10;
			}
			
			// append for each trophy entry
			$(".media").append('<a class="pull-left"><img class="media-object" src="/images/' + imageURL + '" alt="...""></a>'
				+ '<p class="media-heading medium-font"><b>' + title + '</b></p>' // trophy title
				+ '<p>' + description + '</p>' // trophy description
				+ '<div class="progress progress-striped">'
				+ '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width:' + prog10 + '%">'
				+ progress + '/10</div></div><hr>'
			);
		}
	});
}

// updates the progress bar of a trophy
function updateTrophy(trophy) {
	var trophy_title = "Trophy";
	var trophy_description = "Description";
	var newProgress = 0;

	// get old info
	var progressRef = firebaseRef.ref('trophies/' + trophy + '/progress');
	progressRef.transaction(function(progress) {
		newProgress = (progress || 0) + 1;
		return newProgress;
	});

	console.log("Updating progress of trophy" + trophy + " to " + newProgress);
}

// log a specific challenge to a specific trophy
function challengeToTrophy(trophy) {
	var trophy_title = "Trophy";
	var trophy_description = "Description";
	var numCom = 0;
	
	// key will be "monNum-Date"
	var monNum = m + 1;
	passDate = date;
	if( passDate < 10 ) {
		passDate = "0" + date;
	}
	var tDate = monNum + "-" + passDate;

	var chalT = $("#challenge").text();
	var themT = $("#themeText").text();

	// send challenge to the respective trophy
	firebaseRef.ref('trophies/' + trophy + '/' + tDate).set({
		cat: category,
		chal: chalT,
		theme: themT
	});
	
	firebaseRef.ref('completed/' + tDate).set({
		cat: category,
		chal: chalT,
		theme: themT
	});
	console.log("Adding chal " + tDate + " to trophy" + trophy);
}

// retrieve completed challenges from database
function getChallengeHistory() {
	// clear to prevent extra appending
	$(".histLog").html("");

	// loading local JSON data
    var jsonData;
    $.ajax({
            url: "/days.json",
            type: "GET",
            // Request body
            data: "{body}",
            async: false,
            dataType: 'json'
        })
        .done(function(data) {
            // set JSON data to be used
            jsonData = data;
            //console.log(data);
        })
        .fail(function() {
            console.log("News error");
    });

    for( var i = 1; i < jsonData.length; i++ ) {
    	var chal = "Challenge";
		var cTheme = "A Day";
		var cat = "Other";
		var cDate = "01-01";
		var cM = "1";
		var cD = "1";
		var fontColor = "black";

		cDate = jsonData[i].date;
		var cM = cDate.substring(5,7);
		if( cM.substring(0,1) == "0") {
			cM = cM.substring(1,2);
		}
		var cD = cDate.substring(8,10);
		if( cD.substring(0,1) == "0") {
			cD = cD.substring(1,2);
		}
		cDate = cM + "/" + cD;
		chal = jsonData[i].challenge;
		cTheme = jsonData[i].theme;
		cat = jsonData[i].category;
		fontColor = jsonData[i].darkerColor;

		var d = new Date();
		var n = d.getDate();

		// show only themes/challenges up to the current date
		if( jsonData[i].month <= month) {
        	var histString = '<p><span class="medium-font"><b>' + cDate + ':</b> <i>' + cTheme
			+ '</i></span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-flag" aria-hidden="true"></i> "'
			+ chal + '"</p>';
			/*var histString = '<p><span class="medium-font"><b>' + cDate + ':</b> <i>' + cTheme
			+ '</i></span><ul><li>"'
			+ chal + '"</li></ul></p>';*/
			$(".histLog").prepend(histString);
    	}
		else if( jsonData[i].month == month && cD <= n) {
        	var histString = '<p><span class="medium-font"><b>' + cDate + ':</b> <i>' + cTheme
			+ '</i></span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-flag" aria-hidden="true"></i> "'
			+ chal + '"</p>';
			/*var histString = '<p><span class="medium-font"><b>' + cDate + ':</b> <i>' + cTheme
			+ '</i></span><ul><li>"'
			+ chal + '"</li></ul></p>';*/
			$(".histLog").prepend(histString);
    	}    	
    }
    //console.log(jsonData[0].theme);
	//var comChal = 0;
	/*var comRef = firebaseRef.ref('completed');
	comRef.on('value', function(snapshot) {
		// clear to prevent extra appending
		$(".histLog").html("");

		console.log("numCom=" + snapshot.numChildren());

		// get chalDate and challenge from each children
		snapshot.forEach(function(childSnap) {
			var chal = "Challenge";
			var cTheme = "A Day";
			var cat = "Other";

			var chalRef = firebaseRef.ref('completed/'+ childSnap.key + '/chal');
			chalRef.once('value', function(chalSnapshot) {
				chal = chalSnapshot.val();
			});
			var themeRef = firebaseRef.ref('completed/' + childSnap.key + '/theme');
			themeRef.once('value', function(themeSnapshot) {
				cTheme = themeSnapshot.val();
			});
			var catRef = firebaseRef.ref('completed/' + childSnap.key + '/cat');
			catRef.once('value', function(catSnapshot) {
				cat = catSnapshot.val();
			});
			var histString = '<p><span class="medium-font"><b>' + childSnap.key + ':</b> <i>' + cTheme
				+ '</i></span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-flag" aria-hidden="true"></i> "'
				+ chal + '"</p>';
			$(".histLog").prepend(histString);
		});
	});*/
	//console.log(comChal);
}


// loading news
function getNews() {
	// query properties
	var apiKey = "a07871d6e0834d1686b1971a820607dc";
	var query = "awareness day";
	var seeString = $("#newsSearchResults").text();
	query = seeString;
	var limit = 5;

	// clear to prevent extra appending
	//$("#loadingNews").html("<span id='newsSearchResults'></span>");
	$(".getNews").html("");

	$(function() {
        var params = {
            // Request parameters
            "q": query,
            "count": limit,
            "offset": "0",
            "mkt": "en-us",
            "safeSearch": "Moderate",
        };
      
        $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",apiKey);
            },
            type: "GET",
            // Request body
            data: "{body}",
            async: false,
            dataType: 'json'
        })
        .done(function(data) {
            // set news JSON data to be used
            newsJson = data.value;
            console.log("News success");
        })
        .fail(function() {
            console.log("News error");
        });

        // display search results message
       	$("#loadingNews").html('Showing ' + newsJson.length + ' news results for<br>');
        //$("#newsSearchResults").html('Showing ' + newsJson.length + ' news results for<br><b>"' + query +'"</b>');

        // iterate over each News object
        for( var i = 0; i < newsJson.length; i++) {
        	var newsTitle = newsJson[i].name;
        	var newsURL = newsJson[i].url;
        	var newsSource = newsJson[i].provider;
        	newsSource = newsSource[0].name;
        	var newsDescrip = newsJson[i].description;
        	var newsImage = "";

        	// check if there is a news image
        	if( newsJson[i].image != null ) {
        		//console.log("There is a news image");
        		newsImage = newsJson[i].image.thumbnail.contentUrl;
        	}
        	/*else {
        		console.log("No news image");
        	}*/

        	// converting newsTime
        	var newsTime = newsJson[i].datePublished;
        	var d = new Date(newsTime);
			newsTime = d.toLocaleString();
			newsJson[i].datePublished = newsTime;

			// append each news item
        	$(".getNews").append("<div><hr><div class='image-float'>" + "<img src='" + newsImage + "''></div>"
        		+ "<a href='" + newsURL + "' class='medium-font'><b>" + newsTitle + "</b></a><br>" // news title
        		+ "<p class='small-font'><i>" + newsSource + "</i> - " + newsTime + "<br></p>" // date published
        		+ newsDescrip + "</div></div>"
        	);
        }
    });
}