'use strict';

var calendars = {}; // for CLNDR
var modal;

var day_of_week = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
var month_of_year = new Array('January','February','March','April','May','June','July','August','September','October','November','December');

//  DECLARE VARIABLES
var Calendar;
var year;
var month;
var today;
var weekday;

var DAYS_OF_WEEK = 7;    // "constant" for number of days in a week
var DAYS_OF_MONTH = 31;    // "constant" for number of days in a month
var cal;    // Used for printing

// VARIABLES FOR FORMATTING
var TR_start = '<TR>';
var TR_end = '</TR>';
var highlight_start = '<TD class="cal-cell" BGCOLOR=DEDEFF><B><CENTER>';
var highlight_end   = '</CENTER></B>';
var TD_start = '<TD class="cal-cell"><CENTER>';
var TD_end = '</CENTER></TD>';


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

//Function that is called when the document is ready.
function initializePage() {
	// initialize variables
	Calendar = new Date();
	year = Calendar.getFullYear();     // Returns year
	month = Calendar.getMonth();    // Returns month (0-11)
	today = Calendar.getDate();    // Returns day (1-31)
	weekday = Calendar.getDay();    // Returns day (1-31)

	Calendar.setDate(1);    // Start the calendar day at '1'
	Calendar.setMonth(month);    // Start the calendar month at now

	//clndrStuff();
	//createCalendar();

	modal = document.getElementById("eventPopup");
	modal.style.display = 'none';
	$(".close").click(hideEvent);
}


// displaying Event popup
function displayEvent(eMon,eDate,eText){
	var eventText = document.getElementById("eventContent");
	eventText.innerHTML = "<p class='big-font'>" + eMon + " " + eDate
		+ "</p><center><p class='medium-font'>" + eText + "</p></center>";

	modal.style.display = "block";
}
// hiding Event popup
function hideEvent(e) {
	modal.style.display = 'none';
}


// code from: http://www.htmlbestcodes.com/Calendar.htm
function createCalendar() {
	console.log("creating Calendar...");
	cal =  '<TABLE BORDER=0 CELLSPACING=0 CELLPADDING=0><TR><TD>';
	cal += '<TABLE BORDER=1 CELLSPACING=0 CELLPADDING=10 BORDERCOLOR=BBBBBB>' + TR_start;
	cal += '<TD COLSPAN="' + DAYS_OF_WEEK + '" BGCOLOR="#EFEFEF"><CENTER><B>';
	cal += month_of_year[month]  + '   ' + year + '</B>' + TD_end + TR_end;
	cal += TR_start;

	//   DO NOT EDIT BELOW THIS POINT  //

	// LOOPS FOR EACH DAY OF WEEK
	for(var index=0; index < DAYS_OF_WEEK; index++)
	{

	// BOLD TODAY'S DAY OF WEEK
	if(weekday == index)
	cal += TD_start + '<B>' + day_of_week[index] + '</B>' + TD_end;

	// PRINTS DAY
	else
	cal += TD_start + day_of_week[index] + TD_end;
	}

	cal += TD_end + TR_end;
	cal += TR_start;

	// FILL IN BLANK GAPS UNTIL TODAY'S DAY
	for(index=0; index < Calendar.getDay(); index++)
	cal += TD_start + '  ' + TD_end;

	// LOOPS FOR EACH DAY IN CALENDAR
	for(index=0; index < DAYS_OF_MONTH; index++)
	{
	if( Calendar.getDate() > index )
	{
	  // RETURNS THE NEXT DAY TO PRINT
	  var week_day =Calendar.getDay();

	  // START NEW ROW FOR FIRST DAY OF WEEK
	  if(week_day == 0)
	  cal += TR_start;

	  if(week_day != DAYS_OF_WEEK)
	  {

	  // SET VARIABLE INSIDE LOOP FOR INCREMENTING PURPOSES
	  var day  = Calendar.getDate();

	  // HIGHLIGHT TODAY'S DATE
	  if( today==Calendar.getDate() )
	  cal += highlight_start + day + highlight_end + TD_end;

	  // PRINTS DAY
	  else
	  cal += TD_start + day + TD_end;
	  }

	  // END ROW FOR LAST DAY OF WEEK
	  if(week_day == DAYS_OF_WEEK)
	  cal += TR_end;
	  }

	  // INCREMENTS UNTIL END OF THE MONTH
	  Calendar.setDate(Calendar.getDate()+1);

	}// end for loop

	cal += '</TD></TR></TABLE></TABLE>';

	//  PRINT CALENDAR
	//console.log(cal);
	//document.write(cal);
	//$("#calendar").html = cal;
	
	/*var calHTML = document.getElementById("calendar");
	calHTML.innerHTML = cal;*/
}


