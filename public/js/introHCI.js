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


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

//Function that is called when the document is ready.
function initializePage() {
	setDayData();

	// defining click listeners
	$("#signup-btn").click(signup);
	$("#login-btn").click(login);
	$("#help-btn").click(displayHelp);
	$(".close").click(displayHelp);
	$("#completedbtn").click(greyButton);
	$("#completedbtn").click(updateCount);
}


// does error checking when Sign Up button is clicked
function signup(e) {
	var signupMessageHTML = document.getElementById("signupMessage");
	var user = document.getElementById("signupUser").value;
	var pass = document.getElementById("signupPassword").value;
	var mail = document.getElementById("signupEmail").value;
	
	// account created successfully
	if(user != "" && pass != "" && mail != "") {
		console.log(user + ": " + pass + " (" + mail + ")");
		writeUserData(user,pass,mail);
		signupMessageHTML.innerHTML = "<font color=green>An account has been created for</font> <b>" + mail + "</b><br>";
	}
	// empty input fields errors
	else {
		var signupErrorMessage = "";
		if( user == "" ) {
			signupErrorMessage = "<br>You must provide a username!";
		}
		if( pass == "" ) {
			signupErrorMessage += "<br>You must provide a password!";
		}
		if( mail == "" ) {
			signupErrorMessage += "<br>You must provide an email!";
		}
		signupMessageHTML.innerHTML = "<font color=red>" + signupErrorMessage + "</font><br><br>";
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
						else {
							console.log("Login credentials are correct.");
							loginMessageHTML.innerHTML = "<br><font color=green>You are now logged in!</font>";
						}
					});
				}
		});
	}
	// empty input fields errors
	else {
		var loginErrorMessage = "";
		if( user == "" ) {
			loginErrorMessage = "<br>You must provide a username!";
		}
		if( pass == "" ) {
			loginErrorMessage += "<br>You must provide a password!";
		}
		loginMessageHTML.innerHTML = "<font color=red>" + loginErrorMessage + "</font>";
	}	
}


// displays the Help documentation
function displayHelp(e){
	var modal = document.getElementById("myhelp");
	var helpbtn = document.getElementById("help-btn");
	var span = document.getElementsByClassName("close")[0];
	console.log(modal.style.display);
	if (modal.style.display !== "block"){
		modal.style.display = "block";
	}
	else if (modal.style.display === "block"){
		modal.style.display = "none";
	}
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
	console.log(data + " dayOfWeek=" + dayOfWeek);
	
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
	$(this).css("background-color", "grey");
}

// display the number of participants for Challenges page
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
			participantsHTML.innerHTML = partNum;
		}
	});
}

// updates the participants count number for the server and for display
function updateCount(e) {
	var newCount = 0;
	// get old count
	var countRef = firebase.database().ref('challenges/' + data + '/count');
	countRef.on('value', function(snapshot) {
		newCount = snapshot.val();
	});
	// update with new count
	newCount = newCount + 1;
	firebase.database().ref('challenges/' + data).set({
		count: newCount
	});
	console.log("Updating count for " + data + " to " + newCount);
	var partMessageHTML = document.getElementById("partUpdateMessage");
	partMessageHTML.innerHTML = "You have completed today's challenge!<br>Come again tomorrow to see another challenge.";
}