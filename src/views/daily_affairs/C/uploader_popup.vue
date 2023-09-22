<script lang="ts" setup>
import uploadImage from './upload_image.vue'
const props = defineProps({
    showUploder: Boolean
});
const emit = defineEmits(['update:showUploder'])
const _visible = computed({
    get: () => props.showUploder,
    set: value => {
        emit('update:showUploder', value)
    },
})
const imageList = ref([
    {
        userList: [
            {
                user_name: '张 1 - 1',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 1 - 2',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 1 - 3',
                image_url: '',
                is_batch: true
            }
        ]
    },
    {
        userList: [
            {
                user_name: '张 2 - 1',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 2 - 2',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 2 - 3',
                image_url: '',
                is_batch: false
            },
        ]
    },
    {
        userList: [
            {
                user_name: '张 3 - 1',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 3 - 2',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 3 - 3',
                image_url: '',
                is_batch: false
            },
        ]
    },
    {
        userList: [
            {
                user_name: '张 4 -1',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 4 -2',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 4 -3',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 4 -5',
                image_url: '',
                is_batch: true
            },
            {
                user_name: '张 4 -5',
                image_url: '',
                is_batch: true
            },
        ]
    },
])
const filterType = (type?: number) => {
    switch(type) {
        case 1:
            return '授权书'
        case 2:
            return '收据'
        case 3:
            return '香港身份证'
        default:
            return '小白条'
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
                <div class="tiile flex-align-items-center d-flex">
                    上传证件
                </div>
                <div class="content">
                    <div class="replace flex-jusify-between d-flex">
                        <div class="replace_title">
                            是否代领
                        </div>
                        <div class="buttones">

                        </div>
                    </div>
                    <div class="listes" v-for="(item, index) in imageList" :key="index">
                        <div class="title d-flex">
                            <div class="type">{{ filterType(index) }}</div>
                            <div class="tips">{{ `(${index ? '办证者' : '获批者'}每人一张)` }}</div>
                        </div>
                        <div class="list">
                            <div class="list_item" v-for="(res, resIndex) in item.userList" :key="resIndex">
                                <div class="user_name">
                                    {{ res.user_name }}
                                </div>
                                <uploadImage />
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
    padding: 0 42px;
    color: #888F98;
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
.content {
    flex: 1;
    overflow-y: auto;
}
</style>