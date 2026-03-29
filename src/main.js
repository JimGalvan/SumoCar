import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

// ========================
// CONSTANTS
// ========================
const clock = new THREE.Clock();

const SCENE = {
  BACKGROUND_COLOR: 0x87ceeb,
  AMBIENT_LIGHT_COLOR: 0xffffff,
  AMBIENT_LIGHT_INTENSITY: 0.2,
  DIR_LIGHT_COLOR: 0xffffff,
  DIR_LIGHT_INTENSITY: 2,
  DIR_LIGHT_POS: new THREE.Vector3(5, 10, 5),
};

const GROUND = {
  SIZE: 200,
  COLOR: 0x228b22,
  HALF_EXTENT: 50,
  THICKNESS: 0.05,
};

const CAR = {
  WIDTH: 1,
  HEIGHT: 0.5,
  LENGTH: 2,
  COLOR: 0x00ff00,
  SPAWN_Y: 1,
  SPAWN_Z: 15,
  LINEAR_DAMPING: 1,
  ANGULAR_DAMPING: 2.0,
  MASS: 500,
  MAX_SPEED: 30,
  ACCELERATION: 50,
};

const WHEEL = {
  RADIUS: 0.3,
  THICKNESS: 0.2,
  SEGMENTS: 16,
  COLOR: 0x333333,
  Y_OFFSET: -0.2,
  SLOT_OFFSET: 0.4,
};

const PHYSICS = {
  GRAVITY: { x: 0, y: -9.81, z: 0 },
  DRIVE_FORCE: 50,
  TORQUE_FORCE: 15,
  MAX_ANGULAR_VEL: 1.5,
};

const STEERING = {
  TURN_SPEED: 1,
  MAX_ANGLE: 0.5,
  RETURN_DAMPING: 0.85,
};

const CAMERA = {
  FOV: 75,
  NEAR: 0.1,
  FAR: 1000,
  DISTANCE: 5,
  HEIGHT: 3,
  LERP: 0.2,
};

const RAMP = {
  WIDTH: 4,
  HEIGHT: 0.2,
  DEPTH: 6,
  COLOR: 0x8b4513,
};

// ========================
// SCENE / RENDERER
// ========================

const scene = new THREE.Scene();
scene.background = new THREE.Color(SCENE.BACKGROUND_COLOR);
scene.add(new THREE.AxesHelper(10));

