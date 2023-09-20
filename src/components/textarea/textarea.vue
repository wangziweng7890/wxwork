<template>
  <div class="textareaBox">
    <van-field
      v-model="message"
      rows="3"
      type="textarea"
      placeholder="请输入备注内容"
    />
  </div>
  <div class="btnBox">
    <van-button>取消</van-button>
    <van-button style="margin: 0 16px" type="primary">保存</van-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const message = ref('')
</script>
<style lang="scss" scoped>
.van-field {
  padding: 0;
}
:deep(.van-field__control) {
  background-color: #f8f9fb;
}
.textareaBox {
}
.btnBox {
  border-top: 1px solid #f0f0f0;
  width: 100%;
  height: 87px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #f8f9fb;
  .van-button {
    border: none;
    height: 55px;
  }
}
</style>
