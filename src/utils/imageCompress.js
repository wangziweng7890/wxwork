import EXIF from 'exif-js';

// 图片压缩
export async function h5CompressImage(
  file,
  options = {
    ratio: 0.8, // 压缩比
  }
) {
  let myResolve;

  let fileReader = new FileReader();
  let img = new Image();
  let imgWidth = '';
  let imgHeight = ''; // 旋转角度
  let Orientation = null; // 缩放图片需要的canvas
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  const isLt2M = file.size < 2097152; // 图片大小  大于2MB 则压缩
  const getOrientation = () =>
    new Promise(resolve => {
      // 通过 EXIF 获取旋转角度 1 为正常  3 为 180°  6 顺时针90°  9 为 逆时针90°
      EXIF.getData(file, function () {
        // EXIF.getAllTags(this);
        Orientation = EXIF.getTag(this, 'Orientation');
        resolve();
      });
    });
  // await getOrientation(); // 确保获取到旋转值
  const fileReaderOnload = () =>
    new Promise(resolve => {
      // 文件读取 成功执行
      fileReader.onload = function (ev) {
        // 文件base64化，以便获知图片原始尺寸
        resolve(ev.target.result);
      }; // 读取文件
      fileReader.readAsDataURL(file);
    });
  const src = await fileReaderOnload();
  img.src = src; // base64地址图片加载完毕后
  img.onload = async function () {
    imgWidth = img.width;
    imgHeight = img.height;
    canvas.width = img.width;
    canvas.height = img.height; // 目标尺寸
    let targetWidth = imgWidth;
    let targetHeight = imgHeight; // 满足条件不需要压缩
    if (isLt2M && imgWidth < 960 && imgHeight < 960) {
      return myResolve({
        preview: src,
        file: base64toFile(src, file),
      }); // 把上传的图片base64转化jpg格式为文件流
    } // 大于2MB 、img宽高 > 960 则进行压缩
    if (!isLt2M || imgWidth >= 960 || imgHeight >= 960) {
      // 最大尺寸
      let maxWidth = 960;
      let maxHeight = 960; // 图片尺寸超过 960 X 960 的限制
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        if (imgWidth / imgHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (imgHeight / imgWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (imgWidth / imgHeight));
          if (targetWidth < 500) {
            targetWidth = 500;
          }
        }
      } // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    }
    var u = navigator.userAgent;
    var versions = u.toLowerCase();
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // 判断是否是安卓
    let isOldiOSVersion = false;
    if (!isAndroid) {
      var ver = versions.match(/cpu iphone os (.*?) like mac os/);
      isOldiOSVersion = ver?.[1].replace(/_/g, '.') < '13.4'; // 判断ios是否大于13.4
    } // android
    let imgSrc = canvas.toDataURL(file.type, options.ratio || 1);
    // if (isAndroid || isOldiOSVersion) {
    //   // 拍照旋转 需矫正图片
    //   if (Orientation && +Orientation !== 1) {
    //     // 根据获取到的值旋转
    //     if (+Orientation == 6) {
    //       // 旋转90度
    //       imgSrc = await rotateBase64Img(imgSrc, 90, file.type);
    //     } else if (+Orientation == 3) {
    //       // 旋转180度
    //       imgSrc = await rotateBase64Img(imgSrc, 180, file.type);
    //     } else if (+Orientation == 8) {
    //       // 旋转270度
    //       imgSrc = await rotateBase64Img(imgSrc, 270, file.type);
    //     }
    //   }
    // }
    myResolve({
      preview: imgSrc,
      file: base64toFile(imgSrc, file),
    });
  };
  return new Promise(resolve => {
    myResolve = resolve;
  });
}

function rotateBase64Img(src, edg, fileType) {
  return new Promise(resolve => {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imgW; // 图片宽度
    var imgH; // 图片高度
    var size; // canvas初始大小
    if (edg < 0) {
      edg = (edg % 360) + 360;
    }
    const quadrant = (edg / 90) % 4; // 旋转象限
    const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; // 裁剪坐标
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = function () {
      imgW = image.width;
      imgH = image.height;
      size = imgW > imgH ? imgW : imgH;
      canvas.width = size * 2;
      canvas.height = size * 2;
      switch (quadrant) {
        case 0:
          cutCoor.sx = size;
          cutCoor.sy = size;
          cutCoor.ex = size + imgW;
          cutCoor.ey = size + imgH;
          break;
        case 1:
          cutCoor.sx = size - imgH;
          cutCoor.sy = size;
          cutCoor.ex = size;
          cutCoor.ey = size + imgW;
          break;
        case 2:
          cutCoor.sx = size - imgW;
          cutCoor.sy = size - imgH;
          cutCoor.ex = size;
          cutCoor.ey = size;
          break;
        case 3:
          cutCoor.sx = size;
          cutCoor.sy = size - imgW;
          cutCoor.ex = size + imgH;
          cutCoor.ey = size + imgW;
          break;
      }
      ctx.translate(size, size);
      ctx.rotate((edg * Math.PI) / 180);
      ctx.drawImage(image, 0, 0);
      var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
      if (quadrant % 2 == 0) {
        canvas.width = imgW;
        canvas.height = imgH;
      } else {
        canvas.width = imgH;
        canvas.height = imgW;
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL(fileType));
    };
  });
}

function base64toFile(dataurl, file) {
  let arr = dataurl.split(',');
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], file.name, {
    type: file.type,
  });
}
