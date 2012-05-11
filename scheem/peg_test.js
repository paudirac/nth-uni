var wrapExceptions = function(f) {
    return function(x) {
	try {
	    return f(x);
	}
	catch(err) { return undefined; }
    };
};
var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var file_name = '/home/pau/js-uni/nth-uni-pl101-lesson2/scheem/scheem.peg';
var data = fs.readFileSync(file_name, 'utf-8');

// Show the PEG grammar file
console.log(data);

// Create my parser
var parse = wrapExceptions(PEG.buildParser(data).parse);

// Nodeunit tests
var count = 0;
var assert = function (obtained, expected,name) {
    count++;
    var test_name = count.toString();
    if (name) test_name = name;
    //try { test_name = expected.toString() } catch(e) { }
    exports[test_name] = function(test) {
	console.log("obt: " + obtained);
	test.deepEqual(obtained, expected);
	test.done();
    };
};

// Test parse atoms
// exports['atom'] = function(test) {
//     test.deepEqual(parse("atom"), "atom");
//     test.done();
// };

// atoms and lists of expressions
assert(parse("atom"), "atom");
assert(parse("turkey"), "turkey");
assert(parse("1492"), "1492");
assert(parse("u"), "u");
assert(parse("*abc$"), "*abc$");
assert(parse("+"), "+");
assert(parse("(+ x 3)"), ["+", "x", "3"]);
assert(parse("(atom)"), ["atom"]);
assert(parse("(atom turkey or)"), ["atom", "turkey", "or"]);
assert(parse("(+ 1 (f x 3 y))"), ["+", "1", ["f", "x", "3","y"]]);

// add extra whitespace
assert(parse("(atom  other    atom)"), ["atom", "other", "atom"]);
assert(parse("( atom  other    atom)"), ["atom", "other", "atom"]);
assert(parse("( atom  other (atom))"), ["atom", "other", ["atom"]]);
assert(parse("( atom  other (    atom other))"), ["atom", "other", ["atom", "other"]]);
assert(parse("( atom  other    atom )"), ["atom", "other", "atom"]);
assert(parse("( atom  other (    atom other ))"), ["atom", "other", ["atom", "other"]]);
assert(parse("( atom  other (    atom other ) )"), ["atom", "other", ["atom", "other"]]);
assert(parse("( atom   (\n atom   ) )"), ["atom", ["atom"]]);

assert(parse(" atom"), "atom", 'p1');
assert(parse(" \tatom"), "atom", 'p2');
assert(parse(" (atom)"), ["atom"], 'p3');
assert(parse(" (  atom ) "), ["atom"], 'p4');
assert(parse(" ( a  b     c d)"), ["a", "b", "c", "d"], 'p5');



// add tabs and newlines
assert(parse("(atom  \tother    atom)"), ["atom", "other", "atom"]);
assert(parse("(atom  \nother    atom)"), ["atom", "other", "atom"]);
assert(parse("(atom  \r\nother    atom)"), ["atom", "other", "atom"]);




//assert(parse("((atom turkey) or)"), [["atom", "turkey"], "or"]);


