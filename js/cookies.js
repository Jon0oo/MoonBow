import '../css/cookies.css';
import cookieImage from '../images/cookie.png';
import jarImage from '../images/cookieJar.png';
const Matter = require('matter-js');

const { Engine, Render, Runner, Bodies, World, Mouse, MouseConstraint, Events, Body, Vector } = Matter;

const engine = Engine.create();
const world = engine.world;

document.addEventListener('DOMContentLoaded', () => {

  // =================== CONFIG ===================
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight * 5;

  const floorThickness = 20;

  // Floor Y position
  const floorY = canvasHeight + 10;

  const jarConfig = {
    x: canvasWidth /5,
    width: 200,
    height: 250,
    wallThickness: 20
  };
  jarConfig.y = floorY +20 - jarConfig.height / 2 - (floorThickness / 2);

  const config = {
    showWalls: false  // Toggle this to true/false to show/hide walls
  };

  // =================== RENDER ===================
  const render = Render.create({
    element: document.querySelector('.cookie-jar-section'),
    canvas: document.getElementById('world'),
    engine: engine,
    options: {
      width: canvasWidth,
      height: canvasHeight,
      wireframes: false,
      background: 'transparent'
    }
  });
  Render.run(render);
  Runner.run(Runner.create(), engine);

  // =================== COOKIE ===================
  const cookieScale = 0.04;
  const imageSize = 3000;
  const visualSize = imageSize * cookieScale;
  const cookieRadius = visualSize / 2;

  const cookie = Bodies.circle(100, 50, cookieRadius, {
    restitution: 0.3,
    frictionAir: 0.02,
    render: {
      sprite: {
        texture: cookieImage,
        xScale: cookieScale,
        yScale: cookieScale
      }
    }
  });

  // =================== JAR WALLS ===================
  let leftJarWall, rightJarWall, jarBottomWall;
  let leftTopWall, rightTopWall;

  function createJarWalls() {
    // vertical side walls
    leftJarWall = Bodies.rectangle(
      jarConfig.x - jarConfig.width / 2,
      jarConfig.y,
      jarConfig.wallThickness,
      jarConfig.height * 2,
      { 
        isStatic: true,
        render: { visible: config.showWalls }
      }
    );

    rightJarWall = Bodies.rectangle(
      jarConfig.x + jarConfig.width / 2,
      jarConfig.y,
      jarConfig.wallThickness,
      jarConfig.height * 2,
      { 
        isStatic: true,
        render: { visible: config.showWalls }
      }
    );

    // bottom wall
    jarBottomWall = Bodies.rectangle(
      jarConfig.x,
      jarConfig.y + jarConfig.height / 2,
      jarConfig.width,
      jarConfig.wallThickness,
      { 
        isStatic: true,
        render: { visible: config.showWalls }
      }
    );

    // top slanted walls (tilted inward by ~30 degrees)
    const tiltAngle = Math.PI / 0.6; // 30 degrees in radians
    const topLength = jarConfig.width * 0.4; // slightly shorter than jar opening
    const topY = jarConfig.y - jarConfig.height - jarConfig.wallThickness / 2 -10;

    leftTopWall = Bodies.rectangle(
      jarConfig.x - jarConfig.width / 2.2,
      topY,
      topLength,
      jarConfig.wallThickness,
      { 
        isStatic: true, 
        angle: tiltAngle,
        render: { visible: config.showWalls }
      }
    );

    rightTopWall = Bodies.rectangle(
      jarConfig.x + jarConfig.width / 2.2,
      topY,
      topLength,
      jarConfig.wallThickness,
      { 
        isStatic: true, 
        angle: -tiltAngle,
        render: { visible: config.showWalls }
      }
    );

    World.add(world, [leftJarWall, rightJarWall, jarBottomWall, leftTopWall, rightTopWall,cookie]);
  }
  createJarWalls();

  // =================== FLOOR & WALLS ===================
  const floor = Bodies.rectangle(
    canvasWidth / 2,
    floorY,
    canvasWidth,
    floorThickness,
    { 
      isStatic: true,
      render: { visible: config.showWalls }
    }
  );

  const leftWallScreen = Bodies.rectangle(-10, canvasHeight / 2, 20, canvasHeight, { 
    isStatic: true,
    render: { visible: config.showWalls }
  });
  const rightWallScreen = Bodies.rectangle(canvasWidth + 10, canvasHeight / 2, 20, canvasHeight, { 
    isStatic: true,
    render: { visible: config.showWalls }
  });

  World.add(world, [ floor, leftWallScreen, rightWallScreen]);

  // =================== MOUSE CONTROL ===================
  const mouse = Mouse.create(render.canvas);
  mouse.element.removeEventListener('wheel', mouse.mousewheel);
  mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
  mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);

  let activeMouseConstraint = null;
  let canGrabCookie = true;

  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } }
  });
  activeMouseConstraint = mouseConstraint;
  World.add(world, mouseConstraint);

  // =================== CURSOR BOUNDS ===================
  const dragBounds = {
    minX: 0 + cookieRadius,
    maxX: canvasWidth - cookieRadius,
    minY: 0 + cookieRadius,
    maxY: floor.position.y - cookieRadius
  };

  Events.on(mouseConstraint, 'mousemove', () => {
    const pos = mouse.position;
    pos.x = Math.max(dragBounds.minX, Math.min(dragBounds.maxX, pos.x));
    pos.y = Math.max(dragBounds.minY, Math.min(dragBounds.maxY, pos.y));
  });

  // =================== LIMIT COOKIE SPEED ===================
  Events.on(engine, 'beforeUpdate', () => {
    const maxSpeed = 40; // adjust if needed
    const speed = Vector.magnitude(cookie.velocity);
    if (speed > maxSpeed) {
      Body.setVelocity(cookie, Vector.mult(Vector.normalise(cookie.velocity), maxSpeed));
    }
  });

  // =================== JAR SPRITE ===================
  const jarSprite = document.createElement('img');
  jarSprite.src = jarImage;
  jarSprite.style.position = 'absolute';
  jarSprite.style.transform = 'scale(2)'; // 1.5 times bigger
