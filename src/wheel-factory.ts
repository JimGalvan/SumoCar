import Wheel from './wheel.js';

interface WheelFactoryOptions {
  radius?: number;
  thickness?: number;
  segments?: number;
  color?: number;
}

class WheelFactory {
  static createWheels({
    radius = 0.3,
    thickness = 0.2,
    segments = 16,
    color = 0x333333,
  }: WheelFactoryOptions = {}): Wheel[] {
    const config = { radius, thickness, segments, color };
    return [
      new Wheel({ ...config, name: 'frontLeftWheel' }),
      new Wheel({ ...config, name: 'frontRightWheel' }),
      new Wheel({ ...config, name: 'rearLeftWheel' }),
      new Wheel({ ...config, name: 'rearRightWheel' }),
    ];
  }
}

export default WheelFactory;
