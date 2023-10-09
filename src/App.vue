<!--
 * @Author: Autumn.again
 * @Date: 2023-09-12 17:15:47
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-20 14:21:55
 * @FilePath: \workwexin-h5-sidebar\src\App.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup>
import { RouterView } from 'vue-router'
import vLoading from './components/Loading/Loading.vue'
import { useCommonStoreInfo } from '@/stores/modules/common'
import VConsole from 'vconsole';
const useCommonStore = useCommonStoreInfo()

// 5秒内点击10次
let clickCount = 0;
let timer = null;

function showDebugger() {
	clickCount++;
    if (clickCount >= 10) {
        clearTimeout(timer);
        clickCount = 0;
		new VConsole();
    } else {
        timer = setTimeout(() => {
            clickCount = 0;
        }, 5000);
    }
}

</script>

<template>
	<div class="height_100" @click="showDebugger">
		<!-- 全局loading -->
        <v-loading v-show="useCommonStore.getLoading" />
		<!-- 路由 -->
		<RouterView />
	</div>
</template>

<style lang="less">
#app {
    height: 100vh;
}
</style>
