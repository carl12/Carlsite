

class Game{
    constructor(){
        this.BOARD_WIDTH = 4;
        this.BOARD_HEIGHT = 4;
        this.board = new Array(this.BOARD_HEIGHT).fill(new Array(this.BOARD_WIDTH));


    }
}
var spaces = {
    RedWharehouse:{
        name: "Red Wharehouse",
        action: function(player){
            player.fillRed();
        },
        img: "",
        boardNum: 0,
    },
    YellowWharehouse:{
        name: "Yellow Wharehouse",
        action:function(player){
            player.fillYellow();
        },
        img: "",
        boardNum: 0,
    },
    GreenWharehouse:{
        name: "Green Wharehouse",
        action:function(player){
            player.fillGreen();
        },
        img:"",
        boardNum:0,
    }
};

