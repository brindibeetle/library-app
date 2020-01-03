(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}



// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;
var $author$project$Main$LinkClicked = function (a) {
	return {$: 'LinkClicked', a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 'UrlChanged', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$Login = function (a) {
	return {$: 'Login', a: a};
};
var $author$project$Main$LoginMsg = function (a) {
	return {$: 'LoginMsg', a: a};
};
var $author$project$Main$MenuMsg = function (a) {
	return {$: 'MenuMsg', a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Domain$InitFlags$emptyInitFlags = {googleClientId: '', libraryApiBaseUrlString: '', thisBaseUrlString: ''};
var $author$project$Domain$InitFlags$InitFlags = F3(
	function (googleClientId, libraryApiBaseUrlString, thisBaseUrlString) {
		return {googleClientId: googleClientId, libraryApiBaseUrlString: libraryApiBaseUrlString, thisBaseUrlString: thisBaseUrlString};
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Domain$InitFlags$initFlagsBookDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'this_base_url',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'library_api_base_url',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'google_oauth2_client_id',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Domain$InitFlags$InitFlags))));
var $author$project$Domain$InitFlags$getInitFlags = function (dvalue) {
	var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Domain$InitFlags$initFlagsBookDecoder, dvalue);
	if (_v0.$ === 'Ok') {
		var initFlags = _v0.a;
		return initFlags;
	} else {
		var a = _v0.a;
		return $author$project$Domain$InitFlags$emptyInitFlags;
	}
};
var $krisajenkins$remotedata$RemoteData$Loading = {$: 'Loading'};
var $author$project$Login$DoUserReceived = function (a) {
	return {$: 'DoUserReceived', a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 'BadUrl_':
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 'Timeout_':
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 'NetworkError_':
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 'BadStatus_':
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.statusCode));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $krisajenkins$remotedata$RemoteData$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $krisajenkins$remotedata$RemoteData$Success = function (a) {
	return {$: 'Success', a: a};
};
var $krisajenkins$remotedata$RemoteData$fromResult = function (result) {
	if (result.$ === 'Err') {
		var e = result.a;
		return $krisajenkins$remotedata$RemoteData$Failure(e);
	} else {
		var x = result.a;
		return $krisajenkins$remotedata$RemoteData$Success(x);
	}
};
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$Session$getLibraryApiBaseUrlString = function (session) {
	return session.initFlags.libraryApiBaseUrlString;
};
var $author$project$Login$libraryApiBaseUrl = function (session) {
	return $author$project$Session$getLibraryApiBaseUrlString(session);
};
var $truqu$elm_oauth2$OAuth$tokenToString = function (_v0) {
	var t = _v0.a;
	return 'Bearer ' + t;
};
var $author$project$Domain$User$User = F3(
	function (name, email, picture) {
		return {email: email, name: name, picture: picture};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (_v0.$ === 'Ok') {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (_v1.$ === 'Ok') {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _v1.a;
					return $elm$json$Json$Decode$fail(
						$elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $author$project$Domain$User$userDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'picture',
	$elm$json$Json$Decode$string,
	'',
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'email',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Domain$User$User))));
var $author$project$Login$getUser = F2(
	function (session, token) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = $author$project$Login$libraryApiBaseUrl(session) + ('/user' + ('?access_token=' + puretoken));
		return $elm$http$Http$get(
			{
				expect: A2(
					$elm$http$Http$expectJson,
					A2($elm$core$Basics$composeR, $krisajenkins$remotedata$RemoteData$fromResult, $author$project$Login$DoUserReceived),
					$author$project$Domain$User$userDecoder),
				url: requestUrl
			});
	});
var $author$project$Login$DoUserInfoReceived = function (a) {
	return {$: 'DoUserInfoReceived', a: a};
};
var $author$project$Domain$UserInfo$UserInfo = F3(
	function (name, numberBooks, numberCheckouts) {
		return {name: name, numberBooks: numberBooks, numberCheckouts: numberCheckouts};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Domain$UserInfo$userInfoDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'numberCheckouts',
	$elm$json$Json$Decode$int,
	0,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'numberBooks',
		$elm$json$Json$Decode$int,
		0,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Domain$UserInfo$UserInfo))));
var $author$project$Login$getUserInfo = F2(
	function (session, token) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = $author$project$Login$libraryApiBaseUrl(session) + ('/user/info' + ('?access_token=' + puretoken));
		return $elm$http$Http$get(
			{
				expect: A2(
					$elm$http$Http$expectJson,
					A2($elm$core$Basics$composeR, $krisajenkins$remotedata$RemoteData$fromResult, $author$project$Login$DoUserInfoReceived),
					$author$project$Domain$UserInfo$userInfoDecoder),
				url: requestUrl
			});
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Login$initialLogin = function (session) {
	var _v0 = session.token;
	if (_v0.$ === 'Just') {
		var token = _v0.a;
		return _Utils_Tuple2(
			_Utils_update(
				session,
				{user: $krisajenkins$remotedata$RemoteData$Loading}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($author$project$Login$getUser, session, token),
						A2($author$project$Login$getUserInfo, session, token)
					])));
	} else {
		return _Utils_Tuple2(session, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Session$Empty = {$: 'Empty'};
var $krisajenkins$remotedata$RemoteData$NotAsked = {$: 'NotAsked'};
var $author$project$Session$WelcomePage = {$: 'WelcomePage'};
var $author$project$Session$initialSession = F3(
	function (token, navbarState, initFlags) {
		return {initFlags: initFlags, message: $author$project$Session$Empty, navbarState: navbarState, page: $author$project$Session$WelcomePage, token: token, user: $krisajenkins$remotedata$RemoteData$NotAsked, userInfo: $krisajenkins$remotedata$RemoteData$NotAsked};
	});
var $author$project$Menu$NavbarMsg = function (a) {
	return {$: 'NavbarMsg', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$Hidden = {$: 'Hidden'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$State = function (a) {
	return {$: 'State', a: a};
};
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $rundis$elm_bootstrap$Bootstrap$Navbar$mapState = F2(
	function (mapper, _v0) {
		var state = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Navbar$State(
			mapper(state));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$initWindowSize = F2(
	function (toMsg, state) {
		return A2(
			$elm$core$Task$perform,
			function (vp) {
				return toMsg(
					A2(
						$rundis$elm_bootstrap$Bootstrap$Navbar$mapState,
						function (s) {
							return _Utils_update(
								s,
								{
									windowWidth: $elm$core$Maybe$Just(vp.viewport.width)
								});
						},
						state));
			},
			$elm$browser$Browser$Dom$getViewport);
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$initialState = function (toMsg) {
	var state = $rundis$elm_bootstrap$Bootstrap$Navbar$State(
		{dropdowns: $elm$core$Dict$empty, height: $elm$core$Maybe$Nothing, visibility: $rundis$elm_bootstrap$Bootstrap$Navbar$Hidden, windowWidth: $elm$core$Maybe$Nothing});
	return _Utils_Tuple2(
		state,
		A2($rundis$elm_bootstrap$Bootstrap$Navbar$initWindowSize, toMsg, state));
};
var $author$project$Menu$initialState = $rundis$elm_bootstrap$Bootstrap$Navbar$initialState($author$project$Menu$NavbarMsg);
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$initialState = F2(
	function (maybeToken, flags) {
		var _v0 = $author$project$Menu$initialState;
		var navbarState = _v0.a;
		var menuCmd = _v0.b;
		var session = A3(
			$author$project$Session$initialSession,
			maybeToken,
			navbarState,
			$author$project$Domain$InitFlags$getInitFlags(flags));
		var _v1 = $author$project$Login$initialLogin(session);
		var loginSession = _v1.a;
		var loginCmd = _v1.b;
		return _Utils_Tuple2(
			$author$project$Main$Login(loginSession),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($elm$core$Platform$Cmd$map, $author$project$Main$MenuMsg, menuCmd),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$LoginMsg, loginCmd)
					])));
	});
var $truqu$elm_oauth2$Internal$AuthorizationError = F4(
	function (error, errorDescription, errorUri, state) {
		return {error: error, errorDescription: errorDescription, errorUri: errorUri, state: state};
	});
var $elm$url$Url$Parser$Internal$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm$url$Url$Parser$Query$custom = F2(
	function (key, func) {
		return $elm$url$Url$Parser$Internal$Parser(
			function (dict) {
				return func(
					A2(
						$elm$core$Maybe$withDefault,
						_List_Nil,
						A2($elm$core$Dict$get, key, dict)));
			});
	});
var $elm$url$Url$Parser$Query$string = function (key) {
	return A2(
		$elm$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.b && (!stringList.b.b)) {
				var str = stringList.a;
				return $elm$core$Maybe$Just(str);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
};
var $truqu$elm_oauth2$Internal$errorDescriptionParser = $elm$url$Url$Parser$Query$string('error_description');
var $truqu$elm_oauth2$Internal$errorUriParser = $elm$url$Url$Parser$Query$string('error_uri');
var $elm$url$Url$Parser$Query$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var a = _v0.a;
		var b = _v1.a;
		var c = _v2.a;
		return $elm$url$Url$Parser$Internal$Parser(
			function (dict) {
				return A3(
					func,
					a(dict),
					b(dict),
					c(dict));
			});
	});
var $truqu$elm_oauth2$Internal$stateParser = $elm$url$Url$Parser$Query$string('state');
var $truqu$elm_oauth2$Internal$authorizationErrorParser = function (errorCode) {
	return A4(
		$elm$url$Url$Parser$Query$map3,
		$truqu$elm_oauth2$Internal$AuthorizationError(errorCode),
		$truqu$elm_oauth2$Internal$errorDescriptionParser,
		$truqu$elm_oauth2$Internal$errorUriParser,
		$truqu$elm_oauth2$Internal$stateParser);
};
var $truqu$elm_oauth2$OAuth$Implicit$defaultAuthorizationErrorParser = $truqu$elm_oauth2$Internal$authorizationErrorParser;
var $truqu$elm_oauth2$OAuth$Implicit$AuthorizationSuccess = F5(
	function (token, refreshToken, expiresIn, scope, state) {
		return {expiresIn: expiresIn, refreshToken: refreshToken, scope: scope, state: state, token: token};
	});
var $elm$url$Url$Parser$Query$int = function (key) {
	return A2(
		$elm$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.b && (!stringList.b.b)) {
				var str = stringList.a;
				return $elm$core$String$toInt(str);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		});
};
var $truqu$elm_oauth2$Internal$expiresInParser = $elm$url$Url$Parser$Query$int('expires_in');
var $elm$url$Url$Parser$Query$map = F2(
	function (func, _v0) {
		var a = _v0.a;
		return $elm$url$Url$Parser$Internal$Parser(
			function (dict) {
				return func(
					a(dict));
			});
	});
var $truqu$elm_oauth2$Internal$spaceSeparatedListParser = function (param) {
	return A2(
		$elm$url$Url$Parser$Query$map,
		function (s) {
			return A2(
				$elm$core$String$split,
				' ',
				A2($elm$core$Maybe$withDefault, '', s));
		},
		$elm$url$Url$Parser$Query$string(param));
};
var $truqu$elm_oauth2$Internal$scopeParser = $truqu$elm_oauth2$Internal$spaceSeparatedListParser('scope');
var $truqu$elm_oauth2$OAuth$Implicit$defaultAuthorizationSuccessParser = function (accessToken) {
	return A4(
		$elm$url$Url$Parser$Query$map3,
		A2($truqu$elm_oauth2$OAuth$Implicit$AuthorizationSuccess, accessToken, $elm$core$Maybe$Nothing),
		$truqu$elm_oauth2$Internal$expiresInParser,
		$truqu$elm_oauth2$Internal$scopeParser,
		$truqu$elm_oauth2$Internal$stateParser);
};
var $truqu$elm_oauth2$OAuth$AccessDenied = {$: 'AccessDenied'};
var $truqu$elm_oauth2$OAuth$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $truqu$elm_oauth2$OAuth$InvalidRequest = {$: 'InvalidRequest'};
var $truqu$elm_oauth2$OAuth$InvalidScope = {$: 'InvalidScope'};
var $truqu$elm_oauth2$OAuth$ServerError = {$: 'ServerError'};
var $truqu$elm_oauth2$OAuth$TemporarilyUnavailable = {$: 'TemporarilyUnavailable'};
var $truqu$elm_oauth2$OAuth$UnauthorizedClient = {$: 'UnauthorizedClient'};
var $truqu$elm_oauth2$OAuth$UnsupportedResponseType = {$: 'UnsupportedResponseType'};
var $truqu$elm_oauth2$OAuth$errorCodeFromString = function (str) {
	switch (str) {
		case 'invalid_request':
			return $truqu$elm_oauth2$OAuth$InvalidRequest;
		case 'unauthorized_client':
			return $truqu$elm_oauth2$OAuth$UnauthorizedClient;
		case 'access_denied':
			return $truqu$elm_oauth2$OAuth$AccessDenied;
		case 'unsupported_response_type':
			return $truqu$elm_oauth2$OAuth$UnsupportedResponseType;
		case 'invalid_scope':
			return $truqu$elm_oauth2$OAuth$InvalidScope;
		case 'server_error':
			return $truqu$elm_oauth2$OAuth$ServerError;
		case 'temporarily_unavailable':
			return $truqu$elm_oauth2$OAuth$TemporarilyUnavailable;
		default:
			return $truqu$elm_oauth2$OAuth$Custom(str);
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $truqu$elm_oauth2$Internal$errorParser = function (errorCodeFromString) {
	return A2(
		$elm$url$Url$Parser$Query$map,
		$elm$core$Maybe$map(errorCodeFromString),
		$elm$url$Url$Parser$Query$string('error'));
};
var $truqu$elm_oauth2$OAuth$Implicit$defaultErrorParser = $truqu$elm_oauth2$Internal$errorParser($truqu$elm_oauth2$OAuth$errorCodeFromString);
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $truqu$elm_oauth2$Extra$Maybe$andThen2 = F3(
	function (fn, ma, mb) {
		return A2(
			$elm$core$Maybe$andThen,
			$elm$core$Basics$identity,
			A3($elm$core$Maybe$map2, fn, ma, mb));
	});
var $truqu$elm_oauth2$OAuth$Bearer = function (a) {
	return {$: 'Bearer', a: a};
};
var $elm$core$String$toLower = _String_toLower;
var $truqu$elm_oauth2$OAuth$tryMakeToken = F2(
	function (tokenType, token) {
		var _v0 = $elm$core$String$toLower(tokenType);
		if (_v0 === 'bearer') {
			return $elm$core$Maybe$Just(
				$truqu$elm_oauth2$OAuth$Bearer(token));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $truqu$elm_oauth2$OAuth$makeToken = $truqu$elm_oauth2$Extra$Maybe$andThen2($truqu$elm_oauth2$OAuth$tryMakeToken);
var $elm$url$Url$Parser$Query$map2 = F3(
	function (func, _v0, _v1) {
		var a = _v0.a;
		var b = _v1.a;
		return $elm$url$Url$Parser$Internal$Parser(
			function (dict) {
				return A2(
					func,
					a(dict),
					b(dict));
			});
	});
var $truqu$elm_oauth2$Internal$tokenParser = A3(
	$elm$url$Url$Parser$Query$map2,
	$truqu$elm_oauth2$OAuth$makeToken,
	$elm$url$Url$Parser$Query$string('token_type'),
	$elm$url$Url$Parser$Query$string('access_token'));
var $truqu$elm_oauth2$OAuth$Implicit$defaultTokenParser = $truqu$elm_oauth2$Internal$tokenParser;
var $truqu$elm_oauth2$OAuth$Implicit$defaultParsers = {authorizationErrorParser: $truqu$elm_oauth2$OAuth$Implicit$defaultAuthorizationErrorParser, authorizationSuccessParser: $truqu$elm_oauth2$OAuth$Implicit$defaultAuthorizationSuccessParser, errorParser: $truqu$elm_oauth2$OAuth$Implicit$defaultErrorParser, tokenParser: $truqu$elm_oauth2$OAuth$Implicit$defaultTokenParser};
var $truqu$elm_oauth2$OAuth$Implicit$Empty = {$: 'Empty'};
var $truqu$elm_oauth2$OAuth$Implicit$Error = function (a) {
	return {$: 'Error', a: a};
};
var $truqu$elm_oauth2$OAuth$Implicit$Success = function (a) {
	return {$: 'Success', a: a};
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$query = function (_v0) {
	var queryParser = _v0.a;
	return $elm$url$Url$Parser$Parser(
		function (_v1) {
			var visited = _v1.visited;
			var unvisited = _v1.unvisited;
			var params = _v1.params;
			var frag = _v1.frag;
			var value = _v1.value;
			return _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					visited,
					unvisited,
					params,
					frag,
					value(
						queryParser(params)))
				]);
		});
};
var $truqu$elm_oauth2$Internal$parseUrlQuery = F3(
	function (url, def, parser) {
		return A2(
			$elm$core$Maybe$withDefault,
			def,
			A2(
				$elm$url$Url$Parser$parse,
				$elm$url$Url$Parser$query(parser),
				url));
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0.a;
		var parseAfter = _v1.a;
		return $elm$url$Url$Parser$Parser(
			function (state) {
				return A2(
					$elm$core$List$concatMap,
					parseAfter,
					parseBefore(state));
			});
	});
var $elm$url$Url$Parser$questionMark = F2(
	function (parser, queryParser) {
		return A2(
			$elm$url$Url$Parser$slash,
			parser,
			$elm$url$Url$Parser$query(queryParser));
	});
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $truqu$elm_oauth2$OAuth$Implicit$parseTokenWith = F2(
	function (_v0, url_) {
		var tokenParser = _v0.tokenParser;
		var errorParser = _v0.errorParser;
		var authorizationSuccessParser = _v0.authorizationSuccessParser;
		var authorizationErrorParser = _v0.authorizationErrorParser;
		var url = _Utils_update(
			url_,
			{fragment: $elm$core$Maybe$Nothing, path: '/', query: url_.fragment});
		var _v1 = A2(
			$elm$url$Url$Parser$parse,
			A2(
				$elm$url$Url$Parser$questionMark,
				$elm$url$Url$Parser$top,
				A3($elm$url$Url$Parser$Query$map2, $elm$core$Tuple$pair, tokenParser, errorParser)),
			url);
		_v1$2:
		while (true) {
			if (_v1.$ === 'Just') {
				if (_v1.a.a.$ === 'Just') {
					var _v2 = _v1.a;
					var accessToken = _v2.a.a;
					return A3(
						$truqu$elm_oauth2$Internal$parseUrlQuery,
						url,
						$truqu$elm_oauth2$OAuth$Implicit$Empty,
						A2(
							$elm$url$Url$Parser$Query$map,
							$truqu$elm_oauth2$OAuth$Implicit$Success,
							authorizationSuccessParser(accessToken)));
				} else {
					if (_v1.a.b.$ === 'Just') {
						var _v3 = _v1.a;
						var error = _v3.b.a;
						return A3(
							$truqu$elm_oauth2$Internal$parseUrlQuery,
							url,
							$truqu$elm_oauth2$OAuth$Implicit$Empty,
							A2(
								$elm$url$Url$Parser$Query$map,
								$truqu$elm_oauth2$OAuth$Implicit$Error,
								authorizationErrorParser(error)));
					} else {
						break _v1$2;
					}
				}
			} else {
				break _v1$2;
			}
		}
		return $truqu$elm_oauth2$OAuth$Implicit$Empty;
	});
var $truqu$elm_oauth2$OAuth$Implicit$parseToken = $truqu$elm_oauth2$OAuth$Implicit$parseTokenWith($truqu$elm_oauth2$OAuth$Implicit$defaultParsers);
var $author$project$Main$queryAsFragment = function (url) {
	var _v0 = url.fragment;
	if (_v0.$ === 'Just') {
		if (_v0.a === '_=_') {
			return _Utils_update(
				url,
				{fragment: url.query, query: $elm$core$Maybe$Nothing});
		} else {
			return url;
		}
	} else {
		return _Utils_update(
			url,
			{fragment: url.query, query: $elm$core$Maybe$Nothing});
	}
};
var $author$project$Main$init = F3(
	function (flags, url, navKey) {
		var _v0 = $truqu$elm_oauth2$OAuth$Implicit$parseToken(
			$author$project$Main$queryAsFragment(url));
		switch (_v0.$) {
			case 'Empty':
				return A2($author$project$Main$initialState, $elm$core$Maybe$Nothing, flags);
			case 'Success':
				var token = _v0.a.token;
				var state = _v0.a.state;
				return A2(
					$author$project$Main$initialState,
					$elm$core$Maybe$Just(token),
					flags);
			default:
				var error = _v0.a.error;
				var errorDescription = _v0.a.errorDescription;
				return A2($author$project$Main$initialState, $elm$core$Maybe$Nothing, flags);
		}
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Main$BookEditor = F2(
	function (a, b) {
		return {$: 'BookEditor', a: a, b: b};
	});
var $author$project$Main$BookEditorMsg = function (a) {
	return {$: 'BookEditorMsg', a: a};
};
var $author$project$Main$BookSelector = F2(
	function (a, b) {
		return {$: 'BookSelector', a: a, b: b};
	});
var $author$project$Main$BookSelectorMsg = function (a) {
	return {$: 'BookSelectorMsg', a: a};
};
var $author$project$Main$Checkin = F2(
	function (a, b) {
		return {$: 'Checkin', a: a, b: b};
	});
var $author$project$Main$CheckinMsg = function (a) {
	return {$: 'CheckinMsg', a: a};
};
var $author$project$Main$Library = F2(
	function (a, b) {
		return {$: 'Library', a: a, b: b};
	});
var $author$project$Main$LibraryMsg = function (a) {
	return {$: 'LibraryMsg', a: a};
};
var $author$project$Main$LogoutMsg = function (a) {
	return {$: 'LogoutMsg', a: a};
};
var $author$project$Main$Welcome = function (a) {
	return {$: 'Welcome', a: a};
};
var $author$project$Main$WelcomeMsg = function (a) {
	return {$: 'WelcomeMsg', a: a};
};
var $author$project$Main$Logout = function (a) {
	return {$: 'Logout', a: a};
};
var $author$project$BookSelector$DoAddToLibrary = {$: 'DoAddToLibrary'};
var $author$project$BookSelector$DoCancel = {$: 'DoCancel'};
var $author$project$BookSelector$DoDetail = function (a) {
	return {$: 'DoDetail', a: a};
};
var $author$project$BookSelector$DoNext = {$: 'DoNext'};
var $author$project$BookSelector$DoPrevious = {$: 'DoPrevious'};
var $author$project$BookSelector$DoSearch = {$: 'DoSearch'};
var $author$project$BookSelector$Tiles = {$: 'Tiles'};
var $author$project$BookSelector$UpdateSearchAuthor = function (a) {
	return {$: 'UpdateSearchAuthor', a: a};
};
var $author$project$BookSelector$UpdateSearchIsbn = function (a) {
	return {$: 'UpdateSearchIsbn', a: a};
};
var $author$project$BookSelector$UpdateSearchString = function (a) {
	return {$: 'UpdateSearchString', a: a};
};
var $author$project$BookSelector$UpdateSearchTitle = function (a) {
	return {$: 'UpdateSearchTitle', a: a};
};
var $author$project$Domain$LibraryBook$emptyLibrarybook = {authors: '', description: '', id: 0, language: '', location: '', owner: '', publishedDate: '', smallThumbnail: '', thumbnail: '', title: ''};
var $author$project$BookSelector$initialModel = {
	bookDetailsEdit: {
		book: $author$project$Domain$LibraryBook$emptyLibrarybook,
		doInsert: {visible: true},
		doUpdate: {visible: false}
	},
	bookView: $author$project$BookSelector$Tiles,
	bookdetails: {actionHtml: _List_Nil, doAction: $author$project$BookSelector$DoAddToLibrary, doActionDisabled: false, doCancel: $author$project$BookSelector$DoCancel, doNext: $author$project$BookSelector$DoNext, doPrevious: $author$project$BookSelector$DoPrevious, hasNext: false, hasPrevious: false, maybeBook: $elm$core$Maybe$Nothing, textAction: 'Add to library'},
	booktiles: {books: $krisajenkins$remotedata$RemoteData$NotAsked, doAction: $author$project$BookSelector$DoDetail, doSearch: $author$project$BookSelector$DoSearch, searchAuthors: '', searchIsbn: 0, searchString: '', searchTitle: '', updateSearchAuthor: $author$project$BookSelector$UpdateSearchAuthor, updateSearchIsbn: $author$project$BookSelector$UpdateSearchIsbn, updateSearchString: $author$project$BookSelector$UpdateSearchString, updateSearchTitle: $author$project$BookSelector$UpdateSearchTitle},
	searchbooks: $krisajenkins$remotedata$RemoteData$NotAsked
};
var $author$project$BookEditor$LibraryTilesMsg = function (a) {
	return {$: 'LibraryTilesMsg', a: a};
};
var $author$project$Session$getUser = function (session) {
	var _v0 = session.user;
	if (_v0.$ === 'Success') {
		var user1 = _v0.a;
		return user1.email;
	} else {
		return 'Not found';
	}
};
var $author$project$BookEditor$DoCancel = {$: 'DoCancel'};
var $author$project$BookEditor$DoDelete = {$: 'DoDelete'};
var $author$project$BookEditor$DoNext = {$: 'DoNext'};
var $author$project$BookEditor$DoPrevious = {$: 'DoPrevious'};
var $author$project$BookEditor$DoUpdate = {$: 'DoUpdate'};
var $author$project$BookEditor$Tiles = {$: 'Tiles'};
var $author$project$View$LibraryTiles$intialConfig = function (userEmail) {
	return {books: $krisajenkins$remotedata$RemoteData$NotAsked, checkouts: $krisajenkins$remotedata$RemoteData$NotAsked, checkoutsDistributed: $krisajenkins$remotedata$RemoteData$NotAsked, searchAuthors: '', searchCheckStatus: '', searchCheckoutUser: '', searchLocation: '', searchOwner: '', searchTitle: '', showSearchAuthors: false, showSearchCheckStatus: false, showSearchCheckoutUser: false, showSearchLocation: false, showSearchOwner: false, showSearchTitle: false, userEmail: userEmail};
};
var $author$project$BookEditor$initialModel = function (userEmail) {
	return {
		bookView: $author$project$BookEditor$Tiles,
		bookdetails: {
			doAction1: {disabled: false, msg: $author$project$BookEditor$DoDelete, text: 'Delete', visible: true},
			doAction2: {disabled: false, msg: $author$project$BookEditor$DoUpdate, text: 'Update', visible: true},
			doCancel: $author$project$BookEditor$DoCancel,
			doNext: $author$project$BookEditor$DoNext,
			doPrevious: $author$project$BookEditor$DoPrevious,
			hasNext: false,
			hasPrevious: false,
			libraryBook: $author$project$Domain$LibraryBook$emptyLibrarybook,
			maybeCheckout: $elm$core$Maybe$Nothing,
			remarks: '',
			userEmail: userEmail
		},
		bookedit: {
			book: $author$project$Domain$LibraryBook$emptyLibrarybook,
			doInsert: {visible: false},
			doUpdate: {visible: true}
		},
		booktiles: $author$project$View$LibraryTiles$intialConfig(userEmail),
		checkouts: $krisajenkins$remotedata$RemoteData$NotAsked,
		librarybooks: $krisajenkins$remotedata$RemoteData$NotAsked
	};
};
var $author$project$View$LibraryTiles$DoBooksReceived = function (a) {
	return {$: 'DoBooksReceived', a: a};
};
var $author$project$View$LibraryTiles$DoCheckoutsReceived = function (a) {
	return {$: 'DoCheckoutsReceived', a: a};
};
var $author$project$Domain$LibraryBook$libraryApiBooksUrl = function (session) {
	return $author$project$Session$getLibraryApiBaseUrlString(session) + '/books';
};
var $elm$json$Json$Decode$array = _Json_decodeArray;
var $author$project$Domain$LibraryBook$LibraryBook = function (id) {
	return function (title) {
		return function (authors) {
			return function (description) {
				return function (publishedDate) {
					return function (language) {
						return function (smallThumbnail) {
							return function (thumbnail) {
								return function (owner) {
									return function (location) {
										return {authors: authors, description: description, id: id, language: language, location: location, owner: owner, publishedDate: publishedDate, smallThumbnail: smallThumbnail, thumbnail: thumbnail, title: title};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Domain$LibraryBook$libraryBookDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'location',
	$elm$json$Json$Decode$string,
	'',
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'owner',
		$elm$json$Json$Decode$string,
		'',
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'thumbnail',
			$elm$json$Json$Decode$string,
			'',
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'smallThumbnail',
				$elm$json$Json$Decode$string,
				'',
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'language',
					$elm$json$Json$Decode$string,
					'',
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'publishedDate',
						$elm$json$Json$Decode$string,
						'',
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'description',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'authors',
								$elm$json$Json$Decode$string,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'title',
									$elm$json$Json$Decode$string,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'id',
										$elm$json$Json$Decode$int,
										$elm$json$Json$Decode$succeed($author$project$Domain$LibraryBook$LibraryBook)))))))))));
var $author$project$Domain$LibraryBook$libraryBooksDecoder = $elm$json$Json$Decode$array($author$project$Domain$LibraryBook$libraryBookDecoder);
var $author$project$Domain$LibraryBook$getBooks = F3(
	function (msg, session, token) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = $author$project$Domain$LibraryBook$libraryApiBooksUrl(session) + ('?access_token=' + puretoken);
		return $elm$http$Http$get(
			{
				expect: A2(
					$elm$http$Http$expectJson,
					A2($elm$core$Basics$composeR, $krisajenkins$remotedata$RemoteData$fromResult, msg),
					$author$project$Domain$LibraryBook$libraryBooksDecoder),
				url: requestUrl
			});
	});
var $author$project$Domain$Checkout$Checkout = F5(
	function (id, bookId, dateTimeFrom, dateTimeTo, userEmail) {
		return {bookId: bookId, dateTimeFrom: dateTimeFrom, dateTimeTo: dateTimeTo, id: id, userEmail: userEmail};
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$ExpectingEnd = {$: 'ExpectingEnd'};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return _Utils_eq(
				$elm$core$String$length(s.src),
				s.offset) ? A3($elm$parser$Parser$Advanced$Good, false, _Utils_Tuple0, s) : A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 'Problem', a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		});
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$core$Basics$round = _Basics_round;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$core$String$toFloat = _String_toFloat;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs = A2(
	$elm$parser$Parser$andThen,
	function (str) {
		if ($elm$core$String$length(str) <= 9) {
			var _v0 = $elm$core$String$toFloat('0.' + str);
			if (_v0.$ === 'Just') {
				var floatVal = _v0.a;
				return $elm$parser$Parser$succeed(
					$elm$core$Basics$round(floatVal * 1000));
			} else {
				return $elm$parser$Parser$problem('Invalid float: \"' + (str + '\"'));
			}
		} else {
			return $elm$parser$Parser$problem(
				'Expected at most 9 digits, but got ' + $elm$core$String$fromInt(
					$elm$core$String$length(str)));
		}
	},
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompWhile($elm$core$Char$isDigit)));
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts = F6(
	function (monthYearDayMs, hour, minute, second, ms, utcOffsetMinutes) {
		return $elm$time$Time$millisToPosix((((monthYearDayMs + (((hour * 60) * 60) * 1000)) + (((minute - utcOffsetMinutes) * 60) * 1000)) + (second * 1000)) + ms);
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$core$String$append = _String_append;
var $elm$parser$Parser$UnexpectedChar = {$: 'UnexpectedChar'};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
				return _Utils_eq(newOffset, -1) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src}) : A3(
					$elm$parser$Parser$Advanced$Good,
					true,
					_Utils_Tuple0,
					{col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src}));
			});
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (step.$ === 'Loop') {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt = function (quantity) {
	var helper = function (str) {
		if (_Utils_eq(
			$elm$core$String$length(str),
			quantity)) {
			var _v0 = $elm$core$String$toInt(str);
			if (_v0.$ === 'Just') {
				var intVal = _v0.a;
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$Done,
					$elm$parser$Parser$succeed(intVal));
			} else {
				return $elm$parser$Parser$problem('Invalid integer: \"' + (str + '\"'));
			}
		} else {
			return A2(
				$elm$parser$Parser$map,
				function (nextChar) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$String$append, str, nextChar));
				},
				$elm$parser$Parser$getChompedString(
					$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
		}
	};
	return A2($elm$parser$Parser$loop, '', helper);
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$not = _Basics_not;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear = 1970;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay = function (day) {
	return $elm$parser$Parser$problem(
		'Invalid day: ' + $elm$core$String$fromInt(day));
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear = function (year) {
	return (!A2($elm$core$Basics$modBy, 4, year)) && ((!(!A2($elm$core$Basics$modBy, 100, year))) || (!A2($elm$core$Basics$modBy, 400, year)));
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore = function (y1) {
	var y = y1 - 1;
	return (((y / 4) | 0) - ((y / 100) | 0)) + ((y / 400) | 0);
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay = 86400000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear = 31536000000;
var $rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay = function (_v0) {
	var year = _v0.a;
	var month = _v0.b;
	var dayInMonth = _v0.c;
	if (dayInMonth < 0) {
		return $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth);
	} else {
		var succeedWith = function (extraMs) {
			var yearMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerYear * (year - $rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear);
			var days = ((month < 3) || (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year))) ? (dayInMonth - 1) : dayInMonth;
			var dayMs = $rtfeldman$elm_iso8601_date_strings$Iso8601$msPerDay * (days + ($rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore(year) - $rtfeldman$elm_iso8601_date_strings$Iso8601$leapYearsBefore($rtfeldman$elm_iso8601_date_strings$Iso8601$epochYear)));
			return $elm$parser$Parser$succeed((extraMs + yearMs) + dayMs);
		};
		switch (month) {
			case 1:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(0);
			case 2:
				return ((dayInMonth > 29) || ((dayInMonth === 29) && (!$rtfeldman$elm_iso8601_date_strings$Iso8601$isLeapYear(year)))) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(2678400000);
			case 3:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(5097600000);
			case 4:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(7776000000);
			case 5:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(10368000000);
			case 6:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(13046400000);
			case 7:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(15638400000);
			case 8:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(18316800000);
			case 9:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(20995200000);
			case 10:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(23587200000);
			case 11:
				return (dayInMonth > 30) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(26265600000);
			case 12:
				return (dayInMonth > 31) ? $rtfeldman$elm_iso8601_date_strings$Iso8601$invalidDay(dayInMonth) : succeedWith(28857600000);
			default:
				return $elm$parser$Parser$problem(
					'Invalid month: \"' + ($elm$core$String$fromInt(month) + '\"'));
		}
	}
};
var $rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs = A2(
	$elm$parser$Parser$andThen,
	$rtfeldman$elm_iso8601_date_strings$Iso8601$yearMonthDay,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F3(
						function (year, month, day) {
							return _Utils_Tuple3(year, month, day);
						})),
				$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(4)),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed($elm$core$Basics$identity),
							$elm$parser$Parser$symbol('-')),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
					]))),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Basics$identity),
						$elm$parser$Parser$symbol('-')),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
				]))));
