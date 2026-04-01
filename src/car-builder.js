import CarConfig from './car-config.js';
import Car from './car.js';

class CarBuilder {
  constructor() {
    this._wheels = [];
    this._config = new CarConfig();
    this._physicsBody = null;
  }

  setWheels(wheels) {
    this._wheels = wheels;
    return this;
  }

  setPhysicsBody(body) {
    this._physicsBody = body;
    return this;
  }

  setWidth(width) {
    this._config.width = width;
    return this;
  }

  setHeight(height) {
    this._config.height = height;
    return this;
  }

  setLength(length) {
    this._config.length = length;
    return this;
  }

  setColor(color) {
    this._config.color = color;
    return this;
  }

  setSpawnY(spawnY) {
    this._config.spawnY = spawnY;
    return this;
  }

  setSpawnZ(spawnZ) {
    this._config.spawnZ = spawnZ;
    return this;
  }

  setLinearDamping(value) {
    this._config.linearDamping = value;
    return this;
  }

  setAngularDamping(value) {
    this._config.angularDamping = value;
    return this;
  }

  setMass(mass) {
    this._config.mass = mass;
    return this;
  }

  setMaxSpeed(maxSpeed) {
    this._config.maxSpeed = maxSpeed;
    return this;
  }

  setAcceleration(acceleration) {
    this._config.acceleration = acceleration;
    return this;
  }

  setConfig(config) {
    this._config = new CarConfig({
      ...this._config,
      ...config,
    });
    return this;
  }

  build() {
    if (!this._wheels || this._wheels.length !== 4) {
      throw new Error('Car must have 4 wheels');
    }

    return new Car({
      wheels: this._wheels,
      config: this._config,
      physicsBody: this._physicsBody,
    });
  }
}

export default CarBuilder;
