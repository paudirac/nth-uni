// Test parser
var test_parser = function(suite, test, assert, SCHEEM) {
suite('parse', function() {
    test('a number', function() {
	assert.deepEqual(
	    SCHEEM.parse('42'),
	    42
	);
    });
    test('a variable', function() {
	assert.deepEqual(
	    SCHEEM.parse('x'),
	    'x'
	);
    });
});
};