function _get(obj, key) {
    return obj == null ? undefined : obj[key]
}

var slice = Array.prototype.slice;
function _rest(list, num) {
    return slice.call(list, num || 1); // 인자로 첫번째 값은 data를 담은 배열을 가지고 온다. slice를 해주는 이유는 첫번째 인자 값을 뺀 나머지 함수값들만 리턴한다.. 
}

function _is_object(obj) {
    return typeof obj == 'object' && !!obj;
}

function _keys(obj) {
    return _is_object(obj) ? Object.keys(obj) : [];
}

function _each(list, iter) {
    var keys = _keys(list);  
    for(var i = 0, len = keys.length; i < len; i++) {
        iter(list[keys[i]], keys[i]);
    }
    return list;
}

function _filter(list, predi) {
    var new_list = [];
    _each(list, function(val) {
        if(predi(val)) new_list.push(val);
    });
    return new_list;
}

function _map(list, mapper) {
    var new_list = [];
    _each(list, function(val, key) { 
        new_list.push(mapper(val, key));
    });
    return new_list;
}

function _reduce(list, iter, memo) {
    if(arguments.length == 2) {
        memo = list[0];
        list = _rest(list);
    }
    _each(list, function(val) {
        memo = iter(memo, val)
    });
    return memo;
}

function _curryr(fn) {
    return function(a, b) {
        return arguments.length == 2 ? fn(a, b) : function(b) { return fn(b, a); };
    }
}

var _get = _curryr(function(obj, key) {
    return obj == null ? undefined : obj[key]
});

var _map = _curryr(_map), 
    _each = _curryr(_each),
    _filter = _curryr(_filter);

function _pipe() {
    var fns = arguments;
    return function(arg) {
        return _reduce(fns, function(arg, fn) {
            return fn(arg);
        }, arg);
    }
}

function _go(arg){
    var fns = _rest(arguments); // 함수만 가지고 있는 fns 변수
    return _pipe.apply(null, fns)(arg); // 
}

// _group_by -----------------------------------------------------

function _push(obj, key, val) {
    (obj[key] = obj[key] || []).push(val);
    return obj;
}

var _group_by = _curryr(function(data, iter) {
    return _reduce(data, function(grouped,  val) {
        return _push(grouped, iter(val), val);
    }, {}); // 원하는 결과가 객체이기 때문에 초기값을 {}로 세팅해준다.
});

// _count_by, inc -----------------------------------------------------

function _inc(count, key) {
    count[key] ? count[key]++ : count[key] = 1;
    return count;
}

var _count_by = _curryr(function(data, iter) {
    return _reduce(data, function(count, val) {
        return _inc(count, iter(val));
    }, {});
});

var pairs = _map((val, key) => [key, val]);