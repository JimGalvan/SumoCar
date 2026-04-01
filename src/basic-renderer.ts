import * as THREE from 'three';
import type { IRenderer } from './i-renderer.js';

interface BasicRendererOptions {
  fov?: number;
  near?: number;
  far?: number;
}

class BasicRenderer implements IRenderer {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly camera: THREE.PerspectiveCamera;

  constructor({ fov = 75, near = 0.1, far = 1000 }: BasicRendererOptions = {}) {
    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  render(scene: THREE.Scene): void {
    this.renderer.render(scene, this.camera);
  }
}

export default BasicRenderer;
