
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
    game.load.image('carbody', 'images/body_new.png');
    game.load.image('wheel', 'images/smallWheelv2.png');
    game.load.image('motor_pickup', 'images/motor_pickup.png');
    game.load.image('vision_pickup', 'images/vision_pickup.png');
    game.load.image('aerial_logo', 'images/aerial_logo.png');
    game.load.image('background', 'images/background.jpg');

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
var randPickup;
var textStyle;
var text;

var pickups;
var randPickupsArr = ["motor_pickup", "vision_pickup"];
var addedPickups = [];
var pickupCount = 5;


function create() {

    var bg = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
    bg.anchor.setTo(0.5, 0.5);
    bg.fixedToCamera = true;

    text = game.add.text(330, 108, "Aerial Points: 0", {
        font: "20px Arial",
        fill: "#ffffff",
        align: "right"
    });
    text.anchor.setTo(2, 3);
    text.fixedToCamera = true;
    

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

    console.log("----PICKUP POSITIONS----");
    pickups = game.add.group();
    for (var i = 0; i < pickupCount; i++) {
        var pickupX = getRandomX();
        var pickupY = getRandomY();
        var myRandomPickup = randPickupsArr[getRandomInt(0, 1)];
        addedPickups[i] = myRandomPickup;
        console.log("Random X: " + pickupX + " Random Y: " + pickupY + " Created: " + myRandomPickup, i);
        randPickup = pickups.create(pickupX, 300, myRandomPickup);
        game.physics.p2.enable(randPickup);
        randPickup.body.static = true;
    }

    polygonCollisionSprite = game.add.sprite(1600, 320, 'map3');
    game.physics.p2.enable(polygonCollisionSprite, false);
    carBodySprite = game.add.sprite(100, 350, 'carbody');
    wheelFrontSprite = game.add.sprite(150, 350, 'wheel');
    wheelBackSprite = game.add.sprite(150, 350, 'wheel');

    var aerial = game.add.sprite(10, 0, 'aerial_logo');
    aerial.fixedToCamera = true;


    //wheelBackSprite.body.restitution = 0;

    //game.physics.p2.enable([polygonCollisionSprite, carBodySprite, wheelFrontSprite, wheelBackSprite], true);
    game.physics.p2.enable(polygonCollisionSprite);
    game.physics.p2.enable(carBodySprite);
    game.physics.p2.enable(wheelFrontSprite);
    game.physics.p2.enable(wheelBackSprite);
   // game.physics.p2.enable(motor_pickup);


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


var i = 0;
function update() {
    //console.log("carBody X: " + carBodySprite.body.x + "pickup X: " + motor_pickup.x);
    //console.log("carBody X: " + carBodySprite.body.x + "carBody Y: " + carBodySprite.body.y);

    //if(carBodySprite.body.y < 250){ 
        i++;
        text.text = "Aerial Points: " + i;

    //}

    pickups.forEachAlive(checkOverlapManually, this);

    if (cursors.up.isDown) {
        if (wheelBackSprite.body.angularVelocity < 40 || wheelFrontSprite.body.angularVelocity < 40 || carBodySprite.body.velocity.x < 450) {
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

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(carBodySprite, 32, 500);
}

function checkOverlapManually(pickupObj) {
    var i = 0;
    for (i = 0 ; i < pickups.length; i++) {
        var dx = carBodySprite.body.x - pickupObj.body.x;
        var dy = carBodySprite.body.y - pickupObj.body.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 70) {
            activatePickup(pickupObj, i);
            break;
        }
    }
}

function activatePickup(pickupObj ,i) {
    carBodySprite.body.velocity.x += 100;
    console.log("Picked Up: " + addedPickups[i], i);
    pickupObj.kill();
}


function getRandomX() {
    var pickupX = 0;
    var x;
    var previousX = 0;
    while (true) {
        x = getRandomInt(300, 8000);
        delta = previousX - x;
        if (x > 250 & x < 7000 & Math.abs(delta) > 1000) {
            pickupX = x-500;
            break;
        }
    }
    return pickupX;
}

function getRandomY() {
    var pickupY = 0;
    var y;
    var previousX = 0;
    while (true) {
        y = getRandomInt(200, 300);
        if (y > 250 & y < 300) {
            pickupY = y;
            break;
        }
    }
    return pickupY;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

