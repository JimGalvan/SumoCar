import * as THREE from 'three';

class Wheel {
  constructor(
    radius = 0.3,
    thickness = 0.2,
    segments = 16,
    color = 0x333333,
    yOffset = 0,
    name = 'wheel',
  ) {
    this.radius = radius;
    this.thickness = thickness;
    this.segments = segments;
    this.color = color;
    this.wheel = color;
    this.yOffset = yOffset;
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        this.radius,
        this.radius,
        this.thickness,
        this.segments,
      ),
      new THREE.MeshStandardMaterial({ color: this.wheel }),
    );
    this.mesh.name = name;
    this.mesh.rotation.z = Math.PI / 2;
    this.mesh.position.set(x, this.yOffset, z);
  }

  getMesh() {
    return this.mesh;
  }
}
export default Wheel;
