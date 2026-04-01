import CarConfig from './car-config.ts';
import Car from './car.ts';
import type Wheel from './wheel.ts';

class CarBuilder {
  private wheels: Wheel[] = [];
  private config: CarConfig = new CarConfig();

  setWheels(wheels: Wheel[]): this {
    this.wheels = wheels;
    return this;
  }

  setWidth(width: number): this {
    this.config.width = width;
    return this;
  }

  setHeight(height: number): this {
    this.config.height = height;
    return this;
  }

  setLength(length: number): this {
    this.config.length = length;
    return this;
  }

  setColor(color: number): this {
    this.config.color = color;
    return this;
  }

  setSpawnY(spawnY: number): this {
    this.config.spawnY = spawnY;
    return this;
  }

  setSpawnZ(spawnZ: number): this {
    this.config.spawnZ = spawnZ;
    return this;
  }

  setLinearDamping(value: number): this {
    this.config.linearDamping = value;
    return this;
  }

  setAngularDamping(value: number): this {
    this.config.angularDamping = value;
    return this;
  }

  setMass(mass: number): this {
    this.config.mass = mass;
    return this;
  }

  setMaxSpeed(maxSpeed: number): this {
    this.config.maxSpeed = maxSpeed;
    return this;
  }

  setAcceleration(acceleration: number): this {
    this.config.acceleration = acceleration;
    return this;
  }

  setSteeringMaxAngle(value: number): this {
    this.config.steeringMaxAngle = value;
    return this;
  }

  setSteeringTurnSpeed(value: number): this {
    this.config.steeringTurnSpeed = value;
    return this;
  }

  setSteeringReturnDamping(value: number): this {
    this.config.steeringReturnDamping = value;
    return this;
  }

  setTorqueForce(value: number): this {
    this.config.torqueForce = value;
    return this;
  }

  setMaxAngularVelocity(value: number): this {
    this.config.maxAngularVelocity = value;
    return this;
  }

  setConfig(config: Partial<CarConfig>): this {
    this.config = new CarConfig({ ...this.config, ...config });
    return this;
  }

  build(): Car {
    if (this.wheels.length !== 4) {
      throw new Error('Car must have 4 wheels');
    }

    return new Car({ wheels: this.wheels, config: this.config });
  }
}

export default CarBuilder;
