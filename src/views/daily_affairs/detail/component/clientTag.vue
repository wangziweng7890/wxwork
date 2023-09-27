<template>
  <div class="clientTag">
    <div class="title">{{ $t('message.clientTag') }}</div>
    <Tag
      :tableId="route.query.tableId"
      :clientArray="tagArray"
      class="Tag"
    ></Tag>
  </div>
  <div class="addPlan">
    <div class="title">
      <span>{{ $t('message.addIntentionPlan') }}</span>
      <span class="addBtn" @click="addShow">{{ $t('message.addPlan') }}</span>
    </div>
    <div class="history">
      <HistoryDemand v-if="demand.length>0" :demand="demand"></HistoryDemand>
      <div v-else style="display: flex;align-items: center;justify-content: center; color: #888f98;height: 208px;">
        - 暂无添加 -
      </div>
    </div>
    <van-action-sheet v-model:show="show" lock-scroll>
      <div class="header">
        <div class="headerTitle">{{ $t('message.addPlan') }}</div>
        <img
          src="@/assets/close.svg"
          class="close"
          alt=""
          @click="closeAddShow"
        />
      </div>
      <van-field
        required
        :error-message="errorMessage"
        v-model="plan"
        rows="5"
        type="textarea"
        :placeholder="$t('message.pleaseRemark')"
      />
      <div class="btnBox">
        <div class="cancel" @click="closeAddShow">
          {{ $t('message.cancel') }}
        </div>
        <div class="submit" @click="submit">{{ $t('message.submit') }}</div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup name="clientTag">
import Tag from '@/components/tag/tag.vue'
import HistoryDemand from '@/components/historyDemand/historyDemand.vue'
import { judgeInput } from '@/utils/enter'
import { saveDemand } from '@/api/daily_affairs/index'
import { showSuccessToast } from 'vant'
const { t } = useI18n()
const route = useRoute()
const props = defineProps({
  detailList: {
    type: Object,
    default: () => ({})
  }
})
const tagArray = computed(() =>
  props.detailList.tag_info ? props.detailList.tag_info.tagArray : []
)
const demand = computed(() =>
  props.detailList.tag_info ? props.detailList.tag_info.demand : []
)
const errorMessage = ref('')
const show = ref(false)
const plan = ref('')
const scrollX = ref()
const scrollY = ref()
const addShow = () => {
  scrollX.value = window.scrollX
  scrollY.value = window.scrollY
  plan.value = ''
  errorMessage.value = ''
  show.value = true
  judgeInput()
}
const closeAddShow = () => {
  show.value = false
  window.scrollTo(scrollX.value, scrollY.value)
}
const getList = inject('getList')
const submit = async () => {
  errorMessage.value = !plan.value ? t('message.pleaseRemark') : ''
  if (!plan.value) return
  const { code } = await saveDemand({
    id: route.query.tableId,
    content: plan.value
  })
  if (code === 200) {
    showSuccessToast(t('message.addSucess'))
    getList()
  }
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
  margin-bottom: 32px;
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
