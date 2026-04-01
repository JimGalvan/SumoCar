import * as THREE from 'three';

export const SCENE = {
  BACKGROUND_COLOR: 0x87ceeb,
  AMBIENT_LIGHT_COLOR: 0xffffff,
  AMBIENT_LIGHT_INTENSITY: 0.2,
  DIR_LIGHT_COLOR: 0xffffff,
  DIR_LIGHT_INTENSITY: 2,
  DIR_LIGHT_POS: new THREE.Vector3(5, 10, 5),
};

export const GROUND = {
  SIZE: 200,
  COLOR: 0x228b22,
  HALF_EXTENT: 50,
  THICKNESS: 0.05,
};

export const CAR = {
  WIDTH: 1,
  HEIGHT: 0.5,
  LENGTH: 2,
  COLOR: 0x00ff00,
  SPAWN_Y: 1,
  SPAWN_Z: 15,
  LINEAR_DAMPING: 1,
  ANGULAR_DAMPING: 2.0,
  MASS: 500,
  MAX_SPEED: 30,
  ACCELERATION: 50,
};

export const WHEEL = {
  RADIUS: 0.3,
  THICKNESS: 0.2,
  SEGMENTS: 16,
  COLOR: 0x333333,
};

export const PHYSICS = {
  GRAVITY: { x: 0, y: -9.81, z: 0 },
};

export const CAMERA = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  DISTANCE: 5,
  HEIGHT: 3,
  LERP: 0.2,
};

export const RAMP = {
  WIDTH: 4,
  HEIGHT: 0.2,
  DEPTH: 6,
  COLOR: 0x8b4513,
};