var $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes = function () {
	var utcOffsetMinutesFromParts = F3(
		function (multiplier, hours, minutes) {
			return (multiplier * (hours * 60)) + minutes;
		});
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$map,
					function (_v0) {
						return 0;
					},
					$elm$parser$Parser$symbol('Z')),
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed(utcOffsetMinutesFromParts),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$map,
										function (_v1) {
											return 1;
										},
										$elm$parser$Parser$symbol('+')),
										A2(
										$elm$parser$Parser$map,
										function (_v2) {
											return -1;
										},
										$elm$parser$Parser$symbol('-'))
									]))),
						$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$ignorer,
									$elm$parser$Parser$succeed($elm$core$Basics$identity),
									$elm$parser$Parser$symbol(':')),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2),
								$elm$parser$Parser$succeed(0)
							]))),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(0),
					$elm$parser$Parser$end)
				])));
}();
var $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601 = A2(
	$elm$parser$Parser$andThen,
	function (datePart) {
		return $elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$keeper,
								A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed(
											$rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts(datePart)),
										$elm$parser$Parser$symbol('T')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
								$elm$parser$Parser$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$keeper,
											A2(
												$elm$parser$Parser$ignorer,
												$elm$parser$Parser$succeed($elm$core$Basics$identity),
												$elm$parser$Parser$symbol(':')),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
											$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
										]))),
							$elm$parser$Parser$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$keeper,
										A2(
											$elm$parser$Parser$ignorer,
											$elm$parser$Parser$succeed($elm$core$Basics$identity),
											$elm$parser$Parser$symbol(':')),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)),
										$rtfeldman$elm_iso8601_date_strings$Iso8601$paddedInt(2)
									]))),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$symbol('.')),
									$rtfeldman$elm_iso8601_date_strings$Iso8601$fractionsOfASecondInMs),
									$elm$parser$Parser$succeed(0)
								]))),
					A2($elm$parser$Parser$ignorer, $rtfeldman$elm_iso8601_date_strings$Iso8601$utcOffsetInMinutes, $elm$parser$Parser$end)),
					A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A6($rtfeldman$elm_iso8601_date_strings$Iso8601$fromParts, datePart, 0, 0, 0, 0, 0)),
					$elm$parser$Parser$end)
				]));
	},
	$rtfeldman$elm_iso8601_date_strings$Iso8601$monthYearDayInMs);
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime = function (str) {
	return A2($elm$parser$Parser$run, $rtfeldman$elm_iso8601_date_strings$Iso8601$iso8601, str);
};
var $elm_community$json_extra$Json$Decode$Extra$datetime = A2(
	$elm$json$Json$Decode$andThen,
	function (dateString) {
		var _v0 = $rtfeldman$elm_iso8601_date_strings$Iso8601$toTime(dateString);
		if (_v0.$ === 'Ok') {
			var v = _v0.a;
			return $elm$json$Json$Decode$succeed(v);
		} else {
			return $elm$json$Json$Decode$fail('Expecting an ISO-8601 formatted date+time string');
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Domain$Checkout$checkoutDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'userEmail',
	$elm$json$Json$Decode$string,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'dateTimeTo',
		$elm_community$json_extra$Json$Decode$Extra$datetime,
		$elm$time$Time$millisToPosix(0),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'dateTimeFrom',
			$elm_community$json_extra$Json$Decode$Extra$datetime,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'bookId',
				$elm$json$Json$Decode$int,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'id',
					$elm$json$Json$Decode$int,
					$elm$json$Json$Decode$succeed($author$project$Domain$Checkout$Checkout))))));
var $author$project$Domain$Checkout$checkoutsDecoder = $elm$json$Json$Decode$array($author$project$Domain$Checkout$checkoutDecoder);
var $author$project$Domain$Checkout$libraryApiCheckoutsCurrentUrl = function (session) {
	return $author$project$Session$getLibraryApiBaseUrlString(session) + '/checkouts/current';
};
var $author$project$Domain$Checkout$getCheckoutsCurrent = F3(
	function (msg, session, token) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = $author$project$Domain$Checkout$libraryApiCheckoutsCurrentUrl(session) + ('?access_token=' + puretoken);
		return $elm$http$Http$get(
			{
				expect: A2(
					$elm$http$Http$expectJson,
					A2($elm$core$Basics$composeR, $krisajenkins$remotedata$RemoteData$fromResult, msg),
					$author$project$Domain$Checkout$checkoutsDecoder),
				url: requestUrl
			});
	});
var $author$project$View$LibraryTiles$doSearch = F2(
	function (model, session) {
		var _v0 = session.token;
		if (_v0.$ === 'Just') {
			var token = _v0.a;
			return {
				cmd: $elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A3($author$project$Domain$LibraryBook$getBooks, $author$project$View$LibraryTiles$DoBooksReceived, session, token),
							A3($author$project$Domain$Checkout$getCheckoutsCurrent, $author$project$View$LibraryTiles$DoCheckoutsReceived, session, token)
						])),
				model: _Utils_update(
					model,
					{books: $krisajenkins$remotedata$RemoteData$Loading, checkouts: $krisajenkins$remotedata$RemoteData$Loading}),
				session: session
			};
		} else {
			return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$View$LibraryTiles$initialModelCmd = function (session1) {
	var _v0 = A2(
		$author$project$View$LibraryTiles$doSearch,
		$author$project$View$LibraryTiles$intialConfig(
			$author$project$Session$getUser(session1)),
		session1);
	var model = _v0.model;
	var session = _v0.session;
	var cmd = _v0.cmd;
	return _Utils_Tuple2(model, cmd);
};
var $author$project$View$LibraryTiles$setSearch = F2(
	function (_v0, config) {
		var title = _v0.title;
		var authors = _v0.authors;
		var location = _v0.location;
		var owner = _v0.owner;
		var checkStatus = _v0.checkStatus;
		var checkoutUser = _v0.checkoutUser;
		return _Utils_update(
			config,
			{searchAuthors: authors, searchCheckStatus: checkStatus, searchCheckoutUser: checkoutUser, searchLocation: location, searchOwner: owner, searchTitle: title});
	});
var $author$project$View$LibraryTiles$setShowSearch = F2(
	function (_v0, config) {
		var title = _v0.title;
		var authors = _v0.authors;
		var location = _v0.location;
		var owner = _v0.owner;
		var checkStatus = _v0.checkStatus;
		var checkoutUser = _v0.checkoutUser;
		return _Utils_update(
			config,
			{showSearchAuthors: authors, showSearchCheckStatus: checkStatus, showSearchCheckoutUser: checkoutUser, showSearchLocation: location, showSearchOwner: owner, showSearchTitle: title});
	});
var $author$project$BookEditor$initialModelCmd = function (session1) {
	var userEmail = $author$project$Session$getUser(session1);
	var model = $author$project$BookEditor$initialModel(
		$author$project$Session$getUser(session1));
	var _v0 = $author$project$View$LibraryTiles$initialModelCmd(session1);
	var booktiles = _v0.a;
	var cmd = _v0.b;
	var model1 = _Utils_update(
		model,
		{
			booktiles: A2(
				$author$project$View$LibraryTiles$setSearch,
				{authors: '', checkStatus: '', checkoutUser: '', location: '', owner: userEmail, title: ''},
				A2(
					$author$project$View$LibraryTiles$setShowSearch,
					{authors: true, checkStatus: false, checkoutUser: false, location: true, owner: false, title: true},
					booktiles))
		});
	return _Utils_Tuple2(
		model1,
		A2($elm$core$Platform$Cmd$map, $author$project$BookEditor$LibraryTilesMsg, cmd));
};
var $author$project$Checkin$LibraryTilesMsg = function (a) {
	return {$: 'LibraryTilesMsg', a: a};
};
var $author$project$Checkin$DoCancel = {$: 'DoCancel'};
var $author$project$Checkin$DoCheckout = {$: 'DoCheckout'};
var $author$project$Checkin$DoNext = {$: 'DoNext'};
var $author$project$Checkin$DoPrevious = {$: 'DoPrevious'};
var $author$project$Checkin$Tiles = {$: 'Tiles'};
var $author$project$Checkin$initialModel = function (userEmail) {
	return {
		bookView: $author$project$Checkin$Tiles,
		bookdetails: {
			doAction1: {disabled: false, msg: $author$project$Checkin$DoCheckout, text: 'Checkout', visible: true},
			doAction2: {disabled: false, msg: $author$project$Checkin$DoCheckout, text: '', visible: false},
			doCancel: $author$project$Checkin$DoCancel,
			doNext: $author$project$Checkin$DoNext,
			doPrevious: $author$project$Checkin$DoPrevious,
			hasNext: false,
			hasPrevious: false,
			libraryBook: $author$project$Domain$LibraryBook$emptyLibrarybook,
			maybeCheckout: $elm$core$Maybe$Nothing,
			remarks: '',
			userEmail: userEmail
		},
		booktiles: $author$project$View$LibraryTiles$intialConfig(userEmail),
		checkouts: $krisajenkins$remotedata$RemoteData$NotAsked,
		librarybooks: $krisajenkins$remotedata$RemoteData$NotAsked
	};
};
var $author$project$Checkin$initialModelCmd = function (session1) {
	var userEmail = $author$project$Session$getUser(session1);
	var model = $author$project$Checkin$initialModel(
		$author$project$Session$getUser(session1));
	var _v0 = $author$project$View$LibraryTiles$initialModelCmd(session1);
	var booktiles = _v0.a;
	var cmd = _v0.b;
	var model1 = _Utils_update(
		model,
		{
			booktiles: A2(
				$author$project$View$LibraryTiles$setSearch,
				{authors: '', checkStatus: 'checkedout', checkoutUser: userEmail, location: '', owner: '', title: ''},
				A2(
					$author$project$View$LibraryTiles$setShowSearch,
					{authors: false, checkStatus: false, checkoutUser: false, location: false, owner: false, title: false},
					booktiles))
		});
	return _Utils_Tuple2(
		model1,
		A2($elm$core$Platform$Cmd$map, $author$project$Checkin$LibraryTilesMsg, cmd));
};
var $author$project$Library$LibraryTilesMsg = function (a) {
	return {$: 'LibraryTilesMsg', a: a};
};
var $author$project$Library$DoCancel = {$: 'DoCancel'};
var $author$project$Library$DoCheckout = {$: 'DoCheckout'};
var $author$project$Library$DoNext = {$: 'DoNext'};
var $author$project$Library$DoPrevious = {$: 'DoPrevious'};
var $author$project$Library$Tiles = {$: 'Tiles'};
var $author$project$Library$initialModel = function (userEmail) {
	return {
		bookView: $author$project$Library$Tiles,
		bookdetails: {
			doAction1: {disabled: false, msg: $author$project$Library$DoCheckout, text: 'Checkout', visible: true},
			doAction2: {disabled: false, msg: $author$project$Library$DoCheckout, text: 'Checkout', visible: false},
			doCancel: $author$project$Library$DoCancel,
			doNext: $author$project$Library$DoNext,
			doPrevious: $author$project$Library$DoPrevious,
			hasNext: false,
			hasPrevious: false,
			libraryBook: $author$project$Domain$LibraryBook$emptyLibrarybook,
			maybeCheckout: $elm$core$Maybe$Nothing,
			remarks: '',
			userEmail: userEmail
		},
		booktiles: $author$project$View$LibraryTiles$intialConfig(userEmail),
		checkouts: $krisajenkins$remotedata$RemoteData$NotAsked,
		librarybooks: $krisajenkins$remotedata$RemoteData$NotAsked
	};
};
var $author$project$Library$initialModelCmd = function (session1) {
	var model = $author$project$Library$initialModel(
		$author$project$Session$getUser(session1));
	var _v0 = $author$project$View$LibraryTiles$initialModelCmd(session1);
	var booktiles = _v0.a;
	var cmd = _v0.b;
	var model1 = _Utils_update(
		model,
		{
			booktiles: A2(
				$author$project$View$LibraryTiles$setShowSearch,
				{authors: true, checkStatus: true, checkoutUser: true, location: true, owner: true, title: true},
				booktiles)
		});
	return _Utils_Tuple2(
		model1,
		A2($elm$core$Platform$Cmd$map, $author$project$Library$LibraryTilesMsg, cmd));
};
var $author$project$Main$toSession = function (model) {
	switch (model.$) {
		case 'BookSelector':
			var session = model.b;
			return session;
		case 'Library':
			var session = model.b;
			return session;
		case 'Checkin':
			var session = model.b;
			return session;
		case 'BookEditor':
			var session = model.b;
			return session;
		case 'Login':
			var session = model.a;
			return session;
		case 'Logout':
			var session = model.a;
			return session;
		default:
			var session = model.a;
			return session;
	}
};
var $author$project$Main$toModel = F3(
	function (model, cmd, session) {
		var _v0 = _Utils_Tuple2(session.page, model);
		switch (_v0.a.$) {
			case 'WelcomePage':
				var _v1 = _v0.a;
				return _Utils_Tuple2(
					$author$project$Main$Welcome(session),
					cmd);
			case 'LoginPage':
				var _v10 = _v0.a;
				var model1 = _v0.b;
				return _Utils_Tuple2(
					$author$project$Main$Login(
						$author$project$Main$toSession(model1)),
					cmd);
			case 'LogoutPage':
				var _v11 = _v0.a;
				var model1 = _v0.b;
				return _Utils_Tuple2(
					$author$project$Main$Logout(
						$author$project$Main$toSession(model1)),
					cmd);
			case 'BookSelectorPage':
				if (_v0.b.$ === 'BookSelector') {
					var _v2 = _v0.a;
					var _v3 = _v0.b;
					var bookSelectorModel = _v3.a;
					var session1 = _v3.b;
					return _Utils_Tuple2(
						A2($author$project$Main$BookSelector, bookSelectorModel, session),
						cmd);
				} else {
					var _v12 = _v0.a;
					var model1 = _v0.b;
					return _Utils_Tuple2(
						A2($author$project$Main$BookSelector, $author$project$BookSelector$initialModel, session),
						cmd);
				}
			case 'LibraryPage':
				if (_v0.b.$ === 'Library') {
					var _v4 = _v0.a;
					var _v5 = _v0.b;
					var libraryModel = _v5.a;
					var session1 = _v5.b;
					return _Utils_Tuple2(
						A2($author$project$Main$Library, libraryModel, session),
						cmd);
				} else {
					var _v13 = _v0.a;
					var model1 = _v0.b;
					var _v14 = $author$project$Library$initialModelCmd(session);
					var libraryModel = _v14.a;
					var initialLibraryCmd = _v14.b;
					return _Utils_Tuple2(
						A2($author$project$Main$Library, libraryModel, session),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									cmd,
									A2($elm$core$Platform$Cmd$map, $author$project$Main$LibraryMsg, initialLibraryCmd)
								])));
				}
			case 'CheckinPage':
				if (_v0.b.$ === 'Checkin') {
					var _v6 = _v0.a;
					var _v7 = _v0.b;
					var checkinModel = _v7.a;
					var session1 = _v7.b;
					return _Utils_Tuple2(
						A2($author$project$Main$Checkin, checkinModel, session),
						cmd);
				} else {
					var _v15 = _v0.a;
					var model1 = _v0.b;
					var _v16 = $author$project$Checkin$initialModelCmd(session);
					var checkinModel = _v16.a;
					var initialCheckinCmd = _v16.b;
					return _Utils_Tuple2(
						A2($author$project$Main$Checkin, checkinModel, session),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									cmd,
									A2($elm$core$Platform$Cmd$map, $author$project$Main$CheckinMsg, initialCheckinCmd)
								])));
				}
			default:
				if (_v0.b.$ === 'BookEditor') {
					var _v8 = _v0.a;
					var _v9 = _v0.b;
					var bookEditorModel = _v9.a;
					var session1 = _v9.b;
					return _Utils_Tuple2(
						A2($author$project$Main$BookEditor, bookEditorModel, session),
						cmd);
				} else {
					var _v17 = _v0.a;
					var model1 = _v0.b;
					var _v18 = $author$project$BookEditor$initialModelCmd(session);
					var bookEditorModel = _v18.a;
					var initialBookEditorCmd = _v18.b;
					return _Utils_Tuple2(
						A2($author$project$Main$BookEditor, bookEditorModel, session),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									cmd,
									A2($elm$core$Platform$Cmd$map, $author$project$Main$BookEditorMsg, initialBookEditorCmd)
								])));
				}
		}
	});
var $author$project$BookEditor$LibraryEditMsg = function (a) {
	return {$: 'LibraryEditMsg', a: a};
};
var $author$project$BookEditor$Details = function (a) {
	return {$: 'Details', a: a};
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $krisajenkins$remotedata$RemoteData$andMap = F2(
	function (wrappedValue, wrappedFunction) {
		var _v0 = _Utils_Tuple2(wrappedFunction, wrappedValue);
		_v0$2:
		while (true) {
			_v0$3:
			while (true) {
				_v0$4:
				while (true) {
					_v0$5:
					while (true) {
						switch (_v0.a.$) {
							case 'Success':
								switch (_v0.b.$) {
									case 'Success':
										var f = _v0.a.a;
										var value = _v0.b.a;
										return $krisajenkins$remotedata$RemoteData$Success(
											f(value));
									case 'Failure':
										break _v0$2;
									case 'Loading':
										break _v0$4;
									default:
										var _v4 = _v0.b;
										return $krisajenkins$remotedata$RemoteData$NotAsked;
								}
							case 'Failure':
								var error = _v0.a.a;
								return $krisajenkins$remotedata$RemoteData$Failure(error);
							case 'Loading':
								switch (_v0.b.$) {
									case 'Failure':
										break _v0$2;
									case 'Loading':
										break _v0$3;
									case 'NotAsked':
										break _v0$3;
									default:
										break _v0$3;
								}
							default:
								switch (_v0.b.$) {
									case 'Failure':
										break _v0$2;
									case 'Loading':
										break _v0$4;
									case 'NotAsked':
										break _v0$5;
									default:
										break _v0$5;
								}
						}
					}
					var _v3 = _v0.a;
					return $krisajenkins$remotedata$RemoteData$NotAsked;
				}
				var _v2 = _v0.b;
				return $krisajenkins$remotedata$RemoteData$Loading;
			}
			var _v1 = _v0.a;
			return $krisajenkins$remotedata$RemoteData$Loading;
		}
		var error = _v0.b.a;
		return $krisajenkins$remotedata$RemoteData$Failure(error);
	});
var $krisajenkins$remotedata$RemoteData$map = F2(
	function (f, data) {
		switch (data.$) {
			case 'Success':
				var value = data.a;
				return $krisajenkins$remotedata$RemoteData$Success(
					f(value));
			case 'Loading':
				return $krisajenkins$remotedata$RemoteData$Loading;
			case 'NotAsked':
				return $krisajenkins$remotedata$RemoteData$NotAsked;
			default:
				var error = data.a;
				return $krisajenkins$remotedata$RemoteData$Failure(error);
		}
	});
var $author$project$View$LibraryTiles$merge2RemoteDatas = F2(
	function (a, b) {
		return A2(
			$krisajenkins$remotedata$RemoteData$andMap,
			b,
			A2(
				$krisajenkins$remotedata$RemoteData$map,
				F2(
					function (a1, b1) {
						return _Utils_Tuple2(a1, b1);
					}),
				a));
	});
var $author$project$BookEditor$doIndex = F2(
	function (model, index) {
		var books_checkouts = A2($author$project$View$LibraryTiles$merge2RemoteDatas, model.booktiles.books, model.booktiles.checkoutsDistributed);
		if (books_checkouts.$ === 'Success') {
			var _v1 = books_checkouts.a;
			var actualBooks = _v1.a;
			var actualCheckouts = _v1.b;
			var maybeCheckout = A2($elm$core$Array$get, index, actualCheckouts);
			var maybeCheckout1 = function () {
				if (maybeCheckout.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var checkout = maybeCheckout.a;
					return checkout;
				}
			}();
			var libraryBook = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Domain$LibraryBook$emptyLibrarybook,
				A2($elm$core$Array$get, index, actualBooks));
			var bookdetails = model.bookdetails;
			var bookdetails1 = _Utils_update(
				bookdetails,
				{
					hasNext: _Utils_cmp(
						index + 1,
						$elm$core$Array$length(actualBooks)) < 0,
					hasPrevious: index > 0,
					libraryBook: libraryBook,
					maybeCheckout: maybeCheckout1
				});
			return _Utils_update(
				model,
				{
					bookView: $author$project$BookEditor$Details(index),
					bookdetails: bookdetails1
				});
		} else {
			return model;
		}
	});
var $author$project$View$LibraryEdit$DoInserted = function (a) {
	return {$: 'DoInserted', a: a};
};
var $author$project$View$LibraryEdit$DoUpdated = function (a) {
	return {$: 'DoUpdated', a: a};
};
var $author$project$Utils$buildErrorMessage = function (httpError) {
	switch (httpError.$) {
		case 'BadUrl':
			var message = httpError.a;
			return message;
		case 'Timeout':
			return 'Server is taking too long to respond. Please try again later.';
		case 'NetworkError':
			return 'Unable to reach server.';
		case 'BadStatus':
			var statusCode = httpError.a;
			return 'Request failed with status code: ' + $elm$core$String$fromInt(statusCode);
		default:
			var message = httpError.a;
			return message;
	}
};
var $author$project$Session$Error = function (a) {
	return {$: 'Error', a: a};
};
var $author$project$Session$fail = F2(
	function (session, message) {
		return _Utils_update(
			session,
			{
				message: $author$project$Session$Error(message),
				page: $author$project$Session$WelcomePage
			});
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Domain$LibraryBook$newLibraryBookEncoder = function (libraryBook) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'title',
				$elm$json$Json$Encode$string(libraryBook.title)),
				_Utils_Tuple2(
				'authors',
				$elm$json$Json$Encode$string(libraryBook.authors)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(libraryBook.description)),
				_Utils_Tuple2(
				'publishedDate',
				$elm$json$Json$Encode$string(libraryBook.publishedDate)),
				_Utils_Tuple2(
				'language',
				$elm$json$Json$Encode$string(libraryBook.language)),
				_Utils_Tuple2(
				'smallThumbnail',
				$elm$json$Json$Encode$string(libraryBook.smallThumbnail)),
				_Utils_Tuple2(
				'thumbnail',
				$elm$json$Json$Encode$string(libraryBook.thumbnail)),
				_Utils_Tuple2(
				'owner',
				$elm$json$Json$Encode$string(libraryBook.owner)),
				_Utils_Tuple2(
				'location',
				$elm$json$Json$Encode$string(libraryBook.location))
			]));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{body: r.body, expect: r.expect, headers: _List_Nil, method: 'POST', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 'Header', a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $truqu$elm_oauth2$OAuth$useToken = function (token) {
	return $elm$core$List$cons(
		A2(
			$elm$http$Http$header,
			'Authorization',
			$truqu$elm_oauth2$OAuth$tokenToString(token)));
};
var $author$project$Domain$LibraryBook$insert = F4(
	function (msg, session, token, libraryBook) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = $author$project$Domain$LibraryBook$libraryApiBooksUrl(session) + ('?access_token=' + puretoken);
		var printheaders = $truqu$elm_oauth2$OAuth$tokenToString(token);
		var jsonBody = $author$project$Domain$LibraryBook$newLibraryBookEncoder(libraryBook);
		var headers = A2($truqu$elm_oauth2$OAuth$useToken, token, _List_Nil);
		return $elm$http$Http$post(
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Domain$LibraryBook$newLibraryBookEncoder(libraryBook)),
				expect: A2($elm$http$Http$expectJson, msg, $author$project$Domain$LibraryBook$libraryBookDecoder),
				url: requestUrl
			});
	});
var $author$project$Domain$LibraryBook$setAuthors = F2(
	function (authors, libraryBook) {
		return _Utils_update(
			libraryBook,
			{authors: authors});
	});
var $author$project$Domain$LibraryBook$setDescription = F2(
	function (description, libraryBook) {
		return _Utils_update(
			libraryBook,
			{description: description});
	});
var $author$project$Domain$LibraryBook$setLanguage = F2(
	function (language, libraryBook) {
		return _Utils_update(
			libraryBook,
			{language: language});
	});
var $author$project$Domain$LibraryBook$setLocation = F2(
	function (location, libraryBook) {
		return _Utils_update(
			libraryBook,
			{location: location});
	});
var $author$project$Domain$LibraryBook$setOwner = F2(
	function (owner, libraryBook) {
		return _Utils_update(
			libraryBook,
			{owner: owner});
	});
var $author$project$Domain$LibraryBook$setPublishedDate = F2(
	function (publishedDate, libraryBook) {
		return _Utils_update(
			libraryBook,
			{publishedDate: publishedDate});
	});
var $author$project$Domain$LibraryBook$setTitle = F2(
	function (title, libraryBook) {
		return _Utils_update(
			libraryBook,
			{title: title});
	});
var $author$project$Session$Succeeded = function (a) {
	return {$: 'Succeeded', a: a};
};
var $author$project$Session$succeed = F2(
	function (session, message) {
		return _Utils_update(
			session,
			{
				message: $author$project$Session$Succeeded(message),
				page: $author$project$Session$WelcomePage
			});
	});
