<script setup name="pending_list" lang="tsx">
// 获取DOM值
const fold = ref(null)
// 下一天的loading
const next_loading = ref(false)
// 折叠面板
const collArray = ref(['1'])
const props = defineProps<{
    listData: any
}>()
// 列表参数
const next_date = () => {
    console.log('进行到下一天');
    
}
const onScroll = () => {
    next_loading.value = true;
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

</script>
<template>
    <div class="pending_list">
        <van-collapse v-model="collArray" class="fold" ref="fold">
            <van-collapse-item :name="collIndex + 1" v-for="(res, collIndex) in props.listData" :key="collIndex" class="fold_item">
                <template #title>
                    <div class="title_box">
                        <div class="title_box_left">
                            <div class="time">
                                {{ res.time }}
                            </div>
                        </div>
                        <div class="title_box_name">
                            {{ res.user_name || '-' }}
                        </div>
                        <div class="title_box_type">
                            <!-- {{ res.visa_type || '-' }} -->
                            已领证
                        </div>
                    </div>
                    <div class="title_manage">
                        接待人：待分配
                    </div>
                </template>
                <div class="fold_item_content">
                    <div class="fold_item_content_message block">

                    </div>
                    <div class="fold_item_content_servise block">
                        期望银河提供服务：
                    </div>
                    <div class="fold_item_content_action block">
                        <div>
                            <span>
                                意向需求：
                            </span>
                            <span>
                                查看历史需求
                            </span>
                        </div>
                        <div>

                        </div>
                    </div>
                    <div class="fold_item_content_action block" @click="">
                        上传证件：
                        <van-icon name="arrow" />
                    </div>
                </div>
            </van-collapse-item>
        </van-collapse>
        <div class="pending_list_loadingText" v-if="next_loading">
            已经到底，继续上拉可翻到下一日
        </div>
    </div>
</template>
<style lang="scss" scoped>
.pending_list {
    background: #f6f6f6;
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
                        padding-right: 16px;
                        margin-right: 0;
                        position: relative;
                        &::after {
                            content: '';
                            position: absolute;
                            right: 0;
                            top: 50%;
                            transform: translateY(-50%);
                            width: 1px;
                            height: 24px;
                            background: #E1E1E1;
                        }
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
            // :deep(.van-cell) {
            //     &::after {
            //         border-bottom: none;
            //     }
            // }
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
                    min-height: 560px;
                }
                &_action {
                    display: flex;
                    justify-content: space-between;
                    .van-icon {
                        color: #9B9B9B;
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
</style>