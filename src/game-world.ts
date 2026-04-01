import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import type { IRenderer } from './i-renderer.js';
import type { ISceneEntity } from './i-scene-entity.js';
import type { IPhysicsEntity } from './i-physics-entity.js';

class GameWorld {
  private readonly world: RAPIER.World;
  private readonly scene: THREE.Scene;
  private readonly renderer: IRenderer;

  constructor(
    renderer: IRenderer,
    gravity: { x: number; y: number; z: number },
    backgroundColor: number,
  ) {
    this.world = new RAPIER.World(gravity);
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(backgroundColor);
  }

  add(entity: ISceneEntity): void {
    this.scene.add(entity.getMesh());
    if (this.isPhysicsEntity(entity)) {
      const body = this.world.createRigidBody(entity.getBodyDesc());
      this.world.createCollider(entity.getColliderDesc(), body);
      entity.onPhysicsReady(body);
    }
  }

  step(): void {
    this.world.step();
  }

  render(): void {
    this.renderer.render(this.scene);
  }

  private isPhysicsEntity(entity: ISceneEntity): entity is IPhysicsEntity {
    return 'getBodyDesc' in entity;
  }
}

export default GameWorld;
