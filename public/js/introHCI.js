'use strict';

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
var modal = document.getElementById("myhelpbtn");
var helpbtn = document.getElementById("help");
var span = document.getElementsByClassName("close")[0];

helpbtn.onclick = function(){
	modal.style.display = "block";
}
span.onclick = function(){
	modal.style.display = "none";
}
