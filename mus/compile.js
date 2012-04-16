var max = function(a, b) {
    return a > b ? a : b;
};

var endTime = function(time, expr) {
    if (!expr) { return time; }
    if (expr.tag === 'note') { 
	return time + expr.dur; 
    }
    else if (expr.tag === 'par') {
	return time + max(endTime(0, expr.left), endTime(0, expr.right));
    }
    else if (expr.tag === 'rest') {
	return time + expr.duration;
    }
    else if (expr.tag === 'seq') {
	return time + endTime(0, expr.left) + endTime(0, expr.right);
    }
};


var singlenote = function(musexpr, start) {
    return {
	tag: 'note',
	pitch: musexpr.pitch,
	start: start,
	dur: musexpr.dur
    };
};

var cons = function(el, list) {
    if (el.length) { return el.concat(list); }
    else { return [el].concat(list); }
};

var _compile = function(musexpr, start) {
    if (musexpr.tag === 'note') {	
	return cons(
	    singlenote(musexpr, start),
	    []
	);
    }
    else if (musexpr.tag == 'par') {
	var par_duration = endTime(musexpr);
	return cons(
	    _compile(musexpr.left, start),
	    _compile(musexpr.right, start)
	);
    }
    else if (musexpr.tag == 'seq') {
	var start_right = endTime(start, musexpr.left);
	return cons(
	    _compile(musexpr.left, start),
	    _compile(musexpr.right, start_right)
	);
    }
};

var compile = function (musexpr) {
    if (!musexpr) { return []; }
    return _compile(musexpr, 0);
};

var c_chord = {
    tag: 'par',
    left: { tag: 'note', pitch: 'c4', dur: 250 },
    right: {
	tag: 'par',
	left: { tag: 'note', pitch: 'e4', dur: 50 },
	right: { tag: 'note', pitch: 'g4', dur: 450 }
    }
};

var melody = {
    tag: 'seq',
    left: c_chord,
    right: { tag: 'note', pitch: 'g4', dur: 450 }
};

console.log(c_chord);
console.log(compile(c_chord));
console.log(melody);
console.log(compile(melody));

var melody_with_rests = {
    tag: 'seq',
    left: { tag: 'note', pitch: 'c4', dur: 250 },
    right: {
	tag: 'seq',
	left: { tag: 'rest', duration: 250 },
	right: { tag: 'note', pitch: 'e4', dur: 250 }
    }
};

console.log(melody_with_rests);
console.log(endTime(0, melody_with_rests));

// console.log(compile(melody_with_rests));