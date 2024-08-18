import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

const gui = new GUI();

export class AxisGridHelper {
  private grid: THREE.GridHelper;
  private axes: THREE.AxesHelper;
  private _visible: boolean = false;

  constructor(node: THREE.Object3D | THREE.Mesh, units = 10) {
    const axes = new THREE.AxesHelper();
    const axesMaterial = axes.material as THREE.Material;
    axesMaterial.depthTest = false;
    axes.renderOrder = 2; // after the grid
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

export function makeAxisGrid(
  node: THREE.Mesh | THREE.Object3D,
  label: string,
  units?: number
) {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, "visible").name(label);
}
