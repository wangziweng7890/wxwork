<template>
  <div class="familyDetail">
  <div class="row">
      <div class="title">配偶信息</div>
    <div class="content">
      <div class="item">
        <div class="label">姓名:</div>
        <div class="value">肖建俊 XIAO JUANJUN</div>
      </div>
      <div class="item">
        <div class="label">曾用名:</div>
        <div class="value"></div>
      </div>
      <div class="item">
        <div class="label">手机号:</div>
        <div class="value"></div>
      </div>
      <div class="item">
        <div class="label">性别:</div>
        <div class="value"></div>
      </div>
      <div class="item">
        <div class="label">年龄:</div>
        <div class="value"></div>
      </div>

    </div>
  </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.familyDetail {
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
    color: #222;
  }
}
</style>
