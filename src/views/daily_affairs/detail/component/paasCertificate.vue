<template>
  <div>
    <div class="row" v-for="(item, index) in detailList" :key="index">
      <div class="passCertificate">
        <div class="title">
          {{ titleMap[item.relation] }}：{{ item.applicant_name }}
        </div>
        <div class="content">
          <div class="item" v-for="(it, idx) in item.file_list" :key="idx" @click="showPreview(index, idx)">
            <div class="label">{{ it.file_name }}</div>
            <div class="value" >查看</div>
          </div>
        </div>
      </div>
    </div>
    <van-image-preview v-model:show="show" :images="images">
    </van-image-preview>
  </div>
</template>

<script setup>
import { getArchivist } from '@/api/daily_affairs/index'
import { previewOss } from '@/api/common/index'
import * as wx from '@wecom/jssdk'

const { t, locale } = useI18n()
const route = useRoute()
const titleMap = {
  1: t('message.order'),
  2: '配偶',
  3: '子女'
}
const detailList = ref([])
const show = ref(false)
const images = ref([])
const showPreview = async (index, idx) => {
  let file_list = detailList.value[index].file_list[idx].file_source
  if (file_list[0].ext === 'pdf') {
    let url = ''
    url = await previewOss({ object: file_list[0].url })
    wx.openDefaultBrowser({ // 企微移动端直接调用 window.open 打不开页面，非得先调sdk方法，原因未知
        url
    }).catch(() => {
        window.open(url)
    })
  } else {
    const urlArray = await Promise.all(
      file_list.map(async item => {
        const url = await previewOss({ object: item.url })
        return url
      })
    )
    if (urlArray.length < 1) return
    images.value = urlArray
    show.value = true
  }
}
const getList = async () => {
  const { code, data } = await getArchivist({
    order_id: route.query.orderId,
    chinese_convert: locale.value === 'HK' ? 1 : 0
  })
  if (code === 200) {
    detailList.value = data
  }
}
onMounted(async () => {
  getList()
})
</script>

<style lang="scss" scoped>
.row {
  margin-bottom: 32px;
}

.passCertificate {
  border-radius: 24px;
  background: #fff;

  padding: 32px;
  .title {
    color: #222;
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
    border-radius: 31px;
    background: #f8f9fb;
    font-size: 20px;
    color: #222;
    height: 39px;
    padding: 4px 16px;
    cursor: pointer;
  }
}
</style>
