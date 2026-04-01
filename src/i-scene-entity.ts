import type * as THREE from 'three';

interface ISceneEntity {
  getMesh(): THREE.Object3D;
}

export type { ISceneEntity };
