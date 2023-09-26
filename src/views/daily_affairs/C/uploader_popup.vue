<script lang="ts" setup>
import { getTransactionInfo, updateCertificate } from '@/api/daily_affairs'

import AliyunOssService from '@/utils/ali-oss'
import uploadImage from './upload_image.vue'
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
            imageList.value = res.data
        }
    })
}
getInfo()
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
                    <div class="tiile flex-align-items-center d-flex">
                        上传证件
                    </div>
                </div>
                <div class="uploader_content">
                    <div class="replace flex-jusify-between d-flex">
                        <div class="replace_title">
                            是否代领
                        </div>
                        <div class="buttones">

                        </div>
                    </div>
                    <div class="listes" v-for="(item, index) in imageList" :key="index">
                        <div class="title d-flex">
                            <div class="type">{{ filterType(item.type) }}</div>
                            <div class="tips">{{ `(${item.type === 1 ? '办证者' : '获批者'}每人一张)` }}</div>
                        </div>
                        <div class="list">
                            <div class="list_item" v-for="(res, resIndex) in item.data" :key="resIndex">
                                <div class="user_name">
                                    {{ res.user_name }}
                                </div>
                                <uploadImage :ossService="ossService" :resData="res" :fn="updateCertificate" :id="props.id"/>
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
            }
            .tips {
                font-size: 26px;
                margin-left: 9px;
            }
        }
        .list {
            display: flex;
            overflow-x: auto;
            .list_item {
                .upload_image, .user_name {
                    text-align: center;
                }
            }
        }

    }
}
.uploader_content {
    padding: 0 42px;
    flex: 1;
    overflow-y: auto;
}
</style>