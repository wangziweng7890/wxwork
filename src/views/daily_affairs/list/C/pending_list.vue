<script setup name="pending_list" lang="tsx">
import { showToast } from 'vant'
import uploaderPopup from './uploader_popup.vue'
import Tag from '@/components/tag/tag.vue'
import { saveDemand } from '@/api/daily_affairs'
import WorkerPopup from './worker_popup.vue'
import * as wx from '@wecom/jssdk'

const { t } = useI18n()
// import HistoryDemand from '@/components/historyDemand/historyDemand.vue'
const router = useRouter()
// 获取DOM值
const fold = ref(null)
// 下一天的loading
const next_loading = ref(false)
// 折叠面板
const collArray = ref(['1'])
// 上传详情id
const uploaderId = ref(0)

const props = defineProps<{
  listData: any
  canBatchAction: boolean
  role_key: boolean
}>()

const emit = defineEmits(['update:listData'])
const list = computed({
  get: () => props.listData,
  set: (value) => {
    emit('update:listData', value)
  }
})
// 初始化选中框
const checkboxRefs = ref([])
const showWorker = ref(false)

// 初始化展示历史数据
// const showHistrory = ref(false)
// const demand = ref([])

// 列表参数
const next_date = () => {
  console.log('进行到下一天')
}

// 对话框
const onScroll = () => {
  // next_loading.value = true;
  //正文总高度
  // let scrollHeight= document.getElementsByClassName("pending_list_loadingText")[0].scrollHeight;
  // //元素可见区域高度
  // let offsetHeight= document.documentElement.offsetHeight;
  // //可滚动容器超出当前窗口显示范围的高度
  // let scrollTop = document.documentElement.scrollTop;
  // //避免切换时读取到异常高度
  // if (scrollTop == 0) {
  //     scrollHeight= 10000;
  // }
  // //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现scrollHeight< (offsetHeight+ scrollTop)的情况，严格来讲，是接近底部。
  // console.log(scrollHeight, offsetHeight, scrollTop);
  // if (next_loading.value) {
  //     console.log("加载中~");
  //     if (scrollTop>=scrollHeight - offsetHeight ) {
  //         //此处添加自定义操作
  //         next_loading.value = false;
  //         next_date();
  //     }
  // }
}

//页面加载
onMounted(() => {
  // formData.value.is_convert
  window.addEventListener('scroll', onScroll)
})
//页面卸载
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// 保存或者清除
const submitMessage = (res?: any, index?: number) => {
  if (!res.message) {
    return false
  }
  if (index === undefined) {
    // 提交
    saveDemand({
      content: res.message,
      id: res.id
    }).then((rel: any) => {
      if (rel.code === 200) {
        res.message = ''
        showToast('保存意向需求成功')
      }
    })
  } else {
    // 取消则清空
    res.message = ''
  }
}
const showUploder = ref(false)
// 打开上传组件
const openUploader = (res: any) => {
  uploaderId.value = res.id
  showUploder.value = true
}
// 过滤办证者展示
const fliterUserList = (res: any) => {
  if (!res.length) {
    return '-'
  } else {
    const newArray = res.map((item) => {
      return item.name
    })
    return newArray.join('、')
  }
}
// 过滤时间
const fliterGoTime = (res: any) => {
  // const new_date = new Date(res)
  // const date_time = new_date.getFullYear() + '年' + (new_date.getMonth() + 1) + '月' + new_date.getDay() + '日'
  // const hour_time = (new_date.getHours() < 10  ? '0' + new_date.getHours() : new_date.getHours()) + ':' + (new_date.getMinutes() < 10 ? '0' + new_date.getMinutes() : new_date.getMinutes())
  if (!res) {
    return {
      date_time: '-',
      hour_time: '-'
    }
  }
  const new_date = res.split(' ')
  const dates = new_date[0].split('-')
  const date_time = dates[0] + '年' + dates[1] + '月' + dates[2] + '日'
  const hour_time = new_date[1].slice(0, -3)
  return {
    date_time,
    hour_time
  }
}
// 跳转详情
const linkDetail = (res: any, type?: string) => {
  if (props.canBatchAction) return false
  router.push({
    path: '/daily_affairs/detail',
    query: {
      orderId: res.order_id,
      tableId: res.id,
      isActive: type || ''
    }
  })
}
const transmitUserId = ref(null)
// 转让任务
const transmit = (res: any) => {
  transmitUserId.value = res.id
  showWorker.value = true
}
// 查看历史记录
const viewHistory = (values: any) => {
  linkDetail(values, 'clientTag')
  /*
    // 暂时注释，无需弹窗，需要跳转路由
    getOssConfig({
        // id: values.id
    }).then((res: any) => {
        if (res.code === 200) {
            const {tag_info} = res.data
            if (tag_info && tag_info.demand && tag_info.demand.length) {
                showHistrory.value = true
                demand.value = tag_info.demand
            } else {
                showToast('还未填写');
            }
        }
    }).catch((error: any) => {
    })
    */
}
onBeforeUpdate(() => {
  // checkboxRefs.value = JSON.parse(JSON.stringify(props.listData));
  checkboxRefs.value = []
})
// const check_box_list = computed(() =>{
//     const arr = JSON.parse(JSON.stringify(props.listData))
//     return arr.map(res =>{
//         return false
//     })
// })
// 确认选中复选框
const toggle = (index: number) => {
  if (props.canBatchAction) {
    fold.value.toggleAll(false)
    // check_box_list[index] = !check_box_list[index]
  }
}

