<!--
 * @Author: Autumn.again
 * @Date: 2023-09-27 09:25:43
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-10-08 17:15:42
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\list\daily_affairs.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script setup name="daily_affairs" lang="tsx">
import PendingList from "./C/pending_list.vue";
import WorkerPopup from "./C/worker_popup.vue";
import ExportPopup from "./C/export_popup.vue";
import weekCalender from "./C/week_calender.vue";
import SearchForm from "./C/searchForm.vue";
import { useUserStore } from "@/stores/modules/user";
import {
  getTransactionTaskList,
  getTransactionUserList,
  getRole,
} from "@/api/daily_affairs";
import { showToast } from "vant";
import dayjs from "dayjs";

const { t, locale } = useI18n();
const router = useRouter();
const { setWorkmateList } = useUserStore() as any;
const isMaster = ref(false);
const showWeek_Candeler = ref(true);
// 定义搜索参数
const filterData: filter_params = reactive({
  customer_name: "",
  user_id: "", // 香港同事
  address: "", // 地点
  task_status: "", // 状态:0待分配,1待办理,2已办理,3已领证
  start_time: "", // 开始
  end_time: "", // 结束
  is_convert: 1, // 是否转换数据格式为按天统计：1转换,0不转换
  chinese_convert: 1,
  hideWeekCandeler: 0, // 是否隐藏日历
});
const chooseDate = ref("");
// 展开
const showBottom = ref(false);
const showAction = ref(false);
// 展示导出选择框
const showExprot = ref(false);

const workmateList = ref([]);
const listData = ref([]);
// const date = ref([])
const date = ref("");
onMounted(async () => {
  const { data } = await getRole();
  isMaster.value = data === "hk_transaction_master";
  const res = (await getTransactionUserList()) as any;
  setWorkmateList(res.data);
  workmateList.value = [
    {
      id: "",
      wework_name: "全部",
    },
    ...res.data,
  ];
});

// 记住位置
const yScroll = ref(null)
let scrollTop = ''
onActivated(() => {
    yScroll.value.scrollTop = scrollTop || 0
})
onBeforeRouteLeave((to, from, next) => {
    scrollTop = yScroll.value.scrollTop
    next()
})


// 点击搜索
const searchClick = (value?: string | number) => {
  if (value) {
    showBottom.value = !showBottom.value;
  } else {
    router.push("/daily_affairs/serch_list");
  }
};
const active = ref("0");

// 简体中英文繁体字切换
const changeLang = () => {
  locale.value = locale.value === "HK" ? "ZH" : "HK";
  filterData.chinese_convert = locale.value === "HK" ? 1 : 0;
  getTransactionList(1);
};

const higLight = () => {
  const { customer_name, user_id, address, task_status, hideWeekCandeler } =
    filterData;
  return (
    !!customer_name ||
    !!user_id ||
    !!address ||
    task_status !== "" ||
    hideWeekCandeler
  );
};

let cacheList = {}; // 缓存数据
// 更新时间范围
function updateTimeRange(timeRange) {
  filterData.start_time = timeRange.start_time;
  filterData.end_time = timeRange.end_time;
  clearCache();
}

// 因为列表是根据搜索条件展示，而缓存又是根据时间缓存，当除了时间以外的参数变化时，需要清除缓存
function clearCache() {
  cacheList = {};
}

// 监听数值变化就调用接口
const getTransactionList = async (clear) => {
  clear && clearCache();
  if (cacheList[chooseDate.value] && showWeek_Candeler.value) {
    // 只有没有在弹出层理筛选时间才走缓存
    listData.value = cacheList[chooseDate.value];
  } else {
    const res = await getTransactionTaskList(filterData);
    let i = filterData.start_time;
    while (dayjs(i).isBefore(dayjs(filterData.end_time)) || dayjs(i).isSame(filterData.end_time)) {
      cacheList[i] = res.data?.[i] ?? [];
      i = dayjs(i).add(1, "day").format("YYYY-MM-DD");
    }
    listData.value = !showWeek_Candeler.value
      ? res.data
      : cacheList[chooseDate.value];
  }
};