var $elm$http$Http$expectString = function (toMsg) {
	return A2(
		$elm$http$Http$expectStringResponse,
		toMsg,
		$elm$http$Http$resolve($elm$core$Result$Ok));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Domain$LibraryBook$libraryBookEncoder = function (libraryBook) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(libraryBook.id)),
				_Utils_Tuple2(
				'title',
				$elm$json$Json$Encode$string(libraryBook.title)),
				_Utils_Tuple2(
				'authors',
				$elm$json$Json$Encode$string(libraryBook.authors)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(libraryBook.description)),
				_Utils_Tuple2(
				'publishedDate',
				$elm$json$Json$Encode$string(libraryBook.publishedDate)),
				_Utils_Tuple2(
				'language',
				$elm$json$Json$Encode$string(libraryBook.language)),
				_Utils_Tuple2(
				'smallThumbnail',
				$elm$json$Json$Encode$string(libraryBook.smallThumbnail)),
				_Utils_Tuple2(
				'thumbnail',
				$elm$json$Json$Encode$string(libraryBook.thumbnail)),
				_Utils_Tuple2(
				'owner',
				$elm$json$Json$Encode$string(libraryBook.owner)),
				_Utils_Tuple2(
				'location',
				$elm$json$Json$Encode$string(libraryBook.location))
			]));
};
var $author$project$Domain$LibraryBook$update = F4(
	function (msg, session, token, libraryBook) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = $author$project$Domain$LibraryBook$libraryApiBooksUrl(session) + ('/' + ($elm$core$String$fromInt(libraryBook.id) + ('?access_token=' + puretoken)));
		var printheaders = $truqu$elm_oauth2$OAuth$tokenToString(token);
		var jsonBody = $author$project$Domain$LibraryBook$libraryBookEncoder(libraryBook);
		var headers = A2($truqu$elm_oauth2$OAuth$useToken, token, _List_Nil);
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$jsonBody(jsonBody),
				expect: $elm$http$Http$expectString(msg),
				headers: headers,
				method: 'put',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: requestUrl
			});
	});
var $author$project$View$LibraryEdit$update = F3(
	function (msg, model, session) {
		switch (msg.$) {
			case 'UpdateTitle':
				var title = msg.a;
				var book = model.book;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							book: A2($author$project$Domain$LibraryBook$setTitle, title, book)
						}),
					session: session
				};
			case 'UpdateAuthors':
				var authors = msg.a;
				var book = model.book;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							book: A2($author$project$Domain$LibraryBook$setAuthors, authors, book)
						}),
					session: session
				};
			case 'UpdateDescription':
				var description = msg.a;
				var book = model.book;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							book: A2($author$project$Domain$LibraryBook$setDescription, description, book)
						}),
					session: session
				};
			case 'UpdateLanguage':
				var language = msg.a;
				var book = model.book;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							book: A2($author$project$Domain$LibraryBook$setLanguage, language, book)
						}),
					session: session
				};
			case 'UpdatePublishedDate':
				var publishedDate = msg.a;
				var book = model.book;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							book: A2($author$project$Domain$LibraryBook$setPublishedDate, publishedDate, book)
						}),
					session: session
				};
			case 'UpdateOwner':
				var owner = msg.a;
				var book = model.book;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							book: A2($author$project$Domain$LibraryBook$setOwner, owner, book)
						}),
					session: session
				};
			case 'UpdateLocation':
				var location = msg.a;
				var book = model.book;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							book: A2($author$project$Domain$LibraryBook$setLocation, location, book)
						}),
					session: session
				};
			case 'DoInsert':
				var _v1 = session.token;
				if (_v1.$ === 'Just') {
					var token = _v1.a;
					var libraryAppApiCmd = A4($author$project$Domain$LibraryBook$insert, $author$project$View$LibraryEdit$DoInserted, session, token, model.book);
					return {cmd: libraryAppApiCmd, model: model, session: session};
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			case 'DoUpdate':
				var _v2 = session.token;
				if (_v2.$ === 'Just') {
					var token = _v2.a;
					var libraryAppApiCmd = A4($author$project$Domain$LibraryBook$update, $author$project$View$LibraryEdit$DoUpdated, session, token, model.book);
					return {cmd: libraryAppApiCmd, model: model, session: session};
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			case 'DoInserted':
				if (msg.a.$ === 'Ok') {
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.book.title + '\" has been added to the library!'))
					};
				} else {
					var err = msg.a.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book \"' + (model.book.title + ('\" has NOT been added to the library : ' + $author$project$Utils$buildErrorMessage(err))))
					};
				}
			case 'DoUpdated':
				if (msg.a.$ === 'Ok') {
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.book.title + '\" has been updated in the library!'))
					};
				} else {
					var err = msg.a.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book \"' + (model.book.title + ('\" has NOT been updated in the library : ' + $author$project$Utils$buildErrorMessage(err))))
					};
				}
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$View$LibraryTiles$distributeCheckoutsLibrarybook = F2(
	function (actualCheckouts, librarybook) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (checkout) {
					return _Utils_eq(checkout.bookId, librarybook.id);
				},
				actualCheckouts));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$View$LibraryTiles$distributeCheckouts = F2(
	function (librarybooks, checkouts) {
		var _v0 = _Utils_Tuple2(librarybooks, checkouts);
		if ((_v0.a.$ === 'Success') && (_v0.b.$ === 'Success')) {
			var actualLibraryBooks = _v0.a.a;
			var actualCheckouts = _v0.b.a;
			var actualCheckoutsList = $elm$core$Array$toList(actualCheckouts);
			return $krisajenkins$remotedata$RemoteData$Success(
				$elm$core$Array$fromList(
					A2(
						$elm$core$List$map,
						$author$project$View$LibraryTiles$distributeCheckoutsLibrarybook(actualCheckoutsList),
						$elm$core$Array$toList(actualLibraryBooks))));
		} else {
			return $krisajenkins$remotedata$RemoteData$NotAsked;
		}
	});
var $author$project$View$LibraryTiles$setCheckStatus = F2(
	function (status, config) {
		return _Utils_update(
			config,
			{searchCheckStatus: status});
	});
var $author$project$View$LibraryTiles$setCheckoutUser = F2(
	function (user, config) {
		return _Utils_update(
			config,
			{searchCheckoutUser: user});
	});
var $author$project$View$LibraryTiles$setSearchAuthors = F2(
	function (authors, config) {
		return _Utils_update(
			config,
			{searchAuthors: authors});
	});
var $author$project$View$LibraryTiles$setSearchLocation = F2(
	function (location, config) {
		return _Utils_update(
			config,
			{searchLocation: location});
	});
var $author$project$View$LibraryTiles$setSearchOwner = F2(
	function (owner, config) {
		return _Utils_update(
			config,
			{searchOwner: owner});
	});
var $author$project$View$LibraryTiles$setSearchTitle = F2(
	function (title, config) {
		return _Utils_update(
			config,
			{searchTitle: title});
	});
var $author$project$View$LibraryTiles$update = F3(
	function (msg, model, session) {
		switch (msg.$) {
			case 'UpdateSearchTitle':
				var title = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$View$LibraryTiles$setSearchTitle, title, model),
					session: session
				};
			case 'UpdateSearchAuthors':
				var authors = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$View$LibraryTiles$setSearchAuthors, authors, model),
					session: session
				};
			case 'UpdateSearchLocation':
				var location = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$View$LibraryTiles$setSearchLocation, location, model),
					session: session
				};
			case 'UpdateSearchOwner':
				var owner = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$View$LibraryTiles$setSearchOwner, owner, model),
					session: session
				};
			case 'UpdateSearchCheckStatus':
				var status = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$View$LibraryTiles$setCheckStatus, status, model),
					session: session
				};
			case 'UpdateSearchCheckoutUser':
				var user = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$View$LibraryTiles$setCheckoutUser, user, model),
					session: session
				};
			case 'DoSearch':
				return A2($author$project$View$LibraryTiles$doSearch, model, session);
			case 'DoBooksReceived':
				var response = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							books: response,
							checkoutsDistributed: A2($author$project$View$LibraryTiles$distributeCheckouts, response, model.checkouts)
						}),
					session: session
				};
			case 'DoCheckoutsReceived':
				var response = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							checkouts: response,
							checkoutsDistributed: A2($author$project$View$LibraryTiles$distributeCheckouts, model.books, response)
						}),
					session: session
				};
			default:
				var index = msg.a;
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$BookEditor$DoDeleted = function (a) {
	return {$: 'DoDeleted', a: a};
};
var $author$project$Domain$LibraryBook$delete = F4(
	function (msg, session, token, libraryBook) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = $author$project$Domain$LibraryBook$libraryApiBooksUrl(session) + ('/' + ($elm$core$String$fromInt(libraryBook.id) + ('?access_token=' + puretoken)));
		var printheaders = $truqu$elm_oauth2$OAuth$tokenToString(token);
		var jsonBody = $author$project$Domain$LibraryBook$newLibraryBookEncoder(libraryBook);
		var headers = A2($truqu$elm_oauth2$OAuth$useToken, token, _List_Nil);
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$jsonBody(
					$author$project$Domain$LibraryBook$newLibraryBookEncoder(libraryBook)),
				expect: $elm$http$Http$expectString(msg),
				headers: headers,
				method: 'delete',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: requestUrl
			});
	});
var $author$project$BookEditor$doActionCancel = F2(
	function (model, index) {
		return _Utils_update(
			model,
			{
				bookView: $author$project$BookEditor$Details(index)
			});
	});
var $author$project$BookEditor$DoActionDone = function (a) {
	return {$: 'DoActionDone', a: a};
};
var $author$project$BookEditor$doActionDone = F2(
	function (model, index) {
		return _Utils_update(
			model,
			{
				bookView: $author$project$BookEditor$DoActionDone(index)
			});
	});
var $author$project$BookEditor$updateConfirm = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$BookEditor$doActionCancel,
						A2($author$project$BookEditor$doIndex, model, index),
						index),
					session: session
				};
			case 'DoDeleteConfirm':
				var _v1 = session.token;
				if (_v1.$ === 'Just') {
					var token = _v1.a;
					return {
						cmd: A4($author$project$Domain$LibraryBook$delete, $author$project$BookEditor$DoDeleted, session, token, model.bookdetails.libraryBook),
						model: A2($author$project$BookEditor$doActionDone, model, index),
						session: session
					};
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$BookEditor$ConfirmDelete = function (a) {
	return {$: 'ConfirmDelete', a: a};
};
var $author$project$BookEditor$Update = function (a) {
	return {$: 'Update', a: a};
};
var $author$project$BookEditor$doAction = F2(
	function (model, index) {
		var bookdetails = model.bookdetails;
		var bookdetails1 = _Utils_update(
			bookdetails,
			{hasNext: false, hasPrevious: false});
		return _Utils_update(
			model,
			{bookdetails: bookdetails1});
	});
var $author$project$BookEditor$setBookView = F2(
	function (bookView, model) {
		return _Utils_update(
			model,
			{bookView: bookView});
	});
var $author$project$BookEditor$setEditBook = F2(
	function (book, model) {
		var bookedit = model.bookedit;
		return _Utils_update(
			model,
			{
				bookedit: _Utils_update(
					bookedit,
					{book: book})
			});
	});
var $author$project$BookEditor$updateDetails = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoPrevious':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$BookEditor$doIndex, model, index - 1),
					session: session
				};
			case 'DoNext':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$BookEditor$doIndex, model, index + 1),
					session: session
				};
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{bookView: $author$project$BookEditor$Tiles}),
					session: session
				};
			case 'DoDelete':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$BookEditor$setBookView,
						$author$project$BookEditor$ConfirmDelete(index),
						A2($author$project$BookEditor$doAction, model, index)),
					session: session
				};
			case 'DoUpdate':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$BookEditor$setEditBook,
						model.bookdetails.libraryBook,
						A2(
							$author$project$BookEditor$setBookView,
							$author$project$BookEditor$Update(index),
							A2($author$project$BookEditor$doAction, model, index))),
					session: session
				};
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$BookEditor$updateDoActionDone = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoDeleted':
				if (msg.a.$ === 'Ok') {
					var result = msg.a.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.bookdetails.libraryBook.title + '\" has been deleted from the library!'))
					};
				} else {
					var error = msg.a.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book has NOT been deleted : ' + $author$project$Utils$buildErrorMessage(error))
					};
				}
			case 'DoUpdated':
				if (msg.a.$ === 'Ok') {
					var result = msg.a.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.bookdetails.libraryBook.title + '\" has been updated!'))
					};
				} else {
					var error = msg.a.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book has NOT been updated : ' + $author$project$Utils$buildErrorMessage(error))
					};
				}
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$BookEditor$update = F3(
	function (msg1, model1, session1) {
		var _v0 = model1.bookView;
		switch (_v0.$) {
			case 'Tiles':
				if (msg1.$ === 'LibraryTilesMsg') {
					if (msg1.a.$ === 'DoDetail') {
						var index = msg1.a.a;
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: A2($author$project$BookEditor$doIndex, model1, index),
							session: session1
						};
					} else {
						var subMsg = msg1.a;
						var _v2 = A3($author$project$View$LibraryTiles$update, subMsg, model1.booktiles, session1);
						var model = _v2.model;
						var session = _v2.session;
						var cmd = _v2.cmd;
						var model2 = _Utils_update(
							model1,
							{booktiles: model});
						return {
							cmd: A2($elm$core$Platform$Cmd$map, $author$project$BookEditor$LibraryTilesMsg, cmd),
							model: model2,
							session: session
						};
					}
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model1, session: session1};
				}
			case 'Details':
				var index = _v0.a;
				return A4($author$project$BookEditor$updateDetails, msg1, model1, session1, index);
			case 'Update':
				var index = _v0.a;
				if (msg1.$ === 'LibraryEditMsg') {
					if (msg1.a.$ === 'DoCancel') {
						var _v4 = msg1.a;
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: A2($author$project$BookEditor$doIndex, model1, index),
							session: session1
						};
					} else {
						var subMsg = msg1.a;
						var _v5 = A3($author$project$View$LibraryEdit$update, subMsg, model1.bookedit, session1);
						var model = _v5.model;
						var session = _v5.session;
						var cmd = _v5.cmd;
						var model2 = _Utils_update(
							model1,
							{bookedit: model});
						return {
							cmd: A2($elm$core$Platform$Cmd$map, $author$project$BookEditor$LibraryEditMsg, cmd),
							model: model2,
							session: session
						};
					}
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model1, session: session1};
				}
			case 'ConfirmDelete':
				var index = _v0.a;
				return A4($author$project$BookEditor$updateConfirm, msg1, model1, session1, index);
			case 'ConfirmUpdate':
				var index = _v0.a;
				return A4($author$project$BookEditor$updateConfirm, msg1, model1, session1, index);
			default:
				var index = _v0.a;
				return A4($author$project$BookEditor$updateDoActionDone, msg1, model1, session1, index);
		}
	});
var $author$project$BookSelector$Details = function (a) {
	return {$: 'Details', a: a};
};
var $author$project$BookSelector$LibraryEditMsg = function (a) {
	return {$: 'LibraryEditMsg', a: a};
};
var $elm$core$Debug$log = _Debug_log;
var $author$project$BookSelector$DetailsEdit = function (a) {
	return {$: 'DetailsEdit', a: a};
};
var $author$project$BookSelector$doIndex = F2(
	function (model, index) {
		var _v0 = model.booktiles.books;
		if (_v0.$ === 'Success') {
			var actualBooks = _v0.a;
			var maybeBook = A2($elm$core$Array$get, index, actualBooks);
			var doActionDisabled = false;
			var bookdetails = model.bookdetails;
			var actionHtml = _List_Nil;
			var bookdetails1 = _Utils_update(
				bookdetails,
				{
					actionHtml: actionHtml,
					doActionDisabled: doActionDisabled,
					hasNext: _Utils_cmp(
						index + 1,
						$elm$core$Array$length(actualBooks)) < 0,
					hasPrevious: index > 0,
					maybeBook: maybeBook
				});
			return _Utils_update(
				model,
				{
					bookView: $author$project$BookSelector$Details(index),
					bookdetails: bookdetails1
				});
		} else {
			return model;
		}
	});
var $author$project$Domain$LibraryBook$searchbook2librarybook = function (searchbook) {
	return {authors: searchbook.authors, description: searchbook.description, id: 0, language: searchbook.language, location: '', owner: '', publishedDate: searchbook.publishedDate, smallThumbnail: searchbook.smallThumbnail, thumbnail: searchbook.thumbnail, title: searchbook.title};
};
var $author$project$BookSelector$initialBookDetailsEdit = F2(
	function (searchBook, user) {
		return {
			book: function () {
				if (searchBook.$ === 'Just') {
					var actualSearchBook = searchBook.a;
					return A2(
						$author$project$Domain$LibraryBook$setOwner,
						user,
						$author$project$Domain$LibraryBook$searchbook2librarybook(actualSearchBook));
				} else {
					return $author$project$Domain$LibraryBook$emptyLibrarybook;
				}
			}(),
			doInsert: {visible: true},
			doUpdate: {visible: false}
		};
	});
var $author$project$BookSelector$updateDetails = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoPrevious':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$BookSelector$doIndex, model, index - 1),
					session: session
				};
			case 'DoNext':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$BookSelector$doIndex, model, index + 1),
					session: session
				};
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{bookView: $author$project$BookSelector$Tiles}),
					session: session
				};
			case 'DoAddToLibrary':
				var searchBook = model.bookdetails.maybeBook;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{
							bookDetailsEdit: A2(
								$author$project$BookSelector$initialBookDetailsEdit,
								searchBook,
								$author$project$Session$getUser(session)),
							bookView: $author$project$BookSelector$DetailsEdit(index)
						}),
					session: session
				};
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$BookSelector$DoBooksReceived = function (a) {
	return {$: 'DoBooksReceived', a: a};
};
var $author$project$Domain$SearchBook$baseUrl = 'https://www.googleapis.com/books/v1/volumes';
var $author$project$Domain$SearchBook$SearchBook = F7(
	function (title, authors, description, publishedDate, language, smallThumbnail, thumbnail) {
		return {authors: authors, description: description, language: language, publishedDate: publishedDate, smallThumbnail: smallThumbnail, thumbnail: thumbnail, title: title};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Domain$SearchBook$authorListDecoder = A2(
	$elm$json$Json$Decode$map,
	$elm$core$String$join(', '),
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string));
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt = F4(
	function (path, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$at, path, valDecoder),
			decoder);
	});
var $author$project$Domain$SearchBook$searchbookDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
	_List_fromArray(
		['volumeInfo', 'imageLinks', 'thumbnail']),
	$elm$json$Json$Decode$string,
	'',
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
		_List_fromArray(
			['volumeInfo', 'imageLinks', 'smallThumbnail']),
		$elm$json$Json$Decode$string,
		'',
		A4(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
			_List_fromArray(
				['volumeInfo', 'language']),
			$elm$json$Json$Decode$string,
			'',
			A4(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
				_List_fromArray(
					['volumeInfo', 'publishedDate']),
				$elm$json$Json$Decode$string,
				'',
				A4(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
					_List_fromArray(
						['volumeInfo', 'description']),
					$elm$json$Json$Decode$string,
					'',
					A4(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalAt,
						_List_fromArray(
							['volumeInfo', 'authors']),
						$author$project$Domain$SearchBook$authorListDecoder,
						'',
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
							_List_fromArray(
								['volumeInfo', 'title']),
							$elm$json$Json$Decode$string,
							$elm$json$Json$Decode$succeed($author$project$Domain$SearchBook$SearchBook))))))));
var $author$project$Domain$SearchBook$searchbooksDecoder = A2(
	$elm$json$Json$Decode$field,
	'items',
	$elm$json$Json$Decode$array($author$project$Domain$SearchBook$searchbookDecoder));
var $author$project$Domain$SearchBook$getBooks = F2(
	function (msg, _v0) {
		var searchString = _v0.searchString;
		var searchAuthors = _v0.searchAuthors;
		var searchTitle = _v0.searchTitle;
		var searchIsbn = _v0.searchIsbn;
		var query = _Utils_ap(
			searchString,
			_Utils_ap(
				(searchTitle === '') ? '' : ('+intitle:' + searchTitle),
				_Utils_ap(
					(searchAuthors === '') ? '' : ('+inauthor:' + searchAuthors),
					(!searchIsbn) ? '' : ('+isbn:' + $elm$core$String$fromInt(searchIsbn)))));
		return $elm$http$Http$get(
			{
				expect: A2(
					$elm$http$Http$expectJson,
					A2($elm$core$Basics$composeR, $krisajenkins$remotedata$RemoteData$fromResult, msg),
					$author$project$Domain$SearchBook$searchbooksDecoder),
				url: $author$project$Domain$SearchBook$baseUrl + ('?q=' + query)
			});
	});
var $author$project$BookSelector$setBookTiles = F2(
	function (model, booktiles) {
		return _Utils_update(
			model,
			{booktiles: booktiles});
	});
var $author$project$View$SelectorTiles$setSearchAuthors = F2(
	function (authors, config) {
		return _Utils_update(
			config,
			{searchAuthors: authors});
	});
var $author$project$View$SelectorTiles$setSearchIsbn = F2(
	function (isbn, config) {
		return _Utils_update(
			config,
			{searchIsbn: isbn});
	});
var $author$project$View$SelectorTiles$setSearchString = F2(
	function (string, config) {
		return _Utils_update(
			config,
			{searchString: string});
	});
var $author$project$View$SelectorTiles$setSearchTitle = F2(
	function (title, config) {
		return _Utils_update(
			config,
			{searchTitle: title});
	});
var $author$project$BookSelector$updateTiles = F3(
	function (msg, model, session) {
		switch (msg.$) {
			case 'UpdateSearchTitle':
				var title = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$BookSelector$setBookTiles,
						model,
						A2($author$project$View$SelectorTiles$setSearchTitle, title, model.booktiles)),
					session: session
				};
			case 'UpdateSearchAuthor':
				var authors = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$BookSelector$setBookTiles,
						model,
						A2($author$project$View$SelectorTiles$setSearchAuthors, authors, model.booktiles)),
					session: session
				};
			case 'UpdateSearchIsbn':
				var isbn = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$BookSelector$setBookTiles,
						model,
						A2(
							$author$project$View$SelectorTiles$setSearchIsbn,
							A2(
								$elm$core$Maybe$withDefault,
								0,
								$elm$core$String$toInt(isbn)),
							model.booktiles)),
					session: session
				};
			case 'UpdateSearchString':
				var string = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$BookSelector$setBookTiles,
						model,
						A2($author$project$View$SelectorTiles$setSearchString, string, model.booktiles)),
					session: session
				};
			case 'DoSearch':
				return {
					cmd: A2(
						$author$project$Domain$SearchBook$getBooks,
						$author$project$BookSelector$DoBooksReceived,
						{searchAuthors: model.booktiles.searchAuthors, searchIsbn: model.booktiles.searchIsbn, searchString: model.booktiles.searchString, searchTitle: model.booktiles.searchTitle}),
					model: _Utils_update(
						model,
						{searchbooks: $krisajenkins$remotedata$RemoteData$Loading}),
					session: session
				};
			case 'DoBooksReceived':
				var response = msg.a;
				var booktiles = model.booktiles;
				var booktiles1 = _Utils_update(
					booktiles,
					{books: response});
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{booktiles: booktiles1}),
					session: session
				};
			case 'DoDetail':
				var index = msg.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$BookSelector$doIndex, model, index),
					session: session
				};
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{bookView: $author$project$BookSelector$Tiles}),
					session: session
				};
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$BookSelector$update = F3(
	function (msg1, model1, session1) {
		var a = A2($elm$core$Debug$log, 'update msg = ', msg1);
		var _v0 = model1.bookView;
		switch (_v0.$) {
			case 'Tiles':
				return A3($author$project$BookSelector$updateTiles, msg1, model1, session1);
			case 'Details':
				var index = _v0.a;
				return A4($author$project$BookSelector$updateDetails, msg1, model1, session1, index);
			default:
				var index = _v0.a;
				if (msg1.$ === 'LibraryEditMsg') {
					if (msg1.a.$ === 'DoCancel') {
						var _v2 = msg1.a;
						return {
							cmd: $elm$core$Platform$Cmd$none,
							model: _Utils_update(
								model1,
								{
									bookView: $author$project$BookSelector$Details(index)
								}),
							session: session1
						};
					} else {
						var subMsg = msg1.a;
						var _v3 = A3($author$project$View$LibraryEdit$update, subMsg, model1.bookDetailsEdit, session1);
						var model = _v3.model;
						var session = _v3.session;
						var cmd = _v3.cmd;
						var model2 = _Utils_update(
							model1,
							{bookDetailsEdit: model});
						return {
							cmd: A2($elm$core$Platform$Cmd$map, $author$project$BookSelector$LibraryEditMsg, cmd),
							model: model2,
							session: session
						};
					}
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model1, session: session1};
				}
		}
	});
var $author$project$Checkin$Details = function (a) {
	return {$: 'Details', a: a};
};
var $author$project$Checkin$doIndex = F2(
	function (model, index) {
		var books_checkouts = A2($author$project$View$LibraryTiles$merge2RemoteDatas, model.booktiles.books, model.booktiles.checkoutsDistributed);
		if (books_checkouts.$ === 'Success') {
			var _v1 = books_checkouts.a;
			var actualBooks = _v1.a;
			var actualCheckouts = _v1.b;
			var maybeCheckout = A2($elm$core$Array$get, index, actualCheckouts);
			var maybeCheckout1 = function () {
				if (maybeCheckout.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var checkout = maybeCheckout.a;
					return checkout;
				}
			}();
			var libraryBook = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Domain$LibraryBook$emptyLibrarybook,
				A2($elm$core$Array$get, index, actualBooks));
			var bookdetails = model.bookdetails;
			var bookdetails1 = _Utils_update(
				bookdetails,
				{
					hasNext: _Utils_cmp(
						index + 1,
						$elm$core$Array$length(actualBooks)) < 0,
					hasPrevious: index > 0,
					libraryBook: libraryBook,
					maybeCheckout: maybeCheckout1
				});
			return _Utils_update(
				model,
				{
					bookView: $author$project$Checkin$Details(index),
					bookdetails: bookdetails1
				});
		} else {
			return model;
		}
	});
var $author$project$Checkin$DoCheckinDone = function (a) {
	return {$: 'DoCheckinDone', a: a};
};
var $author$project$Checkin$DoCheckoutDone = function (a) {
	return {$: 'DoCheckoutDone', a: a};
};
var $author$project$Checkin$doActionCancel = F2(
	function (model, index) {
		return _Utils_update(
			model,
			{
				bookView: $author$project$Checkin$Details(index)
			});
	});
var $author$project$Checkin$DoActionDone = function (a) {
	return {$: 'DoActionDone', a: a};
};
var $author$project$Checkin$doActionDone = F2(
	function (model, index) {
		return _Utils_update(
			model,
			{
				bookView: $author$project$Checkin$DoActionDone(index)
			});
	});
var $elm$http$Http$expectBytesResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'arraybuffer',
			_Http_toDataView,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$http$Http$expectWhatever = function (toMsg) {
	return A2(
		$elm$http$Http$expectBytesResponse,
		toMsg,
		$elm$http$Http$resolve(
			function (_v0) {
				return $elm$core$Result$Ok(_Utils_Tuple0);
			}));
};
var $author$project$Domain$Checkout$libraryApiCheckinUrl = F2(
	function (session, bookId) {
		return $author$project$Session$getLibraryApiBaseUrlString(session) + ('/checkin/' + $elm$core$String$fromInt(bookId));
	});
var $author$project$Domain$Checkout$doCheckin = F4(
	function (msg, session, token, bookId) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = A2($author$project$Domain$Checkout$libraryApiCheckinUrl, session, bookId) + ('?access_token=' + puretoken);
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: $elm$http$Http$expectWhatever(msg),
				headers: _List_Nil,
				method: 'PUT',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: requestUrl
			});
	});
var $author$project$Domain$Checkout$libraryApiCheckoutUrl = F2(
	function (session, bookId) {
		return $author$project$Session$getLibraryApiBaseUrlString(session) + ('/checkout/' + $elm$core$String$fromInt(bookId));
	});
var $author$project$Domain$Checkout$doCheckout = F4(
	function (msg, session, token, bookId) {
		var puretoken = A2(
			$elm$core$String$dropLeft,
			7,
			$truqu$elm_oauth2$OAuth$tokenToString(token));
		var requestUrl = A2($author$project$Domain$Checkout$libraryApiCheckoutUrl, session, bookId) + ('?access_token=' + puretoken);
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: $elm$http$Http$expectWhatever(msg),
				headers: _List_Nil,
				method: 'PUT',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: requestUrl
			});
	});
