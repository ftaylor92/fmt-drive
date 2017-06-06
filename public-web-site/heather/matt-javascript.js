$(document).ready(function() {
    jQuery(function ($) {
        $('.panel-heading span.clickable').on("click", function (e) {
            if ($(this).hasClass('panel-collapsed')) {
                // expand the panel
                $(this).parents('.panel').find('.panel-body').slideDown();
                $(this).removeClass('panel-collapsed');
                $(this).find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
            }
            else {
                // collapse the panel
                $(this).parents('.panel').find('.panel-body').slideUp();
                $(this).addClass('panel-collapsed');
                $(this).find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
            }
        });

	$('#btn-chat').on("click", function (e) {
	   $('#heather-chat').append('<li class="right clearfix"><span class="chat-img pull-right"> <img src="http://placehold.it/50/FA6F57/fff&amp;text=ME" alt="User Avatar" class="img-circle"> </span> <div class="chat-body clearfix"> <div class="header">  <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>15 mins ago</small> <strong class="pull-right primary-font">Bhaumik Patel</strong>  </div> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare </p> </div> </li>');
	});
    });

    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
	    dayClick: function() {
		alert('a day has been clicked!');
	    }
	});

});

function addEvent() {
	var evt= {};
	evt.title= "new event";
	evt.start= "2017-06-14T13:15:30Z"
	evt.end= "2017-06-14T14:15:30Z";
	evt.eventColor="green";
	$('#calendar').fullCalendar('renderEvent', evt, true);
}
