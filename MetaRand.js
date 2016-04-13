    /*
     *  MetaRand : switches strategy randomly if things are going poorly
     */
    RPS.Player.MetaRand = function() {

        // Believe in yourself!
        this.confidence = 10;
        this.paranoia = 0;

        //Keep track :       R  P  S
        this.myMoveCount = [0, 0, 0];
    };

    RPS.Player.MetaRand.NAME = 'MetaRand';
    // Memory needs to carry through all 100 sets with an opponent
    RPS.Player.MetaRand.Memory = "";
    RPS.Player.MetaRand.Strategy = 'trump my last move';

    //Check if the recent pattern of moves has occurred in memory
    //   Recurse with ever shorter spans
    RPS.Player.MetaRand.prototype.patternMatch = function(span) {

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

                // get the move occurring after found pattern
                prediction = hist[index + pattern.length];
                return parseInt(prediction);

            //Recurse with a shorter search span
            } else { arguments.callee(Math.floor(span/2)); }
        } 
        return RPS.randomMove();
        
    };

    RPS.Player.MetaRand.prototype.throwMove = function() {

        var s = RPS.Player.MetaRand.Strategy;
        var m = RPS.randomMove();

        if (s == 'outwit') {

            myMostPlayed = this.myMoveCount.indexOf( Math.max(...this.myMoveCount)) + 1;.
            m = RPS.trumps(RPS.trumps(myMostPlayed));

        } else if (s == 'pattern matching') {

            //Check if there is an optimal span
            m = this.patternMatch(25);

        } else if (s == 'trump my last move') {

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
    RPS.Player.MetaRand.prototype.addResult = function(result, opponentMove) {

        //Store data on my opponent
        RPS.Player.MetaRand.Memory += String(opponentMove);

        // clear the cache every set
        if (RPS.Player.MetaRand.Memory.length > 9999) { RPS.Player.MetaRand.Memory = ""; }

        this.oppLastMove = opponentMove;
        this.oppMoveCount[opponentMove - 1] += 1;

        // adjust confidence level, biased towards losing
        if (result === 1) {
            this.confidence += 1;
        } else {this.confidence -= 2;}

        // if confidence hits rock bottom randomly switch strategy
        if (this.confidence < 1) {
            var rand = Math.floor((Math.random() * 5) + 1);
            switch (rand) {
                case 1:
                case 2:
                    RPS.Player.MetaRand.Strategy = 'pattern matching'; //decimates
                    break;
                case 3:
                case 4:
                    RPS.Player.MetaRand.Strategy = 'outwit'; //doubletrumps trumper
                    break;    
                default:
                    RPS.Player.MetaRand.Strategy = 'random'; //Good ole random
            }
            this.confidence = 10;
        }
    };