var $author$project$Checkin$updateConfirm = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$Checkin$doActionCancel,
						A2($author$project$Checkin$doIndex, model, index),
						index),
					session: session
				};
			case 'DoCheckout':
				var _v1 = session.token;
				if (_v1.$ === 'Just') {
					var token = _v1.a;
					return {
						cmd: A4($author$project$Domain$Checkout$doCheckout, $author$project$Checkin$DoCheckoutDone, session, token, model.bookdetails.libraryBook.id),
						model: A2($author$project$Checkin$doActionDone, model, index),
						session: session
					};
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			case 'DoCheckin':
				var _v2 = session.token;
				if (_v2.$ === 'Just') {
					var token = _v2.a;
					return {
						cmd: A4($author$project$Domain$Checkout$doCheckin, $author$project$Checkin$DoCheckinDone, session, token, model.bookdetails.libraryBook.id),
						model: A2($author$project$Checkin$doActionDone, model, index),
						session: session
					};
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$Checkin$Confirm = function (a) {
	return {$: 'Confirm', a: a};
};
var $author$project$Checkin$doAction = F2(
	function (model, index) {
		var bookdetails = model.bookdetails;
		var bookdetails1 = _Utils_update(
			bookdetails,
			{hasNext: false, hasPrevious: false});
		return _Utils_update(
			model,
			{
				bookView: $author$project$Checkin$Confirm(index),
				bookdetails: bookdetails1
			});
	});
var $author$project$Checkin$updateDetails = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoPrevious':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Checkin$doIndex, model, index - 1),
					session: session
				};
			case 'DoNext':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Checkin$doIndex, model, index + 1),
					session: session
				};
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{bookView: $author$project$Checkin$Tiles}),
					session: session
				};
			case 'DoCheckout':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Checkin$doAction, model, index),
					session: session
				};
			case 'DoCheckin':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Checkin$doAction, model, index),
					session: session
				};
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$Checkin$updateDoActionDone = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoCheckoutDone':
				var checkout = msg.a;
				if (checkout.$ === 'Ok') {
					var result = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.bookdetails.libraryBook.title + '\" has been checked out!'))
					};
				} else {
					var error = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book has NOT been checked out : ' + $author$project$Utils$buildErrorMessage(error))
					};
				}
			case 'DoCheckinDone':
				var checkout = msg.a;
				if (checkout.$ === 'Ok') {
					var result = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.bookdetails.libraryBook.title + '\" has been checked in!'))
					};
				} else {
					var error = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book has NOT been checked in : ' + $author$project$Utils$buildErrorMessage(error))
					};
				}
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$Checkin$update = F3(
	function (msg1, model1, session1) {
		if (msg1.$ === 'LibraryTilesMsg') {
			if (msg1.a.$ === 'DoDetail') {
				var index = msg1.a.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Checkin$doIndex, model1, index),
					session: session1
				};
			} else {
				var subMsg = msg1.a;
				var _v1 = A3($author$project$View$LibraryTiles$update, subMsg, model1.booktiles, session1);
				var model = _v1.model;
				var session = _v1.session;
				var cmd = _v1.cmd;
				var model2 = _Utils_update(
					model1,
					{booktiles: model});
				return {
					cmd: A2($elm$core$Platform$Cmd$map, $author$project$Checkin$LibraryTilesMsg, cmd),
					model: model2,
					session: session
				};
			}
		} else {
			var _v2 = model1.bookView;
			switch (_v2.$) {
				case 'Details':
					var index = _v2.a;
					return A4($author$project$Checkin$updateDetails, msg1, model1, session1, index);
				case 'Confirm':
					var index = _v2.a;
					return A4($author$project$Checkin$updateConfirm, msg1, model1, session1, index);
				case 'DoActionDone':
					var index = _v2.a;
					return A4($author$project$Checkin$updateDoActionDone, msg1, model1, session1, index);
				default:
					return {cmd: $elm$core$Platform$Cmd$none, model: model1, session: session1};
			}
		}
	});
var $author$project$Library$Details = function (a) {
	return {$: 'Details', a: a};
};
var $author$project$Library$doIndex = F2(
	function (model, index) {
		var books_checkouts = A2($author$project$View$LibraryTiles$merge2RemoteDatas, model.booktiles.books, model.booktiles.checkoutsDistributed);
		if (books_checkouts.$ === 'Success') {
			var _v1 = books_checkouts.a;
			var actualBooks = _v1.a;
			var actualCheckouts = _v1.b;
			var maybeCheckout = A2($elm$core$Array$get, index, actualCheckouts);
			var maybeCheckout1 = function () {
				if (maybeCheckout.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var checkout = maybeCheckout.a;
					return checkout;
				}
			}();
			var libraryBook = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Domain$LibraryBook$emptyLibrarybook,
				A2($elm$core$Array$get, index, actualBooks));
			var bookdetails = model.bookdetails;
			var bookdetails1 = _Utils_update(
				bookdetails,
				{
					hasNext: _Utils_cmp(
						index + 1,
						$elm$core$Array$length(actualBooks)) < 0,
					hasPrevious: index > 0,
					libraryBook: libraryBook,
					maybeCheckout: maybeCheckout1
				});
			return _Utils_update(
				model,
				{
					bookView: $author$project$Library$Details(index),
					bookdetails: bookdetails1
				});
		} else {
			return model;
		}
	});
var $author$project$Library$DoCheckinDone = function (a) {
	return {$: 'DoCheckinDone', a: a};
};
var $author$project$Library$DoCheckoutDone = function (a) {
	return {$: 'DoCheckoutDone', a: a};
};
var $author$project$Library$doActionCancel = F2(
	function (model, index) {
		return _Utils_update(
			model,
			{
				bookView: $author$project$Library$Details(index)
			});
	});
var $author$project$Library$DoActionDone = function (a) {
	return {$: 'DoActionDone', a: a};
};
var $author$project$Library$doActionDone = F2(
	function (model, index) {
		return _Utils_update(
			model,
			{
				bookView: $author$project$Library$DoActionDone(index)
			});
	});
var $author$project$Library$updateConfirm = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2(
						$author$project$Library$doActionCancel,
						A2($author$project$Library$doIndex, model, index),
						index),
					session: session
				};
			case 'DoCheckout':
				var _v1 = session.token;
				if (_v1.$ === 'Just') {
					var token = _v1.a;
					return {
						cmd: A4($author$project$Domain$Checkout$doCheckout, $author$project$Library$DoCheckoutDone, session, token, model.bookdetails.libraryBook.id),
						model: A2($author$project$Library$doActionDone, model, index),
						session: session
					};
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			case 'DoCheckin':
				var _v2 = session.token;
				if (_v2.$ === 'Just') {
					var token = _v2.a;
					return {
						cmd: A4($author$project$Domain$Checkout$doCheckin, $author$project$Library$DoCheckinDone, session, token, model.bookdetails.libraryBook.id),
						model: A2($author$project$Library$doActionDone, model, index),
						session: session
					};
				} else {
					return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
				}
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$Library$Confirm = function (a) {
	return {$: 'Confirm', a: a};
};
var $author$project$Library$doAction = F2(
	function (model, index) {
		var bookdetails = model.bookdetails;
		var bookdetails1 = _Utils_update(
			bookdetails,
			{hasNext: false, hasPrevious: false});
		return _Utils_update(
			model,
			{
				bookView: $author$project$Library$Confirm(index),
				bookdetails: bookdetails1
			});
	});
var $author$project$Library$updateDetails = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoPrevious':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Library$doIndex, model, index - 1),
					session: session
				};
			case 'DoNext':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Library$doIndex, model, index + 1),
					session: session
				};
			case 'DoCancel':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: _Utils_update(
						model,
						{bookView: $author$project$Library$Tiles}),
					session: session
				};
			case 'DoCheckout':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Library$doAction, model, index),
					session: session
				};
			case 'DoCheckin':
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Library$doAction, model, index),
					session: session
				};
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$Library$updateDoActionDone = F4(
	function (msg, model, session, index) {
		switch (msg.$) {
			case 'DoCheckoutDone':
				var checkout = msg.a;
				if (checkout.$ === 'Ok') {
					var result = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.bookdetails.libraryBook.title + '\" has been checked out!'))
					};
				} else {
					var error = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book has NOT been checked out : ' + $author$project$Utils$buildErrorMessage(error))
					};
				}
			case 'DoCheckinDone':
				var checkout = msg.a;
				if (checkout.$ === 'Ok') {
					var result = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2($author$project$Session$succeed, session, 'The book \"' + (model.bookdetails.libraryBook.title + '\" has been checked in!'))
					};
				} else {
					var error = checkout.a;
					return {
						cmd: $elm$core$Platform$Cmd$none,
						model: model,
						session: A2(
							$author$project$Session$fail,
							session,
							'The book has NOT been checked in : ' + $author$project$Utils$buildErrorMessage(error))
					};
				}
			default:
				return {cmd: $elm$core$Platform$Cmd$none, model: model, session: session};
		}
	});
var $author$project$Library$update = F3(
	function (msg1, model1, session1) {
		if (msg1.$ === 'LibraryTilesMsg') {
			if (msg1.a.$ === 'DoDetail') {
				var index = msg1.a.a;
				return {
					cmd: $elm$core$Platform$Cmd$none,
					model: A2($author$project$Library$doIndex, model1, index),
					session: session1
				};
			} else {
				var subMsg = msg1.a;
				var _v1 = A3($author$project$View$LibraryTiles$update, subMsg, model1.booktiles, session1);
				var model = _v1.model;
				var session = _v1.session;
				var cmd = _v1.cmd;
				var model2 = _Utils_update(
					model1,
					{booktiles: model});
				return {
					cmd: A2($elm$core$Platform$Cmd$map, $author$project$Library$LibraryTilesMsg, cmd),
					model: model2,
					session: session
				};
			}
		} else {
			var _v2 = model1.bookView;
			switch (_v2.$) {
				case 'Details':
					var index = _v2.a;
					return A4($author$project$Library$updateDetails, msg1, model1, session1, index);
				case 'Confirm':
					var index = _v2.a;
					return A4($author$project$Library$updateConfirm, msg1, model1, session1, index);
				case 'DoActionDone':
					var index = _v2.a;
					return A4($author$project$Library$updateDoActionDone, msg1, model1, session1, index);
				default:
					return {cmd: $elm$core$Platform$Cmd$none, model: model1, session: session1};
			}
		}
	});
var $author$project$Login$Profile = F2(
	function (name, picture) {
		return {name: name, picture: picture};
	});
var $author$project$Session$getGoogleClientId = function (session) {
	return session.initFlags.googleClientId;
};
var $author$project$Login$clientId = function (session) {
	return $author$project$Session$getGoogleClientId(session);
};
var $author$project$Login$configurationFor = function (session) {
	var defaultHttpsUrl = {fragment: $elm$core$Maybe$Nothing, host: '', path: '', port_: $elm$core$Maybe$Nothing, protocol: $elm$url$Url$Https, query: $elm$core$Maybe$Nothing};
	return {
		authorizationEndpoint: _Utils_update(
			defaultHttpsUrl,
			{host: 'accounts.google.com', path: '/o/oauth2/v2/auth'}),
		clientId: $author$project$Login$clientId(session),
		profileDecoder: A3(
			$elm$json$Json$Decode$map2,
			$author$project$Login$Profile,
			A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$field, 'picture', $elm$json$Json$Decode$string)),
		profileEndpoint: _Utils_update(
			defaultHttpsUrl,
			{host: 'www.googleapis.com', path: '/oauth2/v1/userinfo'}),
		scope: _List_fromArray(
			['email', 'profile', 'openid']),
		secret: '<secret>',
		tokenEndpoint: _Utils_update(
			defaultHttpsUrl,
			{host: 'www.googleapis.com', path: '/oauth2/v4/token'})
	};
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $truqu$elm_oauth2$Internal$Token = {$: 'Token'};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $truqu$elm_oauth2$Internal$protocolToString = function (protocol) {
	if (protocol.$ === 'Http') {
		return 'http';
	} else {
		return 'https';
	}
};
var $truqu$elm_oauth2$Internal$makeRedirectUri = function (url) {
	return $elm$core$String$concat(
		_List_fromArray(
			[
				$truqu$elm_oauth2$Internal$protocolToString(url.protocol),
				'://',
				url.host,
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					function (i) {
						return ':' + $elm$core$String$fromInt(i);
					},
					url.port_)),
				url.path,
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					function (q) {
						return '?' + q;
					},
					url.query))
			]));
};
var $truqu$elm_oauth2$Internal$responseTypeToString = function (r) {
	if (r.$ === 'Code') {
		return 'code';
	} else {
		return 'token';
	}
};
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 'QueryParameter', a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $truqu$elm_oauth2$Internal$urlAddList = F3(
	function (param, xs, qs) {
		return _Utils_ap(
			qs,
			function () {
				if (!xs.b) {
					return _List_Nil;
				} else {
					return _List_fromArray(
						[
							A2(
							$elm$url$Url$Builder$string,
							param,
							A2($elm$core$String$join, ' ', xs))
						]);
				}
			}());
	});
var $truqu$elm_oauth2$Internal$urlAddMaybe = F3(
	function (param, ms, qs) {
		return _Utils_ap(
			qs,
			function () {
				if (ms.$ === 'Nothing') {
					return _List_Nil;
				} else {
					var s = ms.a;
					return _List_fromArray(
						[
							A2($elm$url$Url$Builder$string, param, s)
						]);
				}
			}());
	});
var $truqu$elm_oauth2$Internal$makeAuthorizationUrl = F2(
	function (responseType, _v0) {
		var clientId = _v0.clientId;
		var url = _v0.url;
		var redirectUri = _v0.redirectUri;
		var scope = _v0.scope;
		var state = _v0.state;
		var query = A2(
			$elm$core$String$dropLeft,
			1,
			$elm$url$Url$Builder$toQuery(
				A3(
					$truqu$elm_oauth2$Internal$urlAddMaybe,
					'state',
					state,
					A3(
						$truqu$elm_oauth2$Internal$urlAddList,
						'scope',
						scope,
						_List_fromArray(
							[
								A2($elm$url$Url$Builder$string, 'client_id', clientId),
								A2(
								$elm$url$Url$Builder$string,
								'redirect_uri',
								$truqu$elm_oauth2$Internal$makeRedirectUri(redirectUri)),
								A2(
								$elm$url$Url$Builder$string,
								'response_type',
								$truqu$elm_oauth2$Internal$responseTypeToString(responseType))
							])))));
		var _v1 = url.query;
		if (_v1.$ === 'Nothing') {
			return _Utils_update(
				url,
				{
					query: $elm$core$Maybe$Just(query)
				});
		} else {
			var baseQuery = _v1.a;
			return _Utils_update(
				url,
				{
					query: $elm$core$Maybe$Just(baseQuery + ('&' + query))
				});
		}
	});
var $truqu$elm_oauth2$OAuth$Implicit$makeAuthorizationUrl = $truqu$elm_oauth2$Internal$makeAuthorizationUrl($truqu$elm_oauth2$Internal$Token);
var $author$project$Session$getThisBaseUrlString = function (session) {
	return session.initFlags.thisBaseUrlString;
};
var $author$project$Session$getThisBaseUrl = function (session) {
	var _v0 = $elm$url$Url$fromString(
		$author$project$Session$getThisBaseUrlString(session));
	if (_v0.$ === 'Just') {
		var url = _v0.a;
		return url;
	} else {
		return {fragment: $elm$core$Maybe$Nothing, host: 'NOT GOOD.URL', path: '', port_: $elm$core$Maybe$Nothing, protocol: $elm$url$Url$Http, query: $elm$core$Maybe$Nothing};
	}
};
var $author$project$Login$redirectUrl = function (session) {
	return $author$project$Session$getThisBaseUrl(session);
};
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $author$project$Login$update = F2(
	function (msg, session) {
		switch (msg.$) {
			case 'SignInRequested':
				var config = $author$project$Login$configurationFor(session);
				var auth = {
					clientId: config.clientId,
					redirectUri: $author$project$Login$redirectUrl(session),
					scope: config.scope,
					state: $elm$core$Maybe$Just(''),
					url: config.authorizationEndpoint
				};
				return _Utils_Tuple2(
					session,
					$elm$browser$Browser$Navigation$load(
						$elm$url$Url$toString(
							$truqu$elm_oauth2$OAuth$Implicit$makeAuthorizationUrl(auth))));
			case 'DoUserReceived':
				var response = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						session,
						{user: response}),
					$elm$core$Platform$Cmd$none);
			default:
				var response = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						session,
						{userInfo: response}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Logout$logoutUri = function (session) {
	return $author$project$Session$getThisBaseUrlString(session);
};
var $author$project$Logout$update = F2(
	function (msg, session) {
		return _Utils_Tuple2(
			session,
			$elm$browser$Browser$Navigation$load(
				$author$project$Logout$logoutUri(session)));
	});
var $author$project$Session$changedPageSession = F2(
	function (page, session) {
		return _Utils_update(
			session,
			{message: $author$project$Session$Empty, page: page});
	});
var $author$project$Menu$update = F2(
	function (msg, session) {
		if (msg.$ === 'NavbarMsg') {
			var state = msg.a;
			return _Utils_Tuple2(
				_Utils_update(
					session,
					{navbarState: state}),
				$elm$core$Platform$Cmd$none);
		} else {
			var page = msg.a;
			return _Utils_Tuple2(
				A2($author$project$Session$changedPageSession, page, session),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Welcome$update = F2(
	function (msg, session) {
		var page = msg.a;
		return _Utils_Tuple2(
			A2($author$project$Session$changedPageSession, page, session),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model);
		_v0$10:
		while (true) {
			switch (_v0.a.$) {
				case 'WelcomeMsg':
					var subMsg = _v0.a.a;
					var model1 = _v0.b;
					var _v1 = A2(
						$author$project$Welcome$update,
						subMsg,
						$author$project$Main$toSession(model1));
					var sessionUpdated = _v1.a;
					var welcomeCmd = _v1.b;
					return A3(
						$author$project$Main$toModel,
						model1,
						A2($elm$core$Platform$Cmd$map, $author$project$Main$WelcomeMsg, welcomeCmd),
						sessionUpdated);
				case 'LoginMsg':
					var subMsg = _v0.a.a;
					var model1 = _v0.b;
					var _v2 = A2(
						$author$project$Login$update,
						subMsg,
						$author$project$Main$toSession(model1));
					var sessionUpdated = _v2.a;
					var loginCmd = _v2.b;
					return _Utils_Tuple2(
						$author$project$Main$Welcome(sessionUpdated),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$LoginMsg, loginCmd));
				case 'LogoutMsg':
					if (_v0.b.$ === 'Logout') {
						var subMsg = _v0.a.a;
						var session = _v0.b.a;
						var _v3 = A2($author$project$Logout$update, subMsg, session);
						var sessionUpdated = _v3.a;
						var logoutCmd = _v3.b;
						return _Utils_Tuple2(
							$author$project$Main$Welcome(sessionUpdated),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$LogoutMsg, logoutCmd));
					} else {
						break _v0$10;
					}
				case 'MenuMsg':
					var subMsg = _v0.a.a;
					var model1 = _v0.b;
					var _v4 = A2(
						$author$project$Menu$update,
						subMsg,
						$author$project$Main$toSession(model1));
					var sessionUpdated = _v4.a;
					var menuCmd = _v4.b;
					return A3(
						$author$project$Main$toModel,
						model1,
						A2($elm$core$Platform$Cmd$map, $author$project$Main$MenuMsg, menuCmd),
						sessionUpdated);
				case 'BookSelectorMsg':
					if (_v0.b.$ === 'BookSelector') {
						var subMsg = _v0.a.a;
						var _v5 = _v0.b;
						var bookSelectorModel = _v5.a;
						var session = _v5.b;
						var bookSelectorUpdated = A3($author$project$BookSelector$update, subMsg, bookSelectorModel, session);
						return A3(
							$author$project$Main$toModel,
							A2($author$project$Main$BookSelector, bookSelectorUpdated.model, bookSelectorUpdated.session),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$BookSelectorMsg, bookSelectorUpdated.cmd),
							bookSelectorUpdated.session);
					} else {
						break _v0$10;
					}
				case 'LibraryMsg':
					if (_v0.b.$ === 'Library') {
						var subMsg = _v0.a.a;
						var _v6 = _v0.b;
						var libraryModel = _v6.a;
						var session = _v6.b;
						var libraryUpdated = A3($author$project$Library$update, subMsg, libraryModel, session);
						return A3(
							$author$project$Main$toModel,
							A2($author$project$Main$Library, libraryUpdated.model, libraryUpdated.session),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$LibraryMsg, libraryUpdated.cmd),
							libraryUpdated.session);
					} else {
						break _v0$10;
					}
				case 'CheckinMsg':
					if (_v0.b.$ === 'Checkin') {
						var subMsg = _v0.a.a;
						var _v7 = _v0.b;
						var checkinModel = _v7.a;
						var session = _v7.b;
						var checkinUpdated = A3($author$project$Checkin$update, subMsg, checkinModel, session);
						return A3(
							$author$project$Main$toModel,
							A2($author$project$Main$Checkin, checkinUpdated.model, checkinUpdated.session),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$CheckinMsg, checkinUpdated.cmd),
							checkinUpdated.session);
					} else {
						break _v0$10;
					}
				case 'BookEditorMsg':
					if (_v0.b.$ === 'BookEditor') {
						var subMsg = _v0.a.a;
						var _v8 = _v0.b;
						var bookEditorModel = _v8.a;
						var session = _v8.b;
						var bookEditorUpdated = A3($author$project$BookEditor$update, subMsg, bookEditorModel, session);
						return A3(
							$author$project$Main$toModel,
							A2($author$project$Main$BookEditor, bookEditorUpdated.model, bookEditorUpdated.session),
							A2($elm$core$Platform$Cmd$map, $author$project$Main$BookEditorMsg, bookEditorUpdated.cmd),
							bookEditorUpdated.session);
					} else {
						break _v0$10;
					}
				case 'LinkClicked':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				default:
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $rundis$elm_bootstrap$Bootstrap$CDN$stylesheet = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css')
		]),
	_List_Nil);
var $author$project$LibraryAppCDN$stylesheet = A3(
	$elm$html$Html$node,
	'link',
	_List_fromArray(
		[
			$elm$html$Html$Attributes$rel('stylesheet'),
			$elm$html$Html$Attributes$href('src/resources/library-app.css')
		]),
	_List_Nil);
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Disabled = function (a) {
	return {$: 'Disabled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$disabled = function (disabled_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Disabled(disabled_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Disabled = {$: 'Disabled'};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$disabled = $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Disabled;
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$form = _VirtualDom_node('form');
var $rundis$elm_bootstrap$Bootstrap$Form$form = F2(
	function (attributes, children) {
		return A2($elm$html$Html$form, attributes, children);
	});
var $rundis$elm_bootstrap$Bootstrap$Form$applyModifier = F2(
	function (modifier, options) {
		var value = modifier.a;
		return _Utils_update(
			options,
			{
				attributes: _Utils_ap(options.attributes, value)
			});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$defaultOptions = {attributes: _List_Nil};
var $rundis$elm_bootstrap$Bootstrap$Form$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('form-group')
			]),
		options.attributes);
};
var $rundis$elm_bootstrap$Bootstrap$Form$group = F2(
	function (options, children) {
		return A2(
			$elm$html$Html$div,
			$rundis$elm_bootstrap$Bootstrap$Form$toAttributes(options),
			children);
	});
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$label = _VirtualDom_node('label');
var $rundis$elm_bootstrap$Bootstrap$Form$label = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$label,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('form-control-label'),
				attributes),
			children);
	});
var $author$project$Utils$languages = _List_fromArray(
	[
		_Utils_Tuple2('', ''),
		_Utils_Tuple2('en', 'English'),
		_Utils_Tuple2('nl', 'Nederlands'),
		_Utils_Tuple2('fr', 'Français')
	]);
