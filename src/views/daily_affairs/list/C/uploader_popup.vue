<script lang="ts" setup>
import { getTransactionInfo, updateCertificate, updateSaveAgent } from '@/api/daily_affairs'
import AliyunOssService from '@/utils/ali-oss'
import uploadImage from './upload_image.vue'
const {t}=useI18n()

let ossService = null
// 初始化oss
const initOss = async () => {
    ossService = await AliyunOssService.createFromBackend()
}
onMounted(async () => {
    await initOss()
})
const props = defineProps({
    showUploder: Boolean,
    id: Number,
});
// 是否领取
const checked_value = ref(1)

const emit = defineEmits(['update:showUploder'])
const _visible = computed({
    get: () => props.showUploder,
    set: value => {
        emit('update:showUploder', value)
    },
})
const imageList = ref([])
const filterType = (type?: number) => {
    switch(type) {
        case 1:
            return '小白条'
        case 2:
            return '授权书'
        case 3:
            return '收据'
        default:
            return '香港身份证'
    }
}

const getInfo = () =>{
    getTransactionInfo({
        id: props.id
    }).then((res: any) => {
        if (res.code === 200) {
            imageList.value = res.data.data
            checked_value.value = res.data.is_agent
        }
    })
}
getInfo()

// 切换是否待领
const clickType = (value?: number) => {
    if (value === checked_value.value) {
        return false
    } else {
        updateSaveAgent({
            is_agent: value,
            id: props.id
        }).then((res: any) => {
            res.code=== 200 && (checked_value.value = value)
        })
    }
}
</script>
<template>
    <div class="visa">
        <!-- 圆角弹窗（底部） -->
        <van-popup
            v-model:show="_visible"
            round
            position="bottom"
            :style="{ height: '80%' }"
            closeable
            close-icon="close"
        >
            <div class="uploader flex-direction-column">
                <div class="titles">
                    <div class="tiile flex-align-items-center d-flex fw-500">
                        {{ t('message.upload_visa_text') }}
                    </div>
                </div>
                <div class="uploader_content">
                    <div class="replace flex-jusify-between d-flex">
                        <div class="replace_title">
                            {{ t('message.get_visa_text') }}
                        </div>
                        <div class="buttones d-flex">
                            <div class="flex-center-center" :class="checked_value === 1 ? 'checked' : ''" @click="clickType(1)"> 是 </div>
                            <div class="flex-center-center" :class="checked_value === 2 ? 'checked' : ''" @click="clickType(2)"> 否 </div>
                        </div>
                    </div>
                    <div class="listes" v-for="(item, index) in (checked_value === 1 ? imageList : imageList.slice(0, 1))" :key="index">
                        <div class="title d-flex">
                            <div class="type">{{ filterType(item.type) }}</div>
                            <div class="tips">{{ `(${item.type === 1 ? t('message.getBatcher') : t('message.getVisaer')}每个人一${item.type === 1 ? '张' : '封'})` }}</div>
                        </div>
                        <div class="list">
                            <div class="list_item" v-for="(res, resIndex) in item.data" :key="resIndex">
                                <div class="user_name">
                                    {{ res.user_name }}
                                </div>
                                <uploadImage :ossService="ossService" :resData="res" :type="item.type" :fn="updateCertificate" :id="props.id"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<style lang="scss">
.uploader {
    color: #888F98;
    .titles {
        padding: 0 42px;
    }
    .tiile {
        font-size: 34px;
        height: 110px;
        color: #222;
        border-bottom: 1px solid #F0F0F0;
    }
    .replace {
        height: 128px;
        margin-bottom: 24px;
        color: #4E4E4E;
        &_title {
            font-size: 30px;
        }
        .buttones {
            div {
                width: 138px;
                height: 64px;
                flex-shrink: 0;
                border-radius: 41px;
                font-size: 26px;
                background: #F8F9FB;
                margin-left: 16px;
            }
            .checked {
                color: #4487F9;
                border-radius: 54px;
                border: 2px solid #4487F9;
                background: rgba(68, 135, 249, 0.08);
            }
        }
    }
    .listes {
        border-bottom: 1px solid #F0F0F0;
        margin-bottom: 42px;
        padding-bottom: 42px;
        .title {
            height: 45px;
            margin-bottom: 42px;
            .type {
              color: #222222; 
              font-size: 32px; 
              line-height: 42px;
              font-weight: 500;
            }
            .tips {
                font-size: 26px;
                margin-left: 9px;
            }
        }
        .list {
            display: flex;
            flex-wrap: wrap;
            gap: 22px;
            .list_item {
                .upload_image, .user_name {
                    text-align: center;
                }
            }
        }
        &:last-of-type {
            border-bottom: none;
        }
    }
}
.uploader_content {
    padding: 0 42px;
    flex: 1;
    overflow-y: auto;
}
</style>