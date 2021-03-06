/*
---

name: Jx.Adaptor.ListView

description:

license: MIT-style license.

requires:
 - Jx.Adaptor


provides: [Jx.Adaptor.ListView]

...
 */

define('jx/adaptor/listview',function(require, exports, module){
    
    var base = require("../../base");
    
    //This just needs to set the namespace in the global object
    if (base.global) {
        base.global.Adaptor.ListView = {};
    }
});
