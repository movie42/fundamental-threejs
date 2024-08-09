import * as THREE from "three";
import {
  appendElement,
  createElement,
  getElement
} from "./shared/utils/createElement";
import "./style.css";

const app = getElement("app");
const canvas = createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

appendElement(app, canvas);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const { fov, aspect, near, far } = {
  fov: 75,
  aspect: 2,
  near: 0.1,
  far: 5
};
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const geometry = new THREE.BoxGeometry(1, 1, 1);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(-1, 2, 4);
scene.add(light);

const makeInstance = (
  geometry: THREE.BoxGeometry,
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
  makeInstance(geometry, 0x44aa88, 0),
  makeInstance(geometry, 0x8844aa, -2),
  makeInstance(geometry, 0xaa8844, 2)
];

const render = (time: number) => {
  time *= 0.001;

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
