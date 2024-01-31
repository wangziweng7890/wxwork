import { FileService } from '@galaxy-fe/utils'

const fileService = new FileService({
  env: import.meta.env.VITE_APP_ENV === 'production' ? 'prod' : 'test',
  businessCode: '4001013', // 业务code
})


// 私有上传
// fileService.privateUploadFile(file)

// 公有上传
// fileService.publicUploadFile(file)

// 拼接文件临时地址，可用于window新窗口打开进行预览或fetch获取数据进行下载
// fileService.getOssFilePublicUrlSync(fileUrl)

// 异步获取文件的临时地址（公有），可用于页面内预览
// fileService.getOssFilePublicUrlAsync(fileUrl)

// 文件下载
// fileService.downloadFileByUrl(fileUrl)

// 新窗口打开进行文件预览
// fileService.openWindowPreviewFile(fileUrl)

export default fileService
