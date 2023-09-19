<template>
  <div class="tagBox">
    <div
      v-for="item in tagArray"
      :key="item.id"
      @click="activeTag(item.id)"
      :class="['tag', isActive.includes(item.id) ? 'border' : '']"
    >
      {{ item.name }}
      <img v-if="isActive.includes(item.id)" src="@/assets/tag.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, ref } from 'vue'
import type { tagArray } from '../../views/detail/modules'

interface Props {
  tagArray: tagArray[]
}

withDefaults(defineProps<Props>(), {
  tagArray: () => []
})
const isActive = ref([])
const activeTag = id => {
  if (isActive.value.includes(id)) {
    let index = isActive.value.findIndex(item => item === id)
    isActive.value.splice(index, 1)
  } else {
    isActive.value.push(id)
  }
}
</script>

<style lang="scss" scoped>
.tagBox {
  display: grid;
  grid-template-columns: repeat(auto-fill, 142px);
  grid-gap: 16px;
  justify-content: space-between;
  .tag {
    cursor: pointer;
    width: 142px;
    height: 65px;
    border-radius: 12px;
    background: #f8f9fc;
    color: #222;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 28px;
      height: 28px;
    }
  }
  .border {
    border-radius: 12px;
    border: 2px solid #198cff;
    background: rgba(25, 140, 255, 0.08);
  }
}
</style>
../../views/daily_affairs/detail/modules
