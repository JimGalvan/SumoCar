interface CarConfigOptions {
  width?: number;
  height?: number;
  length?: number;
  color?: number;
  spawnY?: number;
  spawnZ?: number;
  linearDamping?: number;
  angularDamping?: number;
  mass?: number;
  maxSpeed?: number;
  acceleration?: number;
  wheelYOffset?: number;
  wheelSlotOffset?: number;
}

class CarConfig {
  width: number;
  height: number;
  length: number;
  color: number;
  spawnY: number;
  spawnZ: number;
  linearDamping: number;
  angularDamping: number;
  mass: number;
  maxSpeed: number;
  acceleration: number;
  wheelYOffset: number;
  wheelSlotOffset: number;

  constructor({
    width = 1,
    height = 0.5,
    length = 2,
    color = 0x00ff00,
    spawnY = 1,
    spawnZ = 15,
    linearDamping = 1,
    angularDamping = 2.0,
    mass = 500,
    maxSpeed = 30,
    acceleration = 50,
    wheelYOffset = -0.2,
    wheelSlotOffset = 0.4,
  }: CarConfigOptions = {}) {
    this.width = width;
    this.height = height;
    this.length = length;
    this.color = color;
    this.spawnY = spawnY;
    this.spawnZ = spawnZ;
    this.linearDamping = linearDamping;
    this.angularDamping = angularDamping;
    this.mass = mass;
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.wheelYOffset = wheelYOffset;
    this.wheelSlotOffset = wheelSlotOffset;
  }
}

export default CarConfig;
