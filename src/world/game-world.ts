import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import type { IRenderer } from '../core/i-renderer.ts';
import type { ISceneEntity } from '../core/i-scene-entity.ts';
import type { IPhysicsEntity } from '../core/i-physics-entity.ts';

class GameWorld {
  private readonly world: RAPIER.World;
  private readonly scene: THREE.Scene;
  private readonly renderer: IRenderer;
  private readonly entities: Map<string, ISceneEntity> = new Map();

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
    const name = entity.getMesh().name;
    if (name) this.entities.set(name, entity);
  }

  get(name: string): ISceneEntity | undefined {
    return this.entities.get(name);
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
