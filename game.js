SL = sugarLab;

var SCREEN_SIZE = new SL.Vec2(800, 576);

function logPlay() {
    _gaq.push(['_trackEvent', 'Button', 'Play']);
}

function start() {
    var startLoad = new Date;

    window.app = new SL.Game({canvas: document.getElementById('GameCanvas')});

    app.assetCollection = new SL.AssetCollection('res/assets.json', app, function () {
        _gaq.push(['_trackEvent', 'Game', 'Load', '', (new Date - startLoad) / 1000]);
        $('.canvas-container').append(domjs.build(templates.modal));

        var loadingScene = new SL.Scene('loading', [], function () {
        }, app);

        loadingScene.addEntity(new SL.Loader({
            assetCollection: app.assetCollection,
            screenSize: SCREEN_SIZE,
            loadCallback: function () { app.transitionScene('menu'); },
            barColor: 'blue',
            textColor: 'green'
        }));

        var menuScene = new SL.Scene('menu', [], function () {
            var modal = $('.modal');

            modal.append(domjs.build(templates.menu));

            $('.menu .button').on('click', function () {
                modal.empty();
                modal.off();
                app.transitionScene($(this).attr('id'));
            });
        }, app);

        var gameScene = new SL.Scene('game', [], function () {
            var modal = $('.modal'),
              atlas = new PIXI.AtlasLoader('res/atlas.json'),
              testSprite = new PIXI.Sprite(app.assetCollection.getTexture('new'));
            modal.empty();
            modal.off();
            modal.hide();

            app.currentScene.addEntity({
                type: 'background',
                sprite: new PIXI.Sprite(app.assetCollection.getTexture('background')),
                update: function () {}
            });

            testSprite.scale = {x: 15, y: 10};
            //testSprite.filters = [new PIXI.PixelateFilter()];
            app.currentScene.addEntity({
              type: 'test',
              sprite: testSprite,
              update: function () {}
            });
        }, app);

        app.addScene(loadingScene);
        app.addScene(menuScene);
        app.addScene(gameScene);
        app.transitionScene('loading');

        app.start();
    });
}

var MapGeneration = {
    var worldSize = 1024;
    var tileOffset = 32;
    var mapContainer = new PIXI.DisplayObjectContainer();
    var texture = new PIXI.RenderTexture();
    texture.render(mapContainer);

    /*
        var map = [
        for(){
            for(){
                [5,5,5,5,5],
            }
            if(i-n eq 1){
                [5,5,5,5,5]];
            }
        }
    */
    /*
    var TileCheck : function(){
        for(var i=0;i<worldSize;i++){

            i+tileOffset;
        }  
    },    
    var Placement : function(){
        for(var i=0;i<worldSize;i++){

            i+tileOffset;
        }  
    },   
    */ 
}
