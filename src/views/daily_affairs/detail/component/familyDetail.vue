<template>
  <div>
    <div class="row" v-for="item in data" :key="item.id">
      <div class="familyDetail">
        <div class="title">
          {{ titleMap[item.relation] }}{{ $t('message.detail') }}
        </div>
        <div class="content">
          <div class="item">
            <div class="label">{{ $t('message.name') }}:</div>
            <div class="value">
              <div class="text">
                {{ item.subset_name }} {{ item.subset_name_pinyin?.family_name
                }}{{ item.subset_name_pinyin?.given_name }}
              </div>
              <div class="tag" v-if="item.follow === 1">
                {{ $t('message.follower') }}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="label">{{ $t('message.usedName') }}:</div>
            <div class="value">{{ item.used_name || '- -' }}</div>
          </div>

          <div class="item">
            <div class="label">{{ $t('message.sex') }}:</div>
            <div class="value">
              {{
                item.sex === 1
                  ? $t('message.man')
                  : item.sex === 2
                  ? $t('message.woman')
                  : $t('message.unknown')
              }}
            </div>
          </div>
          <div class="item">
            <div class="label">{{ $t('message.age') }}:</div>
            <div class="value">{{ item.age }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
const props = defineProps({
  detailList: {
    type: Object,
    default: () => ({})
  }
})
const data = computed(() =>
  props.detailList.subset ? props.detailList.subset : {}
)
const titleMap = {
  1: t('message.orderFather'),
  2: t('message.order'),
  3: t('message.mate'),
  4: t('message.child'),
  5: t('message.brothersAndSisters')
}
</script>

<style lang="scss" scoped>
.row {
  margin-bottom: 32px;
}

.familyDetail {
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
    width: 120px;
  }

  .value {
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #222;

    .tag {
      flex-shrink: 0;
      padding: 4px 8px;
      border-radius: 8px;
      background: rgba(25, 140, 255, 0.08);
      color: #198cff;
      font-size: 22px;
      font-weight: 500;
      margin-left: 12px;
    }

    a {
      color: #198cff;
    }
  }

  .copyValue {
    display: flex;
    align-items: center;

    .copyBtn {
      font-size: 20px;
      padding: 4px 16px;
      border-radius: 31px;
      background: #f8f9fb;
      margin-left: 12px;
      cursor: pointer;
    }
  }
}
</style>
