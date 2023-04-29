import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dotenv from "dotenv";


// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'


export default defineConfig({
  define: {
    __VALUE__: `"${process.env.VALUE}"`, // wrapping in "" since it's a string
  },
  plugins: [
		vue(),
		vuetify({ autoImport: true }),
	],
});
