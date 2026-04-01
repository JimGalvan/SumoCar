import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import type { RigidBody, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';
import type { IPhysicsEntity } from '../../core/i-physics-entity.ts';

interface GroundOptions {
  size?: number;
  thickness?: number;
  color?: number;
  y?: number;
}

class Ground implements IPhysicsEntity {
  private readonly mesh: THREE.Mesh;
  private readonly size: number;
  private readonly thickness: number;

  constructor({
    size = 200,
    thickness = 0.05,
    color = 0x228b22,
    y = -0.2,
  }: GroundOptions = {}) {
    this.size = size;
    this.thickness = thickness;

    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshStandardMaterial({ color }),
    );
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = y;
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  getBodyDesc(): RigidBodyDesc {
    return RAPIER.RigidBodyDesc.fixed();
  }

  getColliderDesc(): ColliderDesc {
    return RAPIER.ColliderDesc.cuboid(this.size / 2, this.thickness, this.size / 2);
  }

  onPhysicsReady(_body: RigidBody): void {}
}

export default Ground;
