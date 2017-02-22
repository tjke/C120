'use strict';

var firebaseRef = firebase.database();

// gathering HTML elements
//var dateHTML = document.getElementById("date");
//var themeHTML = document.getElementById("theme");

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
//var day = days[0]; // default data
//var orgs = days[0].orgs; // default orgs data

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	//setDayData();
	/*database.on('value', function(datasnapshot) {
		console.log(datasnapshot);
	});*/
	//writeUserData("testUser","testPass","test@mail.com");
}

function signup() {
	var loginMessageHTML = document.getElementById("loginMessage");
	var user = document.getElementById("signupUser").value;
	var pass = document.getElementById("signupPassword").value;
	var mail = document.getElementById("signupEmail").value;
	
	if(user != "" && pass != "" && mail != "") {
		console.log(user + ": " + pass + "(" + mail + ")");
		writeUserData(user,pass,mail);
		alert("An account has been created for " + mail);
	}
	// empty input fields errors
	else {
		var signupErrorMessage = "";
		if( user == "" ) {
			signupErrorMessage = "\nYou must provide a username!";
		}
		if( pass == "" ) {
			signupErrorMessage += "\nYou must provide a password!";
		}
		if( mail == "" ) {
			signupErrorMessage += "\nYou must provide an email!";
		}
		alert(signupErrorMessage);
	}	
}

function writeUserData(user, pass, mail) {
	console.log("writeUserData();");
	firebase.database().ref('accounts/' + user).set({
		email: mail,
		name: user,
		password: pass
	});
}

function login() {
	var loginMessageHTML = document.getElementById("loginMessage");
	var user = document.getElementById("loginUser").value;
	var pass = document.getElementById("loginPassword").value;
	
	if(user != "" && pass != "") {
		var accountRef = firebase.database().ref('accounts/' + user);
			accountRef.on('value', function(snapshot) {
				var out = snapshot.val();
				//console.log(out);
				if( out == null) {
					loginMessageHTML.innerHTML = "<br>This username is not registered!";
				}
				else {
					var passRef = firebase.database().ref('accounts/' + user + '/password');
					passRef.on('value', function(snapshot) {
						var checkPass = snapshot.val();
						// passwords don't match in database
						if( pass != checkPass ) {
							loginMessageHTML.innerHTML = "<br>Incorrect password!";
						}
						else {
							console.log("Credentials are correct.");
							loginMessageHTML.innerHTML = "<br>You are now logged in!";
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
		loginMessageHTML.innerHTML = loginErrorMessage;
	}	
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
	dateHTML.innerText = m + " " + n;
}*/
