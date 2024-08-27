import {
  appendElement,
  createElement,
  getElement,
  resizeRendererToDisplaySize
} from "@/shared/utils";
import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import {
  BoxGeometryController,
  CircleController,
  ConeController,
  TetrahedronController
} from "./geometryGui";
import { normals, positions, uvs } from "./customBufferGeomerty";
import { makeSpherePositions } from "./makeSpherePositions";

const canvas = createElement("canvas");
const app = getElement("#app");
appendElement(app, canvas);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas });
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
camera.position.z = 8;
const gui = new GUI();

function addLight(...pos: [number, number, number]) {
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...pos);
  scene.add(light);
}

addLight(-1, 2, 4);
addLight(2, -2, 3);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshPhongMaterial({ color: "#ff33ff" });
const cube = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(cube);
const boxGeometryController = new BoxGeometryController(
  cube,
  gui,
  "box geometry"
);
boxGeometryController.setGeometryParams({ color: "#ff33ff" });

const circleGeometry = new THREE.CircleGeometry(0.6815, 25);
const circleMaterial = new THREE.MeshPhongMaterial({ color: "#ffaa32" });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.x = 2;
scene.add(circle);
new CircleController(circle, gui, "circle");

const coneGeometry = new THREE.ConeGeometry(0.5, 1.2, 16);
const coneMaterial = new THREE.MeshPhongMaterial({ color: "#2fa2f2" });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.x = -2;
cone.position.y = -2;
scene.add(cone);
new ConeController(cone, gui, "cone");

const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.5, 4);
const tetrahedronMaterial = new THREE.MeshPhongMaterial({ color: "#aff2a2" });
const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
tetrahedron.position.x = -2;
scene.add(tetrahedron);
new TetrahedronController(tetrahedron, gui, "tetrahedron");

const radius = 0.7;
const widthSegments = 8;
const heightSegments = 10;
const geometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments
);
const material = new THREE.PointsMaterial({
  color: "red",
  size: 0.1 // in world units
});
const points = new THREE.Points(geometry, material);
points.position.set(2, 2, 0);
scene.add(points);

const customGeometry = new THREE.BufferGeometry();
const positionNumComponents = 3;
const normalNumComponents = 3;
const uvNumComponents = 2;
customGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents)
);
customGeometry.setAttribute(
  "normal",
  new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
);
customGeometry.setAttribute(
  "uv",
  new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
);

const loader = new THREE.TextureLoader();
const texture = loader.load(
  "https://threejs.org/manual/examples/resources/images/star.png"
);
texture.colorSpace = THREE.SRGBColorSpace;

const customGeometryMaterial = new THREE.MeshPhongMaterial({
  color: "#ffeeff",
  map: texture
});

const customGeometryCube = new THREE.Mesh(
  customGeometry,
  customGeometryMaterial
);
customGeometryCube.position.set(2, -2, 0);

scene.add(customGeometryCube);

// ----------------------
const segmentsAround = 24;
const segmentsDown = 16;
const { positions: spherePosition, indices } = makeSpherePositions(
  segmentsAround,
  segmentsDown
);
const sphereNormals = spherePosition.slice();
const sphereBufferGeometry = new THREE.BufferGeometry();

const positionAttribute = new THREE.BufferAttribute(
  spherePosition,
  positionNumComponents
);
positionAttribute.setUsage(THREE.DynamicDrawUsage);
sphereBufferGeometry.setAttribute("position", positionAttribute);
sphereBufferGeometry.setAttribute(
  "normal",
  new THREE.BufferAttribute(sphereNormals, 3)
);
sphereBufferGeometry.setIndex(indices);

const sphereMaterial = new THREE.MeshPhongMaterial({
  color: "#ff0000",
  side: THREE.DoubleSide,
  shininess: 10
});

const sphereCustom = new THREE.Mesh(sphereBufferGeometry, sphereMaterial);
scene.add(sphereCustom);
sphereCustom.position.set(0, -2, 0);

const temp = new THREE.Vector3();

const render = (time: number) => {
  time *= 0.001;
  const speed = 0.3;
  const rot = time * speed;
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cube.rotation.set(rot, 0, 0);
  circle.rotation.set(rot, 0, 0);
  cone.rotation.set(-rot, 0, rot);
  points.rotation.set(-rot * 0.5, 0, 2 * rot);
  customGeometryCube.rotation.set(0, -rot * 2, rot);

  for (let i = 0; i < positions.length; i += 3) {
    const quad = (i / 12) | 0;
    const ringId = (quad / segmentsAround) | 0;
    const ringQuadId = quad % segmentsAround;
    const ringU = ringQuadId / segmentsAround;
    const angle = ringU * Math.PI * 2;
    temp.fromArray(normals, i);
    temp.multiplyScalar(
      THREE.MathUtils.lerp(1, 1.4, Math.sin(time + ringId + angle) * 0.5 + 0.5)
    );
    temp.toArray(positions, i);
  }

  positionAttribute.needsUpdate = true;
  sphereCustom.rotation.x = rot;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

requestAnimationFrame(render);
