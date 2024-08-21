import {
  appendElement,
  ColorGUIHelper,
  createElement,
  getElement,
  resizeRendererToDisplaySize
} from "@/shared/utils";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import "./style.css";

const app = getElement("#app");
const canvas = createElement("canvas");

appendElement(app, canvas);

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas });
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
camera.position.z = 10;
camera.position.y = 10;

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

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
  const ambientLightButton = getElement(".ambientLight") as HTMLButtonElement;
  let light: THREE.AmbientLight | null = null;
  let gui: GUI | null = null;
  const ambientLight = () => {
    const color = 0xffffff;
    const intensity = 1;

    if (light && app?.classList.contains("ambientLight")) {
      app.classList.remove(...app.classList);
      scene.remove(light);
      light = null;
      gui?.destroy();
      gui = null;
      return;
    } else {
      light = new THREE.AmbientLight(color, intensity);
      app?.classList.add("ambientLight");
      scene.add(light);
      gui = new GUI();
      gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
      gui.add(light, "intensity", 0, 2, 0.01);
    }
  };

  ambientLightButton.addEventListener("click", ambientLight);
}

{
  const hemisphereLightButton = getElement(
    ".hemisphereLight"
  ) as HTMLButtonElement;
  const skyColor = 0xb1e1ff; // 하늘색
  const groundColor = 0xb97a20; // 오렌지 브라운
  const intensity = 1;
  let light: THREE.HemisphereLight | null = null;
  let gui: GUI | null = null;
  const hemisphereLight = () => {
    if (light && app?.classList.contains("hemisphereLight")) {
      app.classList.remove(...app.classList);
      scene.remove(light);
      light = null;
      gui?.destroy();
      gui = null;
      return;
    }
    light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    app?.classList.add("hemisphereLight");
    scene.add(light);
    gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, "color"), "value").name("skyColor");
    gui
      .addColor(new ColorGUIHelper(light, "groundColor"), "value")
      .name("groundColor");
    gui.add(light, "intensity", 0, 2, 0.01);
  };

  hemisphereLightButton.addEventListener("click", hemisphereLight);
}

const render = () => {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

requestAnimationFrame(render);
