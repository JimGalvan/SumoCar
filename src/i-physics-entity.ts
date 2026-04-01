import type * as THREE from 'three';
import type { RigidBody, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';

interface IPhysicsEntity {
  getMesh(): THREE.Object3D;
  getBodyDesc(): RigidBodyDesc;
  getColliderDesc(): ColliderDesc;
  onPhysicsReady(body: RigidBody): void;
}

export type { IPhysicsEntity };
