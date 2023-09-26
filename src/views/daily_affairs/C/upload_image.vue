<script setup lang="ts">
import { previewOss } from '@/api/common/index'
const props = defineProps({
    ossService: Object,
    resData: Object,
    fn: Function,
    id: Number,
});
const fileList = ref('')
// 移除图片
const removeImage = () => {
    fileList.value = ''
}
// 预览图片
const previewImage = async (url: string, save?: Boolean) => {
    await previewOss({ object: url }).then((res: any) => {
        fileList.value = res
        if (save) {
            return false
        }
        const { cert_type, user_name, user_id } = JSON.parse(JSON.stringify(props.resData))
        const params = {
            id: props.id,
            user_id,
            user_name,
            cert_type,
            url,
            is_agent: 1
        }
        props.fn(params).then((rel: any) => {
            console.log(rel, 'fn----------------->');
        })
    })
}
// 上传之后的回调
const afteruploader = async (file: any) => {
    const { url }: imageInfo = await props.ossService.uploadFile(file)
    // const res = await previewOss({ object: url })
    previewImage(url)
}

onMounted(() => {
    if (props.resData.cert_url) {
        previewImage(props.resData.cert_url, true)
    }
})
</script>
<template>
    <van-uploader :after-read="afteruploader" :show-upload="false" :disabled="!props.resData.is_current_batch"> 
    <!-- <van-button icon="plus" type="primary">上传文件</van-button> -->
        <div class="upload_image flex-center-center">
            <template v-if="props.resData.is_current_batch">
                <i class="iconfont icon-Subtract1" @click="removeImage" v-if="fileList"></i>
                <img :src="fileList" alt="" srcset="" v-if="fileList" class="image">
                <i class="iconfont icon-icon_tianjia" v-else></i>
            </template>
            <template v-else>
                <div class="not_bacth">
                    该获批者不在本批次当中
                </div>
            </template>
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
    .not_bacth {
        color: rgba(136, 143, 152, 0.50);
        font-size: 22px;
        font-weight: 400;
        padding: 0 18px;
    }
</style>