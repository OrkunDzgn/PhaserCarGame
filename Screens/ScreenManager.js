
var gameWidth = 1000;
var gameHeight = 600;
var backgroundColor = "#00000";
var rotationWheel;
var maxSpeed;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'ArabaDeneme', {preload: preload, create: create, update: update });

function preload() {
    //game.load.crossOrigin = "Anonymous"; //required to load assets for codepen

    // load the sprite texture
    game.load.image('road1', 'images/map1.png');
    game.load.image('road2', 'images/map2.png');
    game.load.image('carbody', 'images/body.png');
    game.load.image('wheel', 'images/smallWheel.png');

    // load the physics data json
    game.load.physics('physicsData', 'road.json');
    game.load.physics('physicsData2', 'road2.json');
    game.load.physics('objectPhysics', 'jeepCol.json');
    game.load.physics('wheelPhysics', 'wheelCol.json');
}

var polygonCollisionSprite;
var objColSprite;
var wheelSprite;
var cursors;

function create() {

    maxSpeed = 850;
    game.world.setBounds(0, 0, 3800, 600);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 500;
    game.physics.p2.friction = 2;

    polygonCollisionSprite = game.add.sprite(1600, 320, 'road2');
    objColSprite = game.add.sprite(0, 0, 'carbody');
    wheelSprite = game.add.sprite(0, 0, 'wheel');

    game.physics.p2.enable([polygonCollisionSprite, objColSprite, wheelSprite], false);

    //var constraint = game.physics.p2.createLockConstraint(objColSprite, wheelSprite, [45, -52], 0);

    polygonCollisionSprite.body.clearShapes();
    objColSprite.body.clearShapes();


    polygonCollisionSprite.body.loadPolygon('physicsData2', 'map2');
    objColSprite.body.loadPolygon('objectPhysics', 'body');
    wheelSprite.body.loadPolygon('wheelPhysics', 'smallWheel');

    objColSprite.body.data.gravityScale = 1, 3;
    polygonCollisionSprite.body.static = true;
    

    objColSprite.mass = 100;
    wheelSprite.mass = 50;
    objColSprite.allowRotation = true;
    wheelSprite.allowRotation = true;


    wheelSprite.anchor.setTo(0.5, 0.5);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(objColSprite);


}
function update() {
    if (cursors.down.isDown) {
        objColSprite.body.y -= 20;
    }
    if (cursors.right.isDown) {
        wheelSprite.body.angle += 10;
        //if (objColSprite.body.velocity.x < maxSpeed)
          //  objColSprite.body.velocity.x += 7;
    } else if (cursors.left.isDown) {
        objColSprite.body.velocity.x -= 7;
    }
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(objColSprite, 32, 500);

}