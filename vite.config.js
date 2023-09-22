/*
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-21 14:21:23
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
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import iconfontLoader, { FileSystemIconLoader } from '@galaxy-fe/vite-plugin-unocss-iconfont'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // 获取.env文件里定义的环境变量
  return defineConfig({
    //项目部署在主域名的子文件使用,例如http://localhost:3000/myvite/。不填默认就是/
    base: "./",
    plugins: [
      // iconfont 转换为 svg,
      // 使用如下
      // <el-icon size="16px" color="burlywood">
      //      <icon-font-meishi />
      // </el-icon>
      iconfontLoader({
        cookie: 'cna=Xl2hHHeH5GYCAXFZYa3NFmsI; EGG_SESS_ICONFONT=U9fbDOeaopkgF8Nw-zVwcgoQJNiGBLVo9e4m0Azk-Cw_Qo7u53eQH6b3oo1pOEgt8eSlAsgJPC5zN7anUpHmnuuZbltZUnIJP69xPZCv-pz8RY86EODkr3Nf2zat7rt3XZ3D1T-wzQ7leAV41ukKo-iZTlTStPlm8K2zHhxRUCm06QqgK9kqMRsrjqekTSOMOc9iDKlUW6Ks02ekylUO5BgeY0lH0NBwXTby8Cxf34UlVG0eQUOWuRhsB89tt5fD; locale=zh-cn; xlly_s=1; ctoken=_zwmQdUWzsOAfXp5NIykDT4K; u=5509081; u.sig=DQk-Ka_8iGU9qoHZrfIxUajSHTJndoXdJHQwxO4hdjk; isg=BJOTxA9Y8xSNb7-kLS6wgXS0Ihe9SCcKu-96j0WwY7LpxLBmzBp6W8lS_jSq5H8C',
        pid: '4042591',
        ctoken: '_zwmQdUWzsOAfXp5NIykDT4K',
      }),
      Icons({
          customCollections: {
              font: FileSystemIconLoader(svg => svg.replace(/fill="#[\w\d]+"/g, 'fill="currentColor"').replace(/style="[^"]*"/g, '')),
          },
      }),
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
        resolvers: [
          VantResolver(),
          IconsResolver({
            prefix: 'Icon',
            customCollections: ['font'],
            // enabledCollections: ['ep'],
        }),],
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
          IconsResolver({
            prefix: 'Icon',
            customCollections: ['font'],
        }),
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
        "/api": {
          // target: 'http://192.168.25.68:8181',
          target: "https://test.api.gateway.galaxy-immi.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
