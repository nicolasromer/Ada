    /*
     *  MetaRand : switches strategy randomly if things are going poorly
     */
    RPS.Player.MetaRand = function() {

        // Believe in yourself!
        this.confidence = 10;
        this.paranoia = 0;

        //Keep track :       R  P  S
        this.oppMoveCount = [0, 0, 0];
        this.myMoveCount = [0, 0, 0];
        this.myLastMove = 2;
        this.oppLastMove = 1;

        this.provenSpan = 0;

        
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

    RPS.Player.MetaRand.prototype.throwMove = function() {

        var s = RPS.Player.MetaRand.Strategy;
        var m = RPS.randomMove();


            m = this.patternMatch(this.provenSpan ? this.provenSpan : 25);


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



    };