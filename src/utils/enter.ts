// 判断手机 - ios/andriod
function isIOS() {
  const u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
}
 
/**
  * @description: 键盘弹起，输入框被遮挡
  */
function judgeInput() {
  if (isIOS()) {
    window.addEventListener('focusin', function () {
      console.log(1+document.activeElement.tagName);
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA'
      ) {
        setTimeout(function () {
          document.documentElement.scrollTop = document.body.scrollHeight;
        }, 0);
 
      }
    });
  } else {
    window.addEventListener('resize', function () {
      console.log(2+ document.activeElement.tagName);
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA'
      ) {
        setTimeout(function () {
          document.activeElement.scrollIntoView();
        }, 0);
      }
    });
  }
}
export {
  isIOS,
  judgeInput
}