/*** CLNDR ***/
// Call this from the developer console and you can control both instances
function clndrStuff() {
    console.info(
        'Welcome to the CLNDR demo. Click around on the calendars and' +
        'the console will log different events that fire.');

    // Assuming you've got the appropriate language files,
    // clndr will respect whatever moment's language is set to.
    // moment.locale('ru');

    // Here's some magic to make sure the dates are happening this month.
    var thisMonth = moment().format('YYYY-MM');
    // Events to load into calendar
    var eventArray = [
    	{
    		title: "World Hijab Day",
    		date: '2017-02-01' 
    	},
    	{
    		title: "World Wetlands Day",
    		date: '2017-02-02' 
    	},
    	{
    		title: "National Wear Red Day",
    		date: '2017-02-03' 
    	},
    	{
    		title: "World Cancer Day",
    		date: '2017-02-04' 
    	},
    	{
    		title: "National Send a Card to a Friend Day",
    		date: '2017-02-07' 
    	},
    	{
    		title: "International Safer Internet Day",
    		date: '2017-02-08' 
    	},
    	{
    		title: "Stop Bullying Day",
    		date: '2017-02-09' 
    	},
    	{
    		title: "National Umbrella Day",
    		date: '2017-02-10' 
    	},
    	{
    		title: "National Shut-In Visitation Day",
    		date: '2017-02-11' 
    	},
    	{
    		title: "Red Hand Day",
    		date: '2017-02-12' 
    	},
    	{
    		title: "International Natural Day",
    		date: '2017-02-13' 
    	},
    	{
    		title: "V-Day",
    		date: '2017-02-14' 
    	},
    	{
    		title: "Random Acts of Kindness Day",
    		date: '2017-02-17'
    	}, 
    	{
    		title: "National Love Your Pet Day",
    		date: '2017-02-20'
    	}, 
    	{
    		title: "International Mother Language Day",
    		date: '2017-02-21'
    	},
    	{
    		title: "Walking the Dog Day",
    		date: '2017-02-22'
    	},  
    	{
    		title: "National Skip the Straw Day",
    		date: '2017-02-24'
    	},
    	{
    		title: "National Polar Bear Day",
    		date: '2017-02-27'
    	},
    	{
    		title: "Rare Disease Day",
    		date: '2017-02-28'
    	},
    	{
    		title: "Self-Injury Awareness Day",
    		date: '2017-03-01'
    	},
    	{
    		title: "World Wildlife Day",
    		date: '2017-03-03'
    	},
    	{
    		title: "International Women's Day",
    		date: '2017-03-08'
    	},
    	{
    		title: "National Plant a Flower Day",
    		date: '2017-03-12'
    	},
    	{
    		title: "National Good Samaritan Day",
    		date: '2017-03-13'
    	},
    	{
    		title: "Panda Day",
    		date: '2017-03-16'
    	},
    	{
    		title: "International Day Against Homophobia and Transphobia Day",
    		date: '2017-03-17'
    	},
    	{
    		title: "International Day of Forests",
    		date: '2017-03-21'
    	},
    	{
    		title: "World Water Day",
    		date: '2017-03-22'
    	},
    	{
    		title: "National Puppy Day",
    		date: '2017-03-23'
    	},
    	{
    		title: "World Tuberculosis Day",
    		date: '2017-03-24'
    	},
    	{
    		title: "Purple Day",
    		date: '2017-03-26'
    	},
    	{
    		title: "Manatee Appreciation Day",
    		date: '2017-03-29'
    	},
    	{
    		title: "National Doctors Day",
    		date: '2017-03-30'
    	}
    ];

    // The order of the click handlers is predictable. Direct click action
    // callbacks come first: click, nextMonth, previousMonth, nextYear,
    // previousYear, nextInterval, previousInterval, or today. Then
    // onMonthChange (if the month changed), inIntervalChange if the interval
    // has changed, and finally onYearChange (if the year changed).
    calendars.clndr1 = $('.cal1').clndr({
        events: eventArray,
        clickEvents: {
            click: function (target) {
            	if( target.events.length > 0 ) {
            		// event and date info to send
            		var dateFormat = new Date(target.date._d);
            		var eMonth = dateFormat.getMonth();
            		eMonth = month_of_year[eMonth];
            		var eDate = dateFormat.getDate();
            		var eTitle = target.events[0].title;
            		displayEvent(eMonth, eDate, eTitle);
            	}
            	else {
            		console.log('No event');
            	}
            }
        },
        multiDayEvents: {
            singleDay: 'date',
            endDate: 'endDate',
            startDate: 'startDate'
        },
        showAdjacentMonths: true,
        adjacentDaysChangeMonth: false
    });

    // Bind all clndrs to the left and right arrow keys
    $(document).keydown( function(e) {
        // Left arrow
        if (e.keyCode == 37) {
            calendars.clndr1.back();
        }

        // Right arrow
        if (e.keyCode == 39) {
            calendars.clndr1.forward();
            calendars.clndr2.forward();
        }
    });
}