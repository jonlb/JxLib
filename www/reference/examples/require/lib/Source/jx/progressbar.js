/*
---

name: Jx.Progressbar

description: A css-based progress bar.

license: MIT-style license.

requires:
 - Jx.Widget
 - Core/Fx.Tween

provides: [Jx.Progressbar]

css:
 - progressbar

images:
 - progressbar.png

...
 */
/**
 * Class: Jx.Progressbar
 *
 * 
 * Example:
 * The following just uses the defaults.
 * (code)
 * var progressBar = new Jx.Progressbar();
 * progressBar.addEvent('update',function(){alert('updated!');});
 * progressBar.addEvent('complete',function(){
 *      alert('completed!');
 *      this.destroy();
 * });
 * 
 * progressbar.addTo('container');
 * 
 * var total = 90;
 * for (i=0; i < total; i++) {
 *      progressbar.update(total, i);
 * }
 * (end)
 * 
 * Events:
 * onUpdate - Fired when the bar is updated
 * onComplete - fires when the progress bar completes it's fill
 * 
 * Locale keys:
 * - progressbar.messageText
 * - progressbar.progressText
 *
 * Copyright (c) 2010 by Jonathan Bomgardner
 * Licensed under an mit-style license
 */
define("jx/progressbar", function(require, exports, module){
    
    var base = require("../base"),
        Widget = require("./widget");
        
    var progressbar = module.exports = new Class({
        Extends: Widget,
        Family: 'Jx.Progressbar',
        
        options: {
            onUpdate: function(){},
            onComplete: function(){},
            /**
             * Option: parent
             * The element to put this progressbar into
             */
            parent: null,
            /**
             * Option: progressText
             * Text to show while processing, uses 
             * {progress} von {total}
             */
            progressText : null,
            /**
             * Option: template
             * The template used to create the progressbar
             */
            template: '<div class="jxProgressBar-container"><div class="jxProgressBar-message"></div><div class="jxProgressBar"><div class="jxProgressBar-outline"></div><div class="jxProgressBar-fill"></div><div class="jxProgressBar-text"></div></div></div>'
        },
        /**
         * Property: classes
         * The classes used in the template
         */
        classes: {
            domObj: 'jxProgressBar-container',
            message: 'jxProgressBar-message', 
            container: 'jxProgressBar',
            outline: 'jxProgressBar-outline',
            fill: 'jxProgressBar-fill',
            text: 'jxProgressBar-text'
        },
        /**
         * Property: bar
         * the bar that is filled
         */
        bar: null,
        /**
         * Property: text
         * the element that contains the text that's shown on the bar (if any).
         */
        text: null,
        
        /**
         * APIMethod: render
         * Creates a new progressbar.
         */
        render: function () {
            this.parent();
            
            this.domObj.addClass('jxProgressStarting');
    
            //we need to know the width of the bar
            this.width = document.id(this.domObj).getContentBoxSize().width;
            
            //Message
            if (this.message) {
                if (Locale.get('Jx','progressbar').messageText !== undefined &&
                    Locale.get('Jx','progressbar').messageText !== null) {
                    this.message.set('html', this.getText({set:'Jx',key:'progressbar',value:'messageText'}));
                } else {
                    this.message.destroy();
                }
            }
    
            //Fill
            if (this.fill) {
                this.fill.setStyles({
                    'width': 0
                });
            }
            
            var obj = {};
            var progressText = this.options.progressText === null ? 
                                  this.getText({set:'Jx',key:'progressbar',value:'progressText'}) :
                                  this.getText(this.options.progressText);
            if (progressText.contains('{progress}')) {
                obj.progress = 0;
            }
            if (progressText.contains('{total}')) {
                obj.total = 0;
            }
            
            //Progress text
            if (this.text) {
                this.text.set('html', progressText.substitute(obj));
            }
            
            //set the tween instance
            this.fill.set('tween', {onComplete: this.tweenDone.bind(this)});
        },
        /**
         * APIMethod: update
         * called to update the progress bar with new percentage.
         * 
         * Parameters: 
         * total - the total # to progress up to
         * progress - the current position in the progress (must be less than or
         *              equal to the total)
         */
        update: function (total, progress) {
            //check for starting class
            if (this.domObj.hasClass('jxProgressStarting')) {
                this.domObj.removeClass('jxProgressStarting').addClass('jxProgressWorking');
            }
            
            this.total = total;
            this.progress = progress;
    
            var newWidth = (progress * this.width) / total;
            
            this.fill.tween('width', newWidth);
            
        },
        
        tweenDone: function(){
            var obj = {};
            var progressText = this.options.progressText === null ?
                                  this.getText({set:'Jx',key:'progressbar',value:'progressText'}) :
                                  this.getText(this.options.progressText);
            if (progressText.contains('{progress}')) {
                obj.progress = this.progress;
            }
            if (progressText.contains('{total}')) {
                obj.total = this.total;
            }
            var t = progressText.substitute(obj);
            this.text.set('text', t);            
            
            if (this.total <= this.progress) {
                this.complete = true;
                this.domObj.removeClass('jxProgressWorking').addClass('jxProgressFinished');
                this.fireEvent('complete');
            } else {
                this.fireEvent('update');
            }
        },
        
        /**
         * APIMethod: changeText
         * This method should be overridden by subclasses. It should be used
         * to change any language specific default text that is used by the widget.
         * 
         * Parameters:
         * lang - the language being changed to or that had it's data set of 
         * 		translations changed.
         */
        changeText: function (lang) {
            this.parent();
            if (this.message) {
                this.message.set('html',this.getText({set:'Jx',key:'progressbar',value:'messageText'}));
            }
            //progress text will update on next update.
        }
        
    });
    
    if (base.global) {
        base.global.Progressbar = module.exports;
    }
});