import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import {
  appendElement,
  createElement,
  getElement,
  resizeRendererToDisplaySize
} from "./shared/utils";
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

// 영근님 코드 보고 그대로 배껴본거
const GlTFloader = new GLTFLoader();

let model: THREE.Group<THREE.Object3DEventMap> | null = null;

GlTFloader.load(
  "src/assets/DamagedHelmet.glb",
  (gltf) => {
    model = gltf.scene;
    model.position.y = 2;
    model.scale.set(0.7, 0.7, 0.7);
    model.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.material.envMap = scene;
        node.material.needsUpdate = true;
      }
    });
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("error occurred! while loading gltf model");
  }
);

const render = (time: number) => {
  time *= 0.001;
  const speed = 0.3;
  const rot = time * speed;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (model) {
    model.rotation.y = rot;
    model.rotation.x = rot;
  }

  cubes.forEach((cube, idx) => {
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

requestAnimationFrame(render);
