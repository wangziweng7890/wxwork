<template>
  <div class="historyDemand">
    <div class="row" v-for="(item, index) in arr" :key="index">
      <div class="line">
        <img class="Group" src="@/assets/Group.svg" alt="" />
        <img class="lineClass" v-if="index!== arr.length-1" src="@/assets/line.svg" alt="" />
      </div>
      <div class="content">
        <div class="title">
          <div class="time">2023.09.13 10:24:41</div>
          香港员工 <span class="people">Daisy-菜婉碧</span> 添加了：
        </div>
        <div class="demand">
          一家几口将要去香港居住，后期要给孩子申请学校上学，另外还稳了租房和菲佣的问题
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
const arr=[0,1,222,2,2,2,2]
</script>

<style lang="scss" scoped>
.historyDemand {
  .row {
    display: flex;
    .line {
    //   display: flex;
    //   flex-direction: column;
    //   align-items: center;
    //   justify-content: center;
      .Group {
        width: 16px;
        height: 16px;
      }
      .lineClass {
        position: relative;
        left: 6px;
        height: 200px;
      }
    }
    .content {
        margin-left: 28px;
      .title {
        display: flex;
        align-items: center;
        color: #222;
        font-size: 24px;
        margin-bottom: 26px;
        .time {
          color: #888f98;
        }
        .people {
          font-weight: 500;
        }
      }
      .demand{
        padding: 24px;border-radius: 12px; background: #F8F9FB;color: #222;


      }
    }
  }
}
</style>
