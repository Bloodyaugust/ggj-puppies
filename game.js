SL = sugarLab;

var SCREEN_SIZE = new SL.Vec2(576, 576);

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
            title.position = new SL.Vec2(290, 140);
            var eyes = new PIXI.Sprite(app.assetCollection.getTexture('titleEyes')),
                eyeBase = new SL.Vec2(290, 140);

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
            var modal = $('.modal'),
                map;
            modal.empty();
            modal.off();
            modal.hide();

            app.currentScene.addEntity({
                type: 'background',
                sprite: new PIXI.Sprite(app.assetCollection.getTexture('background')),
                update: function () {
                }
            });

            map = new Map();

            app.currentScene.addEntity(new Puppy({
                location: new SL.Vec2(256, 64)
            }));

            app.currentScene.addEntity(new Player());
        }, app);

        app.addScene(loadingScene);
        app.addScene(menuScene);
        app.addScene(gameScene);
        app.transitionScene('loading');

        app.start();
    });
}

function Puppy (config) {
    var me = this;

    me.sprite = new PIXI.Sprite.fromFrame('puppyWalk1.png');
    me.rect = new SL.Rect(config.location, new SL.Vec2(me.sprite.width, me.sprite.height));
    me.attention = 100;

    me.sprite.scale = {x: 2, y: 2};

    me.update = function () {
        me.sprite.position = me.rect.location.clone();
    }
}

function Player () {
    var me = this;

    me.sprite = new PIXI.Sprite.fromFrame('cursor.png');
    me.rect = new SL.Rect(new SL.Vec2(0, 0), new SL.Vec2(2, 2));

    me.update = function () {
        var tileGroups = app.currentScene.getEntitiesByTag('tileGroup'),
            hitTileGroup;

        me.rect.setLocation(app.mouseLocation);
        me.sprite.position = app.mouseLocation.clone();

        if (app.onMouseDown('left')) {
            for (var i = 0; i < tileGroups.length; i++) {
                if (me.rect.intersects(tileGroups[i].rect)) {
                    hitTileGroup = tileGroups[i];
                    console.log('intersection with: ', hitTileGroup);
                    for (var i2 = 0; i2 < hitTileGroup.tiles.length; i2++) {
                        if (me.rect.intersects(hitTileGroup.tiles[i2].rect)) {
                            console.log('intersection with: ', hitTileGroup.tiles[i2]);
                        }
                    }
                }
            }
        }
    }
}

function Tile (config) {
    var me = this;

    me.tag = 'tile';
    me.type = config.type;
    me.sprite = new PIXI.Sprite.fromFrame(me.type + '.png');
    me.state = 'idle';
    me.rect = new SL.Rect(config.location, new SL.Vec2(me.sprite.width * 2, me.sprite.height * 2));

    me.sprite.position = me.rect.location.clone();
    me.sprite.scale = {x: 2, y: 2};

    me.update = function () {

    }
}

function TileGroup (location) {
    var me = this,
        tileConfigs = app.assetCollection.assets.tiles,
        largeTileWeight = 0,
        smallTileWeight = 0,
        totalWeight = 0,
        smallTiles = [],
        chances = [],
        largeTiles = [],
        runningChance = 0,
        largeTileChance, tileType, tileSeed;

    me.tag = 'tileGroup';
    me.rect = new SL.Rect(location, new SL.Vec2(576, 128));
    me.tiles = [];

    for (var i = 0; i < tileConfigs.length; i++) {
        if (tileConfigs[i].size === 1) {
            smallTileWeight += tileConfigs[i].rate;
            smallTiles.push(tileConfigs[i]);
        } else {
            largeTileWeight += tileConfigs[i].rate;
            largeTiles.push(tileConfigs[i]);
        }
        totalWeight += tileConfigs[i].rate;
    }
    for (i = 0; i < smallTiles.length; i++) {
        runningChance = 0;
        for (var i2 = 0; i2 <= i; i2++) {
            runningChance += smallTiles[i2].rate / smallTileWeight;
        }
        chances.push(runningChance);
    }
    largeTileChance = largeTileWeight / totalWeight;

    for (i = 0; i < 5; i++) {
        if (Math.random() < largeTileChance) {
            tileType = Math.random() < largeTiles[0].rate / largeTileWeight ? largeTiles[0].type : largeTiles[1].type;
            me.tiles.push(new Tile({
                type: tileType,
                location: me.rect.location.getTranslated(new SL.Vec2(128 * i, 0))
            }));
        } else {
            for (var i2 = 0; i2 < 4; i2++) {
                tileSeed = Math.random();
                switch (true) {
                    case tileSeed >= 0 && tileSeed < chances[0]:
                        me.tiles.push(new Tile({
                            type: smallTiles[0].type,
                            location: me.rect.location.getTranslated(new SL.Vec2((i * 128) + ((i2 % 2) * 64), Math.floor(i2 / 2) * 64))
                        }));
                        break;
                    case tileSeed >= chances[0] && tileSeed <= chances[1]:
                        me.tiles.push(new Tile({
                            type: smallTiles[1].type,
                            location: me.rect.location.getTranslated(new SL.Vec2((i * 128) + ((i2 % 2) * 64), Math.floor(i2 / 2) * 64))
                        }));
                        break;
                    case tileSeed >= chances[1] && tileSeed <= chances[2]:
                        me.tiles.push(new Tile({
                            type: smallTiles[2].type,
                            location: me.rect.location.getTranslated(new SL.Vec2((i * 128) + ((i2 % 2) * 64), Math.floor(i2 / 2) * 64))
                        }));
                        break;
                    case tileSeed >= chances[2] && tileSeed <= chances[3]:
                        me.tiles.push(new Tile({
                            type: smallTiles[3].type,
                            location: me.rect.location.getTranslated(new SL.Vec2((i * 128) + ((i2 % 2) * 64), Math.floor(i2 / 2) * 64))
                        }));
                        break;
                    case tileSeed >= chances[3] && tileSeed <= chances[4]:
                        me.tiles.push(new Tile({
                            type: smallTiles[4].type,
                            location: me.rect.location.getTranslated(new SL.Vec2((i * 128) + ((i2 % 2) * 64), Math.floor(i2 / 2) * 64))
                        }));
                        break;
                }
            }
        }
    }

    for (i = 0; i < me.tiles.length; i++) {
        app.currentScene.addEntity(me.tiles[i]);
    }

    me.update = function () {};
}

function Map () {
    var me = this;

    me.groups = 100;
    me.tileGroups = [];

    for (var i = 0; i < me.groups; i++) {
        me.tileGroups.push(new TileGroup(new SL.Vec2(0, i * 128)));
        app.currentScene.addEntity(me.tileGroups[i]);
    };
}
