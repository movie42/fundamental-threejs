import {
  appendElement,
  createElement,
  getElement,
  MinMaxGUIHelper,
  resizeRendererToDisplaySize,
  setScissorForElement
} from "@/shared/utils";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import "./cameraStyles.css";

const app = getElement("#app");
const canvas = createElement("canvas");
const split = createElement("div");
split.className = "split";
const view1 = createElement("div");
view1.id = "view1";
view1.tabIndex = 1;
const view2 = createElement("div");
view2.id = "view2";
view2.tabIndex = 2;

appendElement(app, canvas);
appendElement(split, view1);
appendElement(split, view2);
appendElement(app, split);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const fov = 45;
const aspect = 2; // the canvas default
const near = 5;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);

const cameraHelper = new THREE.CameraHelper(camera);

const gui = new GUI();
gui.add(camera, "fov", 1, 180);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, "near", "far", 0.1);
gui.add(minMaxGUIHelper, "min", 0.1, 50, 0.1).name("near");
gui.add(minMaxGUIHelper, "max", 0.1, 50, 0.1).name("far");

const controls = new OrbitControls(camera, view1);
controls.target.set(0, 5, 0);
controls.update();

const camera2 = new THREE.PerspectiveCamera(
  60, // fov
  2, // aspect
  0.1, // near
  500 // far
);
camera2.position.set(40, 10, 30);
camera2.lookAt(0, 5, 0);

const controls2 = new OrbitControls(camera2, view2);
controls2.target.set(0, 5, 0);
controls2.update();

const scene = new THREE.Scene();
scene.background = new THREE.Color("black");
scene.add(cameraHelper);

{
  const planeSize = 40;

  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    "https://threejs.org/manual/examples/resources/images/checker.png"
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  const repeats = planeSize / 2;
  texture.repeat.set(repeats, repeats);

  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(planeGeo, planeMat);
  mesh.rotation.x = Math.PI * -0.5;
  scene.add(mesh);
}

{
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  scene.add(mesh);
}

{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  );
  const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}

{
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, 0, 0);
  scene.add(light);
  scene.add(light.target);
}

function updateCamera() {
  camera.updateProjectionMatrix();
}

// const clock = new THREE.Clock();
const render = (time: number) => {
  resizeRendererToDisplaySize(renderer);

  // turn on the scissor
  renderer.setScissorTest(true);

  // render the original view
  {
    const aspect = setScissorForElement(canvas, view1, renderer);

    // adjust the camera for this aspect
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    cameraHelper.update();

    // don't draw the camera helper in the original view
    cameraHelper.visible = false;

    scene.background.set(0x000000);

    // render
    renderer.render(scene, camera);
  }

  // render from the 2nd camera
  {
    const aspect = setScissorForElement(canvas, view2, renderer);

    // adjust the camera for this aspect
    camera2.aspect = aspect;
    camera2.updateProjectionMatrix();

    // draw the camera helper in the 2nd view
    cameraHelper.visible = true;

    scene.background.set(0x000040);

    renderer.render(scene, camera2);
  }

  requestAnimationFrame(render);
};

requestAnimationFrame(render);
