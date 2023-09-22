/*
 * @Author: Autumn.again
 * @Date: 2023-09-13 11:07:24
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-13 11:07:32
 * @FilePath: \workwexin-h5-sidebar\postcss.config.js
 * Copyright: 2023 by Autumn.again, All Rights Reserved.
 */
module.exports = {
  plugins: [
    require("postcss-px-to-viewport")({
      unitToConvert: "px",
      viewportWidth: 750,
      viewportHeight: 1080,
      unitPrecision: 3,
      propList: ["*"],
      viewportUnit: "vw",
      fontViewportUnit: "vw",
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: /(\/|\\)(node_modules)(\/|\\)/,
    }),
    // 解决viewport适配vant 
    require("postcss-px-to-viewport")({
      unitToConvert: "px", // 要转化的单位
      viewportWidth: 375, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ["*"], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: "vw", // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: "vw", // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ["ignore-"], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      // exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      // exclude: [],
      include: [/vant/], //如果设置了include，那将只有匹配到的文件才会被转换
      landscape: false, // 是否处理横屏情况
    }),
  ],
};
