<template>
  <div class="orderDetail">
    <div class="title">个人信息</div>
    <div class="content">
      <div class="item">
        <div class="label">姓名:</div>
        <div class="value copyValue">
          {{ data.username }} {{ data.username_pinyin?.family_name
          }}{{ data.username_pinyin?.given_name }}
          <div
            class="copyBtn"
            @click="
              CopyText(
                `${data.username}${data.username_pinyin?.family_name}${data.username_pinyin?.given_name}`
              )
            "
          >
            复制
          </div>
        </div>
      </div>
      <div class="item">
        <div class="label">订单号:</div>
        <div class="value">{{ data.order_number }}</div>
      </div>
      <div class="item">
        <div class="label">曾用名:</div>
        <div class="value">{{ data.used_name || '- -' }}</div>
      </div>
      <div class="item">
        <div class="label">手机号:</div>
        <div class="value copyValue">
         <a :href="data.mobile">{{ data.mobile || '- -' }}</a> 
          <div class="copyBtn" @click="CopyText(data.mobile)">复制</div>
        </div>
      </div>
      <div class="item">
        <div class="label">性别:</div>
        <div class="value">
          {{ data.sex === 1 ? '男' : data.sex === 2 ? '女' : '未知' }}
        </div>
      </div>
      <div class="item">
        <div class="label">年龄:</div>
        <div class="value">{{ data.age }}</div>
      </div>
      <div class="item">
        <div class="label">婚姻状况:</div>
        <div class="value">{{ marryMap[data.married] }}</div>
      </div>
      <div class="item">
        <div class="label">国籍:</div>
        <div class="value">{{ data.country?.split('-')[0] }}</div>
      </div>
      <div class="item">
        <div class="label">现居住地:</div>
        <div class="value">{{ data.live_country?.area?.join('') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copy } from '@/utils/copy'
import { showToast } from 'vant'
const marryMap = {
  1: '已婚',
  2: '未婚',
  3: '离婚',
  4: '分居',
  5: '丧偶'
}
const props = defineProps({
  detailList: {
    type: Object,
    default: () => ({})
  }
})
const data = computed(()=>props.detailList.master ? props.detailList.master : {}) 
const CopyText = text => {
  const res = copy(text)
  res && showToast('复制成功')
}
</script>

<style lang="scss" scoped>
.orderDetail {
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
     a{
      color: #198CFF;
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
