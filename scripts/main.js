requirejs.config({
    //Address any non-amd modules
    shim: {
        underscore: {
          exports: '_'
        },
        backbone: {
          deps: ["underscore", "jquery"],
          exports: "Backbone"
        }
    },

    //By default load any module IDs from js/lib
    baseUrl: 'scripts',

    //paths config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        main: 'main',
        jquery: "jquery-1.9.0.min", //google ajax call requires a server, so self-host for now
        jquerytypewriter: 'jquery-typewriter/jquerytypewriter',
        adapt: 'adapt.min', //adaptive layout
        underscore: 'underscore',
        Backbone: 'backbone'
    }
});

//requiring adapt is failing, possibly because of the not really hosted reason
require(['jquery','jquerytypewriter','Backbone','underscore'], function($, _, Backbone){
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
    

});