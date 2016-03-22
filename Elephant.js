    /*
     *  Elephant : Keeps all 10,000 enemy moves in memory and searches for a match
     */
    RPS.Player.Elephant = function() {};
    RPS.Player.Elephant.NAME = 'Elephant';

    // Elephant remembers all 100 sets with an opponent
    RPS.Player.Elephant.Memory = "";

    //Check if the recent pattern of moves has occurred in memory
    RPS.Player.Elephant.prototype.patternMatch = function(span) {

        if (span > 4 && RPS.Player.Elephant.Memory.length > span * 2) {

            var hist = RPS.Player.Elephant.Memory;
            var prediction = undefined;

            var pattern = hist.slice(hist.length - span);
            var past = hist.slice(0, -span);
            var index = past.lastIndexOf( pattern );

            if (index > 0) {

                // get the move occurring after found pattern
                prediction = hist[index + pattern.length];
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

    /*
     *  Record the results
     */
    RPS.Player.Elephant.prototype.addResult = function(result, opponentMove) {

        //Store data on my opponent
        RPS.Player.Elephant.Memory += String(opponentMove);

        // clear the cache every set
        if (RPS.Player.Elephant.Memory.length > 9999) { RPS.Player.Elephant.Memory = ""; }

    };