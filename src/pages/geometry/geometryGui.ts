import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

interface GeometryParams {
  visible: boolean;
  wireframe: boolean;
  color: string;
  [key: string]: any;
}

abstract class GeometryController {
  protected mesh: THREE.Mesh;
  protected gui: GUI;
  protected name: string;
  protected folder: GUI;
  protected params: GeometryParams;

  constructor(mesh: THREE.Mesh, gui: GUI, name: string = "Geometry") {
    this.mesh = mesh;
    this.gui = gui;
    this.name = name;
    this.folder = this.gui.addFolder(this.name);

    this.params = {
      visible: true,
      wireframe: false,
      color: "#00ff00",
      ...this.getGeometryParams()
    };

    this.setupGUI();
  }

  protected setupGUI(): void {
    this.folder
      .add(this.params, "visible")
      .onChange(this.updateVisibility.bind(this));
    this.folder
      .add(this.params, "wireframe")
      .onChange(this.updateWireframe.bind(this));
    this.folder
      .addColor(this.params, "color")
      .onChange(this.updateColor.bind(this));

    this.setupGeometryGUI();
  }

  protected updateVisibility(value: boolean): void {
    this.mesh.visible = value;
  }

  protected updateWireframe(value: boolean): void {
    const material = this.mesh.material;
    if (material instanceof THREE.Material && "wireframe" in material) {
      material.wireframe = value;
    } else if (Array.isArray(material)) {
      material.forEach((m) => {
        if (m instanceof THREE.Material && "wireframe" in m) {
          m.wireframe = value;
        }
      });
    }
  }

  protected updateColor(value: string): void {
    const material = this.mesh.material;
    if (material instanceof THREE.MeshPhongMaterial) {
      material.color.set(value);
    } else if (Array.isArray(material)) {
      material.forEach((m) => {
        if (m instanceof THREE.MeshPhongMaterial) {
          m.color.set(value);
        }
      });
    }
  }

  setGeometryParams<T>(params: T) {
    this.params = { ...this.params, ...params };
  }

  protected abstract getGeometryParams(): object;

  protected abstract setupGeometryGUI(): void;
  protected abstract updateGeometry(): void;
}

export class BoxGeometryController extends GeometryController {
  protected getGeometryParams(): object {
    return {
      width: 1,
      height: 1,
      depth: 1
    };
  }

  protected setupGeometryGUI(): void {
    this.folder
      .add(this.params, "width", 0.1, 3)
      .onChange(this.updateGeometry.bind(this));
    this.folder
      .add(this.params, "height", 0.1, 3)
      .onChange(this.updateGeometry.bind(this));
    this.folder
      .add(this.params, "depth", 0.1, 3)
      .onChange(this.updateGeometry.bind(this));
  }

  protected updateGeometry(): void {
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.BoxGeometry(
      this.params.width,
      this.params.height,
      this.params.depth
    );
  }
}

export class CircleController extends GeometryController {
  protected getGeometryParams(): object {
    return {
      radius: 1,
      segments: 25
    };
  }

  protected setupGeometryGUI(): void {
    this.folder
      .add(this.params, "radius", 0.1, 3)
      .onChange(this.updateGeometry.bind(this));
    this.folder
      .add(this.params, "segments", 3, 64, 1)
      .onChange(this.updateGeometry.bind(this));
  }

  protected updateGeometry(): void {
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.CircleGeometry(
      this.params.radius,
      this.params.segments
    );
  }
}

export class ConeController extends GeometryController {
  protected getGeometryParams(): object {
    return {
      radius: 1,
      height: 2,
      radiusSegments: 32
    };
  }

  protected setupGeometryGUI(): void {
    this.folder
      .add(this.params, "radius", 0.5, 3)
      .onChange(this.updateGeometry.bind(this));
    this.folder
      .add(this.params, "height", 1, 7, 0.1)
      .onChange(this.updateGeometry.bind(this));
    this.folder
      .add(this.params, "radiusSegments", 5, 32, 1)
      .onChange(this.updateGeometry.bind(this));
  }

  protected updateGeometry(): void {
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.ConeGeometry(
      this.params.radius,
      this.params.height,
      this.params.radiusSegment
    );
  }
}

export class TetrahedronController extends GeometryController {
  protected getGeometryParams(): object {
    return {
      radius: 1,
      detail: 4
    };
  }

  protected setupGeometryGUI(): void {
    this.folder
      .add(this.params, "radius", 0.5, 3)
      .onChange(this.updateGeometry.bind(this));
    this.folder
      .add(this.params, "detail", 0.5, 7, 1)
      .onChange(this.updateGeometry.bind(this));
  }

  protected updateGeometry(): void {
    this.mesh.geometry.dispose();
    this.mesh.geometry = new THREE.TetrahedronGeometry(
      this.params.radius,
      this.params.detail
    );
  }
}
