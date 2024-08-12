import * as THREE from "three";
import {
  appendElement,
  createElement,
  getElement
} from "./shared/utils/createElement";
import resizeRendererToDisplaySize from "./shared/utils/resizeRendererToDisplaySize";
import "./style.css";

const app = getElement("app");
const canvas = createElement("canvas");

appendElement(app, canvas);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const { fov, aspect, near, far } = {
  fov: 75,
  aspect: 2,
  near: 0.1,
  far: 7
};
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 4;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry(0.7, 10, 10);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-1, 2, 4);
scene.add(light);

const makeInstance = (
  geometry: THREE.BoxGeometry | THREE.SphereGeometry,
  color: number,
  x: number
) => {
  const material = new THREE.MeshPhongMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = x;
  return cube;
};

const cubes = [
  makeInstance(boxGeometry, 0x00fab0, 0),
  makeInstance(sphereGeometry, 0xff84ab, -2),
  makeInstance(boxGeometry, 0x5500ff, 2)
];

const render = (time: number) => {
  time *= 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach((cube, idx) => {
    const speed = 0.3;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

requestAnimationFrame(render);
