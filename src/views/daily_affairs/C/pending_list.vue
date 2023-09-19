<script setup name="pending_list" lang="tsx">

// 获取DOM值
const fold = ref(null)
// 下一天的loading
const next_loading = ref(false)
// 折叠面板
const collArray = ref(['1'])
// 列表参数
const listData = ref([
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 1
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '香港同事A',
        visa_type: 3,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 2
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 3
    },
    {
        time: '2022-01-01',
        user_name: '张三',
        processor: '香港同事BBB',
        visa_type: 1,
        applicant_name: '张1',
        userList: ['张1_父亲', '张1_母亲', '张1_儿子'],
        address: '港湾入境处',
        id: 4
    },
])
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
            <van-collapse-item :name="collIndex + 1" v-for="(res, collIndex) in listData" :key="collIndex" class="fold_item">
                <template #title>
                    <div class="title_box">
                        <div class="title_box_left">
                            <div class="time">
                                {{ res.time }}
                            </div>
                            <div>
                                {{ res.processor || '待分配' }}
                            </div>
                        </div>
                        <div class="title_box_name">
                            {{ res.user_name || '-' }}
                        </div>
                        <div class="title_box_visa">
                            {{ res.visa_type || '-' }}
                        </div>
                    </div>
                </template>
                <div class="fold_item_content">

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
    padding: 30px 0;
    // min-height: 77vh;
    // max-height: 77vh;
    height: 77.5vh;
    overflow-y: auto;
    .fold {
        // height: 100vh;
        // overflow-y: auto;
        &_item {
            margin: 20px;
            border-radius: 20px;
            overflow: hidden;
            .title_box {
                display: flex;
                justify-content: space-between;
                align-items: center;

                &_left {
                    min-width: 500px;
                    display: flex;
                    .time {
                        padding-right: 20px;
                        margin-right: 20px;
                        border-right: 1px solid #ccc;
                    }
                }
            }
            :deep(.van-cell) {
                &::after {
                    border-bottom: none;
                }
            }

            &_content {
                min-height: 700px;
                background: aqua;
            }
        }
    }
    &_loadingText {
        text-align: center;
        padding-top: 20px;
    }
}
</style>