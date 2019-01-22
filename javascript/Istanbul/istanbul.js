var utils = {
    getShuffleArr: function(arr){
        //TODO - actually shuffle
        return arr;
    },
    rollDie:function(){
        return Math.ceil(Math.random()*6)
    },
    roll2:function(){
        return utils.rollDie + utils.rollDie;
    },

}
//Game Object
    //Board - 2d arr of spaces
        //Spaces 
            //Player list
            //Encounter list (ambasador, black market, sketchies)
            //Effect function - input player
                //(Most of the work)
            //Space state - (ie. post office level, gemstore cost, etc)
                //Gems remaining
            //Left helpers

            
    //Player objects 
        //money
        //gems
        //wheelbarrow limit
        //current of blue, red, yellow, green
        //Upgrades - roll, wharehouse, pick up, 5th, coffee??
        //coffee 


    //sequence of play
        //Card can be played
        //input is given for a move
        //Action function enacted (possibly require input, and chain into other actions)
        //Card can be played
        //Encounters - require input
        //Move encounters
        //Card can be played
        //Check gems