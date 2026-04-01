import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import type { RigidBody, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';
import type { IPhysicsEntity } from './i-physics-entity.js';
import type CarConfig from './car-config.js';
import type Wheel from './wheel.js';

interface CarOptions {
  wheels: Wheel[];
  config: CarConfig;
}

class Car implements IPhysicsEntity {
  readonly mesh: THREE.Group;
  private readonly wheels: Wheel[];
  private readonly config: CarConfig;
  private physicsBody: RigidBody | null = null;

  constructor({ wheels, config }: CarOptions) {
    if (wheels.length !== 4) {
      throw new Error('Car must have 4 wheels');
    }

    this.wheels = wheels;
    this.config = config;

    this.mesh = new THREE.Group();
    this.mesh.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(config.width, config.height, config.length),
        new THREE.MeshStandardMaterial({ color: config.color }),
      ),
    );

    const halfWidth = config.width / 2;
    const halfLength = config.length / 2;
    const wheelPositions: Record<string, { x: number; z: number }> = {
      frontLeftWheel:  { x: -halfWidth, z:  halfLength - config.wheelSlotOffset },
      frontRightWheel: { x:  halfWidth, z:  halfLength - config.wheelSlotOffset },
      rearLeftWheel:   { x: -halfWidth, z: -halfLength + config.wheelSlotOffset },
      rearRightWheel:  { x:  halfWidth, z: -halfLength + config.wheelSlotOffset },
    };

    wheels.forEach((wheel) => {
      const pos = wheelPositions[wheel.name];
      if (pos) {
        wheel.getMesh().position.set(pos.x, config.wheelYOffset, pos.z);
      }
      this.mesh.add(wheel.getMesh());
    });

    this.mesh.position.y = config.spawnY;
  }

  getMesh(): THREE.Group {
    return this.mesh;
  }

  getBodyDesc(): RigidBodyDesc {
    return RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0, this.config.spawnY, this.config.spawnZ)
      .setLinearDamping(this.config.linearDamping)
      .setAngularDamping(this.config.angularDamping);
  }

  getColliderDesc(): ColliderDesc {
    return RAPIER.ColliderDesc.cuboid(
      this.config.width / 2,
      this.config.height / 2,
      this.config.length / 2,
    ).setMass(this.config.mass);
  }

  onPhysicsReady(body: RigidBody): void {
    this.physicsBody = body;
  }

  getPhysicsBody(): RigidBody {
    if (!this.physicsBody) throw new Error('Physics not initialized — call gameWorld.add(car) first');
    return this.physicsBody;
  }

  getWheelByName(name: string): Wheel | undefined {
    return this.wheels.find((w) => w.name === name);
  }

  getFrontLeftWheel():  Wheel | undefined { return this.getWheelByName('frontLeftWheel'); }
  getFrontRightWheel(): Wheel | undefined { return this.getWheelByName('frontRightWheel'); }
  getRearLeftWheel():   Wheel | undefined { return this.getWheelByName('rearLeftWheel'); }
  getRearRightWheel():  Wheel | undefined { return this.getWheelByName('rearRightWheel'); }

  getWheelBase(): number {
    return this.config.length - 2 * this.config.wheelSlotOffset;
  }

  sync(): void {
    const body = this.getPhysicsBody();
    const { x, y, z } = body.translation();
    const r = body.rotation();
    this.mesh.position.set(x, y, z);
    this.mesh.quaternion.set(r.x, r.y, r.z, r.w);
  }
}

export default Car;
