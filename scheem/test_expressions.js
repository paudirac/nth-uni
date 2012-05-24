// Test expression evaluator
var test_expressions = function(suite, test, assert, evalScheem) {
suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]], {}),
            [1, 2, 3]
        );
    });
});
suite('add', function() {
    test('two numbers', function() {
        assert.deepEqual(
            evalScheem(['+', 3, 5], {}),
            8
        );
    });
    test('a number and an expression', function() {
        assert.deepEqual(
            evalScheem(['+', 3, ['+', 2, 2]], {}),
            7
        );
    });
    test('a dog and a cat', function() {
	assert.throws(function() {
	    evalScheem(['+', 'dog', 'cat'], {});
	});
    });
    test('two plus tow', function() {
	assert.deepEqual(
	    evalScheem(['+', 2, 2], {}),
	    4
	);
    });
});

suite('numbers', function() {
    test('5', function() {
        assert.deepEqual(
            evalScheem(5, {}),
            5
        );
    });
    test('(+ 2 3)', function() {
	assert.deepEqual(
	    evalScheem(['+', 2, 3], {}),
	    5
	);
    });
    test('(* 2 3)', function() {
	assert.deepEqual(
	    evalScheem(['*', 2, 3], {}),
	    6
	);
    });
    test('(/ 1 2)', function() {
	assert.deepEqual(
	    evalScheem(['/', 1, 2], {}),
	    0.5
	);
    });
    test('(* (/ 8 4) (+ 1 1))', function() {
	assert.deepEqual(
	    evalScheem(['*',['/', 8, 4],['+', 1, 1]], {}),
	    4
	);
    });
});
suite('variables', function() {
    test('x', function() {
    	assert.deepEqual(
    	    evalScheem('x', {x:5}),
    	    5
    	);
    });
    test('(* y 3)', function() {
	assert.deepEqual(
	    evalScheem(['*', 'y', 3], {y : 2}),
	    6
	);
    });
    test('(/ z (+ x y))', function() {
	assert.deepEqual(
	    evalScheem(['/', 'z', ['+', 'x', 'y']], { x: 1, y: 2, z: 12}),
	    4
	);
    });
    var env = {x:2, y:3,z:10};
    test('(define a 5)', function() {
	assert.deepEqual(
	    evalScheem(['define', 'a', 5], env),
	    0
	);
	assert.deepEqual(env, {a:5,x:2,y:3,z:10});
    });
    test('(set! a 1)', function() {
	assert.deepEqual(
	    evalScheem(['set!', 'a', 1], env),
	    0
	);
	assert.deepEqual(env, {a:1,x:2,y:3,z:10});
    });
    test('(set! x 7)', function() {
	assert.deepEqual(
	    evalScheem(['set!', 'x', 7], env),
	    0
	);
	assert.deepEqual(env, {x:7,y:3,z:10,a:1});
    });
});
suite('begin', function() {
    test('(begin 1 2 3)', function() {
	assert.deepEqual(
	    evalScheem(['begin', 1, 2, 3], {}),
	    3
	);
    });
    test('(begin (+ 2 2))', function() {
	assert.deepEqual(
	    evalScheem(['begin', ['+', 2, 2]], {}),
	    4
	);
    });
    var env = { x: 1, y: 2};
    test('(begin x y x)', function() {
	assert.deepEqual(
	    evalScheem(['begin', 'x', 'y', 'x'], env),
	    1
	);
    });
    test('(begin (set! x 5) (set! x (+ y x)) x)', function() {
	assert.deepEqual(
	    evalScheem(['begin', ['set!', 'x', 5], ['set!', 'x', ['+', 'y', 'x']], 'x'], env),
	    7
	);
    });
});
suite('quote', function() {
    test('(quote (+ 2 3))', function() {
	assert.deepEqual(
	    evalScheem(['quote', ['+', 2, 3]], {}),
	    ['+', 2, 3]
	);
    });
    test('(quote (quote (+ 2 3)))', function() {
	assert.deepEqual(
	    evalScheem(['quote', ['quote', ['+', 2, 3]]], {}),
	    ['quote', ['+', 2, 3]]
	);
    });
});
suite('=,<,cons,car,cdr', function() {
    test('(= (+ 2 3) 5)', function() {
	assert.deepEqual(
	    evalScheem(['=', ['+', 2, 3], 5], {}),
	    '#t'
	);
    });
    test('(= 90 (+ 2 3))', function() {
	assert.deepEqual(
	    evalScheem(['=', 90, ['+', 2, 3]], {}),
	    '#f'
	);
    });
    test('(< 2 2)', function() {
	assert.deepEqual(
	    evalScheem(['<', 2, 2], {}),
	    '#f'
	);
    });
    test('< 2 3)', function() {
	assert.deepEqual(
	    evalScheem(['<', 2, 3],{}),
	    '#t'
	);
    });
    test('(< (+ 1 1) (+ 2 3))', function() {
	assert.deepEqual(
	    evalScheem(['<', ['+', 1, 1], ['+', 2, 3]], {}),
	    '#t'
	);
    });
    test("(cons 1 '(2 3))", function() {
	assert.deepEqual(
	    evalScheem(['cons', 1, ['quote', [2, 3]]],{}),
	    [1, 2, 3]
	);
    });
    test("(cons '(1 2) '(3 4))", function() {
    	assert.deepEqual(
    	    evalScheem(['cons', ['quote', [1, 2]], ['quote', [3, 4]]], {}),
    	    [[1, 2], 3, 4]
    	);
    });
    test("(car '((1 2) 3 4))", function() {
    	assert.deepEqual(
    	    evalScheem(['car', ['quote', [[1, 2], 3, 4]]], {}),
    	    [1, 2]
    	);
    });
    test("cdr '((1 2) 3 4)", function() {
    	assert.deepEqual(
    	    evalScheem(['cdr', ['quote', [[1, 2], 3, 4]]], {}),
    	    [3, 4]
    	);
    });
});
suite('if', function() {
    test('(if (= 1 1) 2 3)', function() {
	assert.deepEqual(
	    evalScheem(['if', ['=', 1, 1], 2, 3], {}),
	    2
	);
    });
    test('(if (= 1 0) 2 3)', function() {
	assert.deepEqual(
	    evalScheem(['if', ['=', 1, 0], 2, 3], {}),
	    3
	);
    });
    test('(if (= 1 1) 2 error)', function() {
	assert.deepEqual(
	    evalScheem(['if', ['=', 1, 1], 2, 'error'], {}),
	    2
	);
    });
    test('(if (= 1 0) error 3)', function() {
	assert.deepEqual(
	    evalScheem(['if', ['=', 1, 0], 'error', 3], {}),
	    3
	);
    });
    test('(if (= 1 1) (if (= 2 3) 10 11) 12)', function() {
	assert.deepEqual(
	    evalScheem(['if', ['=', 1, 1], ['if', ['=', 2, 3], 10, 11], 12], {}),
	    11
	);
    });
});
};