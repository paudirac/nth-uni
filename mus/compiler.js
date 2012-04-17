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

var note_re = /([abcdefg])([0-8])/;
var pitch_of = {
    c: 0,
    'c#': 1,
    'db': 1,
    d: 2,
    'd#': 3,
    'eb': 3,
    e: 4,
    'e#': 5,
    'fb': 4,
    f: 5,
    'f#': 6,
    'gb': 6,
    g: 7,
    'g#': 8,
    'ab': 8,
    a: 9,
    'a#': 10,
    'bb': 10,
    b: 11,
    'b#': 0,
    'cb': 11
};
var midi_pitch = function(pitch) {
    var match = note_re.exec(pitch);
    var letter = match[1];
    var octave = match[2];
    return 12 + octave * 12 + pitch_of[letter];
};

var singlenote = function(musexpr, start) {
    return {
	tag: 'note',
	pitch: midi_pitch(musexpr.pitch),
	start: start,
	dur: musexpr.dur
    };
};

var isEmpty = function(el) { return el.length === 0; }

var cons = function(el, list) {
    return el.concat(list);
};

var _compile = function(musexpr, start) {
    if (musexpr.tag === 'note') {	
	return [singlenote(musexpr, start)];
    }
    else if (musexpr.tag == 'par') {
	var par_duration = endTime(musexpr);
	return cons(
	    _compile(musexpr.left, start),
	    _compile(musexpr.right, start)
	);
    }
    else if (musexpr.tag === 'rest') {
	start = start + endTime(musexpr);
	return [];
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

console.log("chord");
console.log(c_chord);
 console.log(compile(c_chord));
console.log("melody");
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

console.log("melody with rests");
console.log(melody_with_rests);
console.log(endTime(0, melody_with_rests));
console.log(compile(melody_with_rests));

console.log((function(note) { return note + ": " + midi_pitch(note); })("a0"));
console.log((function(note) { return note + ": " + midi_pitch(note); })("a4"));
console.log((function(note) { return note + ": " + midi_pitch(note); })("c4"));
console.log((function(note) { return note + ": " + midi_pitch(note); })("e4"));

