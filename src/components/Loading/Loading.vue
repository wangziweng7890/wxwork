<script setup>

</script>

<template>
    <div class="loading">
        <van-loading type="spinner" color="#000" />
    </div>
</template>

<style lang="less" scoped>
.loading {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
}
</style>