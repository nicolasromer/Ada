/*
 *  Megazord : several strategies come together to make an all powerful bot
 */
RPS.Player.Megazord = function() {

    // confidence that my current strategy is working
    this.confidence = 10;
    this.strategies = {
        trumpLast: 1,
        predict: 2,
        outwit: 3,
        random: 4
    };
    this.effectiveness = [0, 0, 0, 0];
};
RPS.Player.Megazord.NAME = 'Megazord';
RPS.Player.Megazord.Strategy = 'trumpLast';


RPS.Player.Megazord.prototype.throwMove = function() {

    // Check the current strategy and attack
    switch (RPS.Player.Megazord.Strategy) {
            case 'trumpLast':
                
            case 'patternMatch':
                
            case 'owtwit':
                
            default:
    }

    return m;

};

/*
 *  Record the results
 */
RPS.Player.Megazord.prototype.addResult = function(result, opponentMove) {




    // adjust confidence level, drops faster when losing
    if (result === 1) {
        this.confidence += 1;
    } else {this.confidence -= 3;}

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