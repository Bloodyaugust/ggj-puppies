var Menu = function(game){}

Menu.prototype = {
  	create: function(){
		var Menu = this.game.add.sprite(250,100,"Menu");
		Menu.anchor.setTo(0.5,0.5);
		var playButton = this.game.add.button(250,300,"play",this.playTheGame,this);
		playButton.anchor.setTo(0.5,0.5);
	},
	playTheGame: function(){
		this.game.state.start("game");
	}
}