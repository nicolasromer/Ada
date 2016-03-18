/*
 *  MetaRand : switches strategy randomly if things are going poorly
 */
RPS.Player.MetaRand = function() {

	// Believe in yourself!
	this.confidence = 10;

	//Keep track :       R  P  S
	this.oppMoveCount = [0, 0, 0];
	this.myLastMove = 1;
};

RPS.Player.MetaRand.NAME = 'MetaRand';
// Memory needs to carry through all 100 sets with an opponent
RPS.Player.MetaRand.Memory = "";
RPS.Player.MetaRand.Strategy = 'random';

//Check if the recent pattern of moves has occurred in memory
RPS.Player.MetaRand.prototype.patternMatch = function(span) {

		var hist = RPS.Player.MetaRand.Memory,
			prediction = undefined;

		// TODO: rate range of pattern lengths based on effectiveness
		var pattern = hist.slice(hist.length - span);
		var past = hist.slice(0, -span);

		var index = past.indexOf( pattern );

		if (index !== -1) {
			prediction = hist[index + pattern.length];
		}

		if (prediction !== undefined) {
			return parseInt(prediction);
		} else {
			return RPS.randomMove();
		}

};

RPS.Player.MetaRand.prototype.throwMove = function() {

	var strat = RPS.Player.MetaRand.Strategy,
		myMove = RPS.randomMove();
	if (strat == 'frequency analysis') {
		myMove = trumpMostPlayed(this.oppMoveCount);
	} else if (strat == 'pattern matching') {
		myMove = this.patternMatch(10);
	} else if (strat == 'trump my last move') {
			myMove = RPS.trumps(this.myLastMove);
	}

	// store the move for reference next round
	this.myLastMove = myMove;

	return myMove;

	// trump the most played move
	function trumpMostPlayed(arr) {
			var index = arr.indexOf( Math.max(...arr));
			return RPS.trumps(index + 1);
	}

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
		this.confidence += 1
	} else {
		this.confidence -= 2;
	}
	/*
	 * TODO: replace 'confidence' with rating system for strategies 
	 *       testing how each would do against the match results
	 *
	 * TODO: establish rating system for secondGuessing
	 */

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