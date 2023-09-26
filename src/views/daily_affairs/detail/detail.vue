<template>
  <div class="detailPage">
    <div class="content">
      <div class="peopleDetail">
        <div><img src="@/assets/defaultimage.png" alt="" /></div>
        <div>
          <div class="nameTitle">
            <span class="name">{{ detailList.username }}</span>
            <div class="tag">优才6万</div>
          </div>
          <div class="manDetail">
            <div>
              {{ detailList.username_pinyin?.family_name
              }}{{ detailList.username_pinyin?.given_name }}
            </div>
            <div>{{ detailList.country?.split('-')[0] }}</div>
            <div>现居住: {{ detailList.live_country?.area.join('') }}</div>
            <div>获批人数: {{ detailList.all_count }}人</div>
            <div>订单号: {{ detailList.order_number }}</div>
          </div>
        </div>
      </div>
      <div class="appointmentDetail">
        <div class="title">
          <div class="titleLeft">
            <span class="cardTitle">办证预约</span>
            <span
              :class="['tag', taskStatusMap[detailList.task_status]?.class]"
              >{{ taskStatusMap[detailList.task_status]?.value }}</span
            >
          </div>
          <div
            class="proof"
            :class="['proof', detailList.receipts?.length < 1 ? 'disable' : '']"
            @click="proofImage"
          >
            凭证
          </div>
        </div>
        <div>
          <div class="mb-32 item">
            <div class="label">预约办证:</div>
            <div class="value">{{ detailList.reserve_count }}人</div>
          </div>
          <div class="mb-32 item">
            <div class="label">入境事务处</div>
            <div class="value">{{ detailList.immigration_office }}</div>
          </div>
          <div class="item">
            <div class="label">预约时间:</div>
            <div class="value">{{ detailList.go_time }}</div>
          </div>
        </div>
      </div>
      <van-tabs v-model:active="active">
        <van-tab title="主审人信息"></van-tab>
        <van-tab title="家庭信息"></van-tab>
        <van-tab title="过关证件"></van-tab>
        <van-tab title="客户标签"> </van-tab>
      </van-tabs>
      <div class="component">
        <component :is="componentsName" :detailList="detailList"></component>
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
import { getOssConfig } from '@/api/daily_affairs/detail'
import dayjs from 'dayjs'
import { previewOss } from '@/api/common/index'
import { showImagePreview } from 'vant';
const active = ref(0)
const detailList = reactive({})
const route=useRoute()
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
const taskStatusMap = {
  0: {
    class: 'tag-orange',
    value: '待分配'
  },
  1: {
    class: 'tag-yellow',
    value: '待办理'
  },
  2: {
    class: 'tag-primary',
    value: '已办理'
  },
  3: {
    class: 'tag-success',
    value: '已领证'
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
const proofImage = async () => {
  const urlArray = []
  detailList.receipts.forEach(async item => {
    const url = await previewOss({ object: item })
    urlArray.push(url)
  })
  if (urlArray.length < 1) return
  showImagePreview({ images: urlArray })
}
const getList = async () => {
  const { data, code } = await getOssConfig({ id: route.query.tableId })
  if (code === 200) {
    Object.assign(detailList, data)
    detailList.go_time = dayjs(detailList.go_time).format(
      'YYYY年MM月DD日 HH:mm'
    )
  }
}

provide('getList', getList)
onMounted(async () => {
  getList()
})
</script>

<style lang="scss" scoped>
.detailPage {
  font-size: 28px;

  .mb-32 {
    margin-bottom: 32px;
  }

  .content {
    padding: 42px;
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
      width: 171px;
      height: 239px;
      margin-right: 52px;
    }

    .nameTitle {
      display: flex;
      align-items: center;

      .name {
        font-size: 38px;
        font-weight: 500;
        color: #222;
        margin-right: 18px;
      }

      .tag {
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
}
</style>
