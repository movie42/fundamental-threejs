import * as THREE from "three";
type PerspectiveCameraParams = "fov" | "aspect" | "near" | "far";
class MinMaxGUIHelper {
  public obj;
  private minProp;
  private minDif;
  private maxProp;

  constructor(
    obj: THREE.PerspectiveCamera,
    minProp: PerspectiveCameraParams,
    maxProp: PerspectiveCameraParams,
    minDif: number
  ) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min; // this will call the min setter
  }
}

export default MinMaxGUIHelper;