watch(
  () => props.canBatchAction,
  (value) => {
    if (value) {
      fold.value.toggleAll(false)
    }
  }
)
const type_list = computed(function () {
  return [
    {
      label: t('message.waitDistributed'),
      value: 0,
      color: '#FF5C00',
      background: 'rgba(255, 92, 0, 0.08)'
    },
    {
      label: t('message.waitProcessed'),
      value: 1,
      color: '#FFB321',
      background: 'rgba(255, 179, 33, 0.08)'
    },
    {
      label: t('message.processed'),
      value: 2,
      color: '#198CFF',
      background: 'rgba(25, 140, 255, 0.08)'
    },
    {
      label: t('message.licensed'),
      value: 3,
      color: '#3ECDC3',
      background: 'rgba(62, 205, 195, 0.08)'
    }
  ]
})
const getTransactionList = inject('getTransactionList') as any
watch(
  () => showUploder.value,
  (value) => {
    // 关闭整个弹窗的时候请求列表接口，刷新状态
    if (!value) {
      getTransactionList(1)
    }
  }
)

// 打开聊天会话
function openChat(id) {
  id &&
    wx
      .openEnterpriseChat({
        userIds: [id]
      })
      .catch((err) => {
        console.log(err)
      })
}
</script>
<template>
  <div class="pending_list" v-if="props.listData && props.listData.length">
    <van-collapse v-model="collArray" class="fold" ref="fold">
      <van-collapse-item
        :name="collIndex + 1"
        v-for="(res, collIndex) in list"
        :key="res.id"
        class="fold_item"
        @click="toggle(collIndex)"
        :class="{ hiddenIcon: canBatchAction }"
      >
        <template #title>
          <div class="title">
            <div class="title_box">
              <div class="title_box_left">
                <div class="time">
                  {{ fliterGoTime(res.go_time).hour_time }}
                </div>
              </div>
              <div class="title_box_name" @click.stop="linkDetail(res)">
                <!-- res.order_information用三元，可能会返回null -->
                {{
                  res.order_information ? res.order_information.username : '-'
                }}
              </div>
              <div>
                {{ t('message.getVisa') }}
              </div>
              <div
                class="title_box_type flex-center-center"
                :style="{
                  background: type_list[res.task_status].background,
                  color: type_list[res.task_status].color
                }"
              >
                <!-- {{ res.visa_type || '-' }} -->
                {{ type_list[res.task_status].label }}
              </div>
            </div>
            <div class="title_manage" >
          <div :class="{ warning: !res.task_user_name }">    接待人：{{ res.task_user_name || t('message.waitDistributed') }}</div>
          <div>{{  t('message.address')}}:{{ res.immigration_office }}</div>
            </div>
            <van-checkbox
              :name="res.id"
              @click.stop="() => {}"
              v-model="res.checked"
              v-if="
                canBatchAction && (!res.task_status || res.task_status === 1)
              "
            />
          </div>
        </template>
        <div class="fold_item_content">
          <div class="block">
            <div class="fold_item_content_message">
              <div class="info">
                <span> {{ t('message.order') }}： </span>
                <div class="info_block">
                  {{
                    res.order_information ? res.order_information.username : '-'
                  }}
                </div>
              </div>
              <div class="info">
                <span> {{ t('message.getVisaer') }}： </span>
                <div class="info_block">
                  <div class="user_list_name">
                    {{ fliterUserList(res.user_list) }}
                  </div>
                  <div class="d-flex">
                    <span v-if="res.break_married" class="break_married"
                      >离婚</span
                    >
                    <span v-if="res.used_name" class="used_name">有曾用名</span>
                    <span v-if="res.have_child"
                      >有{{ res.child_count }}位小孩</span
                    >
                  </div>
                </div>
              </div>
              <div class="info">
                <span> {{ t('message.address') }}： </span>
                <div class="info_block">
                  {{ res.immigration_office }}
                </div>
              </div>
              <div class="info">
                <span> {{ t('message.timer') }}： </span>
                <div class="info_block">
                  {{
                    fliterGoTime(res.go_time).date_time +
                    ' ' +
                    fliterGoTime(res.go_time).hour_time
                  }}
                </div>
              </div>
              <div class="info">
                <span> {{ t('message.manager') }}： </span>
                <div class="info_block">
                  <div class="phone" @click="openChat(res.wework_key)">
                    {{ res.service_name || '-' }}
                    <van-icon
                      v-if="res.wework_key"
                      name="arrow"
                      class="baseline"
                    />
                  </div>
                </div>
              </div>
              <div class="info">
                <span> {{ t('message.managerTel') }}： </span>
                <div class="info_block">
                  <div class="service_phone">
                    <a
                      :href="`tel:${res.service_phone}`"
                      v-if="res.service_phone"
                    >
                      {{ res.service_phone }}
                      <i class="iconfont icon-icon_dianhua"></i
                    ></a>
                  </div>
                </div>
              </div>
              <div
                class="transmit"
                v-if="
                  props.role_key && (!res.task_status || res.task_status === 1)
                "
              >
                <div
                  class="transmit_button flex-center-center"
                  @click="transmit(res)"
                >
                  {{ t('message.setOther') }}
                </div>
              </div>
            </div>
          </div>
          <div class="fold_item_content_servise block">
            {{ t('message.hoper_text') }}：
            <div class="tages">
              <Tag
                :tableId="res.id"
                :clientArray="
                  res.journey_service ? res.journey_service.split(',') : []
                "
                class="Tag"
              ></Tag>
            </div>
          </div>
          <div class="fold_item_content_text block">
            <div class="histroy flex-jusify-between d-flex">
              <span> 意向需求： </span>
              <span @click="viewHistory(res)">
                {{ t('message.history_text') }}
              </span>
            </div>
            <div class="content">
              <van-field
                v-model="res.message"
                rows="3"
                autosize
                label=""
                type="textarea"
                :placeholder="t('message.pleaseRemark')"
              />
              <div class="buttones" :class="{ default: !res.message }">
                <span class="cencel" @click="submitMessage(res, collIndex)">
                  取消
                </span>
                <span class="save" @click="submitMessage(res)"> 保存 </span>
              </div>
            </div>
          </div>
          <div class="fold_item_content_action block">
            {{ t('message.upload_visa_text') }}：
            <div class="upload flex-center-center" @click="openUploader(res)">
              <i class="iconfont icon-btn_upload"></i>
              {{ t('message.goto_upload') }}
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div class="pending_list_loadingText" v-if="next_loading">
      {{ t('message.refresh_text') }}
    </div>
    <uploaderPopup
      v-model:show-uploder="showUploder"
      :id="uploaderId"
      v-if="showUploder"
    />
    <!-- <van-popup
            v-model:show="showHistrory"
            round
            position="bottom"
            :style="{ minHeight: '30%', maxHeight: '80%'}"
            closeable
        >
            <div class="history_demand">
                <HistoryDemand :demand="demand"/>
            </div>
        </van-popup> -->
    <WorkerPopup
      v-model:showWorker="showWorker"
      :formData="null"
      :ids="[transmitUserId]"
    />
  </div>
  <div v-else class="not_data flex-center-center">暂无搜索数据</div>
