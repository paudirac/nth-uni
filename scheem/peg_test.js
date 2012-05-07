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
var data = fs.readFileSync('/home/pau/js-uni/nth-uni-pl101-lesson2/scheem/scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = wrapExceptions(PEG.buildParser(data).parse);


function assert_eq(left, right, msg) {
    var pass = assert.deepEqual(left, right);
    var type = pass ? "PASSED" : "FAILED";
    console.log(type + ": " + msg);
};

// Do a test 
assert_eq(parse("dog"), ["dog"], 'passed dog');
assert_eq(parse("black dog"), ["black", "dog"], 'passed black dog');
assert_eq(parse("angry black dog"), ["angry", "black", "dog"], 'passed angry black dog');
assert_eq(parse("Gray dog"), 1, 'not passed Gray dog');

