// A half-baked implementation of evalScheem
var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
	if (!env[expr]) { 
	    throw new Error(expr + " not found in environment"); 
	}
	else { return env[expr]; }
    }
    // Look at head of list for operation
    switch (expr[0]) {
    case '+':
        return evalScheem(expr[1], env) +
               evalScheem(expr[2], env);
    case '-':
	return evalScheem(expr[1], env) -
	       evalScheem(expr[2], env);
    case '*':
	return evalScheem(expr[1], env) *
	       evalScheem(expr[2], env);
    case '/':
	return evalScheem(expr[1], env) /
	       evalScheem(expr[2], env);
    case 'quote':
        return expr[1];
    case 'define':
	env[expr[1]] = evalScheem(expr[2], env);
	return 0;
    case 'set!':
	env[expr[1]] = evalScheem(expr[2], env);
	return 0;
    case 'begin':
	var res = 0;
	for(var i = 1; i < expr.length; i++) {
	    res = evalScheem(expr[i], env);
	}
	return res;
    case 'quote': // quote means: not evaluate
	return expr[1];
    case '=':
	var eq = evalScheem(expr[1], env) === evalScheem(expr[2], env);
	return eq ? '#t' : '#f';
    case '<':
	var lt = evalScheem(expr[1], env) < evalScheem(expr[2], env);
	return lt ? '#t' : '#f';
    case 'cons':
	return [evalScheem(expr[1], env)].concat(evalScheem(expr[2], env));
    case 'car':
	var slist = evalScheem(expr[1], env);
	return slist[0];
    case 'cdr':
	var slist2 = evalScheem(expr[1], env);
	slist2.shift();
	return slist2;
    case 'if':
	var ebool = evalScheem(expr[1], env);
	if (ebool === '#t') { return evalScheem(expr[2], env); }
	else { return evalScheem(expr[3], env); }
    }
};