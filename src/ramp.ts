import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import type { RigidBody, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';
import type { IPhysicsEntity } from './i-physics-entity.js';

interface RampOptions {
  x: number;
  y: number;
  z: number;
  angle: number;
  width?: number;
  height?: number;
  depth?: number;
  color?: number;
}

class Ramp implements IPhysicsEntity {
  private readonly mesh: THREE.Mesh;
  private readonly x: number;
  private readonly y: number;
  private readonly z: number;
  private readonly angle: number;
  private readonly width: number;
  private readonly height: number;
  private readonly depth: number;

  constructor({
    x, y, z, angle,
    width = 4,
    height = 0.2,
    depth = 6,
    color = 0x8b4513,
  }: RampOptions) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angle = angle;
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color }),
    );
    this.mesh.rotation.x = -angle;
    this.mesh.position.set(x, y, z);
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  getBodyDesc(): RigidBodyDesc {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-this.angle, 0, 0));
    return RAPIER.RigidBodyDesc.fixed()
      .setTranslation(this.x, this.y, this.z)
      .setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
  }

  getColliderDesc(): ColliderDesc {
    return RAPIER.ColliderDesc.cuboid(this.width / 2, this.height / 2, this.depth / 2);
  }

  onPhysicsReady(_body: RigidBody): void {}
}

export default Ramp;
