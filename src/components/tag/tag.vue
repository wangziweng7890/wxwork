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
import {  ref } from 'vue'
import { saveTag } from '@/api/daily_affairs/detail'

interface Props {
  clientArray: string[]
  tableId:string|number
}
// 回显 选中的数组
const props=withDefaults(defineProps<Props>(), {
  clientArray: () => [],
  tableId:''
})
const {t}=useI18n()

const tagArray = [
  { id: '1', name: t('message.business') },
  { id: '2', name: t('message.job') },
  { id: '3', name: t('message.education') },
  { id: '4', name: t('message.Kangbao')},
  { id: '5', name: t('message.insurance')},
  { id: '6', name: t('message.treatment') },
  { id: '7', name: t('message.drivingLicense') }
]
// 选中的数组
const isActive = ref([])

const activeTag = async(id )=> {
  if (isActive.value.includes(id)) {
    let index = isActive.value.findIndex(item => item === id)
    isActive.value.splice(index, 1)
  } else {
    isActive.value.push(id)
  }
await saveTag({id:props.tableId,tags:isActive.value})

}
onMounted(()=>{
  isActive.value=props.clientArray
})
</script>

<style lang="scss" scoped>
.tagBox {
  display: grid;
  grid-template-columns: repeat(auto-fill, 142px);
  grid-row-gap: 18px;
  // grid-column-gap:24px;
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
