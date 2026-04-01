import Ramp from './ramp.js';

class RampBuilder {
  private x: number = 0;
  private y: number = 0;
  private z: number = 0;
  private angle: number = 0;
  private width: number = 4;
  private height: number = 0.2;
  private depth: number = 6;
  private color: number = 0x8b4513;

  setPosition(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setAngle(angle: number): this {
    this.angle = angle;
    return this;
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  setDepth(depth: number): this {
    this.depth = depth;
    return this;
  }

  setColor(color: number): this {
    this.color = color;
    return this;
  }

  build(): Ramp {
    return new Ramp({
      x: this.x,
      y: this.y,
      z: this.z,
      angle: this.angle,
      width: this.width,
      height: this.height,
      depth: this.depth,
      color: this.color,
    });
  }
}

export default RampBuilder;
