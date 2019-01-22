//Player objects 
    //money
    //gems
    //wheelbarrow limit
    // current of blue, red, yellow, green
    //Upgrades - roll, wharehouse, pick up, 5th, coffee??
    //coffee 

class Player{
    constructor(){
        this.money = 0;
        this.gems = 0;
        this.barrowLimit = 2;
        this.blue = 0;
        this.red = 0;
        this.yellow = 0;
        this.green = 0;
        this.currHelpers = 4;
        this.MAX_BARROW_SIZE = 5;
        this.rollUpgrade = false;
        this.wharehouseUpgrade = false;
        this.helperUpgrade = false;
        this.fifthUpgrade = false;
    }
    fillRed(){
        this.red = this.barrowLimit;
    }
    fillYellow(){
        this.yellow = this.barrowLimit;
    }
    fillGreen(){
        this.green = this.barrowLimit;
    }
    addWheelbarrow(){
        if (this.barrowLimit < this.MAX_BARROW_SIZE){
            this.barrowLimit ++;
            if(this.barrowLimit == this.MAX_BARROW_SIZE){
                this.gems ++;
            }
        }
    }
    addRed(num = 1){
        this.red = Math.min(this.red + num, this.barrowLimit);
        this.manageWharehouseUpgrade();
    }
    addBlue(num = 1){
        this.blue = Math.min(this.blue + num, this.barrowLimit);
        this.manageWharehouseUpgrade();
    }
    addYellow(num = 1){
        this.yellow = Math.min(this.yellow + num, this.barrowLimit);
        this.manageWharehouseUpgrade();
    }
    addGreen(num = 1){
        this.green = Math.min(this.green + num, this.barrowLimit);
        this.manageWharehouseUpgrade();
    }
    manageWharehouseUpgrade(){
        if(this.wharehouseUpgrade){
            this.promptWharehouseUpgrade();
        }
    }
    promptWharehouseUpgrade(){
        throw "promptWharehouse called on generic player, function should be overriden";
    }
}

class AIPlayer{
    constructor(){
        super();

    }


}

class HumanPlayer{
    constructor(){
        super();

    }
}