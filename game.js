SL = sugarLab;

var SCREEN_SIZE = new SL.Vec2(800, 576);

function logPlay() {
    _gaq.push(['_trackEvent', 'Button', 'Play']);
}

function start() {
    var startLoad = new Date;

    window.app = new SL.Game({canvas: document.getElementById('GameCanvas')});
    spritesheet = new PIXI.SpriteSheetLoader('res/atlas.json');

    spritesheet.load();

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
            
            var curMOUSE;
            modal.mousemove(function(){
                curMOUSE = new SL.Vec2(event.clientX - this.offsetLeft, event.clientY - this.offsetTop);
            });

            var title = new PIXI.Sprite(app.assetCollection.getTexture('title'));
            app.currentScene.addEntity({
                sprite: title,
                update: function () {}
            });
            title.anchor = {x: 0.5, y: 0.5};
            title.position = new SL.Vec2(389, 140);
            var eyes = new PIXI.Sprite(app.assetCollection.getTexture('titleEyes')),
                eyeBase = new SL.Vec2(389, 140);

            eyes.anchor = {x: 0.5, y: 0.5};
            eyes.position = eyeBase;

            var idleClock;
            var valX, valY;
            var preValX, preValY;

            app.currentScene.addEntity({
                sprite: eyes,
                update: function () {
                    if (curMOUSE) {
                        valX = curMOUSE.x;
                        valY = curMOUSE.y;
                        if(valX != preValX){
                            var direction = title.position.angleBetween(curMOUSE);
                            eyes.position = eyeBase.getTranslatedAlongRotation(-3, direction); 
                            idleClock=0;                          
                        } else {
                            if(Math.floor(idleClock) > 1){
                                eyes.position = eyeBase;
                            } else{
                                idleClock += 1/60;                          
                            }
                        }
                        preValX = valX;
                        preValY = valY;
                    } 
                } 
            });
        }, app);

        var gameScene = new SL.Scene('game', [], function () {
            var modal = $('.modal');
            modal.empty();
            modal.off();
            modal.hide();

            testSprite = new PIXI.Sprite.fromFrame('tree.PNG');

            app.currentScene.addEntity({
                type: 'background',
                sprite: new PIXI.Sprite(app.assetCollection.getTexture('background')),
                update: function () {
                }
            });
            AnimationManager();
            MapGeneration(2048);
        }, app);

        app.addScene(loadingScene);
        app.addScene(menuScene);
        app.addScene(gameScene);
        app.transitionScene('loading');

        app.start();
    });
}

function MapGeneration(m) {
    var worldSize = m;
    var bgIndex = new PIXI.DisplayObjectContainer();

    var mapContainer = new PIXI.DisplayObjectContainer();
    var texture = new PIXI.RenderTexture();
    texture.render(mapContainer);

    function onloadGenerate(x,oX,oY){
        var label = x.split('.');
        var methodLabel = 'load'+label[0];
        methodLabel = new PIXI.Sprite.fromFrame(x);
        methodLabel.scale = {x: 2, y: 2};
        app.currentScene.addEntity({
          type: label[0],
          sprite: methodLabel,
          update: function () {}
        });       
        // var assign obj and add it to the scene and //
        methodLabel.position = new SL.Vec2(oX, oY);
    }
//DRAW//
//INVOKE WHILE < World Map Size//
    var jsonObj;
    xhr = new XMLHttpRequest();
    xhr.onload = function () { 
        jsonObj = JSON.parse(this.responseText); 
        var keys = [];
        var tileKeys = [];
        var oX=0;
        var oY=0;
        for(var key in jsonObj.frames){
          keys.push(key);
        }
        for(var i=0;i<keys.length;i++){
            if(keys[i] == 'alert.PNG' || keys[i] == 'clickGround1.PNG' || keys[i] == 'clickGround2.PNG' || keys[i] == 'clickGround3.PNG' || keys[i] == 'puppyWalk1.PNG' || keys[i] == 'puppyWalk2.PNG' || keys[i] == 'puppyWalk3.PNG'){
            }else{
                tileKeys.push(keys[i]);
            }            
        }
        var counterY = 0;
        var counterX = 0;
        var TileTrackerX = 0;
        while(!((512/64)%8) && oY < 512){
            while(!((512/64)%8) && oX < 512){
                var selector = Math.floor(Math.random() * tileKeys.length);
                bgIndex.addChild(tileKeys[selector]);

                onloadGenerate(tileKeys[selector],oX,oY);
                if(tileKeys[selector] == 'tree.PNG' || tileKeys[selector] == 'dirt.PNG'){
                    oX += 64;
                    TileTrackerX += 128;
                } else {
                    for(var i=0;i<1;i++){
                        var r = Math.floor(Math.random() * tileKeys.length);
                        var yO = oY;
                        while (tileKeys[r] == 'tree.PNG' || tileKeys[r] == 'dirt.PNG') {
                            r = Math.floor(Math.random() * tileKeys.length);
                        }
                        if(tileKeys[r] == 'tree.PNG' || tileKeys[r] == 'dirt.PNG'){
                        } else {
                            yO = oY + 64;                      
                            bgIndex.addChild(tileKeys[r]);
                            onloadGenerate(tileKeys[r],oX,yO);
                            yO = oY;
                        }
                        TileTrackerX += 64;
                        counterX += 1;            
                    }                
                    oX = oX;
                }
                if(TileTrackerX>512){
                    console.log('Encounterd incompatible set Size @ Row: '+(counterY+1) +', '+TileTrackerX);
                }
                oX+=64; 
            }
            counterX = 0;            
            TileTrackerX = 0;
            counterY += 1;            
            oY+=128; 
            oX=0;  
        }
    };
    xhr.open('get', 'res/atlas.json', true);
    xhr.send();
}

function AnimationManager() {
    var indexManagement = new PIXI.DisplayObjectContainer();   
    function onloadGenerate(x,oX,oY){
        var label = x.split('.');
        var methodLabel = 'load'+label[0];
        methodLabel = new PIXI.Sprite.fromFrame(x);
        methodLabel.scale = {x: 2, y: 2};
        methodLabel.position = new SL.Vec2(oX, oY);
        app.currentScene.addEntity({
          type: label[0],
          sprite: methodLabel,
          update: function () {}
        });       
    }
    //DRAW//
    var jsonObj;
    xhr = new XMLHttpRequest();
    xhr.onload = function () { 
        jsonObj = JSON.parse(this.responseText); 
        var keys = [];
        var clickKeys = [];
        var indicatorKeys = [];
        var playerKeys = [];
        for(var key in jsonObj.frames){
          keys.push(key);
        }
        for(var i=0;i<keys.length;i++){
            if(keys[i] == 'clickGround1.PNG' || keys[i] == 'clickGround2.PNG' || keys[i] == 'clickGround3.PNG'){
                clickKeys.push(keys[i]);
            }else if(keys[i] == 'alert.PNG'){
                indicatorKeys.push(keys[i]);
            }else if(keys[i] == 'puppyWalk1.PNG' || keys[i] == 'puppyWalk2.PNG' || keys[i] == 'puppyWalk3.PNG'){
                playerKeys.push(keys[i]);
            }            
        }  
        onloadGenerate(playerKeys[0],250,250);
    };
    xhr.open('get', 'res/atlas.json', true);
    xhr.send();
}

function GameCursor() {
    var indexManagement = new PIXI.DisplayObjectContainer();   


}