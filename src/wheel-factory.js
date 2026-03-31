import Car from './car.js';
import Wheel from './wheel.js';
const WHEEL = {
  RADIUS: 0.3,
  THICKNESS: 0.2,
  SEGMENTS: 16,
  COLOR: 0x333333,
  Y_OFFSET: -0.2,
  SLOT_OFFSET: 0.4,
};

class Vector2XZ {
  constructor(x = 0, z = 0) {
    this.x = x;
    this.z = z;
  }
}

class WheelFactory{

  static createWheels(car){
    const halfWidth = car.getWidth() / 2;
    const halfLength = car.getLength() / 2;
    const wheels = []
    const frontLeftWheelName = 'frontLeftWheel';
    const frontLeftWheel = new Wheel(
      WHEEL.RADIUS,
      WHEEL.THICKNESS,
      WHEEL.SEGMENTS,
      WHEEL.COLOR,
      WHEEL.Y_OFFSET,
      frontLeftWheelName,
    );

  }
}