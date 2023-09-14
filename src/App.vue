<script setup>
import { RouterView } from 'vue-router'
import vLoading from './components/Loading/Loading.vue'
import { useCommonStoreInfo } from '@/stores/modules/common'
const useCommonStore = useCommonStoreInfo()

</script>

<template>
	<div id="app">
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
