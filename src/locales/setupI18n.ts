/*
 * @Author: Autumn.again
 * @Date: 2023-09-14 17:42:21
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-14 18:10:07
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
  // legacy: false,
  // globalInjection: true,
  locale: 'ZH',
  messages
})

export default i18n
