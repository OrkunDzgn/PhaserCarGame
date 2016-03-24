
var gameWidth = 1000;
var gameHeight = 600;
var backgroundColor = "#000000";
var rotationWheel;
var maxSpeed;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'ArabaDeneme', {preload: preload, create: create, update: update });

function preload() {
    //game.load.crossOrigin = "Anonymous"; //required to load assets for codepen

    // load the sprite texture
    game.load.image('road1', 'images/map1.png');
    game.load.image('road2', 'images/map2.png');
    game.load.image('objTest', 'images/object.png');

    // load the physics data json
    game.load.physics('physicsData', 'road.json');
    game.load.physics('physicsData2', 'road2.json');
    game.load.physics('objPhysicsData', 'object.json')
}

var polygonCollisionSprite;
var objColSprite;

function create() {

    maxSpeed = 850;

    //game.add.tileSprite(0, 0, 3200, 600, 'road2');

    game.world.setBounds(0, 0, 3800, 600);

    // start the P2JS physics system
    game.physics.startSystem(Phaser.Physics.P2JS);

    //set some initial gravity
    game.physics.p2.gravity.y = 500;

    game.physics.p2.friction = 2;

    // add our polygon collider sprite
    // and give it physics
    polygonCollisionSprite = game.add.sprite(1600, 320, 'road2');
    objColSprite = game.add.sprite(0, 0, 'objTest');
    

    game.physics.p2.enable([polygonCollisionSprite, objColSprite], false);
    //game.physics.p2.enable(objColSprite, true);

    // remove all of the current collision shapes from the physics body
    polygonCollisionSprite.body.clearShapes();
    objColSprite.body.clearShapes();


    // load our polygon physics data
    polygonCollisionSprite.body.loadPolygon('physicsData2', 'map2');
    objColSprite.body.loadPolygon('objPhysicsData', 'object');

    objColSprite.body.data.gravityScale = 1,3;
    polygonCollisionSprite.body.static = true;

    objColSprite.mass = 100;
    objColSprite.allowRotation = true;

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(objColSprite);

}
function update() {
    if (cursors.down.isDown) {
        objColSprite.body.y -= 20;
    }
    if (cursors.right.isDown) {
        if (objColSprite.body.velocity.x < maxSpeed)
        objColSprite.body.velocity.x += 7;
    } else if (cursors.left.isDown) {
        objColSprite.body.velocity.x -= 7;
    }
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(objColSprite, 32, 500);

}