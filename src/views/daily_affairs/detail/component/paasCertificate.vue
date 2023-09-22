<template>
  <div class="passCertificate">
    <div class="row">
      <div class="title">客户:肖建俊</div>
      <div class="content">
        <div class="item">
          <div class="label">姓名:</div>
          <div class="value" @click="showPreview">查看</div>
        </div>
        <van-image-preview v-model:show="show" :images="images">
        </van-image-preview>
        <div class="item">
          <div class="label">曾用名:</div>
          <div class="value">查看</div>
        </div>
        <div class="item">
          <div class="label">手机号:</div>
          <div class="value">查看</div>
        </div>
        <div class="item">
          <div class="label">性别:</div>
          <div class="value">查看</div>
        </div>
        <div class="item">
          <div class="label">年龄:</div>
          <div class="value">查看</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const show = ref(false)
const images = [
  new URL(`@/assets/defaultimage.png`, import.meta.url),
  'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
]

const showPreview = () => {
  show.value = true
}
</script>

<style lang="scss" scoped>
.passCertificate {
  border-radius: 24px;
  background: #fff;

  padding: 32px;
  .title {
    padding-bottom: 24px;
    font-size: 34px;
    font-weight: 500;
    border-bottom: 1px solid rgba(136, 143, 152, 0.1);
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
    &:first-child {
      margin-top: 36px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .label {
    color: #888f98;
    font-size: 30px;
  }
  .value {
    font-size: 30px;
    border-radius: 31px;
    background: #f8f9fb;
    font-size: 20px;
    color: #222;
    height: 39px;
    padding: 4px 16px;
    cursor: pointer;
  }
}
</style>
