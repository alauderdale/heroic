$(document).ready(function(){


	$( "a.toggle-nav" ).click(function() {
        $( "html" ).toggleClass( "screen-md" );
        $( "html" ).toggleClass( "menu-toggled" );
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



