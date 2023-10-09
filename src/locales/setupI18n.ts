/*
 * @Author: Autumn.again
 * @Date: 2023-09-14 17:42:21
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-15 09:33:42
 * @FilePath: \workwexin-h5-sidebar\src\locales\setupI18n.ts
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
// locales/i18n.ts
import { createI18n } from 'vue-i18n'
import Zh_message from './lang/Zh_cn'
import HK_message from './lang/Zh_HK'

const messages = {
  ...Zh_message,
  ...HK_message
}
const i18n = createI18n({
  legacy: false, // legacy为false，开启compositionAPI方法
  globalInjection: true, // globalInjection为true, 允许全局注册i18n为 $t 方法
  locale: 'HK', // 默认指定是什么语言格式
  messages
})

export default i18n
