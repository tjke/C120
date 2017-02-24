'use strict';

// might use for firebase stuff
var firebaseRef = firebase.database();

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

	// linking whole div buttons
	$(".navbar-btn-home").click(redirectHome);
	$(".navbar-btn-challenge").click(redirectChallenge);
	$(".navbar-btn-organizations").click(redirectOrganizations);
	$(".navbar-btn-news").click(redirectNews);
	$(".navbar-btn-trophies").click(redirectTrophies);

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
		var accountRef = firebase.database().ref('accounts/' + user);
		accountRef.on('value', function(snapshot) {
			var out = snapshot.val();
			//console.log(out);
			// check if username has been taken
			if( out != null) {
				signupMessageHTML.innerHTML = "<font color=red>The username</font> " + user + " <font color=red>has been taken!</font>";
			}
			else {
				// check if valid email
				if( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) ) {
					// account created successfully	
					writeUserData(user,pass,mail);
					signupMessageHTML.innerHTML = "<font color=green>An account has been registered for</font> " + user + " <font color=green>at</font> " + mail + "<br>";
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
	firebase.database().ref('accounts/' + user).set({
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
		var accountRef = firebase.database().ref('accounts/' + user);
			accountRef.on('value', function(snapshot) {
				var out = snapshot.val();
				//console.log(out);
				// check if username is in the database
				if( out == null) {
					loginMessageHTML.innerHTML = "<br><font color=red>The username</font> " + user + " <font color=red>is not registered!</font>";
				}
				else {
					var passRef = firebase.database().ref('accounts/' + user + '/password');
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

// set today's date
function setDayData() {
	var d = new Date();

	// get the current Month and Date
	var m = months[d.getMonth()];
	month = m;
	mon = mons[d.getMonth()];
	var n = d.getDate();
	date = n;
	data = month + " " + date;
	var dayOfWeek = d.getDay();
	var newDate = date;
	console.log(data + ", dayOfWeek=" + dayOfWeek);
	
	if( dayOfWeek == 0 ) {
		newDate = date - 2;
	}
	else if( dayOfWeek < 5) {
		newDate = date + (5-dayOfWeek);
	}
	else if( dayOfWeek > 5) {
		newDate = date - (dayOfWeek - 5);
	}
	data = month + " " + newDate;
	console.log("Getting theme from date " + data);
}


// greys out the Challenge Completed button
function greyButton(e){
	e.preventDefault();
	//$(this).css("background-color", "grey");
	document.getElementById("completed-btn").disabled = true;
}

// display the number of participants for Challenge page
function displayParticipants() {
	var participantsHTML = document.getElementById("displayCount");
	var partNum = 0;
	var participantsRef = firebase.database().ref('challenges/' + data + '/count');
	participantsRef.on('value', function(snapshot) {
		partNum = snapshot.val();
		//console.log(partNum);
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
		var countRef = firebase.database().ref('challenges/' + data + '/count');
		countRef.transaction(function(count) {
			newCount = (count || 0) + 1;
			return newCount;
		});
		// get old count
		/*var countRef = firebase.database().ref('challenges/' + data + '/count');
		countRef.on('value', function(snapshot) {
			newCount = snapshot.val();
		});
		// update with new count
		/*newCount = newCount + 1;
		firebase.database().ref('challenges/' + data).set({
			count: newCount
		});*/
		console.log("Updating count for " + data + " to " + newCount);
		var partMessageHTML = document.getElementById("partUpdateMessage");
		partMessageHTML.innerHTML = "You have completed today's challenge!<br>Check tomorrow to see another challenge.";
		updateTrophy(0); // challenges10
	}
	clickedIn = true;
}

// click listener for when Donate button is clicked
function donateClick(e) {
	updateTrophy(1); // donate10
}


// load Trophies progress data
function getProgress(result) {
	var trophiesRef = firebase.database().ref('trophies');
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

			var titleRef = firebase.database().ref('trophies/' + i + '/title');
			titleRef.once('value', function(titleSnapshot) {
				title = titleSnapshot.val();
			});
			var descriptionRef = firebase.database().ref('trophies/' + i + '/description');
			descriptionRef.once('value', function(descripSnapshot) {
				description = descripSnapshot.val();
			});
			var progressRef = firebase.database().ref('trophies/' + i + '/progress');
			progressRef.once('value', function(progSnapshot) {
				progress = progSnapshot.val();
			});
			/*var progressRef = firebase.database().ref('progress/' + i + '/prog');
			progressRef.on('value', function(progSnapshot) {
				progress = progSnapshot.val();
				//console.log("progressSnapshot=" + progress);
			});*/

			// scale progress to percentage and out of 10
			var prog10 = progress*10;
			if( prog10 > 100 ) {
				prog10 = 100;
				progress = 10;
			}
			
			// append for each trophy entry
			$(".media").append("<br><a class='pull-left'><img class='media-object' src='/images/trophy.png' alt='...''></a>"
				+ "<div class='media-body'>"
				+ "<p class='media-heading medium-font'><b>" + title + "</b></p>" // trophy title
				+ "<p>" + description + "</p>" // trophy description
				+ "<div class='progress progress-striped'>"
				+ "<div class='progress-bar progress-bar-info' role='progressbar' aria-valuenow='80' aria-valuemin='0' aria-valuemax='100' style='width:" + prog10 + "%'>"
				+ progress + "/10</div></div></div>"
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
	var progressRef = firebase.database().ref('trophies/' + trophy + '/progress');
	progressRef.transaction(function(progress) {
		newProgress = (progress || 0) + 1;
		return newProgress;
	});
	/*progressRef.on('value', function(snapshot) {
		newProgress = snapshot.val();
	});
	// update with new progress
	newProgress = newProgress + 1;
	firebase.database().ref('trophies/').child(trophy).update({
		progress: newProgress});*/
	console.log("Updating progress of trophy" + trophy + " to " + newProgress);
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

        // print out news JSON result to console
        var jOut = newsJson;
        //console.log(jOut);

        // display search results message
        $("#newsSearchResults").html("Showing " + newsJson.length + " results for <b>'"+ query +"'</b>:");

        // iterate over each News object
        for( var i = 0; i < newsJson.length; i++) {
        	var newsTitle = newsJson[i].name;
        	var newsURL = newsJson[i].url;
        	var newsSource = newsJson[i].provider;
        	newsSource = newsSource[0].name;
        	var newsDescrip = newsJson[i].description;
        	var newsImage = "";

        	console.log(newsSource);

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