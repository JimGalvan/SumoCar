import type { RigidBody, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';
import type { ISceneEntity } from './i-scene-entity.js';

interface IPhysicsEntity extends ISceneEntity {
  getBodyDesc(): RigidBodyDesc;
  getColliderDesc(): ColliderDesc;
  onPhysicsReady(body: RigidBody): void;
}

export type { IPhysicsEntity };
