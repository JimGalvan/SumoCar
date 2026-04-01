import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import type { RigidBody, RigidBodyDesc, ColliderDesc } from '@dimforge/rapier3d-compat';
import type { IPhysicsEntity } from '../../core/i-physics-entity.ts';
import type CarConfig from './car-config.ts';
import type Wheel from './wheel.ts';
import DriveDirection from '../../enums/drive-direction.ts';
import SteerDirection from '../../enums/steer-direction.ts';

interface CarOptions {
  wheels: Wheel[];
  config: CarConfig;
}

class Car implements IPhysicsEntity {
  readonly mesh: THREE.Group;
  private readonly wheels: Wheel[];
  private readonly config: CarConfig;
  private physicsBody: RigidBody | null = null;
  private steeringAngle: number = 0;

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

  steer(input: SteerDirection): void {
    if (input === SteerDirection.Left) {
      this.steeringAngle = Math.min(this.steeringAngle + this.config.steeringTurnSpeed, this.config.steeringMaxAngle);
    } else if (input === SteerDirection.Right) {
      this.steeringAngle = Math.max(this.steeringAngle - this.config.steeringTurnSpeed, -this.config.steeringMaxAngle);
    } else {
      this.steeringAngle *= this.config.steeringReturnDamping;
    }
    this.getFrontLeftWheel()?.setAngle(this.steeringAngle);
    this.getFrontRightWheel()?.setAngle(this.steeringAngle);
  }

  drive(direction: DriveDirection, deltaTime: number): void {
    const body = this.getPhysicsBody();
    const yaw = this.getYaw();
    const vel = body.linvel();
    const speed = Math.sqrt(vel.x ** 2 + vel.z ** 2);

    if (speed < this.config.maxSpeed) {
      const force = this.config.mass * this.config.acceleration * deltaTime;
      body.applyImpulse(
        { x: force * Math.sin(yaw) * direction, y: 0, z: force * Math.cos(yaw) * direction },
        true,
      );
    }

    const angularVelocity = (speed / this.getWheelBase()) * Math.tan(this.steeringAngle) * 2.5;
    if (Math.abs(body.angvel().y) < this.config.maxAngularVelocity) {
      body.applyTorqueImpulse(
        { x: 0, y: angularVelocity * this.config.torqueForce * direction, z: 0 },
        true,
      );
    }
  }

  getSteeringAngle(): number {
    return this.steeringAngle;
  }

  getYaw(): number {
    const { y, w } = this.getPhysicsBody().rotation();
    return 2 * Math.atan2(y, w);
  }

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
