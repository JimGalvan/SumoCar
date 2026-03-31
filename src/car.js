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
    this.mesh.position.y = config.spawnY;

    this.wheels.forEach((wheel, i) => {
      const wheelMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          wheel.radius,
          wheel.radius,
          wheel.thickness,
          wheel.segments,
        ),
        new THREE.MeshStandardMaterial({ color: wheel.color }),
      );
    });
  }
  getWidth() {
    return this.config.width;
  }
  getHeight() {
    return this.config.height;
  }
  getLength() {
    return this.config.length;
  }
  getColor() {}
}
export default Car;
