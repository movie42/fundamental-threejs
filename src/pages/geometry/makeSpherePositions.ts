import * as THREE from "three";
export function makeSpherePositions(
  segmentsAround: number,
  segmentsDown: number
) {
  const numVertices = segmentsAround * segmentsDown * 6;
  const numComponents = 3;
  const positions = new Float32Array(numVertices * numComponents);
  const indices = [];

  const longHelper = new THREE.Object3D();
  const latHelper = new THREE.Object3D();
  const pointHelper = new THREE.Object3D();
  longHelper.add(latHelper);
  latHelper.add(pointHelper);
  pointHelper.position.z = 1;
  const temp = new THREE.Vector3();

  function getPoint(lat: number, long: number) {
    latHelper.rotation.x = lat;
    longHelper.rotation.y = long;
    longHelper.updateMatrixWorld(true);
    return pointHelper.getWorldPosition(temp).toArray();
  }

  let posNdx = 0;
  let ndx = 0;
  for (let down = 0; down < segmentsDown; ++down) {
    const v0 = down / segmentsDown;
    const v1 = (down + 1) / segmentsDown;
    const lat0 = (v0 - 0.5) * Math.PI;
    const lat1 = (v1 - 0.5) * Math.PI;

    for (let across = 0; across < segmentsAround; ++across) {
      const u0 = across / segmentsAround;
      const u1 = (across + 1) / segmentsAround;
      const long0 = u0 * Math.PI * 2;
      const long1 = u1 * Math.PI * 2;

      positions.set(getPoint(lat0, long0), posNdx);
      posNdx += numComponents;
      positions.set(getPoint(lat1, long0), posNdx);
      posNdx += numComponents;
      positions.set(getPoint(lat0, long1), posNdx);
      posNdx += numComponents;
      positions.set(getPoint(lat1, long1), posNdx);
      posNdx += numComponents;

      indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
      ndx += 4;
    }
  }
  return { positions, indices };
}
