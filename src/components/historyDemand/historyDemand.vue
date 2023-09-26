<template>
  <div class="historyDemand">
    <div class="row" v-for="(item, index) in demand" :key="index">
      <div :class="['line', index === demand.length - 1 ? 'lastChild' : '']">
        <img class="Group" src="@/assets/Group.svg" alt="" />
        <div class="lineClass" v-if="index !== demand.length - 1"></div>
      </div>
      <div class="content">
        <div class="title">
          <span class="time">{{ item.created_at }}</span
          ><span>{{$t('message.hkPeople')}}</span
          ><span class="people">{{ item.user_name }} </span>添加了:
        </div>
        <div class="demand">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  demand: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.historyDemand {
  .row {
    display: flex;
    .line {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 10px;
      .Group {
        width: 16px;
        height: 16px;
      }
      .lineClass {
        width: 1px;
        height: 100%;
        border-left: 2px dashed rgba(25, 140, 255, 0.2);
      }
    }
    .lastChild {
      display: inline-block;
      margin-top: -15px;
    }
    .content {
      margin-left: 28px;
      padding-bottom: 52px;
      .title {
        width: 100%;
        color: #222;
        font-size: 24px;
        margin-bottom: 26px;
        .time {
          color: #888f98;
          margin-right: 14px;
        }
        .people {
          font-weight: 500;
        }
      }
      .demand {
        padding: 24px;
        border-radius: 12px;
        background: #f8f9fb;
        color: #222;
      }
    }
  }
}
</style>
