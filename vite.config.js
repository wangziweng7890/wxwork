import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
	plugins: [
		vue(), 
		vueJsx(),
		Components({
			resolvers: [VantResolver()],
		}),
	],
	resolve: {
		alias: {
		'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	css: {
		// css预处理器
		preprocessorOptions: {
			less: {
				charset: false,
				additionalData: '@import "./src/assets/css/global.less";'
			}
		}
	},
	server: {
		port: 80, // 启动端口号
		proxy: {
			// 选项写法
			'/api': {
				target: 'https://test.api.gateway.galaxy-immi.com',
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	}
})
