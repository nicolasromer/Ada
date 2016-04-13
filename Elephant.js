/*
 *  Elephant : Can keep all enemy moves in memory and searches for a match
 */
RPS.Player.Elephant = function() {};
RPS.Player.Elephant.NAME = 'Elephant';

// Elephant remembers all 100 sets with an opponent
RPS.Player.Elephant.Memory = "";

//Check if the recent pattern of moves has occurred in memory
RPS.Player.Elephant.prototype.patternMatch = function(span) {

    var memory = RPS.Player.Elephant.Memory,
        pattern, data, prediction, index;

    if (span > 4 && memory.length > span * 2) {

        //Split memory into search pattern and data to be searched
        pattern = memory.slice(memory.length - span);
        data = memory.slice(0, -span);

        index = data.lastIndexOf( pattern );

        if (index > 0) {

            // get the move occurring after found pattern
            prediction = memory[index + pattern.length];
            return parseInt(prediction);

        } else { 

            //Recurse with a shorter search span
            arguments.callee( Math.floor(span / 2) );
        }
    } else {

        return RPS.randomMove();
    }
};

RPS.Player.Elephant.prototype.throwMove = function() {

    return this.patternMatch(60);
};

RPS.Player.Elephant.prototype.addResult = function(result, opponentMove) {

    RPS.Player.Elephant.Memory += String(opponentMove);

    // clear the cache a couple times a set for best performance (best score: 4999)
    if (RPS.Player.Elephant.Memory.length > 1999) { RPS.Player.Elephant.Memory = ""; }

};

