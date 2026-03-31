class CarConfig {
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
  } = {}) {
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
  }
}

export default CarConfig;
