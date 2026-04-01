import * as THREE from 'three';

interface WheelOptions {
  radius?: number;
  thickness?: number;
  segments?: number;
  color?: number;
  name?: string;
}

class Wheel {
  readonly name: string;
  private readonly mesh: THREE.Mesh;

  constructor({
    radius = 0.3,
    thickness = 0.2,
    segments = 16,
    color = 0x333333,
    name = 'wheel',
  }: WheelOptions = {}) {
    this.name = name;

    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, thickness, segments),
      new THREE.MeshStandardMaterial({ color }),
    );
    this.mesh.name = name;
    this.mesh.rotation.z = Math.PI / 2;
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  setSteeringAngle(angle: number): void {
    this.mesh.rotation.y = angle;
  }

  getSteeringAngle(): number {
    return this.mesh.rotation.y;
  }
}

export default Wheel;
