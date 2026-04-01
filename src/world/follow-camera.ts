import * as THREE from 'three';
import type Car from '../entities/car/car.ts';

interface FollowCameraConfig {
  distance?: number;
  height?: number;
  lerp?: number;
}

class FollowCamera {
  private readonly camera: THREE.Camera;
  private readonly distance: number;
  private readonly height: number;
  private readonly lerp: number;

  constructor(camera: THREE.Camera, { distance = 5, height = 3, lerp = 0.2 }: FollowCameraConfig = {}) {
    this.camera = camera;
    this.distance = distance;
    this.height = height;
    this.lerp = lerp;
  }

  update(target: Car): void {
    const yaw = target.getYaw();
    const targetX = target.mesh.position.x - Math.sin(yaw) * this.distance;
    const targetZ = target.mesh.position.z - Math.cos(yaw) * this.distance;
    const targetY = target.mesh.position.y + this.height;

    this.camera.position.x += (targetX - this.camera.position.x) * this.lerp;
    this.camera.position.z += (targetZ - this.camera.position.z) * this.lerp;
    this.camera.position.y += (targetY - this.camera.position.y) * this.lerp;
    this.camera.lookAt(target.mesh.position);
  }
}

export default FollowCamera;
