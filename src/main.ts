import RAPIER from '@dimforge/rapier3d-compat';
import CarBuilder from './entities/car/car-builder.ts';
import WheelFactory from './entities/car/wheel-factory.ts';
import GameWorld from './game-world.js';
import RampBuilder from './entities/environment/ramp/ramp-builder.ts';
import Ground from './entities/environment/ground.ts';
import Lighting from './lighting.js';
import BasicRenderer from './basic-renderer.js';
import { SCENE, GROUND, CAR, WHEEL, PHYSICS, CAMERA, RAMP } from './core/constants.ts';
import DriveDirection from './enums/drive-direction.ts';
import SteerDirection from './enums/steer-direction.ts';

import * as THREE from 'three';
const clock = new THREE.Clock();

// ========================
// INPUT
// ========================

const keys: Record<string, boolean> = {};
window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup',   (e) => { keys[e.key.toLowerCase()] = false; });

// ========================
// MAIN
// ========================
async function main(): Promise<void> {
  await RAPIER.init();

  const renderer = new BasicRenderer({ fov: CAMERA.FOV, near: CAMERA.NEAR, far: CAMERA.FAR });
  const camera = renderer.getCamera();
  const gameWorld = new GameWorld(renderer, PHYSICS.GRAVITY, SCENE.BACKGROUND_COLOR);

  gameWorld.add(new Lighting({
    dirLightColor: SCENE.DIR_LIGHT_COLOR,
    dirLightIntensity: SCENE.DIR_LIGHT_INTENSITY,
    dirLightPosition: SCENE.DIR_LIGHT_POS,
    ambientLightColor: SCENE.AMBIENT_LIGHT_COLOR,
    ambientLightIntensity: SCENE.AMBIENT_LIGHT_INTENSITY,
  }));

  gameWorld.add(new Ground({ size: GROUND.SIZE, thickness: GROUND.THICKNESS, color: GROUND.COLOR }));

  const wheels = WheelFactory.createWheels({
    radius: WHEEL.RADIUS,
    thickness: WHEEL.THICKNESS,
    segments: WHEEL.SEGMENTS,
    color: WHEEL.COLOR,
  });

  const car = new CarBuilder()
    .setWidth(CAR.WIDTH)
    .setHeight(CAR.HEIGHT)
    .setLength(CAR.LENGTH)
    .setColor(CAR.COLOR)
    .setSpawnY(CAR.SPAWN_Y)
    .setSpawnZ(CAR.SPAWN_Z)
    .setLinearDamping(CAR.LINEAR_DAMPING)
    .setAngularDamping(CAR.ANGULAR_DAMPING)
    .setMass(CAR.MASS)
    .setMaxSpeed(CAR.MAX_SPEED)
    .setAcceleration(CAR.ACCELERATION)
    .setWheels(wheels)
    .build();

  gameWorld.add(car);

  const ramp1 = new RampBuilder()
    .setWidth(RAMP.WIDTH)
    .setHeight(RAMP.HEIGHT)
    .setDepth(RAMP.DEPTH)
    .setColor(RAMP.COLOR)
    .setPosition(0, 0.5, -10)
    .setAngle(Math.PI / 8)
    .build();

  const ramp2 = new RampBuilder()
    .setWidth(RAMP.WIDTH)
    .setHeight(RAMP.HEIGHT)
    .setDepth(RAMP.DEPTH)
    .setColor(RAMP.COLOR)
    .setPosition(10, 0.5, -20)
    .setAngle(Math.PI / 6)
    .build();

  gameWorld.add(ramp1);
  gameWorld.add(ramp2);

  // ========================
  // GAME LOOP
  // ========================


  function updateCamera(): void {
    const yaw = car.getYaw();
    const targetX = car.mesh.position.x - Math.sin(yaw) * CAMERA.DISTANCE;
    const targetZ = car.mesh.position.z - Math.cos(yaw) * CAMERA.DISTANCE;
    const targetY = car.mesh.position.y + CAMERA.HEIGHT;

    camera.position.x += (targetX - camera.position.x) * CAMERA.LERP;
    camera.position.z += (targetZ - camera.position.z) * CAMERA.LERP;
    camera.position.y += (targetY - camera.position.y) * CAMERA.LERP;
    camera.lookAt(car.mesh.position);
  }

  function update(): void {
    const deltaTime = clock.getDelta();
    const steerInput = keys['a'] ? SteerDirection.Left : keys['d'] ? SteerDirection.Right : SteerDirection.Neutral;
    const driveInput = keys['w'] ? DriveDirection.Forward : keys['s'] ? DriveDirection.Reverse : DriveDirection.Neutral;
    car.updateSteering(steerInput);
    if (driveInput !== DriveDirection.Neutral) {
      car.drive(driveInput, deltaTime);
    }
    gameWorld.step();
    car.sync();
    updateCamera();
  }

  function animate(): void {
    requestAnimationFrame(animate);
    update();
    gameWorld.render();
  }

  animate();
}

main();
