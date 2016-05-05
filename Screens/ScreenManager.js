
var gameWidth = 1000;
var gameHeight = 600;
var backgroundColor = "#669AC0";
var rotationWheel;
var maxSpeed;

var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'ArabaDeneme', {preload: preload, create: create, update: update });

function preload() {
    // load the sprite texture
    game.load.image('road1', 'images/map1.png');
    game.load.image('road2', 'images/map2.png');
    game.load.image('map3', 'images/map3.png');
    game.load.image('carbody', 'images/body.png');
    game.load.image('wheel', 'images/smallWheelv2.png');
    game.load.image('motor_pickup', 'images/motor_pickup.png');

    // load the physics data json
    game.load.physics('physicsData', 'road.json');
    game.load.physics('physicsData2', 'road2.json');
    game.load.physics('map3Physics', 'map3.json');
    game.load.physics('objectPhysics', 'jeepCol.json');
    game.load.physics('wheelPhysics', 'wheelCol.json');
}

var polygonCollisionSprite;
var carBodySprite;
var wheelFrontSprite;
var wheelBackSprite;
var cursors;
var motor_pickup;
var textStyle;
var text;
//var pickups;



function create() {

    maxSpeed = 850;
    //game.stage.backgroundColor = backgroundColor;
    game.world.setBounds(0, 0, 9000, 600);
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.setImpactEvents(true);

    game.physics.p2.gravity.y = 400;
    game.physics.p2.friction = 10;

    var carCG = game.physics.p2.createCollisionGroup();
    var groundCG = game.physics.p2.createCollisionGroup();

    game.physics.p2.updateBoundsCollisionGroup();

    motor_pickup = game.add.sprite(500, 260, 'motor_pickup');
    motor_pickup2 = game.add.sprite(1240, 310, 'motor_pickup');

    polygonCollisionSprite = game.add.sprite(1600, 320, 'map3');
    game.physics.p2.enable(polygonCollisionSprite, false);
    carBodySprite = game.add.sprite(100, 350, 'carbody');
    wheelFrontSprite = game.add.sprite(150, 350, 'wheel');
    wheelBackSprite = game.add.sprite(150, 350, 'wheel');

    //pickups = game.add.group();
    //for (var i = 0; i < enemycount; i++) {
    //    var bullet = enemies.create(Math.random() * game.world.width, Math.random() * game.world.height - 140, 'bulletup'); //create bullet at the right side of the camera view
    //    bullet.health = 10;  // health points..  bullets get only moved by moveAliveEnemy() when with full health
    //    game.physics.p2.enable(bullet, true);
    //    bullet.name = 'bullet';
    //    bullet.body.setCircle(bulletdiameter);
    //}

    

    //wheelBackSprite.body.restitution = 0;

    //game.physics.p2.enable([polygonCollisionSprite, carBodySprite, wheelFrontSprite, wheelBackSprite], true);
    game.physics.p2.enable(polygonCollisionSprite);
    game.physics.p2.enable(carBodySprite);
    game.physics.p2.enable(wheelFrontSprite);
    game.physics.p2.enable(wheelBackSprite);
    game.physics.p2.enable(motor_pickup);


    //var constraint = game.physics.p2.createLockConstraint(carBodySprite, wheelSprite, [45, -52], 0);
    //var constraint = game.physics.p2.createRevoluteConstraint(carBodySprite, [0, 0], wheelSprite, [55, -50]);

    var springFront = game.physics.p2.createSpring(carBodySprite, wheelFrontSprite, 70, 150, 50, null, null, [30, -30], null);
    var springBack = game.physics.p2.createSpring(carBodySprite, wheelBackSprite, 70, 150, 50, null, null, [-30, -30], null);
    //game.physics.p2.createSpring(bodya, bodyb, restLength, stiffness, damping);

    constraintFront = game.physics.p2.createPrismaticConstraint(carBodySprite, wheelFrontSprite, false, [65, 45], [0, 0], [0, 1]);
    //SET LIIMITS
    constraintFront.lowerLimitEnabled = constraintFront.upperLimitEnabled = true;
    constraintFront.upperLimit = 0.1;
    constraintFront.lowerLimit = -0.3;

    constraintBack = game.physics.p2.createPrismaticConstraint(carBodySprite, wheelBackSprite, false, [-48, 45], [0, 0], [0, 1]);
    //SET LIIMITS
    constraintBack.lowerLimitEnabled = constraintBack.upperLimitEnabled = true;
    constraintBack.upperLimit = 0.1;
    constraintBack.lowerLimit = -0.3;

    polygonCollisionSprite.body.clearShapes();
    carBodySprite.body.clearShapes();
    wheelFrontSprite.body.clearShapes();
    wheelBackSprite.body.clearShapes();


    polygonCollisionSprite.body.loadPolygon('map3Physics', 'map3');
    carBodySprite.body.loadPolygon('objectPhysics', 'body');
    wheelFrontSprite.body.loadPolygon('wheelPhysics', 'smallWheel');
    wheelBackSprite.body.loadPolygon('wheelPhysics', 'smallWheel');

    motor_pickup.body.static = true;


    carBodySprite.body.data.gravityScale = 1,3;
    polygonCollisionSprite.body.static = true;
    
    carBodySprite.body.mass = 150; //500
    wheelBackSprite.body.mass = 4;
    wheelFrontSprite.body.mass = 4;

    wheelFrontSprite.anchor.setTo(0.5, 0.5);
    wheelBackSprite.anchor.setTo(0.5, 0.5);

    carBodySprite.body.setCollisionGroup(carCG);
    wheelFrontSprite.body.setCollisionGroup(carCG);
    wheelBackSprite.body.setCollisionGroup(carCG);
    polygonCollisionSprite.body.setCollisionGroup(groundCG);

    polygonCollisionSprite.body.collides(carCG);
    wheelBackSprite.body.collides(groundCG)
    wheelFrontSprite.body.collides(groundCG);
    carBodySprite.body.collides(groundCG);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(carBodySprite);
}



