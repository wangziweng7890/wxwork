<script setup lang="ts">
import { previewOss } from '@/api/common/index'
import { getRecognition } from '@/api/daily_affairs/index'
import { showImagePreview } from 'vant'
import { uploadFile } from '@/utils/crm-oss'
import { showToast } from 'vant'
import { log } from '@/log'

const props = defineProps({
  ossService: Object,
  resData: Object,
  fn: Function,
  id: Number,
  type: Number
})
const { t } = useI18n()

const fileList = ref('')

const updateImage = (url: string) => {
  const { cert_type, user_name, user_id } = JSON.parse(
    JSON.stringify(props.resData)
  )
  const params = {
    id: props.id,
    user_id,
    user_name,
    cert_type,
    url
  }
  props.fn(params).then((rel: any) => {
    // 图片上传成功
  })
}
// 预览图片
const previewImage = async (res: string, save?: Boolean) => {
  previewOss({ object: res }).then(async (url) => {
    fileList.value = url
    if (save) {
      return false
    }
    if (props.resData.cert_type === 3) {
      let { data } = await getRecognition({ url: res })
      if (data !== 1) {
        fileList.value = ''
        return showToast({
          message: '无法识别收据,请重新上传',
          icon: 'cross'
        })
      }
    }
    updateImage(res)
  })

  // await previewOss({ object: url }).then((res: any) => {
  //     fileList.value = res
  //     if (save) {
  //         return false
  //     }
  //     updateImage(url)
  // })
}
// 上传之后的回调
const afteruploader = async (file: any) => {
  const timeStart: any = new Date()
  try {
    // const res = await uploadFile(file.file) // 香港网络上传oss客户反馈经常报失败，使用后端代理上传
    const timeEnd: any = new Date()
    const { url }: imageInfo = await uploadFile(file.file) // 用crm上传,否则后端同步到crm中后,crm中会用不了dwp上传的oss
    log(`${timeEnd - timeStart}：size ${file.size}`, 'time-upload')
    previewImage(url)
  } catch (error) {
    log(`上传失败`, 'time-upload')
    throw error
  }
}

onMounted(() => {
  if (props.resData.cert_url) {
    previewImage(props.resData.cert_url, true)
  }
})
// 有图片的时候不需要再次执行上传
const add = () => {
  // return false
  return !fileList.value
}
// 预览文件
const previewFile = () => {
  showImagePreview([fileList.value])
}
// 移除图片
const removeImage = () => {
  fileList.value = ''
  updateImage('')
}
</script>
<template>
  <template v-if="fileList">
    <div class="upload_image flex-center-center">
      <i class="iconfont icon-Subtract1" @click="removeImage"></i>
      <img
        :src="fileList"
        alt=""
        srcset=""
        class="image"
        @click="previewFile"
      />
    </div>
  </template>
  <van-uploader
    :before-read="add"
    :after-read="afteruploader"
    :show-upload="false"
    :disabled="!props.resData.is_current_batch && props.type !== 1"
    v-else
  >
    <!-- <van-button icon="plus" type="primary">上传文件</van-button> -->
    <div class="upload_image flex-center-center">
      <!-- 不是当前批次不展示，小白条例外 -->
      <template v-if="props.resData.is_current_batch || props.type === 1">
        <!-- <i class="iconfont icon-Subtract1" @click="removeImage" v-if="fileList"></i>
                <img :src="fileList" alt="" srcset="" v-if="fileList" class="image"> -->
        <i class="iconfont icon-icon_tianjia"></i>
      </template>
      <template v-else>
        <div class="not_bacth">
          {{ t('message.not_batch_text') }}
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
  border-radius: 12px;
  width: 204px;
  position: relative;
  .iconfont {
    font-size: 32px;
    color: #d7dadd;
  }
  .icon-Subtract1 {
    position: absolute;
    right: -16px;
    top: -24px;
    z-index: 99;
    color: #222;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }
}
.not_bacth {
  color: rgba(136, 143, 152, 0.5);
  font-size: 22px;
  font-weight: 400;
  padding: 0 18px;
}
</style>
