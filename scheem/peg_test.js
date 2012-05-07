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

// Nodeunit tests
exports['dog'] = function(test) {
    test.deepEqual(parse("dog"), ["dog"]);
    test.done();
};
exports["black dog"] = function(test) {
    test.deepEqual(parse("black dog"), ["black", "dog"]);
    test.done();
};
exports["angry black dog"] = function(test) {
    test.deepEqual(parse("angry black dog"), ["angry", "black", "dog"]);
    test.done();
};
exports["Gray dog"] = function(test) {
    test.notDeepEqual(parse("Gray dog"), ["Gray", "dog"]);
    test.done();
};

