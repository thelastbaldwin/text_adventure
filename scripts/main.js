requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts',

    //paths config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        main: 'main',
        jquery: "jquery-1.9.0.min", //google ajax call requires a server, so self-host for now
        jquerytypewriter: 'jquery-typewriter/jquerytypewriter',
        adapt: 'adapt.min.js' //adaptive layout      
    }
});

//requiring adapt is failing, possibly because of the not really hosted reason
require(['jquery', 'jquerytypewriter'], function($, jquerytypewriter){
	$('#story-container h1').typewrite({delay: 20, callback: function(){
		$('#story-container h2').typewrite({delay: 20, callback: function(){
			$('#page p').typewrite({delay : 10, callback: function(){
				$('#options h3').typewrite({delay: 20, callback: printOptions});
			}});
		}});
	}});
	
	var printOptions = function(){
		$('#options a').each(function(){
			$(this).typewrite({delay: 20});
		});
	};
	
	//Maybe the structure of the page model could look something like this
	var Page1 = {
	    text: "Boox walks into a room and sees a giant bee with a saddle on its back",

	    decision : {
	        prompt: "What should boox do?",
	        options:
	            [{
	                text: "a) Hop on, buddy",
	                trigger: "a",
	                effect: 2
	            },
	            {
	                text: "b) Tis an abomination, shoot it",
	                trigger: "b",
	                effect: 1
	            }]
		}
	};
});