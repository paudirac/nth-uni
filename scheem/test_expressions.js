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
	test('(quote 3)', function() {
            assert.deepEqual(
		evalScheemString("(quote 3)", {}),
		3
            );
	});
	test('(quote dog)', function() {
            assert.deepEqual(
		evalScheemString('(quote dog)', {}),
		'dog'
            );
	});
	test('(quote (1 2 3))', function() {
            assert.deepEqual(
		evalScheemString("(quote (1 2 3))", {}),
		[1, 2, 3]
            );
	});
	test("`(1 2 3)", function() {
            assert.deepEqual(
		evalScheemString("`(1 2 3)", {}),
		[1, 2, 3]
            );
	});
	test('(+ 3 5)', function() {
            assert.deepEqual(
		evalScheemString("(+ 3 5)", {}),
		8
            );
	});
	test('(+ 3 (+ 2 2))', function() {
            assert.deepEqual(
		evalScheemString("(+ 3 (+ 2 2))", {}),
		7
            );
	});
	test('(+ dog cat)', function() {
	    assert.throws(function() {
		evalScheem(['+', 'dog', 'cat'], {});
	    });
	});
	test('(* 2 3)', function() {
	    assert.deepEqual(
		evalScheemString("(* 2 3)", {}),
		6
	    );
	});
	test('(/ 1 2)', function() {
	    assert.deepEqual(
		evalScheemString("(/ 1 2)", {}),
		0.5
	    );
	});
	test('(* (/ 8 4) (+ 1 1))', function() {
	    assert.deepEqual(
		evalScheemString("(* (/ 8 4) (+ 1 1))", {}),
		4
	    );
	});
	test('x', function() {
    	    assert.deepEqual(
		evalScheemString("x", { x: 5}),
    		5
    	    );
	});
	test('(* y 3)', function() {
	    assert.deepEqual(
		evalScheemString("(* y 3)", {y : 2}),
		6
	    );
	});
	test('(/ z (+ x y))', function() {	    
	    assert.deepEqual(
		evalScheemString("(/ z (+ x y))", { x: 1, y: 2, z: 12}),
		4
	    );
	});
	test('(define a 5)', function() {
	    var env = { x: 2, y: 3, z: 10};
	    assert.deepEqual(
		evalScheemString("(define a 5)", env),
		0
	    );
	    assert.deepEqual(env, {a:5,x:2,y:3,z:10});
	});
	test('(set! a 1)', function() {
	    var env = {a: 0, x: 2, y: 3, z: 10};
	    assert.deepEqual(		
		evalScheemString("(set! a 1)", env),
		0
	    );
	    assert.deepEqual(env, {a:1,x:2,y:3,z:10});
	});
	test('(set! x 7)', function() {
	    var env = {a: 1, x: 2, y: 3, z: 10};
	    assert.deepEqual(
		evalScheemString("(set! x 7)", env),
		0
	    );
	    assert.deepEqual(env, {x:7,y:3,z:10,a:1});
	});
	test('(begin 1 2 3)', function() {
	    assert.deepEqual(
		evalScheemString("(begin 1 2 3)", {}),
		3
	    );
	});
	test('(begin (+ 2 2))', function() {
	    assert.deepEqual(
		evalScheemString("(begin (+ 2 2))", {}),
		4
	    );
	});

	test('(begin x y x)', function() {
	    var env = { x: 1, y: 2};
	    assert.deepEqual(
		evalScheemString("(begin x y x)", env),
		1
	    );
	});
	test('(begin (set! x 5) (set! x (+ y x)) x)', function() {
	    var env = { x: 1, y: 2};
	    assert.deepEqual(
		evalScheemString("(begin (set! x 5) (set! x (+ y x)) x)", env),
		7
	    );
	});
	test('(quote (+ 2 3))', function() {
	    assert.deepEqual(
		evalScheemString("(quote (+ 2 3))", {}),
		['+', 2, 3]
	    );
	});
	test('(quote (quote (+ 2 3)))', function() {
	    assert.deepEqual(
		evalScheemString("(quote (quote (+ 2 3)))", {}),
		['quote', ['+', 2, 3]]
	    );
	});
	test('(= (+ 2 3) 5)', function() {
	    assert.deepEqual(
		evalScheemString("(= (+ 2 3) 5)", {}),
		'#t'
	    );
	});
	test('(= 90 (+ 2 3))', function() {
	    assert.deepEqual(
		evalScheemString("(= 90 (+ 2 3))", {}),
		'#f'
	    );
	});
	test('(< 2 2)', function() {
	    assert.deepEqual(
		evalScheemString("(< 2 2)", {}),
		'#f'
	    );
	});
	test('< 2 3)', function() {
	    assert.deepEqual(
		evalScheemString("(< 2 3)", {}),
		'#t'
	    );
	});
	test('(< (+ 1 1) (+ 2 3))', function() {
	    assert.deepEqual(
		evalScheemString("(< (+ 1 1) (+ 2 3))", {}),
		'#t'
	    );
	});
	test("(cons 1 '(2 3))", function() {
	    assert.deepEqual(
		evalScheemString("(cons 1 `(2 3))", {}),
		[1, 2, 3]
	    );
	});
	test("(cons '(1 2) '(3 4))", function() {
    	    assert.deepEqual(
		evalScheemString("(cons `(1 2) `(3 4))", {}),
    		[[1, 2], 3, 4]
    	    );
	});
	test("(car '((1 2) 3 4))", function() {
    	    assert.deepEqual(
		evalScheemString("(car `((1 2) 3 4))", {}),
    		[1, 2]
    	    );
	});
	test("cdr '((1 2) 3 4)", function() {
    	    assert.deepEqual(
		evalScheemString("(cdr `((1 2) 3 4))", {}),
    		[3, 4]
    	    );
	});
	test('(if (= 1 1) 2 3)', function() {
	    assert.deepEqual(
		evalScheemString("(if (= 1 1) 2 3)", {}),
		2
	    );
	});
	test('(if (= 1 0) 2 3)', function() {
	    assert.deepEqual(
		evalScheemString("(if (= 1 0) 2 3)", {}),
		3
	    );
	});
	test('(if (= 1 1) 2 error)', function() {
	    assert.deepEqual(
		evalScheemString("(if (= 1 1) 2 error)", {}),
		2
	    );
	});
	test('(if (= 1 0) error 3)', function() {
	    assert.deepEqual(
		evalScheemString("(if (= 1 0) error 3)", {}),
		3
	    );
	});
	test('(if (= 1 1) (if (= 2 3) 10 11) 12)', function() {
	    assert.deepEqual(
		evalScheemString("(if (= 1 1) (if (= 2 3) 10 11) 12)", {}),
		11
	    );
	});
    });
};