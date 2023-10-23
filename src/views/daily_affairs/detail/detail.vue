<template>
  <div class="detailPage">
    <div class="content">
      <div class="top">
        <div class="peopleDetail">
          <div>
            <img
              v-if="errorImg"
              :src="headImage"
              alt=""
              @error="setDefaultImage"
            />
            <img v-else :src="defaultImg" />
          </div>
          <div>
            <div class="nameTitle">
              <span class="name">{{ detailList.username }}</span>
              <div class="tag" v-if="detailList.product_name">
                {{ detailList.product_name }}
              </div>
            </div>
            <div class="manDetail">
              <div>
                {{ detailList.username_pinyin?.family_name
                }}{{ detailList.username_pinyin?.given_name }}
              </div>
              <div>{{ detailList.country?.split('-')[0] }}</div>
              <div style="word-break: break-all">
                {{ $t('message.liveCountry') }}:
                {{
                  `${detailList.live_country?.area?.join('') ?? ''}${
                    detailList.live_country?.details ?? ''
                  }`
                }}
              </div>
              <div>
                {{ $t('message.allCount') }}: {{ detailList.all_count }}人
              </div>
              <div>
                {{ $t('message.orderNumber') }}: {{ detailList.order_number }}
              </div>
            </div>
          </div>
        </div>
        <div class="appointmentDetail">
          <div class="title">
            <div class="titleLeft">
              <span class="cardTitle">{{
                $t('message.certificateAppointment')
              }}</span>
              <span
                :class="['tag', taskStatusMap[detailList.task_status]?.class]"
                >{{ taskStatusMap[detailList.task_status]?.value }}</span
              >
            </div>
            <div
              class="proof"
              :class="[
                'proof',
                detailList.receipts?.length < 1 ? 'disable' : ''
              ]"
              @click="proofImage"
            >
              {{ $t('message.proof') }}
            </div>
          </div>
          <div>
            <div class="mb-32 item">
              <div class="label">{{ $t('message.reserve') }}:</div>
              <div class="value">{{ detailList.reserve_count }}人</div>
            </div>
            <div class="mb-32 item">
              <div class="label">{{ $t('message.immigrationOffice') }}:</div>
              <div class="value">{{ detailList.immigration_office }}</div>
            </div>
            <div class="item">
              <div class="label">{{ $t('message.goTime') }}:</div>
              <div class="value">{{ detailList.go_time }}</div>
            </div>
          </div>
        </div>
      </div>
      <van-tabs class="vanTab" v-model:active="active">
        <van-tab :title="$t('message.orderDetail')"></van-tab>
        <van-tab :title="$t('message.familyDeatil')"></van-tab>
        <van-tab :title="$t('message.customsClearanceDocument')"></van-tab>
        <van-tab :title="$t('message.clientTag')"> </van-tab>
      </van-tabs>
      <div class="component">
        <OrderDetail v-show="active === 0" :detailList="detailList" />
        <FamilyDetail v-show="active === 1" :detailList="detailList" />
        <PaasCertificate v-show="active === 2" :detailList="detailList" />
        <ClientTag v-show="active === 3" :detailList="detailList" />
      </div>
    </div>
  </div>
</template>

