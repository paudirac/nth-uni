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
var assert_parse = function (input, expected, name) {
    if (!name) { name = input; }
//    console.log("definint " + name);
    exports[name] = function(test) {
//	console.log("executant " + name);
	var obtained = parse(input);
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
assert_parse("atom", "atom");
assert_parse("turkey", "turkey");
assert_parse("1492", "1492");
assert_parse("u", "u");
assert_parse("*abc$", "*abc$");
assert_parse("+", "+");
assert_parse("(+ x 3)", ["+", "x", "3"]);
assert_parse("(atom)", ["atom"]);
assert_parse("(atom turkey or)", ["atom", "turkey", "or"]);
assert_parse("(+ 1 (f x 3 y))", ["+", "1", ["f", "x", "3","y"]]);

// add extra whitespace
assert_parse("(atom  other    atom)", ["atom", "other", "atom"]);
assert_parse("( atom  other    atom)", ["atom", "other", "atom"]);
assert_parse("( atom  other (atom))", ["atom", "other", ["atom"]]);
assert_parse("( atom  other (    atom other))", ["atom", "other", ["atom", "other"]]);
assert_parse("( atom  other    atom )", ["atom", "other", "atom"]);
assert_parse("( atom  other (    atom other ))", ["atom", "other", ["atom", "other"]]);
assert_parse("( atom  other (    atom other ) )", ["atom", "other", ["atom", "other"]]);
assert_parse("( atom   (\n atom   ) )", ["atom", ["atom"]]);

assert_parse(" atom", "atom");//, 'p1');
assert_parse(" \tatom", "atom");//, 'p2');
assert_parse(" (atom)", ["atom"]); //, 'p3');
assert_parse(" (  atom ) ", ["atom"]); //, 'p4');
assert_parse(" ( a  b     c d)", ["a", "b", "c", "d"]); //, 'p5');

// add tabs and newlines
assert_parse("(atom  \tother    atom)", ["atom", "other", "atom"]);
assert_parse("(atom  \nother    atom)", ["atom", "other", "atom"]);
assert_parse("(atom  \r\nother    atom)", ["atom", "other", "atom"]);

// TODO: general S-expr
//assert(parse("((atom turkey) or)"), [["atom", "turkey"], "or"]);

// quote
assert_parse("(quote something)", ["quote", "something"]);
assert_parse(" ( quote something)", ["quote", "something"]);
assert_parse("`(something else)", ["quote", ["something", "else"]]);
assert_parse("`( something else)", ["quote", [ "something", "else"]]);

// comments
assert_parse("atom;; comments", "atom");
assert_parse("turkey   ;; comments", "turkey");
assert_parse("1492 ;; (more comments)", "1492");
assert_parse("(+ x 3);; comments", ["+", "x", "3"]);
assert_parse("(atom turkey or);; (more (comments))", ["atom", "turkey", "or"]);
assert_parse("(+ 1 (f x 3 y));; 2", ["+", "1", ["f", "x", "3","y"]]);
assert_parse("(+ 1 (f x 3 y));; Lorem ipsum quod libet C#", ["+", "1", ["f", "x", "3","y"]]);
//assert_parse("(+ 1 ;; ara canvio\n (f x 3 y));; i un altre comment", ["+", "1", ["f", "x", "3","y"]]);
//assert_parse("(+ 1 (f x 3 y))\n;; Lorem \nipsum quod libet C#", ["+", "1", ["f", "x", "3","y"]]);
//assert_parse("(+ (f 3 5) (g 2 3))", ["+", ["f", "3", "5"], ["g", "2", "3"]]);
//assert_parse("(+ (f 3 5) (g 2 3)) ;; Lorem ipsum quod libet C#", ["+", ["f", "3", "5"], ["g", "2", "3"]]);