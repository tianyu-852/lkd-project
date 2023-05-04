const OSS = require('ali-oss')
import { getOssConfigInfo } from '../api/common'

/**
 * 注意：
 * 
 * 暂未使用该文件
 */

/**
 * 随机数 未指定长度则为32位
 */
const _randomStrFunc = len => {
  len = len || 8
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

/**
 * 生成上传图片路径
 */
 const _createFilePath = (file, filePathPrefix = 'lkd-file') => {
  const fileName = file.name
  const pos = fileName.lastIndexOf('.')

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()
  const time = new Date().getTime()

  return `/${ filePathPrefix }/${ year }${ month }${ day }-${ time }-${ _randomStrFunc(6) }${ fileName.substring(pos) }`
}

/**
 * 单上传文件
 */
const uploadFile = async (fileList) => {
  try {
    const proFileList = fileList.map(file => {
      return {
        file: file,
        filePath: _createFilePath(file)
      }
    })
    console.log(proFileList)

    const ossConfigData = await getOssConfigInfo()
    console.log(ossConfigData)

    const ossClient = new OSS({
      region: 'oss-cn-hangzhou',
      accessKeyId: ossConfigData.AccessKeyId,
      accessKeySecret: ossConfigData.AccessKeySecret,
      stsToken: ossConfigData.SecurityToken,
      bucket: 'lvfuyun',
    })

    const upPromiseArr = proFileList.map(fileItem => {
      return new Promise((resolve, reject) => {
       ossClient.put(fileItem.filePath, fileItem.file)
        .then(res => {
          console.log(res)
          resolve(res)
        })
        .catch(err => {
          console.log(err)

          reject(err)
        })
      })
    })
    return Promise.all(upPromiseArr)
  } catch (error) {
    console.log(error)
  }
}

export default {
  uploadFile
}