var $author$project$Utils$locations = _List_fromArray(
	[
		_Utils_Tuple2('', ''),
		_Utils_Tuple2('am', 'Amsterdam'),
		_Utils_Tuple2('ro', 'Rotterdam'),
		_Utils_Tuple2('br', 'Bruxelles'),
		_Utils_Tuple2('ch', 'Chessy'),
		_Utils_Tuple2('home', 'At home')
	]);
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Utils$lookup = F2(
	function (key, list) {
		return A2(
			$elm$core$Maybe$withDefault,
			key,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$second,
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (_v0) {
							var key1 = _v0.a;
							var value = _v0.b;
							return _Utils_eq(key1, key);
						},
						list))));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Rows = function (a) {
	return {$: 'Rows', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$rows = function (rows_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Rows(rows_);
};
var $rundis$elm_bootstrap$Bootstrap$Table$Inversed = {$: 'Inversed'};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Table$isResponsive = function (option) {
	if (option.$ === 'Responsive') {
		return true;
	} else {
		return false;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$KeyedTBody = function (a) {
	return {$: 'KeyedTBody', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$TBody = function (a) {
	return {$: 'TBody', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$InversedRow = function (a) {
	return {$: 'InversedRow', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$KeyedRow = function (a) {
	return {$: 'KeyedRow', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$Row = function (a) {
	return {$: 'Row', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$InversedCell = function (a) {
	return {$: 'InversedCell', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$Td = function (a) {
	return {$: 'Td', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$Th = function (a) {
	return {$: 'Th', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell = function (cell) {
	var inverseOptions = function (options) {
		return A2(
			$elm$core$List$map,
			function (opt) {
				if (opt.$ === 'RoledCell') {
					var role = opt.a;
					return $rundis$elm_bootstrap$Bootstrap$Table$InversedCell(role);
				} else {
					return opt;
				}
			},
			options);
	};
	if (cell.$ === 'Th') {
		var cellCfg = cell.a;
		return $rundis$elm_bootstrap$Bootstrap$Table$Th(
			_Utils_update(
				cellCfg,
				{
					options: inverseOptions(cellCfg.options)
				}));
	} else {
		var cellCfg = cell.a;
		return $rundis$elm_bootstrap$Bootstrap$Table$Td(
			_Utils_update(
				cellCfg,
				{
					options: inverseOptions(cellCfg.options)
				}));
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow = function (row) {
	var inversedOptions = function (options) {
		return A2(
			$elm$core$List$map,
			function (opt) {
				if (opt.$ === 'RoledRow') {
					var role = opt.a;
					return $rundis$elm_bootstrap$Bootstrap$Table$InversedRow(role);
				} else {
					return opt;
				}
			},
			options);
	};
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		return $rundis$elm_bootstrap$Bootstrap$Table$Row(
			{
				cells: A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell, cells),
				options: inversedOptions(options)
			});
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		return $rundis$elm_bootstrap$Bootstrap$Table$KeyedRow(
			{
				cells: A2(
					$elm$core$List$map,
					function (_v1) {
						var key = _v1.a;
						var cell = _v1.b;
						return _Utils_Tuple2(
							key,
							$rundis$elm_bootstrap$Bootstrap$Table$mapInversedCell(cell));
					},
					cells),
				options: inversedOptions(options)
			});
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTBody = F2(
	function (isTableInversed, tbody_) {
		var _v0 = _Utils_Tuple2(isTableInversed, tbody_);
		if (!_v0.a) {
			return tbody_;
		} else {
			if (_v0.b.$ === 'TBody') {
				var body = _v0.b.a;
				return $rundis$elm_bootstrap$Bootstrap$Table$TBody(
					_Utils_update(
						body,
						{
							rows: A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow, body.rows)
						}));
			} else {
				var keyedBody = _v0.b.a;
				return $rundis$elm_bootstrap$Bootstrap$Table$KeyedTBody(
					_Utils_update(
						keyedBody,
						{
							rows: A2(
								$elm$core$List$map,
								function (_v1) {
									var key = _v1.a;
									var row = _v1.b;
									return _Utils_Tuple2(
										key,
										$rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow(row));
								},
								keyedBody.rows)
						}));
			}
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Table$InversedHead = {$: 'InversedHead'};
var $rundis$elm_bootstrap$Bootstrap$Table$THead = function (a) {
	return {$: 'THead', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTHead = F2(
	function (isTableInversed, _v0) {
		var thead_ = _v0.a;
		var isHeadInversed = A2(
			$elm$core$List$any,
			function (opt) {
				return _Utils_eq(opt, $rundis$elm_bootstrap$Bootstrap$Table$InversedHead);
			},
			thead_.options);
		return $rundis$elm_bootstrap$Bootstrap$Table$THead(
			(isTableInversed || isHeadInversed) ? _Utils_update(
				thead_,
				{
					rows: A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$mapInversedRow, thead_.rows)
				}) : thead_);
	});
var $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption = function (size) {
	switch (size.$) {
		case 'XS':
			return $elm$core$Maybe$Nothing;
		case 'SM':
			return $elm$core$Maybe$Just('sm');
		case 'MD':
			return $elm$core$Maybe$Just('md');
		case 'LG':
			return $elm$core$Maybe$Just('lg');
		default:
			return $elm$core$Maybe$Just('xl');
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$maybeWrapResponsive = F2(
	function (options, table_) {
		var responsiveClass = $elm$html$Html$Attributes$class(
			'table-responsive' + A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					function (v) {
						return '-' + v;
					},
					A2(
						$elm$core$Maybe$andThen,
						$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption,
						A2(
							$elm$core$Maybe$andThen,
							function (opt) {
								if (opt.$ === 'Responsive') {
									var val = opt.a;
									return val;
								} else {
									return $elm$core$Maybe$Nothing;
								}
							},
							$elm$core$List$head(
								A2($elm$core$List$filter, $rundis$elm_bootstrap$Bootstrap$Table$isResponsive, options)))))));
		return A2($elm$core$List$any, $rundis$elm_bootstrap$Bootstrap$Table$isResponsive, options) ? A2(
			$elm$html$Html$div,
			_List_fromArray(
				[responsiveClass]),
			_List_fromArray(
				[table_])) : table_;
	});
var $rundis$elm_bootstrap$Bootstrap$Table$CellAttr = function (a) {
	return {$: 'CellAttr', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Table$cellAttr = function (attr_) {
	return $rundis$elm_bootstrap$Bootstrap$Table$CellAttr(attr_);
};
var $elm$html$Html$Attributes$scope = $elm$html$Html$Attributes$stringProperty('scope');
var $rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh = function (cell) {
	if (cell.$ === 'Th') {
		var cellConfig = cell.a;
		return $rundis$elm_bootstrap$Bootstrap$Table$Th(
			_Utils_update(
				cellConfig,
				{
					options: A2(
						$elm$core$List$cons,
						$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
							$elm$html$Html$Attributes$scope('row')),
						cellConfig.options)
				}));
	} else {
		return cell;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell = function (row) {
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		if (!cells.b) {
			return row;
		} else {
			var first = cells.a;
			var rest = cells.b;
			return $rundis$elm_bootstrap$Bootstrap$Table$Row(
				{
					cells: A2(
						$elm$core$List$cons,
						$rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh(first),
						rest),
					options: options
				});
		}
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		if (!cells.b) {
			return row;
		} else {
			var _v3 = cells.a;
			var firstKey = _v3.a;
			var first = _v3.b;
			var rest = cells.b;
			return $rundis$elm_bootstrap$Bootstrap$Table$KeyedRow(
				{
					cells: A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							firstKey,
							$rundis$elm_bootstrap$Bootstrap$Table$addScopeIfTh(first)),
						rest),
					options: options
				});
		}
	}
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass = F2(
	function (prefix, role) {
		return $elm$html$Html$Attributes$class(
			prefix + ('-' + function () {
				switch (role.$) {
					case 'Primary':
						return 'primary';
					case 'Secondary':
						return 'secondary';
					case 'Success':
						return 'success';
					case 'Info':
						return 'info';
					case 'Warning':
						return 'warning';
					case 'Danger':
						return 'danger';
					case 'Light':
						return 'light';
					default:
						return 'dark';
				}
			}()));
	});
var $rundis$elm_bootstrap$Bootstrap$Table$cellAttribute = function (option) {
	switch (option.$) {
		case 'RoledCell':
			if (option.a.$ === 'Roled') {
				var role = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'table', role);
			} else {
				var _v1 = option.a;
				return $elm$html$Html$Attributes$class('table-active');
			}
		case 'InversedCell':
			if (option.a.$ === 'Roled') {
				var role = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg-', role);
			} else {
				var _v2 = option.a;
				return $elm$html$Html$Attributes$class('bg-active');
			}
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$cellAttributes = function (options) {
	return A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$cellAttribute, options);
};
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $rundis$elm_bootstrap$Bootstrap$Table$renderCell = function (cell) {
	if (cell.$ === 'Td') {
		var options = cell.a.options;
		var children = cell.a.children;
		return A2(
			$elm$html$Html$td,
			$rundis$elm_bootstrap$Bootstrap$Table$cellAttributes(options),
			children);
	} else {
		var options = cell.a.options;
		var children = cell.a.children;
		return A2(
			$elm$html$Html$th,
			$rundis$elm_bootstrap$Bootstrap$Table$cellAttributes(options),
			children);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$rowClass = function (option) {
	switch (option.$) {
		case 'RoledRow':
			if (option.a.$ === 'Roled') {
				var role_ = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'table', role_);
			} else {
				var _v1 = option.a;
				return $elm$html$Html$Attributes$class('table-active');
			}
		case 'InversedRow':
			if (option.a.$ === 'Roled') {
				var role_ = option.a.a;
				return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role_);
			} else {
				var _v2 = option.a;
				return $elm$html$Html$Attributes$class('bg-active');
			}
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$rowAttributes = function (options) {
	return A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$rowClass, options);
};
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $rundis$elm_bootstrap$Bootstrap$Table$renderRow = function (row) {
	if (row.$ === 'Row') {
		var options = row.a.options;
		var cells = row.a.cells;
		return A2(
			$elm$html$Html$tr,
			$rundis$elm_bootstrap$Bootstrap$Table$rowAttributes(options),
			A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$renderCell, cells));
	} else {
		var options = row.a.options;
		var cells = row.a.cells;
		return A3(
			$elm$html$Html$Keyed$node,
			'tr',
			$rundis$elm_bootstrap$Bootstrap$Table$rowAttributes(options),
			A2(
				$elm$core$List$map,
				function (_v1) {
					var key = _v1.a;
					var cell = _v1.b;
					return _Utils_Tuple2(
						key,
						$rundis$elm_bootstrap$Bootstrap$Table$renderCell(cell));
				},
				cells));
	}
};
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $rundis$elm_bootstrap$Bootstrap$Table$renderTBody = function (body) {
	if (body.$ === 'TBody') {
		var attributes = body.a.attributes;
		var rows = body.a.rows;
		return A2(
			$elm$html$Html$tbody,
			attributes,
			A2(
				$elm$core$List$map,
				function (row) {
					return $rundis$elm_bootstrap$Bootstrap$Table$renderRow(
						$rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell(row));
				},
				rows));
	} else {
		var attributes = body.a.attributes;
		var rows = body.a.rows;
		return A3(
			$elm$html$Html$Keyed$node,
			'tbody',
			attributes,
			A2(
				$elm$core$List$map,
				function (_v1) {
					var key = _v1.a;
					var row = _v1.b;
					return _Utils_Tuple2(
						key,
						$rundis$elm_bootstrap$Bootstrap$Table$renderRow(
							$rundis$elm_bootstrap$Bootstrap$Table$maybeAddScopeToFirstCell(row)));
				},
				rows));
	}
};
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $rundis$elm_bootstrap$Bootstrap$Table$theadAttribute = function (option) {
	switch (option.$) {
		case 'InversedHead':
			return $elm$html$Html$Attributes$class('thead-dark');
		case 'DefaultHead':
			return $elm$html$Html$Attributes$class('thead-default');
		default:
			var attr_ = option.a;
			return attr_;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$theadAttributes = function (options) {
	return A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$theadAttribute, options);
};
var $rundis$elm_bootstrap$Bootstrap$Table$renderTHead = function (_v0) {
	var options = _v0.a.options;
	var rows = _v0.a.rows;
	return A2(
		$elm$html$Html$thead,
		$rundis$elm_bootstrap$Bootstrap$Table$theadAttributes(options),
		A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$renderRow, rows));
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $rundis$elm_bootstrap$Bootstrap$Table$tableClass = function (option) {
	switch (option.$) {
		case 'Inversed':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-dark'));
		case 'Striped':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-striped'));
		case 'Bordered':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-bordered'));
		case 'Hover':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-hover'));
		case 'Small':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-sm'));
		case 'Responsive':
			return $elm$core$Maybe$Nothing;
		case 'Reflow':
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('table-reflow'));
		default:
			var attr_ = option.a;
			return $elm$core$Maybe$Just(attr_);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Table$tableAttributes = function (options) {
	return A2(
		$elm$core$List$cons,
		$elm$html$Html$Attributes$class('table'),
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A2($elm$core$List$map, $rundis$elm_bootstrap$Bootstrap$Table$tableClass, options)));
};
var $rundis$elm_bootstrap$Bootstrap$Table$table = function (rec) {
	var isInversed = A2(
		$elm$core$List$any,
		function (opt) {
			return _Utils_eq(opt, $rundis$elm_bootstrap$Bootstrap$Table$Inversed);
		},
		rec.options);
	var classOptions = A2(
		$elm$core$List$filter,
		function (opt) {
			return !$rundis$elm_bootstrap$Bootstrap$Table$isResponsive(opt);
		},
		rec.options);
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Table$maybeWrapResponsive,
		rec.options,
		A2(
			$elm$html$Html$table,
			$rundis$elm_bootstrap$Bootstrap$Table$tableAttributes(classOptions),
			_List_fromArray(
				[
					$rundis$elm_bootstrap$Bootstrap$Table$renderTHead(
					A2($rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTHead, isInversed, rec.thead)),
					$rundis$elm_bootstrap$Bootstrap$Table$renderTBody(
					A2($rundis$elm_bootstrap$Bootstrap$Table$maybeMapInversedTBody, isInversed, rec.tbody))
				])));
};
var $rundis$elm_bootstrap$Bootstrap$Table$simpleTable = function (_v0) {
	var thead_ = _v0.a;
	var tbody_ = _v0.b;
	return $rundis$elm_bootstrap$Bootstrap$Table$table(
		{options: _List_Nil, tbody: tbody_, thead: thead_});
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $rundis$elm_bootstrap$Bootstrap$Table$tbody = F2(
	function (attributes, rows) {
		return $rundis$elm_bootstrap$Bootstrap$Table$TBody(
			{attributes: attributes, rows: rows});
	});
var $rundis$elm_bootstrap$Bootstrap$Table$td = F2(
	function (options, children) {
		return $rundis$elm_bootstrap$Bootstrap$Table$Td(
			{children: children, options: options});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Text = {$: 'Text'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Input = function (a) {
	return {$: 'Input', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Type = function (a) {
	return {$: 'Type', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$create = F2(
	function (tipe, options) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Input$Input(
			{
				options: A2(
					$elm$core$List$cons,
					$rundis$elm_bootstrap$Bootstrap$Form$Input$Type(tipe),
					options)
			});
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size_ = modifier.a;
				return _Utils_update(
					options,
					{
						size: $elm$core$Maybe$Just(size_)
					});
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: $elm$core$Maybe$Just(id_)
					});
			case 'Type':
				var tipe = modifier.a;
				return _Utils_update(
					options,
					{tipe: tipe});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'Value':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						value: $elm$core$Maybe$Just(value_)
					});
			case 'Placeholder':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						placeholder: $elm$core$Maybe$Just(value_)
					});
			case 'OnInput':
				var onInput_ = modifier.a;
				return _Utils_update(
					options,
					{
						onInput: $elm$core$Maybe$Just(onInput_)
					});
			case 'Validation':
				var validation_ = modifier.a;
				return _Utils_update(
					options,
					{
						validation: $elm$core$Maybe$Just(validation_)
					});
			case 'Readonly':
				var val = modifier.a;
				return _Utils_update(
					options,
					{readonly: val});
			case 'PlainText':
				var val = modifier.a;
				return _Utils_update(
					options,
					{plainText: val});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions = {attributes: _List_Nil, disabled: false, id: $elm$core$Maybe$Nothing, onInput: $elm$core$Maybe$Nothing, placeholder: $elm$core$Maybe$Nothing, plainText: false, readonly: false, size: $elm$core$Maybe$Nothing, tipe: $rundis$elm_bootstrap$Bootstrap$Form$Input$Text, validation: $elm$core$Maybe$Nothing, value: $elm$core$Maybe$Nothing};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute = function (size) {
	return A2(
		$elm$core$Maybe$map,
		function (s) {
			return $elm$html$Html$Attributes$class('form-control-' + s);
		},
		$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute = function (inputType) {
	return $elm$html$Html$Attributes$type_(
		function () {
			switch (inputType.$) {
				case 'Text':
					return 'text';
				case 'Password':
					return 'password';
				case 'DatetimeLocal':
					return 'datetime-local';
				case 'Date':
					return 'date';
				case 'Month':
					return 'month';
				case 'Time':
					return 'time';
				case 'Week':
					return 'week';
				case 'Number':
					return 'number';
				case 'Email':
					return 'email';
				case 'Url':
					return 'url';
				case 'Search':
					return 'search';
				case 'Tel':
					return 'tel';
				default:
					return 'color';
			}
		}());
};
var $rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString = function (validation) {
	if (validation.$ === 'Success') {
		return 'is-valid';
	} else {
		return 'is-invalid';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute = function (validation) {
	return $elm$html$Html$Attributes$class(
		$rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation));
};
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$Input$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$Input$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				options.plainText ? 'form-control-plaintext' : 'form-control'),
				$elm$html$Html$Attributes$disabled(options.disabled),
				$elm$html$Html$Attributes$readonly(options.readonly || options.plainText),
				$rundis$elm_bootstrap$Bootstrap$Form$Input$typeAttribute(options.tipe)
			]),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$id, options.id),
						A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$Form$Input$sizeAttribute, options.size),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$value, options.value),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$placeholder, options.placeholder),
						A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, options.onInput),
						A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Form$Input$validationAttribute, options.validation)
					])),
			options.attributes));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$view = function (_v0) {
	var options = _v0.a.options;
	return A2(
		$elm$html$Html$input,
		$rundis$elm_bootstrap$Bootstrap$Form$Input$toAttributes(options),
		_List_Nil);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$input = F2(
	function (tipe, options) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Input$view(
			A2($rundis$elm_bootstrap$Bootstrap$Form$Input$create, tipe, options));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$text = $rundis$elm_bootstrap$Bootstrap$Form$Input$input($rundis$elm_bootstrap$Bootstrap$Form$Input$Text);
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Textarea = function (a) {
	return {$: 'Textarea', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$create = function (options) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Textarea(
		{options: options});
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: $elm$core$Maybe$Just(id_)
					});
			case 'Rows':
				var rows_ = modifier.a;
				return _Utils_update(
					options,
					{
						rows: $elm$core$Maybe$Just(rows_)
					});
			case 'Disabled':
				return _Utils_update(
					options,
					{disabled: true});
			case 'Value':
				var value_ = modifier.a;
				return _Utils_update(
					options,
					{
						value: $elm$core$Maybe$Just(value_)
					});
			case 'OnInput':
				var onInput_ = modifier.a;
				return _Utils_update(
					options,
					{
						onInput: $elm$core$Maybe$Just(onInput_)
					});
			case 'Validation':
				var validation = modifier.a;
				return _Utils_update(
					options,
					{
						validation: $elm$core$Maybe$Just(validation)
					});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$defaultOptions = {attributes: _List_Nil, disabled: false, id: $elm$core$Maybe$Nothing, onInput: $elm$core$Maybe$Nothing, rows: $elm$core$Maybe$Nothing, validation: $elm$core$Maybe$Nothing, value: $elm$core$Maybe$Nothing};
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$validationAttribute = function (validation) {
	return $elm$html$Html$Attributes$class(
		$rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$Textarea$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$Textarea$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('form-control'),
				$elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$id, options.id),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$rows, options.rows),
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$value, options.value),
						A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, options.onInput),
						A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Form$Textarea$validationAttribute, options.validation)
					])),
			options.attributes));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$view = function (_v0) {
	var options = _v0.a.options;
	return A2(
		$elm$html$Html$textarea,
		$rundis$elm_bootstrap$Bootstrap$Form$Textarea$toAttributes(options),
		_List_Nil);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$textarea = A2($elm$core$Basics$composeL, $rundis$elm_bootstrap$Bootstrap$Form$Textarea$view, $rundis$elm_bootstrap$Bootstrap$Form$Textarea$create);
var $rundis$elm_bootstrap$Bootstrap$Table$thead = F2(
	function (options, rows) {
		return $rundis$elm_bootstrap$Bootstrap$Table$THead(
			{options: options, rows: rows});
	});
var $rundis$elm_bootstrap$Bootstrap$Table$tr = F2(
	function (options, cells) {
		return $rundis$elm_bootstrap$Bootstrap$Table$Row(
			{cells: cells, options: options});
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Value = function (a) {
	return {$: 'Value', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$value = function (value_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Value(value_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Value = function (a) {
	return {$: 'Value', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$value = function (value_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Value(value_);
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Internal$Button$Attrs(attrs_);
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size = modifier.a;
				return _Utils_update(
					options,
					{
						size: $elm$core$Maybe$Just(size)
					});
			case 'Coloring':
				var coloring = modifier.a;
				return _Utils_update(
					options,
					{
						coloring: $elm$core$Maybe$Just(coloring)
					});
			case 'Block':
				return _Utils_update(
					options,
					{block: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			default:
				var attrs = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions = {attributes: _List_Nil, block: false, coloring: $elm$core$Maybe$Nothing, disabled: false, size: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass = function (role) {
	switch (role.$) {
		case 'Primary':
			return 'primary';
		case 'Secondary':
			return 'secondary';
		case 'Success':
			return 'success';
		case 'Info':
			return 'info';
		case 'Warning':
			return 'warning';
		case 'Danger':
			return 'danger';
		case 'Dark':
			return 'dark';
		case 'Light':
			return 'light';
		default:
			return 'link';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Internal$Button$applyModifier, $rundis$elm_bootstrap$Bootstrap$Internal$Button$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('btn', true),
						_Utils_Tuple2('btn-block', options.block),
						_Utils_Tuple2('disabled', options.disabled)
					])),
				$elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			function () {
				var _v0 = A2($elm$core$Maybe$andThen, $rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption, options.size);
				if (_v0.$ === 'Just') {
					var s = _v0.a;
					return _List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn-' + s)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.coloring;
					if (_v1.$ === 'Just') {
						if (_v1.a.$ === 'Roled') {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						} else {
							var role = _v1.a.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'btn-outline-' + $rundis$elm_bootstrap$Bootstrap$Internal$Button$roleClass(role))
								]);
						}
					} else {
						return _List_Nil;
					}
				}(),
				options.attributes)));
};
var $rundis$elm_bootstrap$Bootstrap$Button$button = F2(
	function (options, children) {
		return A2(
			$elm$html$Html$button,
			$rundis$elm_bootstrap$Bootstrap$Internal$Button$buttonAttributes(options),
			children);
	});
var $elm$html$Html$Attributes$colspan = function (n) {
	return A2(
		_VirtualDom_attribute,
		'colspan',
		$elm$core$String$fromInt(n));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled = function (a) {
	return {$: 'Disabled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$disabled = function (disabled_) {
	return $rundis$elm_bootstrap$Bootstrap$Internal$Button$Disabled(disabled_);
};
var $elm$html$Html$Attributes$hidden = $elm$html$Html$Attributes$boolProperty('hidden');
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $rundis$elm_bootstrap$Bootstrap$Button$onClick = function (message) {
	return $rundis$elm_bootstrap$Bootstrap$Button$attrs(
		_List_fromArray(
			[
				A2(
				$elm$html$Html$Events$preventDefaultOn,
				'click',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2(message, true)))
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring = function (a) {
	return {$: 'Coloring', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Info = {$: 'Info'};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined = function (a) {
	return {$: 'Outlined', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$outlineInfo = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined($rundis$elm_bootstrap$Bootstrap$Internal$Button$Info));
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary = {$: 'Primary'};
var $rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined($rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary));
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Secondary = {$: 'Secondary'};
var $rundis$elm_bootstrap$Bootstrap$Button$outlineSecondary = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Outlined($rundis$elm_bootstrap$Bootstrap$Internal$Button$Secondary));
var $author$project$View$LibraryDetails$viewBookDetailButtons = function (config) {
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Form$group,
		_List_Nil,
		_List_fromArray(
			[
				$rundis$elm_bootstrap$Bootstrap$Table$simpleTable(
				_Utils_Tuple2(
					A2($rundis$elm_bootstrap$Bootstrap$Table$thead, _List_Nil, _List_Nil),
					A2(
						$rundis$elm_bootstrap$Bootstrap$Table$tbody,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$tr,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$td,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Button$button,
												_List_fromArray(
													[
														$rundis$elm_bootstrap$Bootstrap$Button$outlineInfo,
														$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
														$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doPrevious),
														$rundis$elm_bootstrap$Bootstrap$Button$disabled(!config.hasPrevious)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('<')
													]))
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$td,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Button$button,
												_List_fromArray(
													[
														$rundis$elm_bootstrap$Bootstrap$Button$outlineSecondary,
														$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
														$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doCancel)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Cancel')
													]))
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$td,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$hidden(!config.doAction1.visible))
											]),
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Button$button,
												_List_fromArray(
													[
														$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
														$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
														$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doAction1.msg),
														$rundis$elm_bootstrap$Bootstrap$Button$disabled(config.doAction1.disabled)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(config.doAction1.text)
													]))
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$td,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$hidden(!config.doAction2.visible))
											]),
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Button$button,
												_List_fromArray(
													[
														$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
														$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
														$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doAction2.msg),
														$rundis$elm_bootstrap$Bootstrap$Button$disabled(config.doAction2.disabled)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(config.doAction2.text)
													]))
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$td,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Button$button,
												_List_fromArray(
													[
														$rundis$elm_bootstrap$Bootstrap$Button$outlineInfo,
														$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
														$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doNext),
														$rundis$elm_bootstrap$Bootstrap$Button$disabled(!config.hasNext)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('>')
													]))
											]))
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Table$tr,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Table$td,
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
												$elm$html$Html$Attributes$colspan(4))
											]),
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Form$group,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$rundis$elm_bootstrap$Bootstrap$Form$label,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text(config.remarks)
															]))
													]))
											]))
									]))
							]))))
			]));
};
var $author$project$View$LibraryDetails$viewBookDetail = function (config) {
	var _v0 = config;
	var libraryBook = _v0.libraryBook;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Title')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(libraryBook.title),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Author(s)')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(libraryBook.authors),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Description')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Textarea$textarea(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Textarea$rows(5),
										$rundis$elm_bootstrap$Bootstrap$Form$Textarea$value(libraryBook.description),
										$rundis$elm_bootstrap$Bootstrap$Form$Textarea$disabled
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Published date')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(libraryBook.publishedDate),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Language')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(
										A2($author$project$Utils$lookup, libraryBook.language, $author$project$Utils$languages)),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Location')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(
										A2($author$project$Utils$lookup, libraryBook.location, $author$project$Utils$locations)),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Owner')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(libraryBook.owner),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Image of the book')
									])),
								$rundis$elm_bootstrap$Bootstrap$Table$simpleTable(
								_Utils_Tuple2(
									A2($rundis$elm_bootstrap$Bootstrap$Table$thead, _List_Nil, _List_Nil),
									A2(
										$rundis$elm_bootstrap$Bootstrap$Table$tbody,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Table$tr,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$rundis$elm_bootstrap$Bootstrap$Table$td,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$img,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$src(libraryBook.thumbnail)
																	]),
																_List_Nil)
															]))
													]))
											]))))
							])),
						$author$project$View$LibraryDetails$viewBookDetailButtons(config)
					]))
			]));
};
var $author$project$View$LibraryDetails$view = function (config) {
	return $author$project$View$LibraryDetails$viewBookDetail(config);
};
var $author$project$View$LibraryEdit$DoCancel = {$: 'DoCancel'};
var $author$project$View$LibraryEdit$DoInsert = {$: 'DoInsert'};
var $author$project$View$LibraryEdit$DoUpdate = {$: 'DoUpdate'};
var $author$project$View$LibraryEdit$UpdateAuthors = function (a) {
	return {$: 'UpdateAuthors', a: a};
};
var $author$project$View$LibraryEdit$UpdateDescription = function (a) {
	return {$: 'UpdateDescription', a: a};
};
var $author$project$View$LibraryEdit$UpdateLanguage = function (a) {
	return {$: 'UpdateLanguage', a: a};
};
var $author$project$View$LibraryEdit$UpdateLocation = function (a) {
	return {$: 'UpdateLocation', a: a};
};
var $author$project$View$LibraryEdit$UpdateOwner = function (a) {
	return {$: 'UpdateOwner', a: a};
};
var $author$project$View$LibraryEdit$UpdatePublishedDate = function (a) {
	return {$: 'UpdatePublishedDate', a: a};
};
var $author$project$View$LibraryEdit$UpdateTitle = function (a) {
	return {$: 'UpdateTitle', a: a};
};
var $author$project$View$LibraryEdit$isObligatory = F2(
	function (label, value) {
		if (value === '') {
			return 'Field \"' + (label + '\" needs a value here.');
		} else {
			return '';
		}
	});
var $author$project$View$LibraryEdit$checkAuthors = F2(
	function (label, value) {
		return A2($author$project$View$LibraryEdit$isObligatory, label, value);
	});
var $author$project$View$LibraryEdit$checkDescription = F2(
	function (label, value) {
		return A2($author$project$View$LibraryEdit$isObligatory, label, value);
	});
var $author$project$View$LibraryEdit$checkLanguage = F2(
	function (label, value) {
		return A2($author$project$View$LibraryEdit$isObligatory, label, value);
	});
var $author$project$View$LibraryEdit$checkLocation = F2(
	function (label, value) {
		return A2($author$project$View$LibraryEdit$isObligatory, label, value);
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $author$project$View$LibraryEdit$emailRegex = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|\"' + ('(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*' + ('\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' + '\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])'));
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{caseInsensitive: false, multiline: false},
		string);
};
var $author$project$View$LibraryEdit$checkOwner = F2(
	function (label, value) {
		var _v0 = $elm$regex$Regex$fromString($author$project$View$LibraryEdit$emailRegex);
		if (_v0.$ === 'Just') {
			var regex = _v0.a;
			return A2($elm$regex$Regex$contains, regex, value) ? '' : 'Please enter a valid email address.';
		} else {
			return '';
		}
	});
var $author$project$View$LibraryEdit$checkPublishedDate = F2(
	function (label, value) {
		return A2($author$project$View$LibraryEdit$isObligatory, label, value);
	});
var $author$project$View$LibraryEdit$checkTitle = F2(
	function (label, value) {
		return A2($author$project$View$LibraryEdit$isObligatory, label, value);
	});
