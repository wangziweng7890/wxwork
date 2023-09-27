<template>
  <div class="orderDetail">
    <div class="title">{{$t('message.myDetail')}}</div>
    <div class="content">
      <div class="item">
        <div class="label">{{$t('message.name')}}:</div>
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
          {{$t('message.copy')}}
          </div>
        </div>
      </div>
      <div class="item">
        <div class="label"> {{$t('message.orderNumber')}}:</div>
        <div class="value">{{ data.order_number }}</div>
      </div>
      <div class="item">
        <div class="label">{{$t('message.usedName')}}:</div>
        <div class="value">{{ data.used_name || '- -' }}</div>
      </div>
      <div class="item">
        <div class="label">{{$t('message.phoneNumber')}}:</div>
        <div class="value copyValue">
         <a  :href="`tel:${data.mobile}`">{{ data.mobile || '- -' }}</a> 
          <div class="copyBtn" @click="CopyText(data.mobile)">{{$t('message.copy')}}</div>
        </div>
      </div>
      <div class="item">
        <div class="label">{{$t('message.sex')}}:</div>
        <div class="value">
          {{ data.sex === 1 ?  $t('message.man'): data.sex === 2 ?  $t('message.woman') :  $t('message.unknown') }}
        </div>
      </div>
      <div class="item">
        <div class="label">{{$t('message.age')}}:</div>
        <div class="value">{{ data.age }}</div>
      </div>
      <div class="item">
        <div class="label">{{$t('message.marriedStatus')}}:</div>
        <div class="value">{{ marryMap[data.married] }}</div>
      </div>
      <div class="item">
        <div class="label">{{$t('message.country')}}:</div>
        <div class="value">{{ data.country?.split('-')[0] }}</div>
      </div>
      <div class="item">
        <div class="label">{{$t('message.liveCountry')}}:</div>
        <div class="value">{{ `${data.live_country?.area?.join('')}${data.live_country?.details}` }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copy } from '@/utils/copy'
import { showToast } from 'vant'
const {t}=useI18n()
const marryMap = {
  1: t('message.married'),
  2: t('message.spinster'),
  3: t('message.divorce'),
  4: t('message.separate'),
  5: t('message.widowed')
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
  res && showToast(t('message.copySuccess'))
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
