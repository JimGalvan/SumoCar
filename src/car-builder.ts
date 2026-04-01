import type { RigidBody } from '@dimforge/rapier3d-compat';
import CarConfig from './car-config.js';
import Car from './car.js';
import type Wheel from './wheel.js';

class CarBuilder {
  private _wheels: Wheel[] = [];
  private _config: CarConfig = new CarConfig();
  private _physicsBody: RigidBody | null = null;

  setWheels(wheels: Wheel[]): this {
    this._wheels = wheels;
    return this;
  }

  setPhysicsBody(body: RigidBody): this {
    this._physicsBody = body;
    return this;
  }

  setWidth(width: number): this {
    this._config.width = width;
    return this;
  }

  setHeight(height: number): this {
    this._config.height = height;
    return this;
  }

  setLength(length: number): this {
    this._config.length = length;
    return this;
  }

  setColor(color: number): this {
    this._config.color = color;
    return this;
  }

  setSpawnY(spawnY: number): this {
    this._config.spawnY = spawnY;
    return this;
  }

  setSpawnZ(spawnZ: number): this {
    this._config.spawnZ = spawnZ;
    return this;
  }

  setLinearDamping(value: number): this {
    this._config.linearDamping = value;
    return this;
  }

  setAngularDamping(value: number): this {
    this._config.angularDamping = value;
    return this;
  }

  setMass(mass: number): this {
    this._config.mass = mass;
    return this;
  }

  setMaxSpeed(maxSpeed: number): this {
    this._config.maxSpeed = maxSpeed;
    return this;
  }

  setAcceleration(acceleration: number): this {
    this._config.acceleration = acceleration;
    return this;
  }

  setConfig(config: Partial<CarConfig>): this {
    this._config = new CarConfig({ ...this._config, ...config });
    return this;
  }

  build(): Car {
    if (this._wheels.length !== 4) {
      throw new Error('Car must have 4 wheels');
    }
    if (!this._physicsBody) {
      throw new Error('Car must have a physics body');
    }

    return new Car({
      wheels: this._wheels,
      config: this._config,
      physicsBody: this._physicsBody,
    });
  }
}

export default CarBuilder;