</template>
<style lang="scss" scoped>
.baseline {
  vertical-align: baseline;
  color: #9b9b9b;
}
.pending_list {
  background: #f8f8f8;
  flex: 1;
  overflow-y: auto;
  .fold {
    &_item {
      margin: 32px;
      border-radius: 20px;
      overflow: hidden;
      :deep(.van-collapse-item__title) {
        padding: 32px;
      }
      .title_box {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        font-size: 32px;
        div {
          margin-right: 16px;
          font-weight: 500;
        }
        &_left {
          display: flex;
          .time {
            // padding-right: 16px;
            margin-right: 0;
            position: relative;
          }
        }
        &_name {
          max-width: 190px;
          color: #198cff;
          position: relative;
          padding: 0 16px;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          white-space: nowrap;
          &::after,
          &::before {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 24px;
            background: #e1e1e1;
          }
          &::before {
            left: 0;
          }
        }
        &_type {
          font-size: 22px;
          padding: 0 8px;
          border-radius: 8px;
          height: 38px;
          // color: #3ECDC3;
          // background: rgba(62, 205, 195, 0.08);
        }
      }
      .title_manage {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 26px;
        color: #888f98;
        padding-right:55px;
      }
      .warning {
        color: #ff5c00;
      }
      :deep(.van-collapse-item__content) {
        padding: 42px 36px;
      }
      &_content {
        color: #222222;
        font-size: 30px;
        .block {
          padding: 42px 0;
          border-bottom: 1px solid #f0f0f0;
          &:last-of-type {
            border-bottom: none;
            padding-bottom: 0;
          }
          &:first-of-type {
            padding-top: 0;
          }
        }
        &_message {
          background: #f8f9fb;
          border-radius: 12px;
          padding: 32px 0;
          font-size: 26px;
          .info {
            padding: 0 28px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 32px;
            span {
              color: #888f98;
            }
            .service_phone {
              color: #198cff;
              a {
                color: #198cff;
                display: flex;
                height: 36px;
                align-items: center;
              }
              .iconfont {
                margin-left: 16px;
                font-size: 36px;
              }
            }

            &_block {
              max-width: 422px;
            }
            .d-flex {
              justify-content: flex-end;
              align-items: center;
              margin-top: 8px;
              span {
                display: block;
                margin-left: 12px;
                border-radius: 6px;
                font-size: 20px;
                height: 33px;
                padding: 0 8px;
                color: #198cff;
                background: rgba(25, 140, 255, 0.08);
              }
              .used_name {
                color: #9060f6;
                background: rgba(144, 96, 246, 0.08);
              }
              .break_married {
                color: #757c86;
                background: rgba(136, 143, 152, 0.08);
              }
            }
            .user_list_name {
              display: flex;
              justify-content: flex-end;
            }
          }
          .transmit {
            border-top: 1px solid #f0f0f0;
            font-size: 26px;
            display: flex;
            justify-content: flex-end;
            padding: 24px 28px 0 0;
            &_button {
              width: 142px;
              height: 60px;
              flex-shrink: 0;
              border-radius: 12px;
              border: 2px solid #198cff;
              color: #198cff;
            }
          }
        }
        &_servise {
          .tages {
            padding-top: 24px;
          }
        }
        &_action {
          .upload {
            margin-top: 24px;
            width: 100%;
            height: 90px;
            color: #4388ff;
            border-radius: 12px;
            border: 1px dashed #4388ff;
            background: #fff;
            font-size: 28px;
            .iconfont {
              font-size: 32px;
              margin-right: 8px;
            }
          }
        }
        &_text {
          .histroy {
            span {
              &:last-of-type {
                font-size: 26px;
                color: #198cff;
              }
            }
          }
          .content {
            margin-top: 24px;
            .van-field {
              background: #f8f9fb;
              border-top-right-radius: 12px;
              border-top-left-radius: 12px;
              padding: 24px 28px;
            }
            border-radius: 12px;
            background: #f8f9fb;
            .buttones {
              padding: 16px 0;
              text-align: right;
              font-size: 24px;
              display: flex;
              justify-content: flex-end;
              span {
                margin-right: 16px;
                width: 112px;
                height: 55px;
                flex-shrink: 0;
                border-radius: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #222222;
              }
              .save {
                background: #198cff;
                color: #fff;
              }
            }
            .default {
              span {
                opacity: 0.3;
                cursor: not-allowed;
              }
            }
          }
        }
      }
    }
    .hiddenIcon {
      :deep(.van-cell__right-icon) {
        display: none;
      }
      .title {
        position: relative;
        .van-checkbox {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          :deep(.van-icon) {
            font-size: 28px;
          }
        }
      }
    }
    &::after {
      border-width: 0;
    }
  }
  &_loadingText {
    text-align: center;
    padding-top: 20px;
  }
}
.not_data {
  font-size: 28px;
  padding-top: 50px;
  color: #999;
}
.history_demand {
  padding: 120px 28px;
}
</style>
