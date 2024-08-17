import pug from "@vituum/vite-plugin-pug";
import vituum from "vituum";

export default {
  plugins: [
    vituum(),
    pug({
      root: "./src"
    })
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }]
  }
};
