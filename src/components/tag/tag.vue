<template>
  <div class="tagBox">
    <div v-for="item in tagArray" :key="item.id">{{ item.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue'
import type { tagArray } from '../../views/detail/modules'

interface Props {
  tagArray: tagArray[]
}

const props = withDefaults(defineProps<Props>(), {
  tagArray: () => []
})
</script>

<style></style>
