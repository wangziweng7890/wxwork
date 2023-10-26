import * as Sentry from '@sentry/vue';
import { useUserStore } from '@/stores/modules/user'

// 埋点上报, tag不能为中文
export function log(message: string, tag = 'info') {
  const userStore = useUserStore()
  Sentry.setUser({ // 记录下用户信息，方便定位问题
    username: userStore.userInfo?.name,
    id: userStore.userInfo?.mobile,
  })
  Sentry.captureMessage(`【${tag}】： ${message}`, {
    level: 'debug',
    tags: {
      [tag]: true // 用tag来做分类
    },
    // setUser(user) {
    //   user.id = userStore.userInfo?.mobile
    //   user.username = userStore.userInfo?.name
    //   return this
    // }
  })
}
