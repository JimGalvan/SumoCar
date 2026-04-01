import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import type { IPhysicsEntity } from './i-physics-entity.js';

class GameWorld {
  private readonly world: RAPIER.World;
  private readonly scene: THREE.Scene;

  constructor(scene: THREE.Scene, gravity: { x: number; y: number; z: number }) {
    this.world = new RAPIER.World(gravity);
    this.scene = scene;
  }

  add(entity: IPhysicsEntity): void {
    const body = this.world.createRigidBody(entity.getBodyDesc());
    this.world.createCollider(entity.getColliderDesc(), body);
    entity.onPhysicsReady(body);
    this.scene.add(entity.getMesh());
  }

  addStatic(bodyDesc: RAPIER.RigidBodyDesc, colliderDesc: RAPIER.ColliderDesc): RAPIER.RigidBody {
    const body = this.world.createRigidBody(bodyDesc);
    this.world.createCollider(colliderDesc, body);
    return body;
  }

  step(): void {
    this.world.step();
  }
}

export default GameWorld;
