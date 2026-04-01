import * as THREE from 'three';

class Car {
  constructor({ wheels, config, physicsBody }) {
    if (!wheels || wheels.length !== 4) {
      throw new Error('Car must have 4 wheels');
    }

    this.wheels = wheels;
    this.config = config;
    this.physicsBody = physicsBody;

    this.mesh = new THREE.Group();
    this.mesh.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(config.width, config.height, config.length),
        new THREE.MeshStandardMaterial({ color: config.color }),
      ),
    );

    // Car determines where each wheel sits based on its own dimensions
    const halfWidth = config.width / 2;
    const halfLength = config.length / 2;
    const wheelPositions = {
      frontLeftWheel:  { x: -halfWidth, z:  halfLength - config.wheelSlotOffset },
      frontRightWheel: { x:  halfWidth, z:  halfLength - config.wheelSlotOffset },
      rearLeftWheel:   { x: -halfWidth, z: -halfLength + config.wheelSlotOffset },
      rearRightWheel:  { x:  halfWidth, z: -halfLength + config.wheelSlotOffset },
    };

    wheels.forEach((wheel) => {
      const pos = wheelPositions[wheel.name];
      if (pos) {
        wheel.getMesh().position.set(pos.x, config.wheelYOffset, pos.z);
      }
      this.mesh.add(wheel.getMesh());
    });

    this.mesh.position.y = config.spawnY;
  }

  getWidth() { return this.config.width; }
  getHeight() { return this.config.height; }
  getLength() { return this.config.length; }
  getColor() { return this.config.color; }

  getWheelByName(name) {
    return this.wheels.find((w) => w.name === name);
  }

  getFrontLeftWheel()  { return this.getWheelByName('frontLeftWheel'); }
  getFrontRightWheel() { return this.getWheelByName('frontRightWheel'); }
  getRearLeftWheel()   { return this.getWheelByName('rearLeftWheel'); }
  getRearRightWheel()  { return this.getWheelByName('rearRightWheel'); }

  getWheelBase() {
    return this.config.length - 2 * this.config.wheelSlotOffset;
  }

  sync() {
    const { x, y, z } = this.physicsBody.translation();
    const r = this.physicsBody.rotation();
    this.mesh.position.set(x, y, z);
    this.mesh.quaternion.set(r.x, r.y, r.z, r.w);
  }
}

export default Car;
