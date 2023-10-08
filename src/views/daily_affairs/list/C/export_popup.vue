<script lang="ts" setup>
import { exportData } from '@/api/daily_affairs'
import * as wx from '@wecom/jssdk'
import CalendarPopup from './calender_popup.vue'
const {t, locale} = useI18n()
const props = defineProps({
    showExprot: Boolean,
});
const emit = defineEmits(['update:showExprot'])
const _visible = computed({
    get: () => props.showExprot,
    set: value => {
        emit('update:showExprot', value)
    },
})
const formData: exportForm = reactive({
    task_status: [],
    go_time: [],
    immigration_office: [],
    convert_rule: ''
})
// 展开弹窗
const showPicker = ref(false)

// 弹窗类型
const Picker_type = ref(null)
// 状态文本
const task_status_text = ref('')
// 地点文本
const address_text = ref('')

const clickPicker = (type: number) => {
    Picker_type.value = type
    // if (!type) {
    //     showCalendar.value = true
    //     return false
    // }
    switch (type) {
        case 1:
            list.value = [
                {
                    label: t('message.address_1'),
                    value: ''
                },
                {
                    label: t('message.address_2'),
                    value: '港岛办事处(湾仔)'
                },
                {
                    label: t('message.address_3'),
                    value: '火炭办事处(火炭)'
                },
                {
                    label: t('message.address_4'),
                    value: '屯门办事处(屯门)'
                },
                {
                    label: t('message.address_5'),
                    value: '元朗办事处(元朗)'
                },
                {
                    label: t('message.address_6'),
                    value: '九龙办事处(长沙湾)'
                },
                {
                    label: t('message.address_7'),
                    value: '观塘办事处(观塘)'
                },
            ]
            checked.value = address_text.value.split('、')
            break;
        case 2:
            list.value = [
                {
                    label: t('message.waitDistributed'),
                    value: 0,
                },
                {
                    label: t('message.waitProcessed'),
                    value: 1,
                    color: '#FFB321',
                },
                {
                    label: t('message.processed'),
                    value: 2,
                },
                {
                    label: t('message.licensed'),
                    value: 3,
                },
            ]
            checked.value = task_status_text.value.split('、')
            break;
        default:
            break;
    }
    showPicker.value = true
}

const checked = ref([])
const list = ref([])
const checkboxRefs = ref([])
const toggle = (index) => {
    checkboxRefs.value[index].toggle();
};

onBeforeUpdate(() => {
    checkboxRefs.value = [];
});
// 确定选中
const confirmContent = () => {
    const arr = JSON.parse(JSON.stringify(checked.value))
    const neArr = arr.filter((res) => {
        return res
    })
    if (Picker_type.value === 1) {
        const address_list = []
        neArr.map((res: any) => {
            const canpush = list.value.find(item => item.label === res)
            if (canpush.value) {
                address_list.push(canpush.value)
            }
        })
        formData.immigration_office = address_list
        address_text.value = neArr.join('、')
    } else {
        const ids = []
        neArr.map((res: any) => {
            const canpush = list.value.find(item => item.label === res)
            if (canpush) {
                ids.push(canpush.value)
            }
        })
        formData.task_status = ids
        task_status_text.value = neArr.join('、')
    }
    showPicker.value = false
    checked.value = []
}
// 确认导出
const clickExportData = () => {
    // wx.shareAppMessage({
    //     title: '企业微信',
    //     desc: '让每个企业都有自己的微信',
    //     link: 'https://work.weixin.qq.com/',
    //     imgUrl: 'https://res.mail.qq.com/node/ww/wwmng/style/images/index_share_logo$13c64306.png',
    // })
    const params = JSON.parse(JSON.stringify(formData)) as any
    params.convert_rule = locale.value === 'HK' ? 's2t' : 't2s'
    exportData(params).then((res: any) => {
        if (res.code === 200) {
            wx.shareAppMessage({
                title: '香港日常事务协同',
                desc: 'excel表格',
                link: res.data.file_url,
                imgUrl: '',
            })
        }
    })
}

</script>

<template>
    <van-popup
        v-model:show="_visible"
        position="bottom"
        :style="{ minHeight: '30%', maxHeight: '80%' }"
        closeable
        close-icon="close"
        round
    >
        <div class="actiones">
            <div class="actiones_title">
                <div class="actioes_border">
                    {{t('message.batch_export')}}
                </div>
            </div>
            <div class="actioner_action">
                <CalendarPopup v-model:form-data="formData" :type="'go_time'"/>
                <van-field
                    v-model="address_text"
                    is-link
                    readonly
                    :label="t('message.address')"
                    :placeholder="t('message.not_checked')"
                    @click="clickPicker(1)"
                    />
                <van-field
                    v-model="task_status_text"
                    is-link
                    readonly
                    :label="t('message.status_text')"
                    :placeholder="t('message.not_checked')"
                    @click="clickPicker(2)"
                    class="no_border"
                    />
                <div class="confirm_buttones">
                    <div class="confirm_bottom flex-center-center" @click="clickExportData">
                        {{t('message.submit')}}
                    </div>
                </div>
            </div>
        </div>
        <van-popup
            v-model:show="showPicker"
            round
            position="bottom"
            :style="{ minHeight: '30%', maxHeight: '80%' }"
        >
            <div class="checked_title d-flex flex-jusify-between">
                <span @click="showPicker = false">
                    取消
                </span>
                <!-- <span>
                    选择时间
                </span> -->
                <span @click="confirmContent">
                    {{t('message.submit')}}
                </span>
            </div>
            <van-checkbox-group v-model="checked">
            <van-cell-group inset>
                <van-cell
                v-for="(item, index) in list"
                clickable
                :key="item.value"
                :title="item.label"
                @click="toggle(index)"
                >
                    <template #right-icon>
                        <van-checkbox
                        :name="item.label"
                        :ref="el => checkboxRefs[index] = el"
                        @click.stop
                        />
                    </template>
                </van-cell>
            </van-cell-group>
            </van-checkbox-group>
        </van-popup>
        <!-- <van-calendar v-model:show="showCalendar" type="range" @confirm="confirmDate" :allow-same-day="true"/> -->
    </van-popup>
</template>

<style lang="scss" scoped>
.actiones {
  padding: 32px 0 0;
  .actioes_border {
    padding-bottom: 32px;
    border-bottom: 1px solid #f0f0f0;
  }
  &_title {
    font-size: 34px;
    padding: 0 42px;
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
  .van-field {
        padding: 25px 42px;
    }
    .actioner_action {
        .no_border{
            &::after {
                border: none;
            }
        }
    }

    .confirm_buttones {
        border-top: 1px solid #f0f0f0;
        margin-top: 80px;
        .confirm_bottom {
            height: 96px;
            border-radius: 16px;
            background: #198CFF;
            font-size: 30px;
            font-weight: 500;
            color: #fff;
            margin: 16px 32px 16px;
        }
    }
}
.checked_title {
    padding: 10px 42px;
    font-size: 34px;
    color: #222;
    span:last-of-type {
        color: #198CFF;
        font-size: 28px;
    }
    span:first-of-type {
        color: #909090;
        font-size: 28px;
    }
}
</style>