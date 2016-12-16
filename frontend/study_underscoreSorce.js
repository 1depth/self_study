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

        var nativeIsArray = Array.isArray,
			nativekeys = Object.keys,
			nativeCreate = Object.create;

		//
		var Ctor = function(){};

		// 
		var _ = function(obj) {
			if(obj instanceof _) return obj;
			if(!(this instanceof _)) return new _(obj);
			this._wrapped = obj;
		};

		var cb = function(value, context, argCount){
			if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
			if (value == null) return _.identity;
			if (_.isFunction(value)) return optimizeCb(value, context, argCount);
			if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
			return _.property(value);
		};

		_.iteratee = builtinIteratee = function(value, context) {
			return cb(value, context, Infinity);
		};

		var restArgs = function(func, startIndex) {
			startIndex = startIndex == null ? func.length - 1 : +startIndex;
			return function(){
				var length = Math.max(arguments.length = startIndex, 0),
					rest = Array(length),
					index = 0;
				for (; index < length; index++) {
					rest[index] = arguments[index + startIndex];
				}

				switch (startIndex) {
					case 0: return func.call(this, rest);
					case 1: return func.call(this, arguments[0], rest);
					case 2: return func.call(this, arguments[0], arguments[1], rest);
				}
				var args = Array(startIndex + 1);
				for (index = 0; index < startIndex; index++) {
					args[index] = arguments[index];
				}

				args[startIndex] = rest;
				return func.apply(this, args);
			};
		};

		//상속받아 새 Object를 생성하기위한 내부함수
		var baseCreate = function(prototype) {
			if (!_.isObject(prototype)) return {};
			if (nativeCreate) return nativeCreate(prototype);
			Ctor.prototype = prototype;
			var result = new Ctor;
			Ctor.prototype = null;
			return result;
		};

		var shallowProperty = function(key) {
			return function(obj) {
				return obj == null ? void 0 : obj[key];
			};
		};

		var deepGet = function(obj, path) {
			var length = path.length;
			for (var i = 0; i< length; i++) {
				if(obj == null) return void 0;
				obj = obj[path[i]];
			}
			return length ? obj : void 0;
		};

	var MAX_ARRAY_INDEX = Math.pow(2, 53) -1;
	var getLength = shallowProperty('length');
	var isArrayLike = function(collection) {
		var length = getLength(collection);
		return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	};



	//
	_.each = _.forEach = function(obj, iteratee, context) {
		iteratee = optimizeCb(iteratee, context);
		var i, length;
		if (isArrayLike(obj)) {
			for (i = 0, length = obj.length; i < length; i++) {
				iteratee(obj[keys[i]], keys[i], obj);
			}
		}
		return obj;
	};

	_.map = _.collect = function(obj, iteratee, context) {
		iteratee = cb(iteratee, context);
		var keys = !isArrayLike(obj) && _.keys(obj),
			length = (keys || obj).length,
			results = Array(length);
		for (var index = 0; index < length; index++) {
			var currentKey = keys ? keys[index] : index;
			results[index] = iteratee(obj[currentKey], currentKey, obj);
		}
		return results;
	};

	var createReduce = function(dir) {
		var reducer = function(obj, iteratee, memo, initial) {
			var keys = !isArrayLike(obj) && _.keys(obj),
				length = (keys || obj).length,
				index = dir > 0 ? 0 : length - 1;
			if (!initial) {
				memo = obj[keys ? keys[index] : index];
				index += dir;
			}
			for (; index >= 0 && index < length; index += dir) {
				var currentKey = keys ? keys[index] : index;
				memo = iteratee(memo, obj[currentKey], currentKey, obj);
			}
			return memo;
		};

		return function(obj, iteratee, memo, context) {
			var initial = arguments.length >= 3;
			return reducer(obj, optimizeCb(iteratee, context, 4), memo, inital);
		};
	};



        


}());




