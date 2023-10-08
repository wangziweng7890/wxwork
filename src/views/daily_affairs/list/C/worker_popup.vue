<!--
 * @Author: Autumn.again
 * @Date: 2023-09-27 13:29:40
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-27 16:45:46
 * @FilePath: \workwexin-h5-sidebar\src\views\daily_affairs\list\C\worker_popup.vue
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
-->
<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/user'
import { PostalloTtask } from '@/api/daily_affairs'
import { showToast } from 'vant';
const {t}=useI18n()

const props = defineProps({
    showWorker: Boolean,
    formData: Object,
    ids: Array,
});
const emit = defineEmits(['update:showWorker', 'update:formData', 'getTransactionList'])
const _visible = computed({
    get: () => props.showWorker,
    set: value => {
        emit('update:showWorker', value)
    },
})
const fliterData = computed({
    get: () => props.formData,
    set: value => {
        emit('update:formData', value)
    },
})

const { workmateList } = useUserStore() as any

const customFieldName = ref({
    text: 'wework_name',
    value: 'id',
})

const user_info = ref(null)
// 是否确认转让任务弹窗
const canTransmit = ref(false)
// popup弹出层确认
const onConfirm = (values) => {
        const { selectedOptions } = values
        // formData.value[picker_type.value] = selectedOptions[0]?.value
        _visible.value = false
        user_info.value = selectedOptions[0]
        if (!!fliterData.value) {
            fliterData.value.user_id = selectedOptions[0]?.id || ''
        } else {
            canTransmit.value = true
        }
}
// 从顶级组件中选出的列表刷新方法
const getTransactionList = inject('getTransactionList') as any
// 确认转任务
const confirm = () => {
    const params ={
        user_id: user_info.value.id,
        ids: props.ids,
    }
    PostalloTtask(params).then((res: any) => {
        if (res.code === 200) {
            showToast('转交任务成功')
            if (getTransactionList) {
                getTransactionList()
            }
        }
    }).finally(()=>{
       canTransmit.value = false
    })
}

</script>
<template>
    <div>
        <van-popup
            v-model:show="_visible"
            position="bottom"
            round
            :confirmButtonext="t('message.confirm_text')"
        >
            <van-picker
                :columns="workmateList"
                @confirm="onConfirm"
                @cancel="_visible = false"
                :columns-field-names="customFieldName"
            >
            <template #title>
                <div class="popup_title">
                    {{ t('message.choose_worker') }}
                </div>
            </template>
            </van-picker>
        </van-popup>
        <van-dialog
            v-model:show="canTransmit"
            title=""
            :show-confirm-button="false"
            class="dialog_worker"
            closeOnClickOverlay
        >
            <div class="title">
                {{ t('message.set_warning_text') }} "{{user_info.wework_name || '-'}}" ？
            </div>
            <div class="buttones d-flex flex-jusify-between">
                <div class="flex-center-center" @click="canTransmit = false">
                    取消
                </div>
                <div class="flex-center-center" @click="confirm">
                   {{ t('message.confirm_text') }}
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<style lang="scss" scoped>
.popup_title {
    font-size: 34px;
}
:deep(.dialog_worker) {
    height: 322px;
    border-radius: 24px;
    background: #FFF;
    padding: 62px 32px 32px;
    font-size: 32px;
    .title {
        padding: 0 12px;
        height: 132px;
    }
    .buttones {
        font-size: 28px;
        font-weight: 500;

        div {
            width: 257px;
            height: 90px;
            border-radius: 16px;
            background: #198CFF;
            color: #fff;
            &:first-of-type {
                background: #fff;
                color: #198CFF;
                border: 2px solid #198CFF;
            }
        }
    }

}
</style>