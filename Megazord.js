/*
 *  Megazord : several strategies come together to make an all powerful bot
 */
RPS.Player.Megazord = function() {

    // confidence that my current strategy is working
    this.confidence = 10;
    
    //Keep track:       R  P  S
    this.myMoves = [0, 0, 0];
    this.myLastMove = 1;

    //span length that found a match in memory
    this.provenSpan = 0;

};
RPS.Player.Megazord.NAME = 'Megazord';
RPS.Player.Megazord.Strategy = 'trumpLast';

// Memory needs to carry through all 100 sets with an opponent
RPS.Player.Megazord.Memory = "";

/*
 * Check if the recent pattern of moves has occurred in memory
 *  Recurse with ever shorter spans
 */
RPS.Player.Megazord.prototype.patternMatch = function(span) {

    if (span > 4 && RPS.Player.Megazord.Memory.length > span * 2) {
        var hist = RPS.Player.Megazord.Memory;
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

RPS.Player.Megazord.prototype.throwMove = function() {

    // move
    var m;

    // Check the current strategy and attack
    switch (RPS.Player.Megazord.Strategy) {
            case 'trumpLast':
            
                // trump my last move
                m = RPS.trumps(this.myLastMove);
                
            case 'patternMatch':

                m = this.patternMatch(this.provenSpan ? this.provenSpan : 25);
                
            case 'owtwit':

                // get the index of my most played move
                var myMostPlayed = this.myMoves.indexOf( Math.max(...this.myMoves)) + 1;
                // Double trump
                m = RPS.trumps(RPS.trumps(myMostPlayed));
                
            default:
                m = RPS.randomMove();
    }

    // store the move for reference
    this.myMoves[m - 1] += 1;
    this.myLastMove = m;

    return m;

};

/*
 *  Record the results
 */
RPS.Player.Megazord.prototype.addResult = function(result, opponentMove) {

    //Store data on my opponent
    RPS.Player.Megazord.Memory += String(opponentMove);

    // clear the cache every set
    if (RPS.Player.Megazord.Memory.length > 9999) { RPS.Player.Megazord.Memory = ""; }


    // adjust confidence level, drops faster on loss or tie
    if (result === 1) {
        this.confidence += 1;
    } else {
        this.confidence -= 3;
    }

    // if confidence hits rock bottom switch strategy
    if (this.confidence < 1) {
        switch (RPS.Player.Megazord.Strategy){
            case 'trumpLast':
                RPS.Player.Megazord.Strategy = 'patternMatch';
            case 'patternMatch':
                RPS.Player.Megazord.Strategy = 'outwit'; //doubletrumps trumper
            case 'outwit':
                RPS.Player.Megazord.Strategy = 'random'; //Good ole random
            default:
                RPS.Player.Megazord.Strategy = 'trumpLast';
        }
        // and reset confidence
        this.confidence = 10;
    }
};