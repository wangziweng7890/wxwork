<template>
  <div>
    <Tag :tagArray="clientArray"></Tag>
    <Textarea></Textarea>
  </div>
</template>

<script setup lang="ts" name="clientTag">
import Tag from '@/components/tag/tag.vue'
import Textarea from '@/components/textarea/textarea.vue'
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

<style></style>
