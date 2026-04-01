import * as THREE from 'three';

class Wheel {
  constructor({ radius = 0.3, thickness = 0.2, segments = 16, color = 0x333333, name = 'wheel' } = {}) {
    this.radius = radius;
    this.thickness = thickness;
    this.segments = segments;
    this.color = color;
    this.name = name;

    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, thickness, segments),
      new THREE.MeshStandardMaterial({ color }),
    );
    this.mesh.name = name;
    this.mesh.rotation.z = Math.PI / 2;
  }

  getMesh() {
    return this.mesh;
  }

  setSteeringAngle(angle) {
    this.mesh.rotation.y = angle;
  }

  getSteeringAngle() {
    return this.mesh.rotation.y;
  }
}

export default Wheel;