<script setup name="detail">
import Tag from '@/components/tag/tag.vue'
import ClientTag from './component/clientTag.vue'
import FamilyDetail from './component/familyDetail.vue'
import OrderDetail from './component/orderDetail.vue'
import PaasCertificate from './component/paasCertificate.vue'
import { getOssConfig } from '@/api/daily_affairs/index'
import dayjs from 'dayjs'
import { previewOss } from '@/api/common/index'
import { showImagePreview } from 'vant'
const active = ref(0)
const detailList = reactive({})
const route = useRoute()
const { t, locale } = useI18n()
const taskStatusMap = {
  0: {
    class: 'tag-orange',
    value: t('message.waitDistributed')
  },
  1: {
    class: 'tag-yellow',
    value: t('message.waitProcessed')
  },
  2: {
    class: 'tag-primary',
    value: t('message.processed')
  },
  3: {
    class: 'tag-success',
    value: t('message.licensed')
  }
}
const componentsName = computed(() => {
  if (active.value === 0) {
    return OrderDetail
  } else if (active.value === 1) {
    return FamilyDetail
  } else if (active.value === 2) {
    return PaasCertificate
  } else if (active.value === 3) {
    return ClientTag
  }
})
const headImage = ref(new URL(`@/assets/defaultimage.png`, import.meta.url))
const proofImage = async () => {
  const urlArray = await Promise.all(
    detailList.receipts.map(async (item) => {
      const url = await previewOss({ object: item.url })
      return url
    })
  )
  if (urlArray.length < 1) return
  showImagePreview({ images: urlArray })
}
const errorImg = ref(false)
const getList = async () => {
  const { data, code } = await getOssConfig({
    id: route.query.tableId,
    chinese_convert: locale.value === 'HK' ? 1 : 0
  })
  if (code === 200) {
    Object.assign(detailList, data)
    detailList.go_time = dayjs(detailList.go_time).format(
      'YYYY年MM月DD日 HH:mm'
    )
    // 有头像
    if (detailList.head_pic) {
      const url = await previewOss({ object: detailList.head_pic })
      headImage.value = url
      errorImg.value = true
    } else {
      // 没头像展示默认图
      errorImg.value = false
    }
  }
}
const defaultImg = new URL(`@/assets/defaultimage.png`, import.meta.url)
// 加载失败展示默认图
const setDefaultImage = () => {
  errorImg.value = false
}
provide('getList', getList)
onMounted(async () => {
  await getList()
  active.value = route.query.isActive === 'clientTag' ? 3 : 0
})
</script>

<style lang="scss" scoped>
.detailPage {
  min-height: 100vh;
  font-size: 28px;
  background-color: #fff;

  .mb-32 {
    margin-bottom: 32px;
  }

  .content {
    padding: 42px;
    .top {
      background: #fff;
      margin: -42px;
      padding: 42px;
    }
  }

  .cardTitle {
    color: #222;
    font-size: 32px;
    font-weight: 500;
  }

  .peopleDetail {
    display: flex;
    align-items: center;
    img {
      display: inline-block;
      width: 171px;
      height: 239px;
      margin-right: 52px;
      border-radius: 16px;
      border: 1px solid #f3f4f5;
    }

    .nameTitle {
      display: flex;
      align-items: center;
      word-break: break-all;
      .name {
        font-size: 38px;
        font-weight: 500;
        color: #222;
        margin-right: 18px;
      }

      .tag {
        flex-shrink: 0;
        // width: 88px;
        padding: 4px 8px;
        color: #198cff;
        border-radius: 8px;
        font-size: 20px;
        font-weight: 600;
        border: 1px solid #198cff;
      }
    }

    .manDetail {
      color: #888f98;
      font-size: 24px;
    }
  }

  .appointmentDetail {
    margin-top: 42px;
    width: 100%;
    border-radius: 24px;
    background: #f8f9fb;
    padding: 32px;

    .titleLeft {
      display: flex;
      align-items: center;
    }

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      border-bottom: 1px solid rgba(136, 143, 152, 0.1);
      padding-bottom: 24px;

      .tag {
        margin-left: 12px;
        font-size: 22px;
        font-weight: 500;
        border-radius: 8px;
        padding: 4px 8px;
      }

      .tag-yellow {
        color: #ffb321;
        background: rgba(255, 179, 33, 0.08);
      }

      .tag-orange {
        background-color: rgba(255, 92, 0, 0.08);
        color: #ff5c00;
      }

      .tag-primary {
        background-color: rgba(25, 140, 255, 0.08);
        color: #198cff;
      }

      .tag-success {
        background-color: rgba(62, 205, 195, 0.08);
        color: #3ecdc3;
      }
    }

    .item {
      display: flex;
      color: #222222;
      align-items: center;
      justify-content: space-between;
      font-size: 28px;
    }

    .proof {
      color: #198cff;
      cursor: pointer;
      font-size: 28px;
      font-weight: 500;
    }
  }

  .component {
    background-color: #f8f8f8;
    margin: 0 -42px -42px -42px;
    padding: 42px;
  }
  .disable {
    color: #888f98 !important;
    cursor: no-drop !important;
  }
  .vanTab {
    margin: 20px -42px 0;
    padding: 0 42px;
    background-color: #fff;
    :deep(.van-tab--active) {
      font-weight: 600 !important;
    }
  }
}
</style>
