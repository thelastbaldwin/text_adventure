requirejs.config({
    //Address any non-amd modules
    shim: {
        underscore: {
          exports: '_'
        },
        backbone: {
          deps: ["underscore", "jquery"],
          exports: "Backbone"
        },
        jquerytypewriter: {
            deps: ["jquery"]
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
            $.ajax({
                url : '../story.json',
                success: function(data){
                     //create a page model for each page in the story
                    for(var i = 0; i < data.story.pages.length; i++){
                        this.push(new Page(data.story.pages[i]));
                    }
                    //title and story are same for all pages
                    this.title = data.story.title;
                    this.subheading = data.story.subheading;
                    storyApp = new StoryView({model : this.get(1)});
                }.bind(this)
            });
        }
    });

    
    //view
    var StoryView = Backbone.View.extend({
        el: '#story-container',

        initialize: function(){
            var heading = "<h1>" + story.title + "</h1><h2>" + story.subheading + "</h2>";
            this.$el.find("header").html(heading);

            $('#story-container h1').typewrite({delay: 20, callback: function(){
                $('#story-container h2').typewrite({delay: 20})
            }});

            this.model.bind('change', this.render, this);
            this.render(); //render is initiated off of this call            
        },

        render: function(){
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

    var storyApp; 
    var story = new Story();    
});