var $rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger = {$: 'Danger'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Validation = function (a) {
	return {$: 'Validation', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$danger = $rundis$elm_bootstrap$Bootstrap$Form$Input$Validation($rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger);
var $rundis$elm_bootstrap$Bootstrap$Form$Select$Validation = function (a) {
	return {$: 'Validation', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$danger = $rundis$elm_bootstrap$Bootstrap$Form$Select$Validation($rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger);
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Validation = function (a) {
	return {$: 'Validation', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$danger = $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Validation($rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Danger);
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Email = {$: 'Email'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$email = $rundis$elm_bootstrap$Bootstrap$Form$Input$input($rundis$elm_bootstrap$Bootstrap$Form$Input$Email);
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Id = function (a) {
	return {$: 'Id', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$id = function (id_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$Id(id_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$Id = function (a) {
	return {$: 'Id', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$id = function (id_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Select$Id(id_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Id = function (a) {
	return {$: 'Id', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$id = function (id_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Id(id_);
};
var $rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('invalid-feedback'),
				attributes),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Select$OnChange = function (a) {
	return {$: 'OnChange', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$onChange = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Select$OnChange(toMsg);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput = function (a) {
	return {$: 'OnInput', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$onInput = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Input$OnInput(toMsg);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$OnInput = function (a) {
	return {$: 'OnInput', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$onInput = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Textarea$OnInput(toMsg);
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$Select = function (a) {
	return {$: 'Select', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$create = F2(
	function (options, items) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Select$Select(
			{items: items, options: options});
	});
var $elm$html$Html$select = _VirtualDom_node('select');
var $rundis$elm_bootstrap$Bootstrap$Form$Select$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Size':
				var size_ = modifier.a;
				return _Utils_update(
					options,
					{
						size: $elm$core$Maybe$Just(size_)
					});
			case 'Id':
				var id_ = modifier.a;
				return _Utils_update(
					options,
					{
						id: $elm$core$Maybe$Just(id_)
					});
			case 'Custom':
				return _Utils_update(
					options,
					{custom: true});
			case 'Disabled':
				var val = modifier.a;
				return _Utils_update(
					options,
					{disabled: val});
			case 'OnChange':
				var onChange_ = modifier.a;
				return _Utils_update(
					options,
					{
						onChange: $elm$core$Maybe$Just(onChange_)
					});
			case 'Validation':
				var validation_ = modifier.a;
				return _Utils_update(
					options,
					{
						validation: $elm$core$Maybe$Just(validation_)
					});
			default:
				var attrs_ = modifier.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs_)
					});
		}
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Select$customEventOnChange = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$defaultOptions = {attributes: _List_Nil, custom: false, disabled: false, id: $elm$core$Maybe$Nothing, onChange: $elm$core$Maybe$Nothing, size: $elm$core$Maybe$Nothing, validation: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$sizeAttribute = F2(
	function (isCustom, size_) {
		var prefix = isCustom ? 'custom-select-' : 'form-control-';
		return A2(
			$elm$core$Maybe$map,
			function (s) {
				return $elm$html$Html$Attributes$class(
					_Utils_ap(prefix, s));
			},
			$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size_));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Select$validationAttribute = function (validation_) {
	return $elm$html$Html$Attributes$class(
		$rundis$elm_bootstrap$Bootstrap$Form$FormInternal$validationToString(validation_));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$toAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Form$Select$applyModifier, $rundis$elm_bootstrap$Bootstrap$Form$Select$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('form-control', !options.custom),
						_Utils_Tuple2('custom-select', options.custom)
					])),
				$elm$html$Html$Attributes$disabled(options.disabled)
			]),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2($elm$core$Maybe$map, $elm$html$Html$Attributes$id, options.id),
						A2(
						$elm$core$Maybe$andThen,
						$rundis$elm_bootstrap$Bootstrap$Form$Select$sizeAttribute(options.custom),
						options.size),
						A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Form$Select$customEventOnChange, options.onChange),
						A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Form$Select$validationAttribute, options.validation)
					])),
			options.attributes));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$view = function (_v0) {
	var options = _v0.a.options;
	var items = _v0.a.items;
	return A2(
		$elm$html$Html$select,
		$rundis$elm_bootstrap$Bootstrap$Form$Select$toAttributes(options),
		A2(
			$elm$core$List$map,
			function (_v1) {
				var e = _v1.a;
				return e;
			},
			items));
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$select = F2(
	function (options, items) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Select$view(
			A2($rundis$elm_bootstrap$Bootstrap$Form$Select$create, options, items));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$Select$Item = function (a) {
	return {$: 'Item', a: a};
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $rundis$elm_bootstrap$Bootstrap$Form$Select$item = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Form$Select$Item(
			A2($elm$html$Html$option, attributes, children));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$View$LibraryEdit$selectitem = F2(
	function (valueSelected, _v0) {
		var value1 = _v0.a;
		var text1 = _v0.b;
		return _Utils_eq(valueSelected, value1) ? A2(
			$rundis$elm_bootstrap$Bootstrap$Form$Select$item,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$selected(true),
					$elm$html$Html$Attributes$value(value1)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(text1)
				])) : A2(
			$rundis$elm_bootstrap$Bootstrap$Form$Select$item,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(value1)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(text1)
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Success = {$: 'Success'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$success = $rundis$elm_bootstrap$Bootstrap$Form$Input$Validation($rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Success);
var $rundis$elm_bootstrap$Bootstrap$Form$Select$success = $rundis$elm_bootstrap$Bootstrap$Form$Select$Validation($rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Success);
var $rundis$elm_bootstrap$Bootstrap$Form$Textarea$success = $rundis$elm_bootstrap$Bootstrap$Form$Textarea$Validation($rundis$elm_bootstrap$Bootstrap$Form$FormInternal$Success);
var $author$project$View$LibraryEdit$viewBookDetail = function (config) {
	var _v0 = config;
	var book = _v0.book;
	var titleInputFeedback = A2($author$project$View$LibraryEdit$checkTitle, 'title', book.title);
	var publishedDateInputFeedback = A2($author$project$View$LibraryEdit$checkPublishedDate, 'publishedDate', book.publishedDate);
	var ownerInputFeedback = A2($author$project$View$LibraryEdit$checkOwner, 'owner', book.owner);
	var locationInputFeedback = A2($author$project$View$LibraryEdit$checkLocation, 'location', book.location);
	var languageInputFeedback = A2($author$project$View$LibraryEdit$checkLanguage, 'language', book.language);
	var descriptionInputFeedback = A2($author$project$View$LibraryEdit$checkDescription, 'description', book.description);
	var authorsInputFeedback = A2($author$project$View$LibraryEdit$checkAuthors, 'author(s)', book.authors);
	var allOk = (titleInputFeedback === '') && ((authorsInputFeedback === '') && ((descriptionInputFeedback === '') && ((publishedDateInputFeedback === '') && ((languageInputFeedback === '') && ((ownerInputFeedback === '') && (locationInputFeedback === ''))))));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Title')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$id('title'),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$View$LibraryEdit$UpdateTitle),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(book.title),
										(titleInputFeedback === '') ? $rundis$elm_bootstrap$Bootstrap$Form$Input$success : $rundis$elm_bootstrap$Bootstrap$Form$Input$danger
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(titleInputFeedback)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Author(s)')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$id('authors'),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$View$LibraryEdit$UpdateAuthors),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(book.authors),
										(authorsInputFeedback === '') ? $rundis$elm_bootstrap$Bootstrap$Form$Input$success : $rundis$elm_bootstrap$Bootstrap$Form$Input$danger
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(authorsInputFeedback)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Description')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Textarea$textarea(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Textarea$id('description'),
										$rundis$elm_bootstrap$Bootstrap$Form$Textarea$rows(5),
										$rundis$elm_bootstrap$Bootstrap$Form$Textarea$onInput($author$project$View$LibraryEdit$UpdateDescription),
										$rundis$elm_bootstrap$Bootstrap$Form$Textarea$value(book.description),
										(descriptionInputFeedback === '') ? $rundis$elm_bootstrap$Bootstrap$Form$Textarea$success : $rundis$elm_bootstrap$Bootstrap$Form$Textarea$danger
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(descriptionInputFeedback)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Published date')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$id('publishedDate'),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$View$LibraryEdit$UpdatePublishedDate),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(book.publishedDate),
										(publishedDateInputFeedback === '') ? $rundis$elm_bootstrap$Bootstrap$Form$Input$success : $rundis$elm_bootstrap$Bootstrap$Form$Input$danger
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(publishedDateInputFeedback)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Language')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$Select$select,
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Select$id('language'),
										$rundis$elm_bootstrap$Bootstrap$Form$Select$onChange($author$project$View$LibraryEdit$UpdateLanguage),
										(languageInputFeedback === '') ? $rundis$elm_bootstrap$Bootstrap$Form$Select$success : $rundis$elm_bootstrap$Bootstrap$Form$Select$danger
									]),
								A2(
									$elm$core$List$map,
									$author$project$View$LibraryEdit$selectitem(book.language),
									$author$project$Utils$languages)),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(languageInputFeedback)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Owner of the book')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$email(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$id('owner'),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$View$LibraryEdit$UpdateOwner),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(book.owner),
										(ownerInputFeedback === '') ? $rundis$elm_bootstrap$Bootstrap$Form$Input$success : $rundis$elm_bootstrap$Bootstrap$Form$Input$danger
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(ownerInputFeedback)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Location of the book')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$Select$select,
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Select$id('location'),
										$rundis$elm_bootstrap$Bootstrap$Form$Select$onChange($author$project$View$LibraryEdit$UpdateLocation),
										(locationInputFeedback === '') ? $rundis$elm_bootstrap$Bootstrap$Form$Select$success : $rundis$elm_bootstrap$Bootstrap$Form$Select$danger
									]),
								A2(
									$elm$core$List$map,
									$author$project$View$LibraryEdit$selectitem(book.location),
									$author$project$Utils$locations)),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$invalidFeedback,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(locationInputFeedback)
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Image of the book')
									])),
								$rundis$elm_bootstrap$Bootstrap$Table$simpleTable(
								_Utils_Tuple2(
									A2($rundis$elm_bootstrap$Bootstrap$Table$thead, _List_Nil, _List_Nil),
									A2(
										$rundis$elm_bootstrap$Bootstrap$Table$tbody,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Table$tr,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$rundis$elm_bootstrap$Bootstrap$Table$td,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$img,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$src(book.thumbnail)
																	]),
																_List_Nil)
															]))
													]))
											]))))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Table$simpleTable(
								_Utils_Tuple2(
									A2($rundis$elm_bootstrap$Bootstrap$Table$thead, _List_Nil, _List_Nil),
									A2(
										$rundis$elm_bootstrap$Bootstrap$Table$tbody,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$rundis$elm_bootstrap$Bootstrap$Table$tr,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$rundis$elm_bootstrap$Bootstrap$Table$td,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$rundis$elm_bootstrap$Bootstrap$Button$button,
																_List_fromArray(
																	[
																		$rundis$elm_bootstrap$Bootstrap$Button$outlineInfo,
																		$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																		$rundis$elm_bootstrap$Bootstrap$Button$disabled(true)
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('<')
																	]))
															])),
														A2(
														$rundis$elm_bootstrap$Bootstrap$Table$td,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$rundis$elm_bootstrap$Bootstrap$Button$button,
																_List_fromArray(
																	[
																		$rundis$elm_bootstrap$Bootstrap$Button$outlineSecondary,
																		$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																		$rundis$elm_bootstrap$Bootstrap$Button$onClick($author$project$View$LibraryEdit$DoCancel)
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Cancel')
																	]))
															])),
														A2(
														$rundis$elm_bootstrap$Bootstrap$Table$td,
														_List_fromArray(
															[
																$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
																$elm$html$Html$Attributes$hidden(!config.doInsert.visible))
															]),
														_List_fromArray(
															[
																A2(
																$rundis$elm_bootstrap$Bootstrap$Button$button,
																_List_fromArray(
																	[
																		$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
																		$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																		$rundis$elm_bootstrap$Bootstrap$Button$onClick($author$project$View$LibraryEdit$DoInsert),
																		$rundis$elm_bootstrap$Bootstrap$Button$disabled(!allOk)
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Insert')
																	]))
															])),
														A2(
														$rundis$elm_bootstrap$Bootstrap$Table$td,
														_List_fromArray(
															[
																$rundis$elm_bootstrap$Bootstrap$Table$cellAttr(
																$elm$html$Html$Attributes$hidden(!config.doUpdate.visible))
															]),
														_List_fromArray(
															[
																A2(
																$rundis$elm_bootstrap$Bootstrap$Button$button,
																_List_fromArray(
																	[
																		$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
																		$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																		$rundis$elm_bootstrap$Bootstrap$Button$onClick($author$project$View$LibraryEdit$DoUpdate),
																		$rundis$elm_bootstrap$Bootstrap$Button$disabled(!allOk)
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Update')
																	]))
															])),
														A2(
														$rundis$elm_bootstrap$Bootstrap$Table$td,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$rundis$elm_bootstrap$Bootstrap$Button$button,
																_List_fromArray(
																	[
																		$rundis$elm_bootstrap$Bootstrap$Button$outlineInfo,
																		$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																		$rundis$elm_bootstrap$Bootstrap$Button$disabled(true)
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('>')
																	]))
															]))
													]))
											]))))
							]))
					]))
			]));
};
var $author$project$View$LibraryEdit$view = function (config) {
	return $author$project$View$LibraryEdit$viewBookDetail(config);
};
var $author$project$View$LibraryTiles$UpdateSearchAuthors = function (a) {
	return {$: 'UpdateSearchAuthors', a: a};
};
var $author$project$View$LibraryTiles$UpdateSearchCheckStatus = function (a) {
	return {$: 'UpdateSearchCheckStatus', a: a};
};
var $author$project$View$LibraryTiles$UpdateSearchCheckoutUser = function (a) {
	return {$: 'UpdateSearchCheckoutUser', a: a};
};
var $author$project$View$LibraryTiles$UpdateSearchLocation = function (a) {
	return {$: 'UpdateSearchLocation', a: a};
};
var $author$project$View$LibraryTiles$UpdateSearchOwner = function (a) {
	return {$: 'UpdateSearchOwner', a: a};
};
var $author$project$View$LibraryTiles$UpdateSearchTitle = function (a) {
	return {$: 'UpdateSearchTitle', a: a};
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Utils$checkedStatusList = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('available', 'Available books'),
			_Utils_Tuple2('checkedout', 'Checked out books')
		]));
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$View$LibraryTiles$addCheckoutUser = F2(
	function (maybeCheckout, users) {
		if (maybeCheckout.$ === 'Just') {
			var checkout = maybeCheckout.a;
			return (checkout.userEmail === '') ? users : (A2(
				$elm$core$List$member,
				_Utils_Tuple2(checkout.userEmail, checkout.userEmail),
				users) ? users : A2(
				$elm$core$List$cons,
				_Utils_Tuple2(checkout.userEmail, checkout.userEmail),
				users));
		} else {
			return users;
		}
	});
var $author$project$View$LibraryTiles$getCheckoutUsers = function (webDataCheckouts) {
	if (webDataCheckouts.$ === 'Success') {
		var actualCheckouts = webDataCheckouts.a;
		return A3(
			$elm$core$List$foldl,
			$author$project$View$LibraryTiles$addCheckoutUser,
			_List_Nil,
			$elm$core$Array$toList(actualCheckouts));
	} else {
		return _List_Nil;
	}
};
var $author$project$View$LibraryTiles$addLocation = F2(
	function (book, locations) {
		return (book.location === '') ? locations : (A2(
			$elm$core$List$member,
			_Utils_Tuple2(book.location, book.location),
			locations) ? locations : A2(
			$elm$core$List$cons,
			_Utils_Tuple2(book.location, book.location),
			locations));
	});
var $author$project$View$LibraryTiles$getLocations = function (webDataBooks) {
	if (webDataBooks.$ === 'Success') {
		var actualBooks = webDataBooks.a;
		return A3(
			$elm$core$List$foldl,
			$author$project$View$LibraryTiles$addLocation,
			_List_Nil,
			$elm$core$Array$toList(actualBooks));
	} else {
		return _List_Nil;
	}
};
var $author$project$View$LibraryTiles$addOwner = F2(
	function (book, owners) {
		return (book.owner === '') ? owners : (A2(
			$elm$core$List$member,
			_Utils_Tuple2(book.owner, book.owner),
			owners) ? owners : A2(
			$elm$core$List$cons,
			_Utils_Tuple2(book.owner, book.owner),
			owners));
	});
var $author$project$View$LibraryTiles$getOwners = function (webDataBooks) {
	if (webDataBooks.$ === 'Success') {
		var actualBooks = webDataBooks.a;
		return A3(
			$elm$core$List$foldl,
			$author$project$View$LibraryTiles$addOwner,
			_List_Nil,
			$elm$core$Array$toList(actualBooks));
	} else {
		return _List_Nil;
	}
};
var $author$project$View$LibraryTiles$selectitem = F2(
	function (valueSelected, _v0) {
		var value1 = _v0.a;
		var text1 = _v0.b;
		var _v1 = _Utils_eq(valueSelected, value1);
		if (_v1) {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Form$Select$item,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$selected(true),
						$elm$html$Html$Attributes$value(value1)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(text1)
					]));
		} else {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Form$Select$item,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(value1)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(text1)
					]));
		}
	});
var $rundis$elm_bootstrap$Bootstrap$General$Internal$SM = {$: 'SM'};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$Size = function (a) {
	return {$: 'Size', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Input$small = $rundis$elm_bootstrap$Bootstrap$Form$Input$Size($rundis$elm_bootstrap$Bootstrap$General$Internal$SM);
var $author$project$View$LibraryTiles$viewBookFilter = function (config) {
	var _v0 = config;
	var books = _v0.books;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						config.showSearchTitle ? A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Title')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$small,
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(config.searchTitle),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$View$LibraryTiles$UpdateSearchTitle)
									]))
							])) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
						config.showSearchAuthors ? A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Author(s)')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$small,
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(config.searchAuthors),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput($author$project$View$LibraryTiles$UpdateSearchAuthors)
									]))
							])) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
						config.showSearchLocation ? A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Location')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$Select$select,
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Select$onChange($author$project$View$LibraryTiles$UpdateSearchLocation)
									]),
								A2(
									$elm$core$List$map,
									$author$project$View$LibraryTiles$selectitem(config.searchLocation),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2('', ''),
										$author$project$View$LibraryTiles$getLocations(books))))
							])) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
						config.showSearchOwner ? A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Owner')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$Select$select,
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Select$onChange($author$project$View$LibraryTiles$UpdateSearchOwner)
									]),
								A2(
									$elm$core$List$map,
									$author$project$View$LibraryTiles$selectitem(config.searchOwner),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2('', ''),
										$author$project$View$LibraryTiles$getOwners(books))))
							])) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
						config.showSearchCheckStatus ? A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Availability')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$Select$select,
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Select$onChange($author$project$View$LibraryTiles$UpdateSearchCheckStatus)
									]),
								A2(
									$elm$core$List$map,
									$author$project$View$LibraryTiles$selectitem(config.searchCheckStatus),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2('', ''),
										$elm$core$Dict$toList($author$project$Utils$checkedStatusList))))
							])) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
						config.showSearchCheckoutUser ? A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Checked out by')
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$Select$select,
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Select$onChange($author$project$View$LibraryTiles$UpdateSearchCheckoutUser)
									]),
								A2(
									$elm$core$List$map,
									$author$project$View$LibraryTiles$selectitem(config.searchCheckoutUser),
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2('', ''),
										$author$project$View$LibraryTiles$getCheckoutUsers(config.checkoutsDistributed))))
							])) : A2($elm$html$Html$div, _List_Nil, _List_Nil)
					]))
			]));
};
var $elm$html$Html$br = _VirtualDom_node('br');
var $rundis$elm_bootstrap$Bootstrap$Spinner$Color = function (a) {
	return {$: 'Color', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Spinner$color = function (color_) {
	return $rundis$elm_bootstrap$Bootstrap$Spinner$Color(color_);
};
var $rundis$elm_bootstrap$Bootstrap$Spinner$Large = {$: 'Large'};
var $rundis$elm_bootstrap$Bootstrap$Spinner$Size = function (a) {
	return {$: 'Size', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Spinner$large = $rundis$elm_bootstrap$Bootstrap$Spinner$Size($rundis$elm_bootstrap$Bootstrap$Spinner$Large);
var $elm$html$Html$p = _VirtualDom_node('p');
var $rundis$elm_bootstrap$Bootstrap$Internal$Role$Primary = {$: 'Primary'};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$Role = function (a) {
	return {$: 'Role', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Text$primary = $rundis$elm_bootstrap$Bootstrap$Internal$Text$Role($rundis$elm_bootstrap$Bootstrap$Internal$Role$Primary);
var $rundis$elm_bootstrap$Bootstrap$Spinner$applyModifier = F2(
	function (modifier, options) {
		switch (modifier.$) {
			case 'Kind':
				var spinnerKind = modifier.a;
				return _Utils_update(
					options,
					{kind: spinnerKind});
			case 'Size':
				var spinnerSize = modifier.a;
				return _Utils_update(
					options,
					{size: spinnerSize});
			case 'Color':
				var color_ = modifier.a;
				return _Utils_update(
					options,
					{
						color: $elm$core$Maybe$Just(color_)
					});
			default:
				var list = modifier.a;
				return _Utils_update(
					options,
					{attributes: list});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Spinner$Border = {$: 'Border'};
var $rundis$elm_bootstrap$Bootstrap$Spinner$Normal = {$: 'Normal'};
var $rundis$elm_bootstrap$Bootstrap$Spinner$defaultOptions = {attributes: _List_Nil, color: $elm$core$Maybe$Nothing, kind: $rundis$elm_bootstrap$Bootstrap$Spinner$Border, size: $rundis$elm_bootstrap$Bootstrap$Spinner$Normal};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $rundis$elm_bootstrap$Bootstrap$Spinner$kindClassName = function (kind_) {
	if (kind_.$ === 'Border') {
		return 'spinner-border';
	} else {
		return 'spinner-grow';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Spinner$kindClass = A2($elm$core$Basics$composeL, $elm$html$Html$Attributes$class, $rundis$elm_bootstrap$Bootstrap$Spinner$kindClassName);
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $rundis$elm_bootstrap$Bootstrap$Spinner$sizeAttributes = F2(
	function (size_, kind_) {
		switch (size_.$) {
			case 'Normal':
				return $elm$core$Maybe$Nothing;
			case 'Small':
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							$rundis$elm_bootstrap$Bootstrap$Spinner$kindClassName(kind_) + '-sm')
						]));
			default:
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '3rem'),
							A2($elm$html$Html$Attributes$style, 'height', '3rem')
						]));
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass = function (color) {
	if (color.$ === 'White') {
		return $elm$html$Html$Attributes$class('text-white');
	} else {
		var role = color.a;
		return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'text', role);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Spinner$toAttributes = function (options) {
	return _Utils_ap(
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$core$Maybe$Just(
					$rundis$elm_bootstrap$Bootstrap$Spinner$kindClass(options.kind)),
					A2($elm$core$Maybe$map, $rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass, options.color)
				])),
		_Utils_ap(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2($rundis$elm_bootstrap$Bootstrap$Spinner$sizeAttributes, options.size, options.kind)),
			_Utils_ap(
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'role', 'status')
					]),
				options.attributes)));
};
var $rundis$elm_bootstrap$Bootstrap$Spinner$spinner = F2(
	function (options, children) {
		var opts = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Spinner$applyModifier, $rundis$elm_bootstrap$Bootstrap$Spinner$defaultOptions, options);
		return A2(
			$elm$html$Html$div,
			$rundis$elm_bootstrap$Bootstrap$Spinner$toAttributes(opts),
			children);
	});
var $elm$html$Html$span = _VirtualDom_node('span');
var $rundis$elm_bootstrap$Bootstrap$Spinner$srMessage = function (msg) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sr-only')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(msg)
			]));
};
var $author$project$View$LibraryTiles$bookCheckoutIndex = F3(
	function (book, checkout, index) {
		return {book: book, checkout: checkout, index: index};
	});
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$View$LibraryTiles$booksFilter = F2(
	function (_v0, _v1) {
		var searchTitle = _v0.searchTitle;
		var searchAuthors = _v0.searchAuthors;
		var searchOwner = _v0.searchOwner;
		var searchLocation = _v0.searchLocation;
		var searchCheckStatus = _v0.searchCheckStatus;
		var searchCheckoutUser = _v0.searchCheckoutUser;
		var book = _v1.book;
		var checkout = _v1.checkout;
		var index = _v1.index;
		return (($elm$core$String$isEmpty(searchTitle) || A2(
			$elm$core$String$contains,
			$elm$core$String$toUpper(searchTitle),
			$elm$core$String$toUpper(book.title))) && (($elm$core$String$isEmpty(searchAuthors) || A2(
			$elm$core$String$contains,
			$elm$core$String$toUpper(searchAuthors),
			$elm$core$String$toUpper(book.authors))) && (($elm$core$String$isEmpty(searchOwner) || _Utils_eq(searchOwner, book.owner)) && (($elm$core$String$isEmpty(searchLocation) || _Utils_eq(searchOwner, book.location)) && (($elm$core$String$isEmpty(searchCheckStatus) || (((searchCheckStatus === 'available') && _Utils_eq(checkout, $elm$core$Maybe$Nothing)) || ((searchCheckStatus === 'checkedout') && (!_Utils_eq(checkout, $elm$core$Maybe$Nothing))))) && ($elm$core$String$isEmpty(searchCheckoutUser) || function () {
			if (checkout.$ === 'Just') {
				var checkout1 = checkout.a;
				return _Utils_eq(checkout1.userEmail, searchCheckoutUser);
			} else {
				return false;
			}
		}())))))) ? $elm$core$Maybe$Just(
			{book: book, checkout: checkout, index: index}) : $elm$core$Maybe$Nothing;
	});
var $elm$core$List$map3 = _List_map3;
var $author$project$View$LibraryTiles$DoDetail = function (a) {
	return {$: 'DoDetail', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$Attrs = function (a) {
	return {$: 'Attrs', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$attrs = function (attrs_) {
	return $rundis$elm_bootstrap$Bootstrap$Card$Internal$Attrs(attrs_);
};
var $rundis$elm_bootstrap$Bootstrap$Card$Config = function (a) {
	return {$: 'Config', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$CardBlock = function (a) {
	return {$: 'CardBlock', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyBlockModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 'AlignedBlock':
				var align = option.a;
				return _Utils_update(
					options,
					{
						aligned: $elm$core$Maybe$Just(align)
					});
			case 'BlockColoring':
				var role = option.a;
				return _Utils_update(
					options,
					{
						coloring: $elm$core$Maybe$Just(role)
					});
			case 'BlockTextColoring':
				var color = option.a;
				return _Utils_update(
					options,
					{
						textColoring: $elm$core$Maybe$Just(color)
					});
			default:
				var attrs = option.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultBlockOptions = {aligned: $elm$core$Maybe$Nothing, attributes: _List_Nil, coloring: $elm$core$Maybe$Nothing, textColoring: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption = function (dir) {
	switch (dir.$) {
		case 'Center':
			return 'center';
		case 'Left':
			return 'left';
		default:
			return 'right';
	}
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass = function (_v0) {
	var dir = _v0.dir;
	var size = _v0.size;
	return $elm$html$Html$Attributes$class(
		'text' + (A2(
			$elm$core$Maybe$withDefault,
			'-',
			A2(
				$elm$core$Maybe$map,
				function (s) {
					return '-' + (s + '-');
				},
				$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(size))) + $rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignDirOption(dir)));
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$blockAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyBlockModifier, $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultBlockOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card-body')
			]),
		_Utils_ap(
			function () {
				var _v0 = options.aligned;
				if (_v0.$ === 'Just') {
					var align = _v0.a;
					return _List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(align)
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.coloring;
					if (_v1.$ === 'Just') {
						var role = _v1.a;
						return _List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						var _v2 = options.textColoring;
						if (_v2.$ === 'Just') {
							var color = _v2.a;
							return _List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass(color)
								]);
						} else {
							return _List_Nil;
						}
					}(),
					options.attributes))));
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$block = F2(
	function (options, items) {
		return $rundis$elm_bootstrap$Bootstrap$Card$Internal$CardBlock(
			A2(
				$elm$html$Html$div,
				$rundis$elm_bootstrap$Bootstrap$Card$Internal$blockAttributes(options),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var e = _v0.a;
						return e;
					},
					items)));
	});
var $rundis$elm_bootstrap$Bootstrap$Card$block = F3(
	function (options, items, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Card$Config(
			_Utils_update(
				conf,
				{
					blocks: _Utils_ap(
						conf.blocks,
						_List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Card$Internal$block, options, items)
							]))
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Card$config = function (options) {
	return $rundis$elm_bootstrap$Bootstrap$Card$Config(
		{blocks: _List_Nil, footer: $elm$core$Maybe$Nothing, header: $elm$core$Maybe$Nothing, imgBottom: $elm$core$Maybe$Nothing, imgTop: $elm$core$Maybe$Nothing, options: options});
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Utils$getTimeZone = $elm$time$Time$utc;
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.start, posixMinutes) < 0) {
					return posixMinutes + era.offset;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		day: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		month: month,
		year: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).day;
	});
var $elm$time$Time$Apr = {$: 'Apr'};
var $elm$time$Time$Aug = {$: 'Aug'};
var $elm$time$Time$Dec = {$: 'Dec'};
var $elm$time$Time$Feb = {$: 'Feb'};
var $elm$time$Time$Jan = {$: 'Jan'};
var $elm$time$Time$Jul = {$: 'Jul'};
var $elm$time$Time$Jun = {$: 'Jun'};
var $elm$time$Time$Mar = {$: 'Mar'};
var $elm$time$Time$May = {$: 'May'};
var $elm$time$Time$Nov = {$: 'Nov'};
var $elm$time$Time$Oct = {$: 'Oct'};
var $elm$time$Time$Sep = {$: 'Sep'};
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).month;
		switch (_v0) {
			case 1:
				return $elm$time$Time$Jan;
			case 2:
				return $elm$time$Time$Feb;
			case 3:
				return $elm$time$Time$Mar;
			case 4:
				return $elm$time$Time$Apr;
			case 5:
				return $elm$time$Time$May;
			case 6:
				return $elm$time$Time$Jun;
			case 7:
				return $elm$time$Time$Jul;
			case 8:
				return $elm$time$Time$Aug;
			case 9:
				return $elm$time$Time$Sep;
			case 10:
				return $elm$time$Time$Oct;
			case 11:
				return $elm$time$Time$Nov;
			default:
				return $elm$time$Time$Dec;
		}
	});
var $author$project$Utils$toMonth = function (month) {
	switch (month.$) {
		case 'Jan':
			return 'januari';
		case 'Feb':
			return 'februari';
		case 'Mar':
			return 'march';
		case 'Apr':
			return 'april';
		case 'May':
			return 'may';
		case 'Jun':
			return 'june';
		case 'Jul':
			return 'july';
		case 'Aug':
			return 'august';
		case 'Sep':
			return 'september';
		case 'Oct':
			return 'oktober';
		case 'Nov':
			return 'november';
		default:
			return 'december';
	}
};
var $elm$time$Time$Fri = {$: 'Fri'};
var $elm$time$Time$Mon = {$: 'Mon'};
var $elm$time$Time$Sat = {$: 'Sat'};
var $elm$time$Time$Sun = {$: 'Sun'};
var $elm$time$Time$Thu = {$: 'Thu'};
var $elm$time$Time$Tue = {$: 'Tue'};
var $elm$time$Time$Wed = {$: 'Wed'};
var $elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _v0 = A2(
			$elm$core$Basics$modBy,
			7,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_v0) {
			case 0:
				return $elm$time$Time$Thu;
			case 1:
				return $elm$time$Time$Fri;
			case 2:
				return $elm$time$Time$Sat;
			case 3:
				return $elm$time$Time$Sun;
			case 4:
				return $elm$time$Time$Mon;
			case 5:
				return $elm$time$Time$Tue;
			default:
				return $elm$time$Time$Wed;
		}
	});
var $author$project$Utils$toWeekday = function (weekday) {
	switch (weekday.$) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).year;
	});
var $author$project$Utils$getNiceTime = function (datetime) {
	return $author$project$Utils$toWeekday(
		A2($elm$time$Time$toWeekday, $author$project$Utils$getTimeZone, datetime)) + (' ' + ($elm$core$String$fromInt(
		A2($elm$time$Time$toDay, $author$project$Utils$getTimeZone, datetime)) + (' ' + ($author$project$Utils$toMonth(
		A2($elm$time$Time$toMonth, $author$project$Utils$getTimeZone, datetime)) + (' ' + $elm$core$String$fromInt(
		A2($elm$time$Time$toYear, $author$project$Utils$getTimeZone, datetime)))))));
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$View$LibraryTiles$getthumbnail = function (book) {
	return A3($elm$core$String$replace, '&zoom=1&', '&zoom=7&', book.thumbnail);
};
var $rundis$elm_bootstrap$Bootstrap$Card$ImageBottom = function (a) {
	return {$: 'ImageBottom', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$imgBottom = F3(
	function (attributes, children, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Card$Config(
			_Utils_update(
				conf,
				{
					imgBottom: $elm$core$Maybe$Just(
						$rundis$elm_bootstrap$Bootstrap$Card$ImageBottom(
							A2(
								$elm$html$Html$img,
								_Utils_ap(
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('card-img-bottom')
										]),
									attributes),
								children)))
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Card$ImageTop = function (a) {
	return {$: 'ImageTop', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$imgTop = F3(
	function (attributes, children, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Card$Config(
			_Utils_update(
				conf,
				{
					imgTop: $elm$core$Maybe$Just(
						$rundis$elm_bootstrap$Bootstrap$Card$ImageTop(
							A2(
								$elm$html$Html$img,
								_Utils_ap(
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('card-img-top')
										]),
									attributes),
								children)))
				}));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem = function (a) {
	return {$: 'BlockItem', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Card$Block$text = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem(
			A2(
				$elm$html$Html$p,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card-text')
						]),
					attributes),
				children));
	});
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $rundis$elm_bootstrap$Bootstrap$Card$Block$title = F3(
	function (elemFn, attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Card$Internal$BlockItem(
			A2(
				elemFn,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('card-title'),
					attributes),
				children));
	});
var $rundis$elm_bootstrap$Bootstrap$Card$Block$titleH4 = $rundis$elm_bootstrap$Bootstrap$Card$Block$title($elm$html$Html$h4);
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $rundis$elm_bootstrap$Bootstrap$Card$Block$titleH6 = $rundis$elm_bootstrap$Bootstrap$Card$Block$title($elm$html$Html$h6);
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyModifier = F2(
	function (option, options) {
		switch (option.$) {
			case 'Aligned':
				var align = option.a;
				return _Utils_update(
					options,
					{
						aligned: $elm$core$Maybe$Just(align)
					});
			case 'Coloring':
				var coloring = option.a;
				return _Utils_update(
					options,
					{
						coloring: $elm$core$Maybe$Just(coloring)
					});
			case 'TextColoring':
				var coloring = option.a;
				return _Utils_update(
					options,
					{
						textColoring: $elm$core$Maybe$Just(coloring)
					});
			default:
				var attrs = option.a;
				return _Utils_update(
					options,
					{
						attributes: _Utils_ap(options.attributes, attrs)
					});
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultOptions = {aligned: $elm$core$Maybe$Nothing, attributes: _List_Nil, coloring: $elm$core$Maybe$Nothing, textColoring: $elm$core$Maybe$Nothing};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$cardAttributes = function (modifiers) {
	var options = A3($elm$core$List$foldl, $rundis$elm_bootstrap$Bootstrap$Card$Internal$applyModifier, $rundis$elm_bootstrap$Bootstrap$Card$Internal$defaultOptions, modifiers);
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card')
			]),
		_Utils_ap(
			function () {
				var _v0 = options.coloring;
				if (_v0.$ === 'Just') {
					if (_v0.a.$ === 'Roled') {
						var role = _v0.a.a;
						return _List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role)
							]);
					} else {
						var role = _v0.a.a;
						return _List_fromArray(
							[
								A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'border', role)
							]);
					}
				} else {
					return _List_Nil;
				}
			}(),
			_Utils_ap(
				function () {
					var _v1 = options.textColoring;
					if (_v1.$ === 'Just') {
						var color = _v1.a;
						return _List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Internal$Text$textColorClass(color)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						var _v2 = options.aligned;
						if (_v2.$ === 'Just') {
							var align = _v2.a;
							return _List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Internal$Text$textAlignClass(align)
								]);
						} else {
							return _List_Nil;
						}
					}(),
					options.attributes))));
};
var $rundis$elm_bootstrap$Bootstrap$Card$Internal$renderBlocks = function (blocks) {
	return A2(
		$elm$core$List$map,
		function (block_) {
			if (block_.$ === 'CardBlock') {
				var e = block_.a;
				return e;
			} else {
				var e = block_.a;
				return e;
			}
		},
		blocks);
};
var $rundis$elm_bootstrap$Bootstrap$Card$view = function (_v0) {
	var conf = _v0.a;
	return A2(
		$elm$html$Html$div,
		$rundis$elm_bootstrap$Bootstrap$Card$Internal$cardAttributes(conf.options),
		_Utils_ap(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						function (_v1) {
							var e = _v1.a;
							return e;
						},
						conf.header),
						A2(
						$elm$core$Maybe$map,
						function (_v2) {
							var e = _v2.a;
							return e;
						},
						conf.imgTop)
					])),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Card$Internal$renderBlocks(conf.blocks),
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							function (_v3) {
								var e = _v3.a;
								return e;
							},
							conf.footer),
							A2(
							$elm$core$Maybe$map,
							function (_v4) {
								var e = _v4.a;
								return e;
							},
							conf.imgBottom)
						])))));
};
var $author$project$View$LibraryTiles$viewBookTilesCard = F2(
	function (_v0, _v1) {
		var userEmail = _v0.userEmail;
		var book = _v1.book;
		var checkout = _v1.checkout;
		var index = _v1.index;
		if (checkout.$ === 'Just') {
			var checkout1 = checkout.a;
			return _Utils_eq(userEmail, checkout1.userEmail) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col-lg-3 col-md-4 mb-4'),
						$elm$html$Html$Events$onClick(
						$author$project$View$LibraryTiles$DoDetail(index))
					]),
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Card$view(
						A3(
							$rundis$elm_bootstrap$Bootstrap$Card$imgBottom,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									$author$project$View$LibraryTiles$getthumbnail(book)),
									$elm$html$Html$Attributes$class('bookselector-img-bottom')
								]),
							_List_Nil,
							A3(
								$rundis$elm_bootstrap$Bootstrap$Card$block,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH4,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('card-title text-truncate bookselector-text-title')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.title)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH6,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted bookselector-text-author')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.authors)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted small bookselector-text-published')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.publishedDate)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('card-text block-with-text bookselector-text-description')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.description)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted small bookselector-text-language')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.language)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-checkout-x')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Checked out!')
													])),
												A2(
												$elm$html$Html$p,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('small')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														'from ' + ($author$project$Utils$getNiceTime(checkout1.dateTimeFrom) + ', by You'))
													]))
											]))
									]),
								A3(
									$rundis$elm_bootstrap$Bootstrap$Card$imgTop,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(
											$author$project$View$LibraryTiles$getthumbnail(book)),
											$elm$html$Html$Attributes$class('bookselector-img-top')
										]),
									_List_Nil,
									$rundis$elm_bootstrap$Bootstrap$Card$config(
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Card$attrs(
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('card-checkout-x')
													]))
											]))))))
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col-lg-3 col-md-4 mb-4'),
						$elm$html$Html$Events$onClick(
						$author$project$View$LibraryTiles$DoDetail(index))
					]),
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Card$view(
						A3(
							$rundis$elm_bootstrap$Bootstrap$Card$imgBottom,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									$author$project$View$LibraryTiles$getthumbnail(book)),
									$elm$html$Html$Attributes$class('bookselector-img-bottom')
								]),
							_List_Nil,
							A3(
								$rundis$elm_bootstrap$Bootstrap$Card$block,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH4,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('card-title text-truncate bookselector-text-title')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.title)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH6,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted bookselector-text-author')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.authors)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted small bookselector-text-published')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.publishedDate)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('card-text block-with-text bookselector-text-description')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.description)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted small bookselector-text-language')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.language)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-checkout')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Checked out!')
													])),
												A2(
												$elm$html$Html$p,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('small')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														'from ' + ($author$project$Utils$getNiceTime(checkout1.dateTimeFrom) + (', by ' + checkout1.userEmail)))
													]))
											]))
									]),
								A3(
									$rundis$elm_bootstrap$Bootstrap$Card$imgTop,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(
											$author$project$View$LibraryTiles$getthumbnail(book)),
											$elm$html$Html$Attributes$class('bookselector-img-top')
										]),
									_List_Nil,
									$rundis$elm_bootstrap$Bootstrap$Card$config(
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Card$attrs(
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('card-checkout')
													]))
											]))))))
					]));
		} else {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col-lg-3 col-md-4 mb-4'),
						$elm$html$Html$Events$onClick(
						$author$project$View$LibraryTiles$DoDetail(index))
					]),
				_List_fromArray(
					[
						$rundis$elm_bootstrap$Bootstrap$Card$view(
						A3(
							$rundis$elm_bootstrap$Bootstrap$Card$imgBottom,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$src(
									$author$project$View$LibraryTiles$getthumbnail(book)),
									$elm$html$Html$Attributes$class('bookselector-img-bottom')
								]),
							_List_Nil,
							A3(
								$rundis$elm_bootstrap$Bootstrap$Card$block,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH4,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('card-title text-truncate bookselector-text-title')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.title)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH6,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted bookselector-text-author')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.authors)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted small bookselector-text-published')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.publishedDate)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('card-text block-with-text bookselector-text-description')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.description)
											])),
										A2(
										$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted small bookselector-text-language')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(book.language)
											]))
									]),
								A3(
									$rundis$elm_bootstrap$Bootstrap$Card$imgTop,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(
											$author$project$View$LibraryTiles$getthumbnail(book)),
											$elm$html$Html$Attributes$class('bookselector-img-top')
										]),
									_List_Nil,
									$rundis$elm_bootstrap$Bootstrap$Card$config(
										_List_fromArray(
											[
												$rundis$elm_bootstrap$Bootstrap$Card$attrs(_List_Nil)
											]))))))
					]));
		}
	});
