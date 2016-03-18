/*
 *  MetaRand : switches strategy randomly if things are going poorly
 */
RPS.Player.MetaRand = function() {

	// Believe in yourself!
	this.confidence = 10;

	//Keep track :       R  P  S
	this.oppMoveCount = [0, 0, 0];
	this.myLastMove = 1;

	this.provenSpan = 0;

};

RPS.Player.MetaRand.NAME = 'MetaRand';
// Memory needs to carry through all 100 sets with an opponent
RPS.Player.MetaRand.Memory = "";
RPS.Player.MetaRand.Strategy = 'random';

//Trump most played move
RPS.Player.MetaRand.prototype.trumpMostPlayed = function (arr) {

	//scan for number of occurences in a slice of history
	slice = RPS.Player.MetaRand.Memory.slice()


	//vary the slice to find something optimal



	var index = arr.indexOf( Math.max(...arr));
	return RPS.trumps(index + 1);
}

//Check if the recent pattern of moves has occurred in memory
//   Recurse with ever shorter spans
RPS.Player.MetaRand.prototype.patternMatch = function(span) {

	if (span > 4 && RPS.Player.MetaRand.Memory.length > span * 2) {
		var hist = RPS.Player.MetaRand.Memory;
		var	prediction = undefined;

		// TODO: rate range of pattern lengths based on effectiveness
		var pattern = hist.slice(hist.length - span);

		//remove the pattern so that we don't get it in our search
		var past = hist.slice(0, -span);

		//Check if our past contains the pattern and grab the index
		var index = past.indexOf( pattern );

		//If a match was found
		if (index > 0) {
			//set this span as provenspan
			this.provenSpan = span;

			// get the move occurring after found pattern
			prediction = hist[index + pattern.length];
			return parseInt(prediction);

		//Recurse with a shorter search span
		} else { arguments.callee(span - 5) }
	} else {
		return RPS.randomMove()
	}
}

RPS.Player.MetaRand.prototype.throwMove = function() {

	var strat = RPS.Player.MetaRand.Strategy;
	var	myMove = RPS.randomMove();

	if (strat === 'frequency analysis') {
		myMove = this.trumpMostPlayed(this.oppMoveCount);
	} else if (strat === 'pattern matching') {

		//Check if there is an optimal span
		myMove = this.patternMatch(this.provenSpan ? this.provenSpan : 20);
		debugger;

	} else if (strat === 'trump my last move') {
			myMove = RPS.trumps(this.myLastMove);
	}

	// store the move for reference next round
	this.myLastMove = myMove;

	debugger;
	return myMove;

};

/*
 *  Record the results
 */
RPS.Player.MetaRand.prototype.addResult = function(result, opponentMove) {

	RPS.Player.MetaRand.Memory += String(opponentMove);

	// Frequency: add oppMove to round frequency
	this.oppMoveCount[opponentMove - 1] += 1;

	// adjust confidence level, biased towards losing
	if (result === 1) {
		this.confidence += 1;
	} else {
		this.confidence -= 2;
	}
	
	/* TODO: replace 'confidence' with rating system for strategies 
	          testing how each would do against the match results */ 
	// TODO: establish rating system for secondGuessing
	

	// if confidence hits rock bottom randomly switch strategy
	if (this.confidence < 1) {
		var rand = Math.floor((Math.random() * 4) + 1);
		switch (rand) {
			case 1:
				RPS.Player.MetaRand.Strategy = 'pattern matching';
				break;
			case 2:
				RPS.Player.MetaRand.Strategy = 'frequency analysis';
				break;
			case 3:
				RPS.Player.MetaRand.Strategy = 'trump my last move';
				break;				
			default:
				RPS.Player.MetaRand.Strategy = 'random';
		}
		this.confidence = 5;
	}
}