jarSprite.style.transformOrigin = 'center bottom';
  jarSprite.style.pointerEvents = 'none';
  document.querySelector('.cookie-jar-section').appendChild(jarSprite);

  function updateJarSpritePosition() {
    jarSprite.style.width = jarConfig.width + 'px';
    jarSprite.style.height = jarConfig.height + 'px';
    jarSprite.style.left = (jarConfig.x - jarConfig.width / 2) + 'px';
    jarSprite.style.top = (jarConfig.y - jarConfig.height / 2) + 'px';
  }
  updateJarSpritePosition();

  // =================== MOVE JAR FUNCTION ===================
  function moveJar(newX, newY) {
    jarConfig.x = newX;
    jarConfig.y = newY;

    Body.setPosition(leftJarWall, { x: newX - jarConfig.width / 2, y: newY });
    Body.setPosition(rightJarWall, { x: newX + jarConfig.width / 2, y: newY });
    Body.setPosition(jarBottomWall, { x: newX, y: newY + jarConfig.height / 2 });

    // reposition top slanted walls and keep their inward tilt
    const tiltAngle = Math.PI / 6;
    const topY = newY - jarConfig.height / 2 - jarConfig.wallThickness / 2;
    Body.setPosition(leftTopWall, { x: newX - jarConfig.width / 4, y: topY });
    Body.setAngle(leftTopWall, tiltAngle);
    Body.setPosition(rightTopWall, { x: newX + jarConfig.width / 4, y: topY });
    Body.setAngle(rightTopWall, -tiltAngle);

    updateJarSpritePosition();
  }

  // =================== BUTTON CHECK ===================
  const button = document.getElementById('specialBtn');
  Events.on(engine, 'afterUpdate', () => {
    const inside =
      cookie.position.x > jarConfig.x - jarConfig.width / 2 &&
      cookie.position.x < jarConfig.x + jarConfig.width / 2 &&
      cookie.position.y > jarConfig.y - jarConfig.height &&
      cookie.position.y < jarConfig.y + jarConfig.height;

    button.classList.toggle('visible', inside);
  });

  // Add collision detection for walls
  Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;
      
      // Check if collision involves cookie and any wall
      if ((bodyA === cookie && isWall(bodyB)) || (bodyB === cookie && isWall(bodyA))) {
        // Remove mouse constraint and prevent grabbing
        if (activeMouseConstraint) {
          World.remove(world, activeMouseConstraint);
          activeMouseConstraint = null;
          canGrabCookie = false;
          
          // Allow grabbing again after a short delay
          setTimeout(() => {
            canGrabCookie = true;
          }, 500);
        }
      }
    });
  });

  // Add helper function to check if a body is a wall
  function isWall(body) {
    return (
      body === leftWallScreen ||
      body === rightWallScreen ||
      body === leftJarWall ||
      body === rightJarWall ||
      body === leftTopWall ||
      body === rightTopWall
    );
  }

  // Modify the mouseConstraint behavior
  Events.on(engine, 'beforeUpdate', () => {
    if (!activeMouseConstraint && canGrabCookie && mouseConstraint.body === null) {
      activeMouseConstraint = mouseConstraint;
      World.add(world, activeMouseConstraint);
    }
  });

  // Add debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Only reload if the width actually changed
      if (window.innerWidth !== canvasWidth) {
        location.reload();
      }
    }, 250); // Wait 250ms after last resize event before reloading
  });






specialBtn.addEventListener('click', (e) => {
  e.target.classList.add('clicked');
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 600);
});





});
