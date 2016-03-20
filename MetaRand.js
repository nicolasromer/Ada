/*
 *  MetaRand: switches strategy randomly if things are going poorly
 */
RPS.Player.MetaRand = function () {

    //Personality
    this.confidence = 10;
    this.paranoia = 0;

    //Memory             R  P  S
    this.oppMoveCount = [0, 0, 0];
    this.myMoveCount = [0, 0, 0];
    this.oppLastMove = 1;
    this.myLastMove = 2;
    this.provenSpan = 0;
    
};

RPS.Player.MetaRand.NAME = 'MetaRand';
// Memory needs to carry through all 100 sets with an opponent
RPS.Player.MetaRand.Memory = "";
RPS.Player.MetaRand.Strategy = 'trump my last move';

//Trump most played move
RPS.Player.MetaRand.prototype.trumpMostPlayed = function (oppMoves, myMoves) {

    // determine my and my opp's most played 
    var myMostPlayed = myMoves.indexOf( Math.max(...myMoves)) + 1;
    var oppMostPlayed = oppMoves.indexOf( Math.max(...oppMoves)) + 1;

    // I get paranoid when my opp keeps playing trump on my most played move
    if (RPS.trumps(myMostPlayed) == this.oppLastMove) {
        this.paranoia += 1;
    }
    
    //Is my opponent playing based on frequency?
    if (this.paranoia > 10) {
        //DoubleTrump!
        return RPS.trumps(RPS.trumps(myMostPlayed));
    }
    return RPS.trumps(oppMostPlayed);
};

//Check if the recent pattern of moves has occurred in memory
//   Recurse with ever shorter spans
RPS.Player.MetaRand.prototype.patternMatch = function (span) {

    if (span > 4 && RPS.Player.MetaRand.Memory.length > span * 2) {
        var hist = RPS.Player.MetaRand.Memory;
        var prediction = undefined;

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
        } else { arguments.callee(span - 5); }
    } else {
        return RPS.randomMove();
    }
};

RPS.Player.MetaRand.prototype.throwMove = function () {

    var s = RPS.Player.MetaRand.Strategy;
    var m = RPS.randomMove();

    if (s === 'frequency analysis') {
        m = this.trumpMostPlayed(this.oppMoveCount, this.myMoveCount);
    } else if (s === 'pattern matching') {
        //Check if there is an optimal span
        m = this.patternMatch(this.provenSpan ? this.provenSpan : 25);
    } else if (s === 'trump my last move') {
        m = RPS.trumps(this.myLastMove);
    }

    // store the move for reference
    this.myMoveCount[m - 1] += 1;
    this.myLastMove = m;

    return m;

};

/*
 *  Record the results
 */
RPS.Player.MetaRand.prototype.addResult = function (result, opponentMove) {

    //Store data on my opponent
    RPS.Player.MetaRand.Memory += String(opponentMove);
    this.oppLastMove = opponentMove;
    this.oppMoveCount[opponentMove - 1] += 1;

    // adjust confidence level, biased towards losing
    if (result === 1) {
        this.confidence += 1;
    } else {this.confidence -= 2;}

    // if confidence hits rock bottom randomly switch strategy
    if (this.confidence < 1) {
        var rand = Math.floor((Math.random() * 6) + 1);
        switch (rand) {
            case 1:
            case 2:
                RPS.Player.MetaRand.Strategy = 'pattern matching';
                break;
            case 4:
            case 5:
                RPS.Player.MetaRand.Strategy = 'frequency analysis';
                break;
            default:
                RPS.Player.MetaRand.Strategy = 'random';
        }
        //reset emotions
        this.paranoia = 0;
        this.confidence = 10;
    }
};