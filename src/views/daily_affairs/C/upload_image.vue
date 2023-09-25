<script setup lang="ts">
import AliyunOssService from '@/utils/ali-oss'
import { previewOss } from '@/api/common/index'
let ossService = null
// 初始化oss
const initOss = async () => {
    ossService = await AliyunOssService.createFromBackend()
}
onMounted(async () => {
    await initOss()
})
const fileList = ref('')
// 移除图片
const removeImage = () => {
    console.log(fileList.value, 'removeImage------------------------>')
    fileList.value = ''
}

const uploadImage = () => {
    console.log('uploadImage------------------------>')
}
// 上传之后的回调
const afteruploader = async (file: any) => {
    // const { url }: imageInfo = await ossService.uploadFile(file.file)
    console.log(file, previewOss, 'afteruploader------------------------>');
    fileList.value = file.objectUrl
}
</script>
<template>
    <van-uploader :after-read="afteruploader" :show-upload="false">
    <!-- <van-button icon="plus" type="primary">上传文件</van-button> -->
        <div class="upload_image flex-center-center">
            <i class="iconfont icon-Subtract1" @click="removeImage" v-if="fileList"></i>
            <img :src="fileList" alt="" srcset="" v-if="fileList" class="image">
            <i class="iconfont icon-icon_tianjia" v-else></i>
        </div>
    </van-uploader>
</template>

<style lang="scss" scoped>
    .upload_image {
        background: #f8f9fb;
        height: 128px;
        border: 1px dashed #eff0f2;
        border-radius: 24px;
        margin-right: 24px;
        width: 204px;
        position: relative;
        .iconfont {
            font-size: 32px;
        }
        .icon-Subtract1 {
            position: absolute;
            right: -16px;
            top: -24px;
            z-index: 99;
        }
        .image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 24px;
        }
    }
</style>