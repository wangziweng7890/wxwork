<script setup name="pending_list" lang="tsx">
import uploaderPopup from './uploader_popup.vue'
import { useUserStore } from '@/stores/modules/user'
import Tag from '@/components/tag/tag.vue'
import { saveDemand } from '@/api/daily_affairs/detail'

const router = useRouter()
const { userInfo } = useUserStore() as any
// 获取DOM值
const fold = ref(null)
// 下一天的loading
const next_loading = ref(false)
// 折叠面板
const collArray = ref(['1'])
// 上传详情id
const uploaderId = ref(0)

const props = defineProps<{
    listData: any
}>()
// 列表参数
const next_date = () => {
    console.log('进行到下一天');
    
}
const Demand_message = ref('')
const onScroll = () => {
    // next_loading.value = true;
    //正文总高度
    // let scrollHeight= document.getElementsByClassName("pending_list_loadingText")[0].scrollHeight;
    // //元素可见区域高度
    // let offsetHeight= document.documentElement.offsetHeight;
    // //可滚动容器超出当前窗口显示范围的高度
    // let scrollTop = document.documentElement.scrollTop;
    // //避免切换时读取到异常高度
    // if (scrollTop == 0) {
    //     scrollHeight= 10000;
    // }
    // //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现scrollHeight< (offsetHeight+ scrollTop)的情况，严格来讲，是接近底部。
    // console.log(scrollHeight, offsetHeight, scrollTop);
    // if (next_loading.value) {
    //     console.log("加载中~");
    //     if (scrollTop>=scrollHeight - offsetHeight ) {
    //         //此处添加自定义操作
    //         next_loading.value = false;
    //         next_date();
    //     }
    // }
}
    //页面加载
onMounted(() => {
    window.addEventListener("scroll", onScroll);
})
//页面卸载
onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
})
// 保存或者清除
const submitMessage = (res?: any, index?: number) => {
    if (!Demand_message.value) {
        return false
    }
    if (index === undefined) {
        // 提交
        saveDemand({
            content: Demand_message.value,
            id: res.id
        }).then((res: any) => {
            console.log(res)
        })
    } else {
        // 取消则清空
        Demand_message.value = ''
    }
}
const showUploder = ref(false)
// 打开上传组件
const openUploader = (res: any) => {
    uploaderId.value = res.id
    showUploder.value = true
}
// 过滤办证者展示
const fliterUserList = (res: any) => {
    if (!res.length) {
        return '-'
    } else {
        const newArray = res.map((item) => {
            return item.name
        })
        return newArray.join('、')
    }
}
// 过滤时间
const fliterGoTime = (res: any) => {
    const new_date = new Date(res)
    const date_time = new_date.getFullYear() + '年' + (new_date.getMonth() + 1) + '月' + new_date.getDay() + '日'
    const hour_time = (new_date.getHours() < 10  ? '0' + new_date.getHours() : new_date.getHours()) + ':' + (new_date.getMinutes() < 10 ? '0' + new_date.getMinutes() : new_date.getMinutes())
    return {
        date_time,
        hour_time
    }
}
// 跳转详情
const linkDetail = (res: any) => {
    router.push({
        path: '/daily_affairs/detail',
        query: {orderId: res.order_id}
    })
}
// 转让任务
const transmit = (res: any) => {
    console.log(res, 'transmit转让任务----------------------------->')
}
// 查看历史记录
const viewHistory = () => {
    console.log('查看历史记录----------------------------->')
}
</script>
<template>
    <div class="pending_list" v-if="props.listData && props.listData.length">
        <van-collapse v-model="collArray" class="fold" ref="fold">
            <van-collapse-item :name="collIndex + 1" v-for="(res, collIndex) in props.listData" :key="res.id" class="fold_item">
                <template #title>
                    <div class="title_box">
                        <div class="title_box_left">
                            <div class="time">
                                {{ fliterGoTime(res.go_time).hour_time }}
                            </div>
                        </div>
                        <div class="title_box_name" @click="linkDetail(res)">
                            <!-- res.order_information用三元，可能会返回null -->
                            {{ res.order_information ? res.order_information.username : '-' }}
                        </div>
                        <div>
                            办身份证
                        </div>
                        <div class="title_box_type">
                            <!-- {{ res.visa_type || '-' }} -->
                            已领证
                        </div>
                    </div>
                    <div class="title_manage" :class="{warning: !res.task_user_name}">
                        接待人：{{ res.task_user_name || '待分配' }}
                    </div>
                </template>
                <div class="fold_item_content">
                    <div class="fold_item_content_message block">
                        <div class="info">
                            <span>
                                主申人：
                            </span>
                            <div>
                                {{ res.order_information ? res.order_information.username : '-' }}
                            </div>
                        </div>
                        <div class="info">
                            <span>
                                办证者：
                            </span>
                            <div>
                                {{ fliterUserList(res.user_list) }}
                            </div>
                        </div>
                        <div class="info">
                            <span>
                                地点：
                            </span>
                            <div>
                                {{ res.immigration_office }}
                            </div>
                        </div>
                        <div class="info">
                            <span>
                                时间：
                            </span>
                            <div>
                                {{ fliterGoTime(res.go_time).date_time + ' ' + fliterGoTime(res.go_time).hour_time }}
                            </div>
                        </div>
                        <div class="info">
                            <span>
                                客户经理：
                            </span>
                            <div>
                                <div class="phone">
                                    {{ res.service_name || '-' }}
                                </div>
                                <div class="service_phone">
                                    <a :href="`tel:${res.service_phone}`" v-if="res.service_phone"> {{ res.service_phone }} <i class="iconfont icon-icon_dianhua"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="transmit" v-if="userInfo.role_key">
                            <div class="transmit_button flex-center-center" @click="transmit(res)">
                                转任务
                            </div>
                        </div>
                    </div>
                    <div class="fold_item_content_servise block">
                        期望银河提供服务：
                        <div class="tages">
                            <Tag :tableId="res.id" :clientArray="res.journey_service.split(',')" class="Tag"></Tag>
                        </div>
                    </div>
                    <div class="fold_item_content_text block">
                        <div class="histroy flex-jusify-between d-flex">
                            <span>
                                意向需求：
                            </span>
                            <span @click="viewHistory">
                                查看历史需求
                            </span>
                        </div>
                        <div class="content">
                            <van-field
                                v-model="Demand_message"
                                rows="3"
                                autosize
                                label=""
                                type="textarea"
                                placeholder="请输入备注内容"
                            />
                            <div class="buttones" :class="{default: !Demand_message}">
                                <span class="cencel" @click="submitMessage(res, collIndex)">
                                    取消
                                </span>
                                <span class="save" @click="submitMessage(res)">
                                    保存
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="fold_item_content_action block">
                        上传证件：
                        <div class="upload flex-center-center" @click="openUploader(res)">
                            <i class="iconfont icon-btn_upload"></i>
                            去上传
                        </div>
                    </div>
                </div>
            </van-collapse-item>
        </van-collapse>
        <div class="pending_list_loadingText" v-if="next_loading">
            已经到底，继续上拉可翻到下一日
        </div>
        <uploaderPopup v-model:show-uploder="showUploder" :id="uploaderId" v-if="showUploder"/>
    </div>
    <div v-else class="not_data flex-center-center">
        暂无搜索数据
    </div>