var $author$project$View$LibraryTiles$viewBookTiles = F3(
	function (config, books, checkouts) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row')
				]),
			A2(
				$elm$core$List$map,
				$author$project$View$LibraryTiles$viewBookTilesCard(config),
				A2(
					$elm$core$List$filterMap,
					$author$project$View$LibraryTiles$booksFilter(
						{searchAuthors: config.searchAuthors, searchCheckStatus: config.searchCheckStatus, searchCheckoutUser: config.searchCheckoutUser, searchLocation: config.searchLocation, searchOwner: config.searchOwner, searchTitle: config.searchTitle}),
					A4(
						$elm$core$List$map3,
						$author$project$View$LibraryTiles$bookCheckoutIndex,
						$elm$core$Array$toList(books),
						$elm$core$Array$toList(checkouts),
						A2(
							$elm$core$List$range,
							0,
							$elm$core$Array$length(books) - 1)))));
	});
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$View$LibraryTiles$viewFetchError = function (errorMessage) {
	var errorHeading = 'Couldn\'t fetch posts at this time.';
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(errorHeading)
					])),
				$elm$html$Html$text('Error: ' + errorMessage)
			]));
};
var $author$project$View$LibraryTiles$viewBooks = function (config) {
	var _v0 = config;
	var books = _v0.books;
	var checkoutsDistributed = _v0.checkoutsDistributed;
	var books_checkouts = A2($author$project$View$LibraryTiles$merge2RemoteDatas, books, checkoutsDistributed);
	switch (books_checkouts.$) {
		case 'NotAsked':
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$html$Html$br, _List_Nil, _List_Nil)
							]))
					]));
		case 'Loading':
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Spinner$spinner,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Spinner$large,
								$rundis$elm_bootstrap$Bootstrap$Spinner$color($rundis$elm_bootstrap$Bootstrap$Text$primary)
							]),
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Spinner$srMessage('Loading...')
							]))
					]));
		case 'Success':
			var _v2 = books_checkouts.a;
			var actualBooks = _v2.a;
			var actualCheckouts = _v2.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('containerFluid')
					]),
				_List_fromArray(
					[
						A3($author$project$View$LibraryTiles$viewBookTiles, config, actualBooks, actualCheckouts)
					]));
		default:
			var httpError = books_checkouts.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						$author$project$View$LibraryTiles$viewFetchError(
						$author$project$Utils$buildErrorMessage(httpError))
					]));
	}
};
var $author$project$View$LibraryTiles$view = function (config) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row containerFluid')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col-lg-2 col-md-3 mb-4')
					]),
				_List_fromArray(
					[
						$author$project$View$LibraryTiles$viewBookFilter(config)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('col-lg-8')
					]),
				_List_fromArray(
					[
						$author$project$View$LibraryTiles$viewBooks(config)
					]))
			]));
};
var $author$project$BookEditor$DoDeleteConfirm = {$: 'DoDeleteConfirm'};
var $author$project$BookEditor$viewConfirmDelete = F2(
	function (index, model) {
		var bookdetails = model.bookdetails;
		return $author$project$View$LibraryDetails$view(
			_Utils_update(
				bookdetails,
				{
					doAction1: {disabled: false, msg: $author$project$BookEditor$DoDeleteConfirm, text: 'Confirm', visible: true},
					doAction2: {disabled: false, msg: $author$project$BookEditor$DoUpdate, text: 'Edit', visible: false},
					remarks: 'Please confirm that the book will be removed from the library.'
				}));
	});
var $author$project$BookEditor$DoUpdateConfirm = {$: 'DoUpdateConfirm'};
var $author$project$BookEditor$viewConfirmUpdate = F2(
	function (index, model) {
		var bookdetails = model.bookdetails;
		return $author$project$View$LibraryDetails$view(
			_Utils_update(
				bookdetails,
				{
					doAction1: {disabled: false, msg: $author$project$BookEditor$DoUpdateConfirm, text: 'Confirm', visible: true},
					doAction2: {disabled: false, msg: $author$project$BookEditor$DoUpdate, text: 'Edit', visible: false},
					remarks: 'Please confirm that the book will be updated in the library.'
				}));
	});
var $author$project$BookEditor$viewDetails = F2(
	function (index, model) {
		var bookdetails = model.bookdetails;
		var _v0 = bookdetails.maybeCheckout;
		if (_v0.$ === 'Just') {
			var checkout = _v0.a;
			return $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: true, msg: $author$project$BookEditor$DoDelete, text: 'Delete', visible: true},
						doAction2: {disabled: false, msg: $author$project$BookEditor$DoUpdate, text: 'Edit', visible: true},
						remarks: 'This book is checked out by ' + (checkout.userEmail + '.')
					}));
		} else {
			return $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$BookEditor$DoDelete, text: 'Delete', visible: true},
						doAction2: {disabled: false, msg: $author$project$BookEditor$DoUpdate, text: 'Edit', visible: true},
						remarks: ''
					}));
		}
	});
var $author$project$BookEditor$view = function (model) {
	var _v0 = model.bookView;
	switch (_v0.$) {
		case 'Tiles':
			return A2(
				$elm$html$Html$map,
				$author$project$BookEditor$LibraryTilesMsg,
				$author$project$View$LibraryTiles$view(model.booktiles));
		case 'Details':
			var index = _v0.a;
			return A2($author$project$BookEditor$viewDetails, index, model);
		case 'Update':
			var index = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$BookEditor$LibraryEditMsg,
				$author$project$View$LibraryEdit$view(model.bookedit));
		case 'ConfirmDelete':
			var index = _v0.a;
			return A2($author$project$BookEditor$viewConfirmDelete, index, model);
		case 'ConfirmUpdate':
			var index = _v0.a;
			return A2($author$project$BookEditor$viewConfirmUpdate, index, model);
		default:
			var index = _v0.a;
			return $author$project$View$LibraryDetails$view(model.bookdetails);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$Disabled = function (a) {
	return {$: 'Disabled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Form$Select$disabled = function (disabled_) {
	return $rundis$elm_bootstrap$Bootstrap$Form$Select$Disabled(disabled_);
};
var $author$project$View$SelectorDetails$selectitem = F2(
	function (valueSelected, _v0) {
		var value1 = _v0.a;
		var text1 = _v0.b;
		var _v1 = _Utils_eq(valueSelected, value1);
		if (_v1) {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Form$Select$item,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$selected(true),
						$elm$html$Html$Attributes$value(value1)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(text1)
					]));
		} else {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Form$Select$item,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(value1)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(text1)
					]));
		}
	});
var $author$project$View$SelectorDetails$viewBookDetail = function (config) {
	var _v0 = config;
	var maybeBook = _v0.maybeBook;
	if (maybeBook.$ === 'Just') {
		var book = maybeBook.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$rundis$elm_bootstrap$Bootstrap$Form$form,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$group,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Title')
										])),
									$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Form$Input$id('title'),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$value(book.title),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
										]))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$group,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Author(s)')
										])),
									$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Form$Input$id('authors'),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$value(book.authors),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
										]))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$group,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Description')
										])),
									$rundis$elm_bootstrap$Bootstrap$Form$Textarea$textarea(
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Form$Textarea$id('description'),
											$rundis$elm_bootstrap$Bootstrap$Form$Textarea$rows(5),
											$rundis$elm_bootstrap$Bootstrap$Form$Textarea$value(book.description),
											$rundis$elm_bootstrap$Bootstrap$Form$Textarea$disabled
										]))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$group,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Published date')
										])),
									$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Form$Input$id('publishedDate'),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$value(book.publishedDate),
											$rundis$elm_bootstrap$Bootstrap$Form$Input$disabled(true)
										]))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$group,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Language')
										])),
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$Select$select,
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Form$Select$id('language'),
											$rundis$elm_bootstrap$Bootstrap$Form$Select$disabled(true)
										]),
									A2(
										$elm$core$List$map,
										$author$project$View$SelectorDetails$selectitem(book.language),
										$author$project$Utils$languages))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$group,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Form$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Image of the book')
										])),
									$rundis$elm_bootstrap$Bootstrap$Table$simpleTable(
									_Utils_Tuple2(
										A2($rundis$elm_bootstrap$Bootstrap$Table$thead, _List_Nil, _List_Nil),
										A2(
											$rundis$elm_bootstrap$Bootstrap$Table$tbody,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$rundis$elm_bootstrap$Bootstrap$Table$tr,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$rundis$elm_bootstrap$Bootstrap$Table$td,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$img,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$src(book.thumbnail)
																		]),
																	_List_Nil)
																]))
														]))
												]))))
								])),
							A2(
							$rundis$elm_bootstrap$Bootstrap$Form$group,
							_List_Nil,
							_List_fromArray(
								[
									$rundis$elm_bootstrap$Bootstrap$Table$simpleTable(
									_Utils_Tuple2(
										A2($rundis$elm_bootstrap$Bootstrap$Table$thead, _List_Nil, _List_Nil),
										A2(
											$rundis$elm_bootstrap$Bootstrap$Table$tbody,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$rundis$elm_bootstrap$Bootstrap$Table$tr,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$rundis$elm_bootstrap$Bootstrap$Table$td,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$rundis$elm_bootstrap$Bootstrap$Button$button,
																	_List_fromArray(
																		[
																			$rundis$elm_bootstrap$Bootstrap$Button$outlineInfo,
																			$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																			$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doPrevious),
																			$rundis$elm_bootstrap$Bootstrap$Button$disabled(!config.hasPrevious)
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('<')
																		]))
																])),
															A2(
															$rundis$elm_bootstrap$Bootstrap$Table$td,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$rundis$elm_bootstrap$Bootstrap$Button$button,
																	_List_fromArray(
																		[
																			$rundis$elm_bootstrap$Bootstrap$Button$outlineSecondary,
																			$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																			$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doCancel)
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Cancel')
																		]))
																])),
															A2(
															$rundis$elm_bootstrap$Bootstrap$Table$td,
															_List_Nil,
															A2(
																$elm$core$List$cons,
																A2(
																	$rundis$elm_bootstrap$Bootstrap$Button$button,
																	_List_fromArray(
																		[
																			$rundis$elm_bootstrap$Bootstrap$Button$outlinePrimary,
																			$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																			$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doAction),
																			$rundis$elm_bootstrap$Bootstrap$Button$disabled(config.doActionDisabled)
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text(config.textAction)
																		])),
																config.actionHtml)),
															A2(
															$rundis$elm_bootstrap$Bootstrap$Table$td,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$rundis$elm_bootstrap$Bootstrap$Button$button,
																	_List_fromArray(
																		[
																			$rundis$elm_bootstrap$Bootstrap$Button$outlineInfo,
																			$rundis$elm_bootstrap$Bootstrap$Button$attrs(_List_Nil),
																			$rundis$elm_bootstrap$Bootstrap$Button$onClick(config.doNext),
																			$rundis$elm_bootstrap$Bootstrap$Button$disabled(!config.hasNext)
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('>')
																		]))
																]))
														]))
												]))))
								]))
						]))
				]));
	} else {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Oeps : BookDetails.elm config.book = Nothing')
				]));
	}
};
var $author$project$View$SelectorDetails$view = function (config) {
	return $author$project$View$SelectorDetails$viewBookDetail(config);
};
var $author$project$View$SelectorTiles$displaySearchIsbn = function (isbn) {
	return (!isbn) ? '' : $elm$core$String$fromInt(isbn);
};
var $elm$html$Html$small = _VirtualDom_node('small');
var $rundis$elm_bootstrap$Bootstrap$Form$help = F2(
	function (attributes, children) {
		return A2(
			$elm$html$Html$small,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('form-text text-muted'),
				attributes),
			children);
	});
var $author$project$View$SelectorTiles$viewBookSearcher = function (config) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$rundis$elm_bootstrap$Bootstrap$Form$form,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Title')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(config.searchTitle),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(config.updateSearchTitle)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$help,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('What is (part of) the title of the book.')
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Author(s)')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(config.searchAuthors),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(config.updateSearchAuthor)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$help,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('What is (part of) the authors of the book.')
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Isbn')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(
										$author$project$View$SelectorTiles$displaySearchIsbn(config.searchIsbn)),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(config.updateSearchIsbn)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$help,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('What is the Isbn of the book.')
									]))
							])),
						A2(
						$rundis$elm_bootstrap$Bootstrap$Form$group,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Keywords')
									])),
								$rundis$elm_bootstrap$Bootstrap$Form$Input$text(
								_List_fromArray(
									[
										$rundis$elm_bootstrap$Bootstrap$Form$Input$value(config.searchString),
										$rundis$elm_bootstrap$Bootstrap$Form$Input$onInput(config.updateSearchString)
									])),
								A2(
								$rundis$elm_bootstrap$Bootstrap$Form$help,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Keywords to find the book.')
									]))
							]))
					]))
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled = function (a) {
	return {$: 'Roled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Button$primary = $rundis$elm_bootstrap$Bootstrap$Internal$Button$Coloring(
	$rundis$elm_bootstrap$Bootstrap$Internal$Button$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Button$Primary));
var $author$project$View$SelectorTiles$getthumbnail = function (book) {
	return book.smallThumbnail;
};
var $author$project$View$SelectorTiles$viewBookTilesCard = F3(
	function (_v0, book, index) {
		var doAction = _v0.doAction;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('col-lg-4 col-md-6 mb-4'),
					$elm$html$Html$Events$onClick(
					doAction(index))
				]),
			_List_fromArray(
				[
					$rundis$elm_bootstrap$Bootstrap$Card$view(
					A3(
						$rundis$elm_bootstrap$Bootstrap$Card$imgBottom,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(
								$author$project$View$SelectorTiles$getthumbnail(book)),
								$elm$html$Html$Attributes$class('bookselector-img-bottom')
							]),
						_List_Nil,
						A3(
							$rundis$elm_bootstrap$Bootstrap$Card$block,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH4,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('card-title text-truncate bookselector-text-title')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(book.title)
										])),
									A2(
									$rundis$elm_bootstrap$Bootstrap$Card$Block$titleH6,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-muted bookselector-text-author')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(book.authors)
										])),
									A2(
									$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-muted small bookselector-text-published')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(book.publishedDate)
										])),
									A2(
									$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('card-text block-with-text bookselector-text-description')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(book.description)
										])),
									A2(
									$rundis$elm_bootstrap$Bootstrap$Card$Block$text,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-muted small bookselector-text-language')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(book.language)
										]))
								]),
							A3(
								$rundis$elm_bootstrap$Bootstrap$Card$imgTop,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src(
										$author$project$View$SelectorTiles$getthumbnail(book)),
										$elm$html$Html$Attributes$class('bookselector-img-top')
									]),
								_List_Nil,
								$rundis$elm_bootstrap$Bootstrap$Card$config(
									_List_fromArray(
										[
											$rundis$elm_bootstrap$Bootstrap$Card$attrs(_List_Nil)
										]))))))
				]));
	});
var $author$project$View$SelectorTiles$viewBookTiles = F2(
	function (config, books) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row')
				]),
			A3(
				$elm$core$List$map2,
				$author$project$View$SelectorTiles$viewBookTilesCard(config),
				$elm$core$Array$toList(books),
				A2(
					$elm$core$List$range,
					0,
					$elm$core$Array$length(books) - 1)));
	});
var $author$project$View$SelectorTiles$viewFetchError = function (errorMessage) {
	var errorHeading = 'Couldn\'t fetch posts at this time.';
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(errorHeading)
					])),
				$elm$html$Html$text('Error: ' + errorMessage)
			]));
};
var $author$project$View$SelectorTiles$viewBooks = function (config) {
	var _v0 = config;
	var books = _v0.books;
	var doSearch = _v0.doSearch;
	switch (books.$) {
		case 'NotAsked':
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Button$button,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Button$primary,
								$rundis$elm_bootstrap$Bootstrap$Button$attrs(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('float-left')
									])),
								$rundis$elm_bootstrap$Bootstrap$Button$onClick(doSearch)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Search')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$html$Html$br, _List_Nil, _List_Nil)
							]))
					]));
		case 'Loading':
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Spinner$spinner,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Spinner$large,
								$rundis$elm_bootstrap$Bootstrap$Spinner$color($rundis$elm_bootstrap$Bootstrap$Text$primary)
							]),
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Spinner$srMessage('Loading...')
							]))
					]));
		case 'Success':
			var actualBooks = books.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Button$button,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Button$primary,
								$rundis$elm_bootstrap$Bootstrap$Button$attrs(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('float-left')
									])),
								$rundis$elm_bootstrap$Bootstrap$Button$onClick(doSearch)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Search')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$html$Html$br, _List_Nil, _List_Nil)
							])),
						A2($author$project$View$SelectorTiles$viewBookTiles, config, actualBooks)
					]));
		default:
			var httpError = books.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$rundis$elm_bootstrap$Bootstrap$Button$button,
						_List_fromArray(
							[
								$rundis$elm_bootstrap$Bootstrap$Button$primary,
								$rundis$elm_bootstrap$Bootstrap$Button$attrs(
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('float-left')
									])),
								$rundis$elm_bootstrap$Bootstrap$Button$onClick(doSearch)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Search')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2($elm$html$Html$br, _List_Nil, _List_Nil)
							])),
						$author$project$View$SelectorTiles$viewFetchError(
						$author$project$Utils$buildErrorMessage(httpError))
					]));
	}
};
var $author$project$View$SelectorTiles$view = function (config) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$View$SelectorTiles$viewBookSearcher(config),
				$author$project$View$SelectorTiles$viewBooks(config)
			]));
};
var $author$project$BookSelector$view = function (model) {
	var _v0 = model.bookView;
	switch (_v0.$) {
		case 'Tiles':
			return $author$project$View$SelectorTiles$view(model.booktiles);
		case 'Details':
			var index = _v0.a;
			return $author$project$View$SelectorDetails$view(model.bookdetails);
		default:
			var index = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$BookSelector$LibraryEditMsg,
				$author$project$View$LibraryEdit$view(model.bookDetailsEdit));
	}
};
var $author$project$Checkin$DoCheckin = {$: 'DoCheckin'};
var $author$project$Checkin$viewConfirm = F2(
	function (index, model) {
		var bookdetails = model.bookdetails;
		var _v0 = bookdetails.maybeCheckout;
		if (_v0.$ === 'Just') {
			var checkout = _v0.a;
			return _Utils_eq(checkout.userEmail, bookdetails.userEmail) ? $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Checkin$DoCheckin, text: 'Confirm', visible: true},
						remarks: 'Please confirm that the book is checked in by ' + (bookdetails.userEmail + '.')
					})) : $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: true, msg: $author$project$Checkin$DoCheckin, text: 'Check out', visible: true},
						remarks: checkout.userEmail + (' checked this book out at ' + ($author$project$Utils$getNiceTime(checkout.dateTimeFrom) + '.'))
					}));
		} else {
			return $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Checkin$DoCheckout, text: 'Confirm', visible: true},
						remarks: 'Please confirm that the book is checked out by ' + (bookdetails.userEmail + '.')
					}));
		}
	});
var $author$project$Checkin$viewDetails = F2(
	function (index, model) {
		var bookdetails = model.bookdetails;
		var _v0 = bookdetails.maybeCheckout;
		if (_v0.$ === 'Just') {
			var checkout = _v0.a;
			return _Utils_eq(checkout.userEmail, bookdetails.userEmail) ? $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Checkin$DoCheckin, text: 'Check in', visible: true},
						remarks: 'You checked this book out at ' + ($author$project$Utils$getNiceTime(checkout.dateTimeFrom) + '.')
					})) : $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: true, msg: $author$project$Checkin$DoCheckout, text: 'Check out', visible: true},
						remarks: checkout.userEmail + (' checked this book out at ' + ($author$project$Utils$getNiceTime(checkout.dateTimeFrom) + '.'))
					}));
		} else {
			return $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Checkin$DoCheckout, text: 'Check out', visible: true},
						remarks: ''
					}));
		}
	});
var $author$project$Checkin$view = function (model) {
	var _v0 = model.bookView;
	switch (_v0.$) {
		case 'Tiles':
			return A2(
				$elm$html$Html$map,
				$author$project$Checkin$LibraryTilesMsg,
				$author$project$View$LibraryTiles$view(model.booktiles));
		case 'Details':
			var index = _v0.a;
			return A2($author$project$Checkin$viewDetails, index, model);
		case 'Confirm':
			var index = _v0.a;
			return A2($author$project$Checkin$viewConfirm, index, model);
		default:
			var index = _v0.a;
			return $author$project$View$LibraryDetails$view(model.bookdetails);
	}
};
var $author$project$Library$DoCheckin = {$: 'DoCheckin'};
var $author$project$Library$viewConfirm = F2(
	function (index, model) {
		var bookdetails = model.bookdetails;
		var _v0 = bookdetails.maybeCheckout;
		if (_v0.$ === 'Just') {
			var checkout = _v0.a;
			return _Utils_eq(checkout.userEmail, bookdetails.userEmail) ? $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Library$DoCheckin, text: 'Confirm', visible: true},
						remarks: 'Please confirm that the book is checked in by ' + (bookdetails.userEmail + '.')
					})) : $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: true, msg: $author$project$Library$DoCheckin, text: 'Check out', visible: true},
						remarks: checkout.userEmail + (' checked this book out at ' + ($author$project$Utils$getNiceTime(checkout.dateTimeFrom) + '.'))
					}));
		} else {
			return $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Library$DoCheckout, text: 'Confirm', visible: true},
						remarks: 'Please confirm that the book is checked out by ' + (bookdetails.userEmail + '.')
					}));
		}
	});
var $author$project$Library$viewDetails = F2(
	function (index, model) {
		var bookdetails = model.bookdetails;
		var _v0 = bookdetails.maybeCheckout;
		if (_v0.$ === 'Just') {
			var checkout = _v0.a;
			return _Utils_eq(checkout.userEmail, bookdetails.userEmail) ? $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Library$DoCheckin, text: 'Check in', visible: true},
						remarks: 'You checked this book out at ' + ($author$project$Utils$getNiceTime(checkout.dateTimeFrom) + '.')
					})) : $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: true, msg: $author$project$Library$DoCheckout, text: 'Check out', visible: true},
						remarks: checkout.userEmail + (' checked this book out at ' + ($author$project$Utils$getNiceTime(checkout.dateTimeFrom) + '.'))
					}));
		} else {
			return $author$project$View$LibraryDetails$view(
				_Utils_update(
					bookdetails,
					{
						doAction1: {disabled: false, msg: $author$project$Library$DoCheckout, text: 'Check out', visible: true},
						remarks: ''
					}));
		}
	});
var $author$project$Library$view = function (model) {
	var _v0 = model.bookView;
	switch (_v0.$) {
		case 'Tiles':
			return A2(
				$elm$html$Html$map,
				$author$project$Library$LibraryTilesMsg,
				$author$project$View$LibraryTiles$view(model.booktiles));
		case 'Details':
			var index = _v0.a;
			return A2($author$project$Library$viewDetails, index, model);
		case 'Confirm':
			var index = _v0.a;
			return A2($author$project$Library$viewConfirm, index, model);
		default:
			var index = _v0.a;
			return $author$project$View$LibraryDetails$view(model.bookdetails);
	}
};
var $author$project$Login$SignInRequested = {$: 'SignInRequested'};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Login$view = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Login')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('The login will take place via Google\'s OAuth authentication.'),
					A2($elm$html$Html$br, _List_Nil, _List_Nil),
					$elm$html$Html$text('Please take into account that only Lunatech\'s email addresses (lunatech.be, lunatech.fr, lunatech.nl) are allowed.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$primary,
							$rundis$elm_bootstrap$Bootstrap$Button$onClick($author$project$Login$SignInRequested)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Login via Google')
						]))
				]))
		]));
var $author$project$Logout$Logout = {$: 'Logout'};
var $author$project$Logout$view = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Logout')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Goodbye, hope to see you soon.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$rundis$elm_bootstrap$Bootstrap$Button$button,
					_List_fromArray(
						[
							$rundis$elm_bootstrap$Bootstrap$Button$primary,
							$rundis$elm_bootstrap$Bootstrap$Button$onClick($author$project$Logout$Logout)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Logout')
						]))
				]))
		]));