function updateDate(val) {
  chooseDate.value = val;
  getTransactionList();
}

const click_action = (type?: number) => {
  switch (type) {
    case 0:
    case 1:
      searchClick(type);
      break;
    default:
      showAction.value = true;
      break;
  }
};
const localeText = computed(() =>
  locale.value === "HK" ? t("message.hk_batch_check") : t("message.batch_check")
);
// 批量操作控制
const canBatchAction = ref(false);
const action_content = computed(function () {
  return [
    {
      label: t("message.batch_set"),
      value: 0,
    },
    {
      label: localeText.value,
      value: 1,
    },
    {
      label: t("message.batch_export"),
      value: 2,
    },
    {
      label: "取消",
      value: 3,
    },
  ];
});
const handler_action = (index?: number) => {
  switch (index) {
    case 0:
      if (listData.value.length) {
        canBatchAction.value = true;
      } else {
        showToast(t("message.not_batch_check_data"));
      }
      break;
    case 1:
      changeLang();
      break;
    case 2:
      showExprot.value = true;
      break;
    default:
      break;
  }
  showAction.value = false;
};

// 切换table栏
const onClickTab = (res: any) => {
  const { name } = res;
  filterData.user_id = workmateList.value[name].id;
  getTransactionList(1);
};

provide("getTransactionList", getTransactionList);

const showWorker = ref(false);

const AllotIds = ref([]);
// 确认分配
const batchAllotClick = () => {
  AllotIds.value = [];
  const arr = JSON.parse(JSON.stringify(listData.value));
  arr.map((item) => {
    if (item.checked) {
      AllotIds.value.push(item.id);
    }
  });
  if (!AllotIds.value.length) {
    showToast(t("message.not_batch_set_data"));
    return false;
  }
  showWorker.value = true;
};

const weekCalenderRef = ref(null);
function showWeekCandeler(val) {
  showWeek_Candeler.value = val;
  if (!val) {
    getTransactionList(1);
  } else {
    nextTick(() => {
      weekCalenderRef.value.backToday(1);
    });
  }
  showBottom.value = false;
}
</script>

<template>
  <div class="daily x-flex" :class="{ suspend: canBatchAction }">
    <div class="flex sticky" >
      <van-tabs
        v-model:active="active"
        class="tables"
        :class="{ hiddenTab: !isMaster }"
        @click-tab="onClickTab"
      >
        <van-tab
          :title="item.wework_name || '-'"
          v-for="(item, index) in workmateList"
          :key="index"
          class="table_items"
        >
        </van-tab>
      </van-tabs>
      <div class="title_action" v-if="isMaster">
        <i class="iconfont icon-icon_sousuo" @click="searchClick()"></i>
        <i
          class="iconfont icon-icon_luodou"
          @click="searchClick('fliter')"
          :class="{ highLight: higLight() }"
        ></i>
      </div>
    </div>
    <div class="y-scroll" ref="yScroll">
      <weekCalender
        @updateDate="updateDate"
        :role_key="isMaster"
        :highLight="higLight()"
        :language="locale"
        @click_action="click_action"
        @updateTimeRange="updateTimeRange"
        ref="weekCalenderRef"
        v-if="showWeek_Candeler"
      />
      <template v-if="!showWeek_Candeler">
        <div v-for="(item, index) in Object.keys(listData)" :key="index">
          <div class="listData_title" :class="{'mt-20': index === 0}">
            {{ item }}
          </div>
          <PendingList
            :listData="listData[item]"
            :canBatchAction="canBatchAction"
            :role_key="isMaster"
          />
        </div>
        <div
          v-if="!Object.keys(listData).length"
          class="not_data flex-center-center"
        >
          暂无搜索数据
        </div>
      </template>
      <template v-else>
        <PendingList
          :listData="listData"
          :canBatchAction="canBatchAction"
          :role_key="isMaster"
        />
      </template>
    </div>
    <div
      class="batch_buttones flex-jusify-between d-flex"
      v-if="canBatchAction"
    >
      <div class="flex-center-center" @click="canBatchAction = false">取消</div>
      <div class="flex-center-center" @click="batchAllotClick">分配</div>
    </div>
    <van-popup
      v-model:show="showBottom"
      round
      position="bottom"
      :style="{ maxHeight: '80%', minHeight: '30%' }"
      close-icon="close"
      closeable
    >
      <SearchForm
        v-model:filterData="filterData"
        :role_key="isMaster"
        @getTransactionList="getTransactionList"
        @showWeekCandeler="showWeekCandeler"
      />
    </van-popup>
    <van-popup
      v-model:show="showAction"
      round
      position="bottom"
      :style="{ maxHeight: '80%', minHeight: '30%' }"
      close-icon="close"
      closeable
    >
      <div class="actiones">
        <div class="actiones_title fw-500">更多操作</div>
        <div
          v-for="(item, index) in isMaster
            ? action_content
            : action_content.slice(1)"
          :key="index"
          class="actiones_button"
          @click="handler_action(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
    </van-popup>
    <WorkerPopup
      v-model:showWorker="showWorker"
      :formData="null"
      :ids="AllotIds"
    />
    <ExportPopup v-model:showExprot="showExprot" />
  </div>
