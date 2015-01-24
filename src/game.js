var Game = function(game){
	spriteNumber = null;
	number = 0;
	workingButtons = true;
	higher = true;
	score = 0;
}
Game.prototype = {
  	create: function(){
		spriteNumber = this.game.add.sprite(this.game.width/2,this.game.height/2,"puppy");
		spriteNumber.anchor.setTo(0.5,0.5);
		var higherButton = this.game.add.button(this.game.width/2,this.game.height - 100,"higher",this.forceOver,this);
		higherButton.anchor.setTo(0.5,0.5);
		//var higherButton = this.game.add.button(160,100,"higher",this.clickedHigher,this);
		//var lowerButton = this.game.add.button(160,380,"lower",this.clickedLower,this);
	},
	custom1: function(){
	},
	custom2: function(){
	},
	custom3: function(){
	},
	custom4: function(){
	},
	forceOver: function(){
		this.game.state.start("over");
	}
}