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
        //jquery: "http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min",
        jquery: "jquery-1.9.0.min", //google ajax call requires a server, so self-host if needed
        jquerytypewriter: 'jquery-typewriter/jquerytypewriter',
        adapt: 'adapt.min', //adaptive layout
        underscore: 'underscore',
        Backbone: 'backbone'
    }
});


require(['jquery','underscore','Backbone','jquerytypewriter'], function($, _, Backbone){

    //--- Option ---//
    //model
    var Option = Backbone.Model.extend({
        followLink: function(){
            storyApp.goToPage(this.get("route"));
        }
    });

    //view
    var OptionView = Backbone.View.extend({
        tagName : "li",

        events: {
            "click a" : "followLink",
        },

        initialize: function(){
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){
            this.$el.html("<a>" + this.model.get("text") + "</a>");
            return this.el;
        },

        followLink: function(){
            console.log("click caught");
            this.model.followLink();
        }
    });

    //collection
    var Options = Backbone.Collection.extend({model: Option});
    var options = new Options();


    //--- Page ---//
    //model
    var Page = Backbone.Model.extend({
        getOptionArray: function(){
            //return option models from the basic page data
            var optionObjects = this.get("options");
            var optionModels = [];

            if (optionObjects){
                for(var i = 0; i < optionObjects.length; i ++){
                    optionModels.push(new Option(optionObjects[i]));
                }
            }
            return optionModels; 
        }
    });

    //collection
    var Story = Backbone.Collection.extend({
        model: Page,
        initialize: function(){
            //load the story json test file locally
            story = {};
            $.ajax({
                url : '../story.json',
                async: false, //the story data is necessary before moving on
                success: function(data){
                    story = data.story;
                }
            });

            //create a page model for each page in the story
            for(var i = 0; i < story.pages.length; i++){
                this.push(new Page(story.pages[i]));
            }
            //title and story are same for all pages
            this.title = story.title;
            this.subheading = story.subheading;
        },
        last_page: 0 //one day we'll have a back button of some kind.
    });

    window.story = new Story(); //globalize for debug
    // var story = new Story();    
    
    //view
    var StoryView = Backbone.View.extend({
        el: '#story-container',

        initialize: function(){
            this.firstPage = true;
            this.model.bind('change', this.render, this);
            this.render(); //render is initiated off of this call            
        },

        render: function(){
            if(this.firstPage == true){
                var heading = "<h1>" + story.title + "</h1><h2>" + story.subheading + "</h2>";
                this.$el.find("header").html(heading);

                $('#story-container h1').typewrite({delay: 20, callback: function(){
                    $('#story-container h2').typewrite({delay: 20})
                }});

                this.firstPage = false; //only run this sequence once
            }

            //get the models data and set the elements on the page
            var pageText = this.model.get("text");
            this.$el.find('#page p').html("").html(pageText);
            
            //remove existing options, if any
            this.$el.find("#options ul").html("");

            //rebuild the options list
            this.buildOptionsList();
            //add each option to the options ul
            options.each(function(option){
                this.appendOption(option);
            }, this);


            //display effects
            $('#page p').typewrite({delay : 10, callback: function(){
                $('#options a').each(function(){
                    $(this).typewrite({delay: 20});
                });
            }});           

        },

        goToPage: function(num){
            page = story.get({"id" : num});
            this.model.set(page.toJSON()); //trigger the change event by replacing the page
        },

        buildOptionsList: function(){
            //refresh the options collection
            options.reset();
            newOptions = this.model.getOptionArray();

            if(newOptions.length){
                options.add(newOptions);
            }
            return options;            
        },

        appendOption: function(option){
            var view = new OptionView({"model" : option});
            this.$el.find("ul").append(view.render());
        },

        printOptions : function(){
        $('#options a').each(function(){
            $(this).typewrite({delay: 20});
            });
        }
    });
    window.storyApp = new StoryView({model : story.get({"id" : 1})});
    // var storyApp = new StoryView({model : story.get(1)});

});