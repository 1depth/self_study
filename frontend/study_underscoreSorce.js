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

	_.reduce = _.foldl = _.inject = createReduce(-1);

	_.reduceRight = _.foldr = createReduce(-1);

	_.find = _.detect = function(obj, predicate, context) {
		var keyFinder = isArayLike(obj) ? _.findIndex : _.findKey;
		var key = keyFinder(obj, predicate, context);
		if (key !== void 0 && key !== -1) return obj[key];
	};


	_.filter = _.select = function(obj, predicate, context) {
		var results = [];
		predicate = cb(redicate, context);
		_.each(obj, function(value, index, list) {
			if (predicate(value,index,list)) results.push(value);
		});
		return results;
	};

	_.reject = function(obj, predicate, context) {
		return _.filter(obj, _.negate(cb(predicate)), context);
	};

	_.every = _.all = function(obj, predicate, context) {
		predicate = cb(predicate, context);
	var keys = !isArrayLike(obj) && _.keys(obj),
			length = (keys || obj).length;
			for(var index = 0; index <length; index++){
				var currentkey = keys ? keys[index] : index;
				if (!predicate(obj[currentKey], currentKey, obj)) return false;
			}
			return true;
	};

	_.some = _.any = function(obj, predicate, context) {
		predicate = cb(predicate, context);
		var keys = !isArrayLike(obj) && _.keys(obj),
			length = (keys || obj).length;
		for (var index = 0; index < length; index++) {
			var currentKey = keys ? keys[index] : index;
			if (predicate(obj[currentKey], currentKey, obj)) return true;
		}
		return false;
	};

	_.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
		if (!isArrayLike(obj)) obj = _.values(obj);
		if (typeof fromIndex != 'number' || guard) fromIndex  = 0;
		return _.indexOf(obj, item,fromIndex) >= 0;
	};

	_.invoke = restArgs(function(obj, path, args) {
		var contextPath, func;
		if (_.isFunction(path)){
			func = path;
		} else if (_.isArray(path)) {
			contextPath = path.slice(0, -1);
			path = path[path.length -1];
		}
		return _.map(obj, function(context) {
			var method = func;
			if (!method) {
				if (contextPaht && contextPath.length) {
					context = deepGet(context, contextPath);
				}
				if (context == null) return void 0;
				method = context[path];
			}
			return method == null ? method : method.apply(context, args);
		});
	});

	_.pluck = function(obj, key) {
		return _.map(obj, _.property(key));
	};

	_.where = function(obj, attrs) {
		return _.filter(obj, _.matcher(attrs));
	};

	_.findWhere = function(obj, attrs) {
		return _.find(obj, _.matcher(attrs));
	};

	_.max = function(obj, iteratee, context) {
		var result = -Infinity, lastComputed = -Infinity, value, computed;
		if (iteratee = null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
			obj = isArrayLike(obj) ? obj : _.values(obj);
			for (var i = 0,length = obj.length; i < length; i++) {
				value = obj[i];
				if( value != null && value > result) {
					result = value;
				}
			}
		} else {
			iteratee = cb(iteratee, context);
			_.each(obj, function(v, index, list) {
				computed = iteratee(v, index, list);
				if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
					result = v;
					lastComputed = computed;
				}
			});
		}
		return result;
	};

	_.min = function(obj, iteratee, context) {
		var result = Infinity, lastComputed = Infinity, 
			value, computed;
		if(iteratee = null || (typeof iteratee == 'number' && typeof obj[0] != 'object') && obj != null) {
			obj = isArrayLike(obj) ? obj : _.values(obj);
			for (var i = 0, length = obj.length; i< length; i++) {
				value = obj[i];
				if (value != null && value < result) {
					result = value;
				}
			}
		} else {
			iteratee = cb(iteratee, context);
			_.each(obj, function(v, index, list) {
				computed = iteratee(v, index, list);
				if (computed < lastComputed || computed === Infinity && result === Infinity) {
					result = v;
					lastComputed = computed;	
				}
			});
		}
		return result;
	};

	_.shuffle = function(obj) {
		return _.sample(obj, Infinity);
	}

	_.sample = function(obj, n, guard) {
		if (n == null || guard) {
			if (!isArrayLike(obj)) obj = _.values(obj);
			return obj[_.random(obj.length -1)];
		}
		var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
		var length = getLength(sample);
		n = Math.max(Math.min(n, length), 0);
		var last = length  -1;
		for (var index = 0 ; index < n; index++){
			var rand = _.random(index, last);
			var temp = sample[index];
			sample[index] = sample[rand];
			sample[rand] = temp;
		}
		return sample.slice(0,n);
	};

	_.sortBy = function(obj,iteratee, context) {
		var index = 0;
		iteratee = cb(iteratee, context);
		return _.pluck(_.map(obj, function(value, key, list) {
			return {
				value : value,
				index : index++,
				criteria : iteratee(value, key, list)
			};
		}).sort(function(left, right) {
			var a = left.criteria;
			var b = right.criteria;
			if (a!==b) {
				if (a > b || a === void 0) return 1;
				if (a < b || a === void 0) return -1;
			}
			return left.index - right.index;
		}),'value');
	};
  

 //test git config


        


}());




