<template>
  <div class="row" v-for="item in data" :key="item.id">
    <div class="familyDetail">
      <div class="title">{{ titleMap[item.relation] }}信息</div>
      <div class="content">
        <div class="item">
          <div class="label">姓名:</div>
          <div class="value">
            <div class="text">
              {{ item.subset_name }} {{ item.subset_name_pinyin.family_name
              }}{{ item.subset_name_pinyin.given_name }}
            </div>
            <div class="tag" v-if="item.follow === 1">随迁者</div>
          </div>
        </div>
        <div class="item">
          <div class="label">曾用名:</div>
          <div class="value">{{ item.used_name || '- -' }}</div>
        </div>
        <div class="item">
          <div class="label">手机号:</div>
          <div class="value copyValue">
            <a :href="item.phone">{{ item.phone || '- -' }}</a>
            <div class="copyBtn" @click="CopyText(data.mobile)">复制</div>
          </div>
        </div>
        <div class="item">
          <div class="label">性别:</div>
          <div class="value">
            {{ item.sex === 1 ? '男' : item.sex === 2 ? '女' : '未知' }}
          </div>
        </div>
        <div class="item">
          <div class="label">年龄:</div>
          <div class="value">{{ item.age }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copy } from '@/utils/copy'
import { showToast } from 'vant'
const props = defineProps({
  detailList: {
    type: Object,
    default: () => ({})
  }
})
const data = computed(() =>
  props.detailList.subset ? props.detailList.subset : {}
)
const titleMap = {
  1: '主申人父亲',
  2: '主申人',
  3: '配偶',
  4: '子女',
  5: '兄弟姐妹'
}
const CopyText = text => {
  const res = copy(text)
  res && showToast('复制成功')
}
</script>

<style lang="scss" scoped>
.row {
  margin-bottom: 32px;
}
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
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #222;
    .tag {
      padding: 4px 8px;
      border-radius: 8px;
      background: rgba(25, 140, 255, 0.08);
      color: #198cff;
      font-size: 22px;
      font-weight: 500;
      margin-left: 12px;
    }
    a {
      color: #198cff;
    }
  }
  .copyValue {
    display: flex;
    align-items: center;
    .copyBtn {
      font-size: 20px;
      padding: 4px 16px;
      border-radius: 31px;
      background: #f8f9fb;
      margin-left: 12px;
      cursor: pointer;
    }
  }
}
</style>