const camera = new THREE.PerspectiveCamera(
  CAMERA.FOV,
  window.innerWidth / window.innerHeight,
  CAMERA.NEAR,
  CAMERA.FAR,
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========================
// LIGHTING
// ========================

const dirLight = new THREE.DirectionalLight(
  SCENE.DIR_LIGHT_COLOR,
  SCENE.DIR_LIGHT_INTENSITY,
);
dirLight.position.copy(SCENE.DIR_LIGHT_POS);
scene.add(dirLight);
scene.add(
  new THREE.AmbientLight(
    SCENE.AMBIENT_LIGHT_COLOR,
    SCENE.AMBIENT_LIGHT_INTENSITY,
  ),
);

// ========================
// GROUND
// ========================

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(GROUND.SIZE, GROUND.SIZE),
  new THREE.MeshStandardMaterial({ color: GROUND.COLOR }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.2;
scene.add(ground);

// ========================
// CAR MESH
// ========================

function createWheel(x, z, name) {
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(
      WHEEL.RADIUS,
      WHEEL.RADIUS,
      WHEEL.THICKNESS,
      WHEEL.SEGMENTS,
    ),
    new THREE.MeshStandardMaterial({ color: WHEEL.COLOR }),
  );
  wheel.name = name;
  wheel.rotation.z = Math.PI / 2;
  wheel.position.set(x, WHEEL.Y_OFFSET, z);
  return wheel;
}

const halfWidth = CAR.WIDTH / 2;
const halfLength = CAR.LENGTH / 2;

const WHEEL_POSITIONS = [
  { x: -halfWidth, z: halfLength - WHEEL.SLOT_OFFSET, name: 'frontLeftWheel' },
  { x: halfWidth, z: halfLength - WHEEL.SLOT_OFFSET, name: 'frontRightWheel' },
  { x: -halfWidth, z: -halfLength + WHEEL.SLOT_OFFSET, name: 'rearLeftWheel' },
  { x: halfWidth, z: -halfLength + WHEEL.SLOT_OFFSET, name: 'rearRightWheel' },
];

const car = new THREE.Group();
car.add(
  new THREE.Mesh(
    new THREE.BoxGeometry(CAR.WIDTH, CAR.HEIGHT, CAR.LENGTH),
    new THREE.MeshStandardMaterial({ color: CAR.COLOR }),
  ),
);
WHEEL_POSITIONS.forEach(({ x, z, name }) => car.add(createWheel(x, z, name)));
car.position.y = CAR.SPAWN_Y;
scene.add(car);

// ========================
// INPUT
// ========================

const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// ========================
// PHYSICS WORLD
// ========================
async function main(){
  await RAPIER.init();
  const world = new RAPIER.World(PHYSICS.GRAVITY);

  // Ground
  const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(
      GROUND.SIZE / 2,
      GROUND.THICKNESS,
      GROUND.SIZE / 2,
    ),
    groundBody,
  );

  // Car
  const carPhysicsBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(0, CAR.SPAWN_Y, CAR.SPAWN_Z)
      .setLinearDamping(CAR.LINEAR_DAMPING)
      .setAngularDamping(CAR.ANGULAR_DAMPING),
  );
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(
      CAR.WIDTH / 2,
      CAR.HEIGHT / 2,
      CAR.LENGTH / 2,
    ).setMass(CAR.MASS),
    carPhysicsBody,
  );

  // ========================
  // RAMPS
  // ========================

  function createRamp(x, y, z, angle) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(RAMP.WIDTH, RAMP.HEIGHT, RAMP.DEPTH),
      new THREE.MeshStandardMaterial({ color: RAMP.COLOR }),
    );
    mesh.rotation.x = -angle;
    mesh.position.set(x, y, z);
    scene.add(mesh);

    const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(-angle, 0, 0),
    );
    body.setTranslation({ x, y, z }, true);
    body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, true);
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        RAMP.WIDTH / 2,
        RAMP.HEIGHT / 2,
        RAMP.DEPTH / 2,
      ),
      body,
    );
  }

  createRamp(0, 0.5, -10, Math.PI / 8);
  createRamp(10, 0.5, -20, Math.PI / 6);

  // ========================
  // GAME LOOP
  // ========================

  function getYaw(physicsBody) {
    const { y, w } = physicsBody.rotation();
    return 2 * Math.atan2(y, w);
  }

  function updateSteering(frontLeftWheel, frontRightWheel) {
    if (keys['a']) {
      frontLeftWheel.rotation.y = Math.min(
        frontLeftWheel.rotation.y + STEERING.TURN_SPEED,
        STEERING.MAX_ANGLE,
      );
    } else if (keys['d']) {
      frontLeftWheel.rotation.y = Math.max(
        frontLeftWheel.rotation.y - STEERING.TURN_SPEED,
        -STEERING.MAX_ANGLE,
      );
    } else {
      frontLeftWheel.rotation.y *= STEERING.RETURN_DAMPING;
    }
    frontRightWheel.rotation.y = frontLeftWheel.rotation.y;
    return frontLeftWheel.rotation.y;
  }

  function updateDriveForces(
    steeringAngle,
    rearLeftWheel,
    frontLeftWheel,
    deltaTime,
  ) {
    const driving = keys['w'] || keys['s'];
    const turning = keys['a'] || keys['d'];

    if (driving) {
      const direction = keys['w'] ? 1 : -1;
      const yaw = getYaw(carPhysicsBody);
      const directionX = Math.sin(yaw) * direction;
      const directionZ = Math.cos(yaw) * direction;

      const linearVelocity = carPhysicsBody.linvel();
      const currentSpeed = Math.sqrt(
        linearVelocity.x ** 2 + linearVelocity.z ** 2,
      );
      if (currentSpeed < CAR.MAX_SPEED) {
        const accelerationForce = CAR.MASS * CAR.ACCELERATION * deltaTime;

        carPhysicsBody.applyImpulse(
          {
            x: accelerationForce * directionX,
            y: 0,
            z: accelerationForce * directionZ,
          },
          true,
        );
      }
    }

    if (driving && turning) {
      const linearVelocity = carPhysicsBody.linvel();
      const speed = Math.sqrt(linearVelocity.x ** 2 + linearVelocity.z ** 2);
      const wheelBase = Math.abs(
        rearLeftWheel.position.z - frontLeftWheel.position.z,
      );
      const angularVelStrength = 2.5;
      const angularVelocity =
        (speed / wheelBase) * Math.tan(steeringAngle) * angularVelStrength;
      const dir = keys['w'] ? 1 : -1;

      if (Math.abs(carPhysicsBody.angvel().y) < PHYSICS.MAX_ANGULAR_VEL) {
        const force = angularVelocity * PHYSICS.TORQUE_FORCE * dir;
        carPhysicsBody.applyTorqueImpulse({ x: 0, y: force, z: 0 }, true);
      }
    }
  }

  function syncCarMesh() {
    const { x, y, z } = carPhysicsBody.translation();
    const r = carPhysicsBody.rotation();
    car.position.set(x, y, z);
    car.quaternion.set(r.x, r.y, r.z, r.w);
  }

  function updateCamera() {
    const yaw = getYaw(carPhysicsBody);
    const targetX = car.position.x - Math.sin(yaw) * CAMERA.DISTANCE;
    const targetZ = car.position.z - Math.cos(yaw) * CAMERA.DISTANCE;
    const targetY = car.position.y + CAMERA.HEIGHT;

    camera.position.x += (targetX - camera.position.x) * CAMERA.LERP;
    camera.position.z += (targetZ - camera.position.z) * CAMERA.LERP;
    camera.position.y += (targetY - camera.position.y) * CAMERA.LERP;
    camera.lookAt(car.position);
  }

  function update() {
    const deltaTime = clock.getDelta();

    const frontLeftWheel = car.getObjectByName('frontLeftWheel');
    const frontRightWheel = car.getObjectByName('frontRightWheel');
    const rearLeftWheel = car.getObjectByName('rearLeftWheel');
    const steeringAngle = updateSteering(frontLeftWheel, frontRightWheel);

    updateDriveForces(steeringAngle, rearLeftWheel, frontLeftWheel, deltaTime);

    world.step();
    syncCarMesh();
    updateCamera();
  }

  function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
  }

  animate();
}

main();