var $author$project$Menu$ChangedPage = function (a) {
	return {$: 'ChangedPage', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$Brand = function (a) {
	return {$: 'Brand', a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $rundis$elm_bootstrap$Bootstrap$Navbar$Config = function (a) {
	return {$: 'Config', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$updateConfig = F2(
	function (mapper, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Navbar$Config(
			mapper(conf));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$brand = F3(
	function (attributes, children, config_) {
		return A2(
			$rundis$elm_bootstrap$Bootstrap$Navbar$updateConfig,
			function (conf) {
				return _Utils_update(
					conf,
					{
						brand: $elm$core$Maybe$Just(
							$rundis$elm_bootstrap$Bootstrap$Navbar$Brand(
								A2(
									$elm$html$Html$a,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('navbar-brand')
											]),
										attributes),
									children)))
					});
			},
			config_);
	});
var $rundis$elm_bootstrap$Bootstrap$General$Internal$MD = {$: 'MD'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$updateOptions = F2(
	function (mapper, _v0) {
		var conf = _v0.a;
		return $rundis$elm_bootstrap$Bootstrap$Navbar$Config(
			_Utils_update(
				conf,
				{
					options: mapper(conf.options)
				}));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$toggleAt = F2(
	function (size, conf) {
		return A2(
			$rundis$elm_bootstrap$Bootstrap$Navbar$updateOptions,
			function (opt) {
				return _Utils_update(
					opt,
					{toggleAt: size});
			},
			conf);
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$collapseMedium = $rundis$elm_bootstrap$Bootstrap$Navbar$toggleAt($rundis$elm_bootstrap$Bootstrap$General$Internal$MD);
var $rundis$elm_bootstrap$Bootstrap$Internal$Role$Light = {$: 'Light'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$Light = {$: 'Light'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$Roled = function (a) {
	return {$: 'Roled', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$XS = {$: 'XS'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$config = function (toMsg) {
	return $rundis$elm_bootstrap$Bootstrap$Navbar$Config(
		{
			brand: $elm$core$Maybe$Nothing,
			customItems: _List_Nil,
			items: _List_Nil,
			options: {
				attributes: _List_Nil,
				fix: $elm$core$Maybe$Nothing,
				isContainer: false,
				scheme: $elm$core$Maybe$Just(
					{
						bgColor: $rundis$elm_bootstrap$Bootstrap$Navbar$Roled($rundis$elm_bootstrap$Bootstrap$Internal$Role$Light),
						modifier: $rundis$elm_bootstrap$Bootstrap$Navbar$Light
					}),
				toggleAt: $rundis$elm_bootstrap$Bootstrap$General$Internal$XS
			},
			toMsg: toMsg,
			withAnimation: false
		});
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$items = F2(
	function (items_, config_) {
		return A2(
			$rundis$elm_bootstrap$Bootstrap$Navbar$updateConfig,
			function (conf) {
				return _Utils_update(
					conf,
					{items: items_});
			},
			config_);
	});
var $author$project$Session$LoginPage = {$: 'LoginPage'};
var $author$project$Menu$menuActionsNoAccessToken = _List_fromArray(
	[
		{description: 'You must log in to use the library', imageLink: '', page: $author$project$Session$LoginPage, title: 'Login'}
	]);
var $author$project$Session$BookEditorPage = {$: 'BookEditorPage'};
var $author$project$Session$BookSelectorPage = {$: 'BookSelectorPage'};
var $author$project$Session$CheckinPage = {$: 'CheckinPage'};
var $author$project$Session$LibraryPage = {$: 'LibraryPage'};
var $author$project$Session$LogoutPage = {$: 'LogoutPage'};
var $author$project$Menu$menuActionsWithAccessToken = _List_fromArray(
	[
		{description: 'Add books to the library', imageLink: '', page: $author$project$Session$BookSelectorPage, title: 'Add books'},
		{description: 'Checkout books from the library', imageLink: '', page: $author$project$Session$LibraryPage, title: 'Library'},
		{description: 'Return books to the library', imageLink: '', page: $author$project$Session$CheckinPage, title: 'Checkin'},
		{description: 'Administer your books in the library', imageLink: '', page: $author$project$Session$BookEditorPage, title: 'Your books'},
		{description: 'Say goodbye', imageLink: '', page: $author$project$Session$LogoutPage, title: 'Logout'}
	]);
var $rundis$elm_bootstrap$Bootstrap$Navbar$maybeBrand = function (brand_) {
	if (brand_.$ === 'Just') {
		var b = brand_.a.a;
		return _List_fromArray(
			[b]);
	} else {
		return _List_Nil;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$sizeToComparable = function (size) {
	switch (size.$) {
		case 'XS':
			return 1;
		case 'SM':
			return 2;
		case 'MD':
			return 3;
		case 'LG':
			return 4;
		default:
			return 5;
	}
};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$LG = {$: 'LG'};
var $rundis$elm_bootstrap$Bootstrap$General$Internal$XL = {$: 'XL'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$toScreenSize = function (windowWidth) {
	return (windowWidth <= 576) ? $rundis$elm_bootstrap$Bootstrap$General$Internal$XS : ((windowWidth <= 768) ? $rundis$elm_bootstrap$Bootstrap$General$Internal$SM : ((windowWidth <= 992) ? $rundis$elm_bootstrap$Bootstrap$General$Internal$MD : ((windowWidth <= 1200) ? $rundis$elm_bootstrap$Bootstrap$General$Internal$LG : $rundis$elm_bootstrap$Bootstrap$General$Internal$XL)));
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$shouldHideMenu = F2(
	function (_v0, _v1) {
		var windowWidth = _v0.a.windowWidth;
		var options = _v1.options;
		var winMedia = function () {
			if (windowWidth.$ === 'Just') {
				var s = windowWidth.a;
				return $rundis$elm_bootstrap$Bootstrap$Navbar$toScreenSize(s);
			} else {
				return $rundis$elm_bootstrap$Bootstrap$General$Internal$XS;
			}
		}();
		return _Utils_cmp(
			$rundis$elm_bootstrap$Bootstrap$Navbar$sizeToComparable(winMedia),
			$rundis$elm_bootstrap$Bootstrap$Navbar$sizeToComparable(options.toggleAt)) > 0;
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$AnimatingDown = {$: 'AnimatingDown'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$AnimatingUp = {$: 'AnimatingUp'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$Shown = {$: 'Shown'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$StartDown = {$: 'StartDown'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$StartUp = {$: 'StartUp'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$visibilityTransition = F2(
	function (withAnimation_, visibility) {
		var _v0 = _Utils_Tuple2(withAnimation_, visibility);
		if (_v0.a) {
			switch (_v0.b.$) {
				case 'Hidden':
					var _v1 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$StartDown;
				case 'StartDown':
					var _v2 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$AnimatingDown;
				case 'AnimatingDown':
					var _v3 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Shown;
				case 'Shown':
					var _v4 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$StartUp;
				case 'StartUp':
					var _v5 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$AnimatingUp;
				default:
					var _v6 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Hidden;
			}
		} else {
			switch (_v0.b.$) {
				case 'Hidden':
					var _v7 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Shown;
				case 'Shown':
					var _v8 = _v0.b;
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Hidden;
				default:
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Hidden;
			}
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$transitionHandler = F2(
	function (state, configRec) {
		return $elm$json$Json$Decode$succeed(
			configRec.toMsg(
				A2(
					$rundis$elm_bootstrap$Bootstrap$Navbar$mapState,
					function (s) {
						return _Utils_update(
							s,
							{
								visibility: A2($rundis$elm_bootstrap$Bootstrap$Navbar$visibilityTransition, configRec.withAnimation, s.visibility)
							});
					},
					state)));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $rundis$elm_bootstrap$Bootstrap$Navbar$transitionStyle = function (maybeHeight) {
	var pixelHeight = A2(
		$elm$core$Maybe$withDefault,
		'0',
		A2(
			$elm$core$Maybe$map,
			function (v) {
				return $elm$core$String$fromFloat(v) + 'px';
			},
			maybeHeight));
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'position', 'relative'),
			A2($elm$html$Html$Attributes$style, 'height', pixelHeight),
			A2($elm$html$Html$Attributes$style, 'width', '100%'),
			A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
			A2($elm$html$Html$Attributes$style, '-webkit-transition-timing-function', 'ease'),
			A2($elm$html$Html$Attributes$style, '-o-transition-timing-function', 'ease'),
			A2($elm$html$Html$Attributes$style, 'transition-timing-function', 'ease'),
			A2($elm$html$Html$Attributes$style, '-webkit-transition-duration', '0.35s'),
			A2($elm$html$Html$Attributes$style, '-o-transition-duration', '0.35s'),
			A2($elm$html$Html$Attributes$style, 'transition-duration', '0.35s'),
			A2($elm$html$Html$Attributes$style, '-webkit-transition-property', 'height'),
			A2($elm$html$Html$Attributes$style, '-o-transition-property', 'height'),
			A2($elm$html$Html$Attributes$style, 'transition-property', 'height')
		]);
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$menuAttributes = F2(
	function (state, configRec) {
		var visibility = state.a.visibility;
		var height = state.a.height;
		var defaults = _List_fromArray(
			[
				$elm$html$Html$Attributes$class('collapse navbar-collapse')
			]);
		switch (visibility.$) {
			case 'Hidden':
				if (height.$ === 'Nothing') {
					return ((!configRec.withAnimation) || A2($rundis$elm_bootstrap$Bootstrap$Navbar$shouldHideMenu, state, configRec)) ? defaults : _List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'block'),
							A2($elm$html$Html$Attributes$style, 'height', '0'),
							A2($elm$html$Html$Attributes$style, 'overflow', 'hidden'),
							A2($elm$html$Html$Attributes$style, 'width', '100%')
						]);
				} else {
					return defaults;
				}
			case 'StartDown':
				return $rundis$elm_bootstrap$Bootstrap$Navbar$transitionStyle($elm$core$Maybe$Nothing);
			case 'AnimatingDown':
				return _Utils_ap(
					$rundis$elm_bootstrap$Bootstrap$Navbar$transitionStyle(height),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$Events$on,
							'transitionend',
							A2($rundis$elm_bootstrap$Bootstrap$Navbar$transitionHandler, state, configRec))
						]));
			case 'AnimatingUp':
				return _Utils_ap(
					$rundis$elm_bootstrap$Bootstrap$Navbar$transitionStyle($elm$core$Maybe$Nothing),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$Events$on,
							'transitionend',
							A2($rundis$elm_bootstrap$Bootstrap$Navbar$transitionHandler, state, configRec))
						]));
			case 'StartUp':
				return $rundis$elm_bootstrap$Bootstrap$Navbar$transitionStyle(height);
			default:
				return _Utils_ap(
					defaults,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('show')
						]));
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$menuWrapperAttributes = F2(
	function (state, confRec) {
		var visibility = state.a.visibility;
		var height = state.a.height;
		var styleBlock = _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'block'),
				A2($elm$html$Html$Attributes$style, 'width', '100%')
			]);
		var display = function () {
			if (height.$ === 'Nothing') {
				return ((!confRec.withAnimation) || A2($rundis$elm_bootstrap$Bootstrap$Navbar$shouldHideMenu, state, confRec)) ? 'flex' : 'block';
			} else {
				return 'flex';
			}
		}();
		switch (visibility.$) {
			case 'Hidden':
				return _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', display),
						A2($elm$html$Html$Attributes$style, 'width', '100%')
					]);
			case 'StartDown':
				return styleBlock;
			case 'AnimatingDown':
				return styleBlock;
			case 'AnimatingUp':
				return styleBlock;
			case 'StartUp':
				return styleBlock;
			default:
				return ((!confRec.withAnimation) || A2($rundis$elm_bootstrap$Bootstrap$Navbar$shouldHideMenu, state, confRec)) ? _List_fromArray(
					[
						$elm$html$Html$Attributes$class('collapse navbar-collapse show')
					]) : _List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'block')
					]);
		}
	});
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $rundis$elm_bootstrap$Bootstrap$Navbar$expandOption = function (size) {
	var toClass = function (sz) {
		return $elm$html$Html$Attributes$class(
			'navbar-expand' + A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					function (s) {
						return '-' + s;
					},
					$rundis$elm_bootstrap$Bootstrap$General$Internal$screenSizeOption(sz))));
	};
	switch (size.$) {
		case 'XS':
			return _List_fromArray(
				[
					toClass($rundis$elm_bootstrap$Bootstrap$General$Internal$SM)
				]);
		case 'SM':
			return _List_fromArray(
				[
					toClass($rundis$elm_bootstrap$Bootstrap$General$Internal$MD)
				]);
		case 'MD':
			return _List_fromArray(
				[
					toClass($rundis$elm_bootstrap$Bootstrap$General$Internal$LG)
				]);
		case 'LG':
			return _List_fromArray(
				[
					toClass($rundis$elm_bootstrap$Bootstrap$General$Internal$XL)
				]);
		default:
			return _List_Nil;
	}
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$fixOption = function (fix) {
	if (fix.$ === 'Top') {
		return 'fixed-top';
	} else {
		return 'fixed-bottom';
	}
};
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$backgroundColorOption = function (bgClass) {
	switch (bgClass.$) {
		case 'Roled':
			var role = bgClass.a;
			return A2($rundis$elm_bootstrap$Bootstrap$Internal$Role$toClass, 'bg', role);
		case 'Custom':
			var color = bgClass.a;
			return A2(
				$elm$html$Html$Attributes$style,
				'background-color',
				$avh4$elm_color$Color$toCssString(color));
		default:
			var classString = bgClass.a;
			return $elm$html$Html$Attributes$class(classString);
	}
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$linkModifierClass = function (modifier) {
	return $elm$html$Html$Attributes$class(
		function () {
			if (modifier.$ === 'Dark') {
				return 'navbar-dark';
			} else {
				return 'navbar-light';
			}
		}());
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$schemeAttributes = function (_v0) {
	var modifier = _v0.modifier;
	var bgColor = _v0.bgColor;
	return _List_fromArray(
		[
			$rundis$elm_bootstrap$Bootstrap$Navbar$linkModifierClass(modifier),
			$rundis$elm_bootstrap$Bootstrap$Navbar$backgroundColorOption(bgColor)
		]);
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$navbarAttributes = function (options) {
	return _Utils_ap(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('navbar', true),
						_Utils_Tuple2('container', options.isContainer)
					]))
			]),
		_Utils_ap(
			$rundis$elm_bootstrap$Bootstrap$Navbar$expandOption(options.toggleAt),
			_Utils_ap(
				function () {
					var _v0 = options.scheme;
					if (_v0.$ === 'Just') {
						var scheme_ = _v0.a;
						return $rundis$elm_bootstrap$Bootstrap$Navbar$schemeAttributes(scheme_);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						var _v1 = options.fix;
						if (_v1.$ === 'Just') {
							var fix = _v1.a;
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									$rundis$elm_bootstrap$Bootstrap$Navbar$fixOption(fix))
								]);
						} else {
							return _List_Nil;
						}
					}(),
					options.attributes))));
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$renderCustom = function (items_) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var item = _v0.a;
			return item;
		},
		items_);
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$Closed = {$: 'Closed'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$getOrInitDropdownStatus = F2(
	function (id, _v0) {
		var dropdowns = _v0.a.dropdowns;
		return A2(
			$elm$core$Maybe$withDefault,
			$rundis$elm_bootstrap$Bootstrap$Navbar$Closed,
			A2($elm$core$Dict$get, id, dropdowns));
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$Open = {$: 'Open'};
var $rundis$elm_bootstrap$Bootstrap$Navbar$toggleOpen = F3(
	function (state, id, _v0) {
		var toMsg = _v0.toMsg;
		var currStatus = A2($rundis$elm_bootstrap$Bootstrap$Navbar$getOrInitDropdownStatus, id, state);
		var newStatus = function () {
			switch (currStatus.$) {
				case 'Open':
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Closed;
				case 'ListenClicks':
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Closed;
				default:
					return $rundis$elm_bootstrap$Bootstrap$Navbar$Open;
			}
		}();
		return toMsg(
			A2(
				$rundis$elm_bootstrap$Bootstrap$Navbar$mapState,
				function (s) {
					return _Utils_update(
						s,
						{
							dropdowns: A3($elm$core$Dict$insert, id, newStatus, s.dropdowns)
						});
				},
				state));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$renderDropdownToggle = F4(
	function (state, id, configRec, _v0) {
		var attributes = _v0.a.attributes;
		var children = _v0.a.children;
		return A2(
			$elm$html$Html$a,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav-link dropdown-toggle'),
						$elm$html$Html$Attributes$href('#'),
						A2(
						$elm$html$Html$Events$custom,
						'click',
						$elm$json$Json$Decode$succeed(
							{
								message: A3($rundis$elm_bootstrap$Bootstrap$Navbar$toggleOpen, state, id, configRec),
								preventDefault: true,
								stopPropagation: false
							}))
					]),
				attributes),
			children);
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$renderDropdown = F3(
	function (state, configRec, _v0) {
		var ddRec = _v0.a;
		var needsDropup = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function (fix) {
					if (fix.$ === 'Bottom') {
						return true;
					} else {
						return false;
					}
				},
				configRec.options.fix));
		var isShown = !_Utils_eq(
			A2($rundis$elm_bootstrap$Bootstrap$Navbar$getOrInitDropdownStatus, ddRec.id, state),
			$rundis$elm_bootstrap$Bootstrap$Navbar$Closed);
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('nav-item', true),
							_Utils_Tuple2('dropdown', true),
							_Utils_Tuple2('shown', isShown),
							_Utils_Tuple2('dropup', needsDropup)
						]))
				]),
			_List_fromArray(
				[
					A4($rundis$elm_bootstrap$Bootstrap$Navbar$renderDropdownToggle, state, ddRec.id, configRec, ddRec.toggle),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('dropdown-menu', true),
									_Utils_Tuple2('show', isShown)
								]))
						]),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var item = _v1.a;
							return item;
						},
						ddRec.items))
				]));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$renderItemLink = function (_v0) {
	var attributes = _v0.attributes;
	var children = _v0.children;
	return A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('nav-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_Utils_ap(
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav-link')
						]),
					attributes),
				children)
			]));
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $rundis$elm_bootstrap$Bootstrap$Navbar$renderNav = F3(
	function (state, configRec, navItems) {
		return A2(
			$elm$html$Html$ul,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('navbar-nav mr-auto')
				]),
			A2(
				$elm$core$List$map,
				function (item) {
					if (item.$ === 'Item') {
						var item_ = item.a;
						return $rundis$elm_bootstrap$Bootstrap$Navbar$renderItemLink(item_);
					} else {
						var dropdown_ = item.a;
						return A3($rundis$elm_bootstrap$Bootstrap$Navbar$renderDropdown, state, configRec, dropdown_);
					}
				},
				navItems));
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$parentElement = function (decoder) {
	return A2($elm$json$Json$Decode$field, 'parentElement', decoder);
};
var $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$target = function (decoder) {
	return A2($elm$json$Json$Decode$field, 'target', decoder);
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$heightDecoder = function () {
	var tagDecoder = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (tag, val) {
				return _Utils_Tuple2(tag, val);
			}),
		A2($elm$json$Json$Decode$field, 'tagName', $elm$json$Json$Decode$string),
		$elm$json$Json$Decode$value);
	var resToDec = function (res) {
		if (res.$ === 'Ok') {
			var v = res.a;
			return $elm$json$Json$Decode$succeed(v);
		} else {
			var err = res.a;
			return $elm$json$Json$Decode$fail(
				$elm$json$Json$Decode$errorToString(err));
		}
	};
	var fromNavDec = $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['childNodes', '2', 'childNodes', '0', 'offsetHeight']),
				$elm$json$Json$Decode$float),
				A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['childNodes', '1', 'childNodes', '0', 'offsetHeight']),
				$elm$json$Json$Decode$float)
			]));
	var fromButtonDec = $rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$parentElement(fromNavDec);
	return A2(
		$elm$json$Json$Decode$andThen,
		function (_v0) {
			var tag = _v0.a;
			var val = _v0.b;
			switch (tag) {
				case 'NAV':
					return resToDec(
						A2($elm$json$Json$Decode$decodeValue, fromNavDec, val));
				case 'BUTTON':
					return resToDec(
						A2($elm$json$Json$Decode$decodeValue, fromButtonDec, val));
				default:
					return $elm$json$Json$Decode$succeed(0);
			}
		},
		$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$target(
			$rundis$elm_bootstrap$Bootstrap$Utilities$DomHelper$parentElement(tagDecoder)));
}();
var $rundis$elm_bootstrap$Bootstrap$Navbar$toggleHandler = F2(
	function (state, configRec) {
		var height = state.a.height;
		var updState = function (h) {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Navbar$mapState,
				function (s) {
					return _Utils_update(
						s,
						{
							height: $elm$core$Maybe$Just(h),
							visibility: A2($rundis$elm_bootstrap$Bootstrap$Navbar$visibilityTransition, configRec.withAnimation, s.visibility)
						});
				},
				state);
		};
		return A2(
			$elm$html$Html$Events$on,
			'click',
			A2(
				$elm$json$Json$Decode$andThen,
				function (v) {
					return $elm$json$Json$Decode$succeed(
						configRec.toMsg(
							(v > 0) ? updState(v) : updState(
								A2($elm$core$Maybe$withDefault, 0, height))));
				},
				$rundis$elm_bootstrap$Bootstrap$Navbar$heightDecoder));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$view = F2(
	function (state, conf) {
		var configRec = conf.a;
		return A2(
			$elm$html$Html$nav,
			$rundis$elm_bootstrap$Bootstrap$Navbar$navbarAttributes(configRec.options),
			_Utils_ap(
				$rundis$elm_bootstrap$Bootstrap$Navbar$maybeBrand(configRec.brand),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									'navbar-toggler' + A2(
										$elm$core$Maybe$withDefault,
										'',
										A2(
											$elm$core$Maybe$map,
											function (_v0) {
												return ' navbar-toggler-right';
											},
											configRec.brand))),
									$elm$html$Html$Attributes$type_('button'),
									A2($rundis$elm_bootstrap$Bootstrap$Navbar$toggleHandler, state, configRec)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('navbar-toggler-icon')
										]),
									_List_Nil)
								]))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							A2($rundis$elm_bootstrap$Bootstrap$Navbar$menuAttributes, state, configRec),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									A2($rundis$elm_bootstrap$Bootstrap$Navbar$menuWrapperAttributes, state, configRec),
									_Utils_ap(
										_List_fromArray(
											[
												A3($rundis$elm_bootstrap$Bootstrap$Navbar$renderNav, state, configRec, configRec.items)
											]),
										$rundis$elm_bootstrap$Bootstrap$Navbar$renderCustom(configRec.customItems)))
								]))
						]))));
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$Item = function (a) {
	return {$: 'Item', a: a};
};
var $rundis$elm_bootstrap$Bootstrap$Navbar$itemLink = F2(
	function (attributes, children) {
		return $rundis$elm_bootstrap$Bootstrap$Navbar$Item(
			{attributes: attributes, children: children});
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$itemLinkActive = function (attributes) {
	return $rundis$elm_bootstrap$Bootstrap$Navbar$itemLink(
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class('active'),
			attributes));
};
var $author$project$Menu$viewActionCard = F2(
	function (session, menuAction) {
		var menuActionIsActive = _Utils_eq(session.page, menuAction.page);
		if (menuActionIsActive) {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Navbar$itemLinkActive,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Menu$ChangedPage(menuAction.page))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(menuAction.title)
					]));
		} else {
			return A2(
				$rundis$elm_bootstrap$Bootstrap$Navbar$itemLink,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Menu$ChangedPage(menuAction.page))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(menuAction.title)
					]));
		}
	});
var $rundis$elm_bootstrap$Bootstrap$Navbar$withAnimation = function (config_) {
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Navbar$updateConfig,
		function (conf) {
			return _Utils_update(
				conf,
				{withAnimation: true});
		},
		config_);
};
var $author$project$Menu$view = function (session) {
	return A2(
		$rundis$elm_bootstrap$Bootstrap$Navbar$view,
		session.navbarState,
		A2(
			$rundis$elm_bootstrap$Bootstrap$Navbar$items,
			function () {
				var _v0 = session.token;
				if (_v0.$ === 'Nothing') {
					return A2(
						$elm$core$List$map,
						$author$project$Menu$viewActionCard(session),
						$author$project$Menu$menuActionsNoAccessToken);
				} else {
					var token = _v0.a;
					return A2(
						$elm$core$List$map,
						$author$project$Menu$viewActionCard(session),
						$author$project$Menu$menuActionsWithAccessToken);
				}
			}(),
			A3(
				$rundis$elm_bootstrap$Bootstrap$Navbar$brand,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Menu$ChangedPage($author$project$Session$WelcomePage))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src('src/resources/readingOwl_small.png'),
								$elm$html$Html$Attributes$class('d-inline-block align-top'),
								A2($elm$html$Html$Attributes$style, 'width', '64px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Lunatech')
							]))
					]),
				$rundis$elm_bootstrap$Bootstrap$Navbar$collapseMedium(
					$rundis$elm_bootstrap$Bootstrap$Navbar$withAnimation(
						$rundis$elm_bootstrap$Bootstrap$Navbar$config($author$project$Menu$NavbarMsg))))));
};
var $author$project$Welcome$ChangedPage = function (a) {
	return {$: 'ChangedPage', a: a};
};
var $author$project$Welcome$view = function (session) {
	var _v0 = _Utils_Tuple3(session.token, session.user, session.userInfo);
	_v0$3:
	while (true) {
		_v0$4:
		while (true) {
			if (_v0.a.$ === 'Nothing') {
				var _v1 = _v0.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Welcome')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Welcome to the Lunatech\'s Library App.'),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									$elm$html$Html$text('Browse interesting books. Books that you can borrow from your colleagues.')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('And maybe you have some books at home that are interesting for others...'),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Welcome$ChangedPage($author$project$Session$LoginPage)),
											$elm$html$Html$Attributes$class('linktext')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Please login and take a look.')
										]))
								]))
						]));
			} else {
				switch (_v0.b.$) {
					case 'Success':
						switch (_v0.c.$) {
							case 'Success':
								var token = _v0.a.a;
								var user = _v0.b.a;
								var userInfo = _v0.c.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('container')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h1,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Welcome')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Hi ' + (user.name + ', welcome to the Lunatech\'s Library App.')),
													A2($elm$html$Html$br, _List_Nil, _List_Nil),
													(userInfo.numberCheckouts > 0) ? A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Events$onClick(
																	$author$project$Welcome$ChangedPage($author$project$Session$CheckinPage)),
																	$elm$html$Html$Attributes$class('linktext')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	'You have checked out ' + ($elm$core$String$fromInt(userInfo.numberCheckouts) + '  books. Now you can return these books to the library.'))
																])),
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Events$onClick(
																	$author$project$Welcome$ChangedPage($author$project$Session$LibraryPage)),
																	$elm$html$Html$Attributes$class('linktext')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Or browse for more interesting books in the library.')
																]))
														])) : A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(
															$author$project$Welcome$ChangedPage($author$project$Session$LibraryPage)),
															$elm$html$Html$Attributes$class('linktext')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Now you can browse interesting books in the library. Books that you can borrow from your colleagues.')
														]))
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													(userInfo.numberBooks > 0) ? A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Events$onClick(
																	$author$project$Welcome$ChangedPage($author$project$Session$BookEditorPage)),
																	$elm$html$Html$Attributes$class('linktext')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	'You have registered ' + ($elm$core$String$fromInt(userInfo.numberBooks) + ' books in the library. Now you can manage these books.'))
																])),
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Events$onClick(
																	$author$project$Welcome$ChangedPage($author$project$Session$BookSelectorPage)),
																	$elm$html$Html$Attributes$class('linktext')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Or add some more interesting books.')
																]))
														])) : A2(
													$elm$html$Html$div,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Events$onClick(
																	$author$project$Welcome$ChangedPage($author$project$Session$BookSelectorPage)),
																	$elm$html$Html$Attributes$class('linktext')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Or add some books to the library that are interesting for others...')
																]))
														]))
												])),
											function () {
											var _v2 = session.message;
											switch (_v2.$) {
												case 'Succeeded':
													var message = _v2.a;
													return A2(
														$elm$html$Html$p,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('text-success')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_Nil,
																_List_fromArray(
																	[
																		$elm$html$Html$text(message)
																	]))
															]));
												case 'Warning':
													var message = _v2.a;
													return A2(
														$elm$html$Html$p,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('text-warning')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_Nil,
																_List_fromArray(
																	[
																		$elm$html$Html$text(message)
																	]))
															]));
												case 'Error':
													var message = _v2.a;
													return A2(
														$elm$html$Html$p,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('text-danger')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_Nil,
																_List_fromArray(
																	[
																		$elm$html$Html$text(message)
																	]))
															]));
												default:
													return A2($elm$html$Html$p, _List_Nil, _List_Nil);
											}
										}()
										]));
							case 'Failure':
								break _v0$3;
							default:
								break _v0$4;
						}
					case 'Failure':
						var token = _v0.a.a;
						var httpError = _v0.b.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-danger')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Utils$buildErrorMessage(httpError))
										]))
								]));
					default:
						if (_v0.c.$ === 'Failure') {
							break _v0$3;
						} else {
							break _v0$4;
						}
				}
			}
		}
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-danger')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Something went wrong here.')
						]))
				]));
	}
	var token = _v0.a.a;
	var httpError = _v0.c.a;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-danger')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Utils$buildErrorMessage(httpError))
					]))
			]));
};
var $author$project$Main$view = function (model) {
	var sessionModel = $author$project$Main$toSession(model);
	return {
		body: _List_fromArray(
			[
				$rundis$elm_bootstrap$Bootstrap$CDN$stylesheet,
				$author$project$LibraryAppCDN$stylesheet,
				A2(
				$elm$html$Html$map,
				$author$project$Main$MenuMsg,
				$author$project$Menu$view(
					$author$project$Main$toSession(model))),
				function () {
				switch (model.$) {
					case 'Welcome':
						return A2(
							$elm$html$Html$map,
							$author$project$Main$WelcomeMsg,
							$author$project$Welcome$view(sessionModel));
					case 'Login':
						return A2($elm$html$Html$map, $author$project$Main$LoginMsg, $author$project$Login$view);
					case 'Logout':
						return A2($elm$html$Html$map, $author$project$Main$LogoutMsg, $author$project$Logout$view);
					case 'BookSelector':
						var bookSelectorModel = model.a;
						var session = model.b;
						return A2(
							$elm$html$Html$map,
							$author$project$Main$BookSelectorMsg,
							$author$project$BookSelector$view(bookSelectorModel));
					case 'Library':
						var libraryModel = model.a;
						var session = model.b;
						return A2(
							$elm$html$Html$map,
							$author$project$Main$LibraryMsg,
							$author$project$Library$view(libraryModel));
					case 'Checkin':
						var checkinModel = model.a;
						var session = model.b;
						return A2(
							$elm$html$Html$map,
							$author$project$Main$CheckinMsg,
							$author$project$Checkin$view(checkinModel));
					default:
						var bookEditorModel = model.a;
						var session = model.b;
						return A2(
							$elm$html$Html$map,
							$author$project$Main$BookEditorMsg,
							$author$project$BookEditor$view(bookEditorModel));
				}
			}()
			]),
		title: 'Lunatech Library'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$UrlChanged, onUrlRequest: $author$project$Main$LinkClicked, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$string)(0)}});}(this));