// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Events = Matter.Events;
    // Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
});

// create two boxes and a ground
var bodies = [];
for (i=0; i<20; i++){
    bodies[i] = Bodies.circle(45*i, 45*i, 15, { restitution: 1, friction: 1, mass: 10, frictionAir: 0 });
}
var ground = Bodies.rectangle(400, 610, 810, 100, { isStatic: true });
var leftWall = Bodies.rectangle(10, 10, 50, 1200, { isStatic: true });
var rightWall = Bodies.rectangle(800, 10, 50, 1200, { isStatic: true });
var topWall = Bodies.rectangle(50, 10, 1500, 60, { isStatic: true });

// var spaceShip = Bodies.fromVertices([{x: 10, y: 10}, {x:5, y:30}, {x:15, y:30}]);
var spaceShip = Bodies.rectangle(100, 10, 100, 30, {angle: 78, frictionAir: 0, mass: 20});

engine.world.gravity.y = 0;
engine.world.gravity.x = 0;
engine.world.frictionAir = 0;
Matter.Body.applyForce(bodies[0], bodies[0].position, {x: Math.random(), y: Math.random()});
Matter.Body.applyForce(bodies[10], bodies[1].position, {x: Math.random(), y: 1});

// add all of the bodies to the world
World.add(engine.world, bodies);
World.add(engine.world, spaceShip);
World.add(engine.world, [ground, leftWall, rightWall, topWall]);

Matter.Body.applyForce(spaceShip, spaceShip.position, {x: 0.1, y: 0.1});


// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);