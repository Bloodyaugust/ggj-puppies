/*! ggj-puppies 25-01-2015 */
function logPlay(){_gaq.push(["_trackEvent","Button","Play"])}function start(){var a=new Date;window.app=new SL.Game({canvas:document.getElementById("GameCanvas")}),spritesheet=new PIXI.SpriteSheetLoader("res/atlas.json"),spritesheet.load(),app.assetCollection=new SL.AssetCollection("res/assets.json",app,function(){_gaq.push(["_trackEvent","Game","Load","",(new Date-a)/1e3]),$(".canvas-container").append(domjs.build(templates.modal));var b=new SL.Scene("loading",[],function(){},app);b.addEntity(new SL.Loader({assetCollection:app.assetCollection,screenSize:SCREEN_SIZE,loadCallback:function(){app.transitionScene("menu")},barColor:"blue",textColor:"green"}));var c=new SL.Scene("menu",[],function(){var a=$(".modal");a.append(domjs.build(templates.menu)),$(".menu .button").on("click",function(){a.empty(),a.off(),app.transitionScene($(this).attr("id"))});var b;a.mousemove(function(){b=new SL.Vec2(event.clientX-this.offsetLeft,event.clientY-this.offsetTop)});var c=new PIXI.Sprite(app.assetCollection.getTexture("title"));app.currentScene.addEntity({sprite:c,update:function(){}}),c.position=new SL.Vec2(260,75);var d=new PIXI.Sprite(app.assetCollection.getTexture("titleEyes")),e=new SL.Vec2(389,140);d.anchor={x:.5,y:.5},d.position=e,app.currentScene.addEntity({sprite:d,update:function(){if(b){var a=e.angleBetween(b);d.position=e.getTranslatedAlongRotation(-3,a)}}})},app),d=new SL.Scene("game",[],function(){var a=$(".modal");a.empty(),a.off(),a.hide(),testSprite=new PIXI.Sprite.fromFrame("tree.PNG"),app.currentScene.addEntity({type:"background",sprite:new PIXI.Sprite(app.assetCollection.getTexture("background")),update:function(){}}),MapGeneration()},app);app.addScene(b),app.addScene(c),app.addScene(d),app.transitionScene("loading"),app.start()})}function MapGeneration(){function a(a,b,c){var d=a.split("."),e="load"+d[0];e=new PIXI.Sprite.fromFrame(a),e.scale={x:2,y:2},app.currentScene.addEntity({type:d[0],sprite:e,update:function(){}}),e.position=new SL.Vec2(b,c)}var b=1024,c=new PIXI.DisplayObjectContainer,d=new PIXI.RenderTexture;d.render(c);var e;xhr=new XMLHttpRequest,xhr.onload=function(){e=JSON.parse(this.responseText);var c=[],d=[],f=0,g=0,h=0;for(var i in e.frames)c.push(i);for(var h=0;h<c.length;h++)"alert.PNG"==c[h]||"clickGround1.PNG"==c[h]||"clickGround2.PNG"==c[h]||"clickGround3.PNG"==c[h]||"puppyWalk1.PNG"==c[h]||"puppyWalk2.PNG"==c[h]||"puppyWalk3.PNG"==c[h]||d.push(c[h]);for(var j=0;b>j;j+=64){var k=Math.floor(Math.random()*d.length);if(a(d[k],f,g),"tree.PNG"==d[k]||"dirt.PNG"==d[k])f+=64;else{for(var h=0;2>h;h++){var l=Math.floor(Math.random()*d.length);if("tree.PNG"==d[l]||"dirt.PNG"==d[l]);else{var m=g;m=g+64,a(d[l],f,m)}}f=f}f+=64}},xhr.open("get","res/atlas.json",!0),xhr.send()}SL=sugarLab;var SCREEN_SIZE=new SL.Vec2(800,576);