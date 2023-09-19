<template>
  <div class="detailPage">
    <div class="header">
      <div>《</div>
      <div>客户信息</div>
      <div></div>
    </div>
    <div class="peopleDetail">
      <div><img src="" alt="" /></div>
      <div>
        <div>肖建军</div>
        <div>XIAOJIANJUN</div>
        <div>中国</div>
        <div>现居住:</div>
        <div>获批人数:</div>
        <div>订单号:</div>
      </div>
      <div>优才6万</div>
    </div>
    <div class="appointmentDetail">
      <div class="title">
        <div>办证预约 待办理</div>
        <div class="proof">凭证</div>
      </div>
      <div>
        <div>
          <div class="label">预约办证:</div>
          <div class="value"></div>
        </div>
        <div>
          <div class="label">入境事务处</div>
          <div class="value"></div>
        </div>
        <div>
          <div class="label">预约时间:</div>
          <div class="value"></div>
        </div>
      </div>
    </div>
    <van-tabs v-model:active="active">
      <van-tab title="主审人信息"></van-tab>
      <van-tab title="家庭信息"></van-tab>
      <van-tab title="过关证件"></van-tab>
      <van-tab title="客户标签"> </van-tab>
    </van-tabs>
    <component :is="componentsName"></component>
  </div>
</template>

<script setup name="detail">
import { ref } from "vue";
import Tag from "@/components/tag/tag.vue";
import Textarea from "@/components/textarea/textarea.vue";
import ClientTag from "./component/clientTag.vue";
import FamilyDetail from "./component/familyDetail.vue";
import OrderDetail from "./component/orderDetail.vue";
import PaasCertificate from "./component/paasCertificate.vue";
const active = ref(0);
const clientArray = [
  {
    name: "创业",
    id: 1,
  },
  { name: "就业", id: 2 },
  { name: "教育", id: 3 },
  { name: "港宝", id: 4 },
  { name: "创业", id: 5 },
];
const componentsName = computed(() => {
  if (active.value === 0) {
    return OrderDetail;
  } else if (active.value === 1) {
    return FamilyDetail;
  } else if (active.value === 2) {
    return PaasCertificate;
  } else if (active.value === 3) {
    return ClientTag;
  }
});
</script>

<style lang="scss" scoped>
.detailPage {
  .header {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .peopleDetail {}

  .appointmentDetail {
    .title {}

    .proof {}
  }
}
</style>
