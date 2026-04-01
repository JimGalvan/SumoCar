import type * as THREE from 'three';

interface IRenderer {
  render(scene: THREE.Scene): void;
}

export type { IRenderer };