</template>

<style lang="scss" scoped>
.y-scroll {
  flex: 1;
  height: 0;
//   overflow-y: auto;
}
.x-flex {
  display: flex;
  flex-direction: column;
}
.daily {
  position: relative;
  font-size: 28px;
  min-height: 100%;
  background: #f8f8f8;
}
.sticky {
    position: sticky;
    top: 0;
    z-index: 9999;
    background: #fff;
}
.flex {
  display: flex;
  align-items: center;
}
.title_action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 165px;
  height: 88px;
  background: #fff;
  padding: 0 32px 0 22px;
  border-bottom: 1px solid #f0f0f0;
  .iconfont {
    font-size: 42px;
  }
  .highLight {
    color: #198cff;
  }
  // background: linear-gradient(to right, transparent 0%, #fff 25%);
  // background: linear-gradient(270deg, #FFF 0%, #FFF 81.31%, rgba(255, 255, 255, 0.00) 100%);
}
.tables {
  flex: 1;
  width: 0;
  :deep(.van-tabs__content) {
    flex: 1;
  }
  :deep(.van-tab__text) {
    font-size: 34px;
    color: #888f98;
    flex: 1;
  }
  :deep(.van-tab--active) {
    .van-tab__text {
      color: #198cff;
      font-weight: 600;
    }
  }
  :deep(.van-tabs__line) {
    width: 34px;
  }
}
:deep(.van-tabs__nav--complete) {
  padding-left: 0;
}
.actiones {
  padding: 32px 42px 0;
  &_title {
    font-size: 34px;
    padding-bottom: 32px;
  }
  &_button {
    color: #222222;
    height: 104px;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #f0f0f0;
    &:last-of-type {
      color: #909090;
    }
  }
}
.mt-32 {
  margin-top: 32px
}
.hiddenTab {
  // 通过class样式隐藏tab栏
  :deep(.van-tabs__wrap) {
    display: none;
  }
}
.listData_title {
  color: #888f98;
  padding-left: 40px;
}

.not_data {
  font-size: 28px;
  padding-top: 50px;
  color: #999;
}
// 批量操作的之后中止其他操作
.suspend {
  :deep(.van-tabs__wrap)::before,
  :deep(.calender)::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    z-index: 999;
  }
}
:deep(.van-tabs__wrap),
:deep(.calender) {
  position: relative;
}
:deep(.van-tabs__wrap) {
  border-bottom: 1px solid #f0f0f0;
}
.batch_buttones {
  height: 128px;
  color: #222;
  font-size: 32px;
  font-weight: 500;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 0 32px;
  width: 100%;
  div {
    height: 96px;
    width: 330px;
    border-radius: 16px;
    background: #f8f9fc;
    &:last-of-type {
      background-color: #198cff;
      color: #fff;
    }
  }
}
</style>
