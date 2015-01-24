var Over = function(game){}

Over.prototype = {
	init: function(score){
	},
  	create: function(){
		var playButton = this.game.add.button(this.game.width/2,this.game.height-50,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("game");
	}
}