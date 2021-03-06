/*
---

name: Jx.Field.Editor

description:

license: MIT-style license.

requires:
 - Jx.Field
 - Jx.Editor
 - more/Element.Shortcuts

provides: [Jx.Field.Editor]

css:
 - field.editor


...
 */
define("jx/field/editor", function(require, exports, module){
    
    var base = require("../../base"),
        Field = require("../field"),
        Editor = require("../editor");
        
    var editor = module.exports = new Class({

        Extends: Field,
        Family: 'Jx.Field.Editor',
    
        options: {
            template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputEditor"></span><span class="jxInputTag"></span></span>',
            editorOptions: {
                buttons: [
                    ['bold','italic','underline','strikethrough','separator','alignment',
                          'separator','orderedlist','unorderedlist','indent','outdent'],
                    ['undo','redo','separator','customStyles','block',
                          'separator', 'link','unlink', 'image','separator', 'toggle']
                ]
            }
    
        },
    
        type: 'Editor',
    
        render: function () {
            this.parent();
    
            this.options.editorOptions.content = this.options.value;
            this.options.editorOptions.textareaName = this.options.name;
            
            if (this.options.parent !== null &&
                this.options.parent !== undefined &&
                typeOf(this.options.parent) != 'function') {
                this.createEditor();
            }
    
        },
    
        addTo: function (reference, where) {
    
            this.parent(reference, where);
            //this.createEditor();
            
        },
        
        createEditor: function(){
            if (document.id(this.field).isVisible()) {
                //if the delay is still set...
                if (this.delay) { clearTimeout(this.delay);}
                if (this.editor === undefined ||
                    this.editor === null || !instanceOf(this.editor, Editor)) {
                    this.options.editorOptions.parent = document.id(this.field);
                    this.editor = new Editor(this.options.editorOptions);
                    this.editor.resize();
                    this.field = this.editor.textarea;
                    //grab change and blur events and pass them on for the editor
                    this.editor.addEvents({
                        'editorChange': function(){
                            this.fireEvent('change', this);
                        }.bind(this),
                        'editorBlur': function(){
                            this.fireEvent('blur',this);
                        }.bind(this)
                    });
                }
            } else {
                //we would need to wait until the field is visible before we can render the editor
                //simply delay this function for a seconds and then try again
                this.delay = this.createEditor.delay(1000, this);
            }
        },
    
        getValue: function () {
            return this.editor.saveContent().getContent();
        },
    
        setValue: function (value) {
            this.editor.setContent(value).saveContent();
        }
    
        
    });
    
    if (base.global) {
        base.global.Field.Editor = module.exports;
    }
    
});