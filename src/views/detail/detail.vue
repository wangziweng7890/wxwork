<template>
  <div class="detailPage">
    <van-tabs v-model:active="active">
      <van-tab title="主审人信息">主审人信息</van-tab>
      <van-tab title="家庭信息">家庭信息</van-tab>
      <van-tab title="过关证件">过关证件</van-tab>
      <van-tab title="客户标签">
        <div>客户标签</div>
        <Tag :tagArray="clientArray"></Tag>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup name="detail">
import { ref } from 'vue'
import Tag from '@/components/tag/tag.vue'

const active = ref(0)
const clientArray = [
  {
    name: '创业',
    id: 1
  },
  { name: '就业', id: 2 },
  { name: '教育', id: 3 },
  { name: '港宝', id: 4 },
  { name: '创业', id: 5 }
]
</script>

<style lang="scss" scoped>
.detailPage {
}
</style>
