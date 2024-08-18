import {
  appendElement,
  createElement,
  getElement,
  resizeRendererToDisplaySize
} from "@/shared/utils";
import { makeAxisGrid } from "@/shared/utils";
import * as THREE from "three";

const app = getElement("app");
const canvas = createElement("canvas");
appendElement(app, canvas);
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const scene = new THREE.Scene();

const { fov, aspect, near, far } = {
  fov: 40,
  aspect: 2,
  near: 0.1,
  far: 1000
};
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 150, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

{
  const light = new THREE.PointLight(0xffffff, 500);
  scene.add(light);
}

const objects: (THREE.Mesh | THREE.Object3D)[] = [];

const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments
);

const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xfff000 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
solarSystem.add(sunMesh);
objects.push(sunMesh);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

const moonMateril = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMateril);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);

makeAxisGrid(solarSystem, "solarSystem", 25);
makeAxisGrid(sunMesh, "sunMesh");
makeAxisGrid(earthOrbit, "earthOrbit");
makeAxisGrid(earthMesh, "earthMesh");
makeAxisGrid(moonOrbit, "moonOrbit");
makeAxisGrid(moonMesh, "moonMesh");

const render = (time: number) => {
  time *= 0.001;
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  objects.forEach((obj) => {
    obj.rotation.y = time;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
requestAnimationFrame(render);
