import * as THREE from "three";
type lightProps = "color" | "intensity" | "groundColor";

export class ColorGUIHelper {
  private object: any;
  private prop: lightProps;
  constructor(object: THREE.Light, prop: lightProps) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }

  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
