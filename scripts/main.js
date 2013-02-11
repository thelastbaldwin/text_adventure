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
        el : "li",

        events: {
            "click" : "followLink",
        },

        initialize: function(){
            // this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){
            this.el = "<li><a>" + this.model.get("text") + "</a></li>";
            return this.el;
        },

        followLink: function(){
            this.model.followLink();
        }
    });

    //collection
    var Options = Backbone.Collection.extend({
        model: Option
    });


    //--- Page ---//
    //model
    var Page = Backbone.Model.extend({
        getOptionArray: function(){
            //return option models from the basic page data
            var optionObjects = this.get("options");
            var optionModels = [];

            for(var i = 0; i < optionObjects.length; i ++){
                optionModels.push(new Option(optionObjects[i]));
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
            this.model.bind('change', this.buildOptionsList, this)
            this.model.bind('change', this.render, this);
            this.options = new Options();
            this.goToPage(1); //render is initiated off of this call            
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
            console.log(pageText);
            this.$el.find('#page p').html(pageText);
            
            //remove existing options, if any
            this.$el.find("#options ul").html("");

            // console.log("this.options", this.options);
            this.options.each(function(option){
                this.appendOption(option);
            }, this);


            //display effects
            $('#page p').typewrite({delay : 10, callback: function(){
               $('#options h3').typewrite({delay: 20, callback: function(){
                $('#options a').each(function(){
                    $(this).typewrite({delay: 20});
                    });
               }});           
             }});

            // this.$el
        },

        goToPage: function(num){
            // this.options.reset(); //empty options collection
            page = story.get(num);
            console.log("page = ", page);
            this.model.set(page); //trigger the change event
            this.buildOptionsList(this.model.get("options"));
        },

        buildOptionsList: function(options){
            //refresh the options collection
            this.options.each(function(option){
                option.destroy();
            }, this);

            this.options.reset();

            this.options.add(this.model.getOptionArray());
            return this.options;            
        },

        appendOption: function(option){
            var view = new OptionView({"model" : option});
            this.$el.find("#options ul").append(view.render());
        },

        printOptions : function(){
        $('#options a').each(function(){
            $(this).typewrite({delay: 20});
            });
        }
    });
    window.storyApp = new StoryView({model : story.get(1)});
    // var storyApp = new StoryView({model : story.get(1)});

});