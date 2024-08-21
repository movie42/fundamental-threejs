import pug from "@vituum/vite-plugin-pug";
import vituum from "vituum";

const nav = [
  { url: "/", name: "Home" },
  { url: "/helloworld/index", name: "Hello World" },
  {
    url: "/scenegraph/solarSystem/solarSystem",
    name: "Scene Graph Solar System"
  },
  {
    url: "/scenegraph/movingTank/movingTank",
    name: "Scene Graph Moving Tank"
  },
  {
    url: "/camera/camera",
    name: "Camera"
  },
  {
    url: "/light/light",
    name: "Light"
  }
];

export default {
  plugins: [
    vituum({
      pages: {
        dir: "src/pages",
        input: ["**/*.pug"]
      }
    }),
    pug({
      root: "./src",
      options: { pretty: true },
      globals: {
        nav
      }
    })
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }]
  }
};