</template>
<style lang="scss" scoped>
.pending_list {
    background: #F8F8F8;
    flex: 1;
    overflow-y: auto;
    .fold {
        &_item {
            margin: 20px;
            border-radius: 20px;
            overflow: hidden;
            .title_box {
                display: flex;
                // justify-content: space-between;
                align-items: center;
                font-size: 32px;
                div {
                    margin-right: 16px;
                }
                &_left {
                    display: flex;
                    .time {
                        // padding-right: 16px;
                        margin-right: 0;
                        position: relative;

                    }
                }
                &_name {
                    color: #198CFF;
                    position: relative;
                    padding: 0 16px;
                    &::after, &::before {
                        content: '';
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 1px;
                        height: 24px;
                        background: #E1E1E1;
                    }
                    &::before {
                        left: 0;
                    }
                }
                &_type {
                    font-size: 22px;
                    padding: 0 8px;
                    color: #3ECDC3;
                    border-radius: 8px;
                    height: 38px;
                    background: rgba(62, 205, 195, 0.08);
                }
            }
            .title_manage {
                font-size: 26px;
                color: #888F98;
            }
            .warning {
                color: #FF5C00;
            }
            &_content {
                color: #222222;
                font-size: 30px;
                .block {
                    margin-bottom: 42px;
                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
                &_message {
                    background: #F8F9FB;
                    border-radius: 12px;
                    max-height: 570px;
                    padding: 32px 0;
                    font-size: 26px;
                    .info {
                        padding: 0 28px;
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 32px;
                        span {
                            color: #888F98;
                        }
                        .service_phone {
                            color: #198CFF;
                            a {
                                color: #198CFF;
                                display: flex;
                                height: 36px;
                                align-items: center;
                            }
                            .iconfont {
                                margin-left: 16px;
                                font-size: 36px
                            }
                        }
                    }
                    .transmit {
                        border-top: 1px solid #F0F0F0;
                        font-size: 26px;
                        display: flex;
                        justify-content: flex-end;
                        padding: 24px 28px 0 0;
                        &_button {
                            width: 142px;
                            height: 60px;
                            flex-shrink: 0;
                            border-radius: 12px;
                            border: 2px solid #198CFF;
                            color: #198CFF;
                        }
                    }
                }
                &_servise {
                    .tages {
                        padding-top: 24px;
                    }
                }
                &_action {
                    .upload {
                        margin-top: 24px;
                        width: 100%;
                        height: 90px;
                        color: #4388FF;
                        border-radius: 12px;
                        border: 1px dashed #4388FF;
                        background: #FFF;
                        font-size: 28px;
                        .iconfont {
                            font-size: 32px;
                            margin-right: 8px;
                        }
                    }
                }
                &_text {
                    .histroy {
                        span {
                            &:last-of-type {
                                font-size: 26px;
                                color: #198CFF;
                            }
                        }
                    }
                    .content {
                        margin-top: 24px;
                        .van-field {
                            background: #F8F9FB;
                            border-top-right-radius: 12px;
                            border-top-left-radius: 12px;
                            padding: 24px 28px;
                        }
                        border-radius: 12px;
                        background: #F8F9FB;
                        .buttones {
                            padding: 16px 0;
                            text-align: right;
                            font-size: 24px;
                            display: flex;
                            justify-content: flex-end;
                            span {
                                margin-right: 16px;
                                width: 112px;
                                height: 55px;
                                flex-shrink: 0;
                                border-radius: 8px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                color: #222222;
                            }
                            .save {
                                background:#198CFF;
                                color: #fff;
                            }
                        }
                        .default {
                            span {
                                opacity: 0.3;
                                cursor: not-allowed;
                            }
                        }
                    }
                }
            }
        }
    }
    &_loadingText {
        text-align: center;
        padding-top: 20px;
    }
}
.not_data {
    font-size: 28px;
    padding-top: 50px;
    color: #999;
}
</style>