function update() {
    //console.log("carBody X: " + carBodySprite.body.x + "pickup X: " + motor_pickup.x);
    console.log("carBody X: " + carBodySprite.body.x + "carBody Y: " + carBodySprite.body.y);
    checkOverlapManually(motor_pickup);

    if (cursors.up.isDown) {
        if (wheelBackSprite.body.angularVelocity < 40 || wheelFrontSprite.body.angularVelocity < 40 || carBodySprite.body.velocity.x < 500) {
            wheelBackSprite.body.angularVelocity =+ 8;
            wheelFrontSprite.body.angularVelocity =+ 8;
            carBodySprite.body.velocity.x += 5;
        }
    }
    else if (cursors.down.isDown) {
        wheelBackSprite.body.angularVelocity = -8;
        wheelFrontSprite.body.angularVelocity = -8;
        carBodySprite.body.velocity.x -= 5;
    }
    if (cursors.right.isDown)
    {
        carBodySprite.body.angularVelocity += 0.13;
    }
    else if (cursors.left.isDown) {
        carBodySprite.body.angularVelocity -= 0.13;
    }
}

function checkOverlapManually(pickupObj) {
    //for (var i = 0 ; i < pickupObjects.length; i++) {
    var dx = carBodySprite.body.x - pickupObj.body.x;  //distance ship X to enemy X
    var dy = carBodySprite.body.y - pickupObj.body.y;  //distance ship Y to enemy Y
    var dist = Math.sqrt(dx * dx + dy * dy);     //pythagoras ^^  (get the distance to each other)
    console.log("Dist diff= " + dist);

    if (dist < 70) {  // if distance to each other is smaller than ship radius and bullet radius a collision is happening (or an overlap - depends on what you do now)
        activatePickup(pickupObj);
    }
   // }
}


function activatePickup(pickupObj) {
    carBodySprite.body.velocity.x += 22;
    game.world.remove(pickupObj);
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(carBodySprite, 32, 500);
}