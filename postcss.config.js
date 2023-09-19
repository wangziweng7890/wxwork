/*
 * @Author: Autumn.again
 * @Date: 2023-09-13 11:07:24
 * @LastEditors: Autumn.again
 * @LastEditTime: 2023-09-18 16:49:06
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
  ],
};
