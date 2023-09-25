<template>
  <div class="clientTag">
    <div class="title">客户标签</div>
    <Tag :clientArray="tagArray" class="Tag"></Tag>
  </div>
  <div class="addPlan">
    <div class="title">
      <span>添加意向需求</span>
      <span class="addBtn" @click="addShow">添加需求</span>
    </div>
    <div class="history">
      <HistoryDemand></HistoryDemand>
    </div>
    <van-action-sheet v-model:show="show" lock-scroll>
      <div class="header">
        <div class="headerTitle">添加需求</div>
        <img
          src="@/assets/close.svg"
          class="close"
          alt=""
          @click="closeAddShow"
        />
      </div>
      <van-field
        v-model="plan"
        rows="5"
        type="textarea"
        placeholder="请输入备注内容"
      />
      <div class="btnBox">
        <div class="cancel" @click="closeAddShow">取消</div>
        <div class="submit" @click="submit">确定</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts" name="clientTag">
import Tag from '@/components/tag/tag.vue'
import HistoryDemand from '@/components/historyDemand/historyDemand.vue'
import {judgeInput}from "@/utils/enter"
const props = defineProps({
  detailList: {
    type: Object,
    default: () => ({})
  }
})
const tagArray = computed(()=>props.detailList.tag_info ? props.detailList.tag_info.tagArray : []) 
const show = ref(false)
const plan = ref('')
const addShow = () => {
  show.value = true
  judgeInput()
}
const closeAddShow = () => {
  show.value = false
}
const submit=()=>{
    show.value = false
}


</script>

<style lang="scss" scoped>
.title {
  padding-bottom: 24px;
  font-size: 34px;
  font-weight: 500;
  border-bottom: 1px solid rgba(136, 143, 152, 0.1);
}

.clientTag {
  background-color: #fff;
  border-radius: 24px;
  padding: 32px;

  .Tag {
    margin-top: 32px;
  }
}
.addPlan {
  background-color: #fff;
  border-radius: 24px;
  padding: 32px;
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .addBtn {
      color: #198cff;
      font-weight: 500;
      font-size: 26px;
    }
  }
  .history {
    margin-top: 32px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #222;
    font-size: 34px;
    font-weight: 500;
    padding: 32px 42px 66px;
    img {
      width: 48px;
      height: 48px;
    }
  }
  :deep(.van-field__control) {
    background-color: #f8f9fb;
  }
  :deep(.van-field__control) {
    padding: 37px 32px 0px;
    border-radius: 16px;
    color: #222;
    font-weight: 500;
    font-size: 26px;
  }
  .van-cell {
    padding: 0 42px;
  }
  .van-cell:after {
    border-bottom: none;
  }
  .btnBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 60px;
    padding: 0 42px 42px;
    div {
      cursor: pointer;
      width: 321px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      font-size: 30px;
      font-weight: 500;
    }
    .cancel {
      color: #222;
      background: #f8f9fb;
    }
    .submit {
      background: #e8f0fe;
      color: #3c86f8;
    }
  }
}
</style>
