/*
 *  Ada
 *  
 */

RPS.Player.Ada = function() {

	// Which move will beat the opponent's next move?
	this.paperProbability 	 = 33;
	this.rockProbability	 = 33;
	this.scissorsProbability = 34;

	// Opponent strategy type
	this.repeatOnWin		= 0;
	this.repeatOnLoss		= 0;
	this.repeatOnTie		= 0;
	this.switchOnWin		= 0;
	this.switchOnLoss		= 0;
	this.switchOnTie		= 0;

	// Opponent moves played:    rock 	paper 	scissors
	this.movesPlayed = 			[0,		0,  	0];

	// set up for first round
	this.nextMove = RPS.randomMove();
	this.opponentPreviousMove 	= 9; // nine is foo
	this.previousResult 		= 9; 

	// Personality
	this.confidence		= 5;
	this.forgetfulness	= 3;

}

RPS.Player.Ada.NAME = 'Ada';

RPS.Player.Ada.prototype.throwMove = function() {

	return this.nextMove;

}

/*
 *	Adjust Probabilities				   
 */	
function adjust(repeatOn, switchOn) {
	
	// if opp might repeat
	if (repeatOn > switchOn) {
		return - this.confidence; // Ada shouldnt play this.
	} else if (switchOn > repeatOn) {
		return += this.confidence;
	}
}

/*
 * Adjust next play based on data
 */
RPS.Player.Ada.prototype.addResult = function(result, opponentMove) {

	debugger;

	// Add opponent move to moves played scoreboard
	this.movesPlayed[ opponentMove - 1 ] += 1;

	// Confidence is reflected in the wins
	if (result == 1) {
		this.confidence ++;
	} else if (result == -1) {
		this.confidence -- ;
	}


	// tracking if the opponent switches after a win or loss
	if (this.previousResult == 1) {
		if (this.opponentPreviousMove == opponentMove){
			this.repeatOnWin	+= 1;
		} else {
			this.switchOnWin	+= 1;
		}
	} else if (this.previousResult == 0){
		if (this.opponentPreviousMove == opponentMove){
			this.repeatOnDraw	+= 1;
		} else {
			this.switchOnDraw	+= 1;
		}
	} else if (this.previousResult == -1){
		if (this.opponentPreviousMove == opponentMove){
			this.repeatOnLoss	+= 1;
		} else {
			this.switchOnLoss	+= 1;
		}
	}
				   
	var willRepeat, willSwitch;

	switch(result) {
		case 1:
			var repOn = this.repeatOnWin;
			var swiOn = this.switchOnWin;
			break;
		case 0:
			var repOn = this.repeatOnDraw;
			var swiOn = this.switchOnDraw;
			break;
		default:
			var repOn = this.repeatOnLoss;
			var swiOn = this.switchOnLoss;
	} 

	debugger;

	var primary, secondary;

	switch(opponentMove) {
		case 1:
			this.scissorsProbability 	+= adjust(repOn, swiOn);
			this.rockProbability 		+= (adjust(repOn, swiOn) / 2);
			break;
		case 2:
			this.rockProbability 		+= adjust(repOn, swiOn);
			this.paperProbability 		+= (adjust(repOn, swiOn) / 2);
			break;
		default: 
			this.paperProbability 		+= adjust(repOn, swiOn);
			this.scissorsProbability 	+= (adjust(repOn, swiOn) / 2);
	}


	// record the score and result for next time
	this.opponentPreviousMove 		= opponentMove;
	this.previousResult 			= result;


	// random number to choose next move with help of probabilities
	var random = Math.floor((Math.random() * 101) + 1);

	if (random < this.paperProbability) {
		this.nextMove = RPS.Moves.PAPER;
	} else if (random < (this.paperProbability + this.rockProbability)) {
			this.nextMove = RPS.Moves.ROCK;
	} else {
		this.nextMove = RPS.Moves.SCISSORS;
	}

}


