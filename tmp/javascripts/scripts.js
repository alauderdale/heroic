$(document).ready(function(){


	$( "a.toggle-nav" ).click(function() {
        $( "html" ).toggleClass( "screen-md" );
        $( "html" ).toggleClass( "menu-toggled" );
        //fixes the odd chart not resizing on menu toggle bug
        $(".chart").each(function () {
            var highChart = Highcharts.charts[$(this).data('highchartsChart')];
            var highChartCont = $(highChart.container).parent();
            highChart.setSize(highChartCont.width(), highChartCont.height());
            highChart.hasUserSize = undefined;
        });

    });

});


$(document).ready(function(e) {
    breakpointDetect();
});

$(window).resize(function(e) {
    breakpointDetect();
});


function breakpointDetect(){

    if(!$( "html" ).hasClass( "menu-toggled" )){

        if($(window).width() < 990){
           $( "html" ).addClass( "screen-md" );
        } else {
           $( "html" ).removeClass( "screen-md" );
        }
    }

}





;
