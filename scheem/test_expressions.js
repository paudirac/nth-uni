// test interpreter
var test_expressions = function(suite, test, assert, evalScheemString) {
suite('interpreter', function() {
    test('a number', function() {
	assert.deepEqual(
	    evalScheemString("42", {}),
	    42
	);
    });
    test('a variable', function() {
	assert.deepEqual(
	    evalScheemString("(begin (define x 42) x)", {}),
	    42
	);
    });
    test('(begin (define x 40) (define y 2) (+ x y))', function() {
	assert.deepEqual(
	    evalScheemString('(begin (define x 40) (define y 2) (+ x y))', {}),
	    42
	);
    });
});
};