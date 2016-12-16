//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

//     개인적으로 javascript공부할겸 underscorejs 소스를 보고 있습니다.

(function(){
    

    var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this;

    //'_'변수의 기존값을 저장함            
    var previousUnderscore = root._;

    //
    var ArrayProty = Array.prototype, ObjProto = Object.prototype;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    //
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.otString,
        hasOwnProterty = ObjProto.hasOwnProperty;


}());




