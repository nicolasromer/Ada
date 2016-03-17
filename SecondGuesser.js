RPS.Player.MetaRand = function() {

	// Believe in yourself!
	this.confidence 	= 10;

						// R  P  S 
	this.oppMoveCount 	= [0, 0, 0];
	this.myLastMove 	= 1;
};
RPS.Player.MetaRand.NAME = 'MetaRand';
RPS.Player.MetaRand.MEMORY = "";
RPS.Player.MetaRand.STRATEGY = 'random';

//Check if the recent pattern of moves has occurred in memory
RPS.Player.MetaRand.prototype.patternMatch = function() {

		var hist = RPS.Player.MetaRand.MEMORY;

		// TODO: rate range of pattern lengths based on effectiveness
		var pattern = hist.slice(hist.length - 5);
		var past  = hist.slice(0, -5)

		var index = past.indexOf( pattern );

		if (index != -1) {
			var prediction = hist[index + pattern.length];
		}

		if (prediction != undefined) {
			return parseInt(prediction);
		} else {
			// TODO: return random by frequency analysis
			return this.trumpMostPlayed(this.oppMoveCount);
		}
};

RPS.Player.MetaRand.prototype.trumpMostPlayed = function(arr) {
		var index = arr.indexOf( Math.max(...arr));
		return RPS.trumps(index + 1);
};

RPS.Player.MetaRand.prototype.throwMove = function() {

	var mem = RPS.Player.MetaRand.MEMORY,
		strat = RPS.Player.MetaRand.STRATEGY,
		myMove = RPS.randomMove();

	if (strat == 'frequency analysis') {

		myMove = this.trumpMostPlayed(this.oppMoveCount);

	} else if (strat == 'pattern matching') {
		if (mem.length > 30) {
			debugger;
			myMove = this.patternMatch();
		}
	} else if (strat == 'trump my last move') {
		myMove = RPS.trumps(this.myLastMove);
	}

	this.myLastMove = myMove;
	return myMove;

};

/*
 *	Record the results
 */
RPS.Player.MetaRand.prototype.addResult = function(result, opponentMove) {

	RPS.Player.MetaRand.MEMORY += String(opponentMove);

	// Frequency: add oppMove to round frequency
	this.oppMoveCount[opponentMove - 1] += 1;

	// adjust confidence level, biased towards losing
	if (result == 1) {
		this.confidence += 1
	} else {
		this.confidence -= 2;
	}
	/*
	 * TODO: replace 'confidence' with rating system for strategies 
	 * 			testing how each would do against the match results
	 *
	 * TODO: establish rating system for secondGuessing
	 */

	// if confidence hits rock bottom randomly switch strategy
	if (this.confidence < 1) {
		var rand = Math.floor((Math.random() * 4) + 1);
		switch (rand) {
			case 1:
				RPS.Player.MetaRand.STRATEGY = 'pattern matching';
				break;
			case 2:
				RPS.Player.MetaRand.STRATEGY = 'frequency analysis';
				break;
			case 3:
				RPS.Player.MetaRand.STRATEGY = 'trump my last move';
				break;				
			default:
				RPS.Player.MetaRand.STRATEGY = 'random';
		}
		this.confidence = 5;
	} 
}