import pug from "@vituum/vite-plugin-pug";
import vituum from "vituum";

const nav = [
  { url: "/", name: "Home" },
  { url: "/helloworld/index", name: "Hello World" }
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
