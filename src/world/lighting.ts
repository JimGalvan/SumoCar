import * as THREE from 'three';
import type { ISceneEntity } from './core/i-scene-entity.ts';

interface LightingOptions {
  dirLightColor?: number;
  dirLightIntensity?: number;
  dirLightPosition?: THREE.Vector3;
  ambientLightColor?: number;
  ambientLightIntensity?: number;
}

class Lighting implements ISceneEntity {
  private readonly group: THREE.Group;

  constructor({
    dirLightColor = 0xffffff,
    dirLightIntensity = 2,
    dirLightPosition = new THREE.Vector3(5, 10, 5),
    ambientLightColor = 0xffffff,
    ambientLightIntensity = 0.2,
  }: LightingOptions = {}) {
    const dirLight = new THREE.DirectionalLight(dirLightColor, dirLightIntensity);
    dirLight.position.copy(dirLightPosition);

    const ambientLight = new THREE.AmbientLight(ambientLightColor, ambientLightIntensity);

    this.group = new THREE.Group();
    this.group.add(dirLight, ambientLight);
  }

  getMesh(): THREE.Group {
    return this.group;
  }
}

export default Lighting;
