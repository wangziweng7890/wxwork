/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-14 16:08:44
 * @FilePath: \workwexin-h5-sidebar\vite.config.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
import { fileURLToPath, URL } from "node:url";
import { loadEnv, defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from "unplugin-vue-components/resolvers";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // 获取.env文件里定义的环境变量
  return defineConfig({
    //项目部署在主域名的子文件使用,例如http://localhost:3000/myvite/。不填默认就是/
    base: "./",
    plugins: [
      vue(),
      vueJsx(),
      Components({
        imports: [
          'vue',
          'vue-router',
          {
              vue: [
                  'defineProps',
                  'defineEmits',
                  'defineExpose',
                  'withDefaults',
              ],
          },
        ],
        dts: true,
        resolvers: [VantResolver()],
        include: [/\.vue$/, /\.vue\?vue/, /\.jsx?$/, /\.tsx?$/],
      }),
      AutoImport({
        imports: [
            'vue',
            'vue-router',
            {
                vue: [
                    'defineProps',
                    'defineEmits',
                    'defineExpose',
                    'withDefaults',
                ],
            },
        ],
        resolvers: [
          VantResolver(),
        ],
        dts: true,
        dirs: [
            './src/composables',
            'src/store',
        ],
        vueTemplate: true,
    }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        less: {
          charset: false,
          additionalData: '@import "./src/assets/css/global.less";',
        },
      },
    },
    build: {
      cssCodeSplit: false, //默认ture,将css分割提取到css文件中，false将全部css提取到一个文件里
    },
    server: {
      port: 80, // 启动端口号
      proxy: {
        // 选项写法
        "/api/frontend": {
          // target: 'http://192.168.25.68:8181',
          target: "https://test.api.gateway.galaxy-immi.com",
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, "")
          },
        },
        "/api": {
          // target: 'http://192.168.25.68:8181',
          target: "https://test.dwp.galaxy-immi.com/api",
          changeOrigin: true,
        },
      },
    },
  });
};
