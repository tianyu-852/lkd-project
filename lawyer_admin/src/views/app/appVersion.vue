<template>
  <div>
    <a-spin :spinning="isShowSpinning">
      <a-card style="min-height: 700px">
        <div class="title">
          <img :src="require('@/assets/common/ring-blue.png')" alt="" /> <span>APP版本管理</span>
        </div>

        <!-- 百姓律师 -->
        <div class="app-item">
          <div class="app-item-left">
            <div class="app-name">
              <span>百姓律师</span>
              <a @click="getAppHistoryVersion(0)">版本更新记录<img :src="require('@/assets/common/sm_arrow.png')" /></a>
            </div>
            <!-- ios -->
            <div class="app-client">
              <div class="app-version-wrap">
                <div class="app-device" style="background: #F56C6C;">IOS</div>
                <div class="app-version-item">
                  <div class="app-version-title">当前最新版本：</div>
                  <a-input class="app-version-input" v-model="baixingApp.ios_newest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">最低版本：</div>
                  <a-input class="app-version-input" v-model="baixingApp.ios_oldest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">审核版本：</div>
                  <a-input class="app-version-input" v-model="baixingApp.ios_check_version" />
                </div>

                <div class="checkbox-update" @click="baixingApp.is_ios_mandatory = baixingApp.is_ios_mandatory === 0 ? 1 : 0 ">
                  <img v-if="baixingApp.is_ios_mandatory" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                  <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                  <span style="margin-rigth: 5px;">是否强制更新</span>
                </div>
              </div>

              <div class="update-option-wrap" v-for="(index, key) in baixingApp.ios_update_info" :key="key">
                <span>{{ key + 1 + '. 更新内容：' }}</span>
                <a-input class="update-option-input" v-model="baixingApp.ios_update_info[key]"></a-input>
                <a-button v-if="key === 0" type="primary" @click="baixingApp.ios_update_info.push('')">再加一条</a-button>
                <a-button v-else type="danger" @click="baixingApp.ios_update_info.splice(key, 1)">删除此条</a-button>
              </div>
            </div>
            <!-- 安卓 -->
            <div class="app-client">
              <div class="app-version-wrap">
                <div class="app-device" style="background: #F56C6C;">安卓</div>
                <div class="app-version-item">
                  <div class="app-version-title">当前最新版本：</div>
                  <a-input class="app-version-input" v-model="baixingApp.android_newest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">最低版本：</div>
                  <a-input class="app-version-input" v-model="baixingApp.android_oldest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">审核版本：</div>
                  <a-input class="app-version-input" v-model="baixingApp.android_check_version" />
                </div>

                <div class="checkbox-update" @click="baixingApp.is_android_mandatory = baixingApp.is_android_mandatory === 0 ? 1 : 0 ">
                  <img v-if="baixingApp.is_android_mandatory" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                  <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                  <span style="margin-rigth: 5px;">是否强制更新</span>
                </div>
              </div>

              <div class="update-option-wrap" v-for="(index, key) in baixingApp.android_update_info" :key="key">
                <span>{{ key + 1 + '. 更新内容：' }}</span>
                <a-input class="update-option-input" v-model="baixingApp.android_update_info[key]"></a-input>
                <a-button v-if="key === 0" type="primary" @click="baixingApp.android_update_info.push('')">再加一条</a-button>
                <a-button v-else type="danger" @click="baixingApp.android_update_info.splice(key, 1)">删除此条</a-button>
              </div>

              <div class="android-url">
                <span>安装包地址：</span>
                <span>{{ baixingApp.android_url }}</span>

                <a-button type="primary" style="margin-left: 20px;" @click="chooseAndroidApkFile('baixingApp')">选择文件</a-button>
              </div>
            </div>
          </div>
          <div class="app-item-right">
            <a-popconfirm title="是否更新「百姓律师」版本信息?" @confirm="postAppVersion(0)">
              <a-button type="primary">更新保存</a-button>
            </a-popconfirm>
          </div>
        </div>

        <a-divider />

        <!-- 律师端 -->
        <div class="app-item">
          <div class="app-item-left">
            <div class="app-name">
              <span>律师端</span>
              <a @click="getAppHistoryVersion(3)">版本更新记录<img :src="require('@/assets/common/sm_arrow.png')" /></a>
            </div>
            <!-- ios -->
            <div class="app-client">
              <div class="app-version-wrap">
                <div class="app-device" style="background: #19be6b;">IOS</div>
                <div class="app-version-item">
                  <div class="app-version-title">当前最新版本：</div>
                  <a-input class="app-version-input" v-model="lawyerApp.ios_newest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">最低版本：</div>
                  <a-input class="app-version-input" v-model="lawyerApp.ios_oldest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">审核版本：</div>
                  <a-input class="app-version-input" v-model="lawyerApp.ios_check_version" />
                </div>

                <div class="checkbox-update" @click="lawyerApp.is_ios_mandatory = lawyerApp.is_ios_mandatory === 0 ? 1 : 0 ">
                  <img v-if="lawyerApp.is_ios_mandatory" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                  <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                  <span style="margin-rigth: 5px;">是否强制更新</span>
                </div>
              </div>

              <div class="update-option-wrap" v-for="(index, key) in lawyerApp.ios_update_info" :key="key">
                <span>{{ key + 1 + '. 更新内容：' }}</span>
                <a-input class="update-option-input" v-model="lawyerApp.ios_update_info[key]"></a-input>
                <a-button v-if="key === 0" type="primary" @click="lawyerApp.ios_update_info.push('')">再加一条</a-button>
                <a-button v-else type="danger" @click="lawyerApp.ios_update_info.splice(key, 1)">删除此条</a-button>
              </div>
            </div>
            <!-- 安卓 -->
            <div class="app-client">
              <div class="app-version-wrap">
                <div class="app-device" style="background: #19be6b;">安卓</div>
                <div class="app-version-item">
                  <div class="app-version-title">当前最新版本：</div>
                  <a-input class="app-version-input" v-model="lawyerApp.android_newest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">最低版本：</div>
                  <a-input class="app-version-input" v-model="lawyerApp.android_oldest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">审核版本：</div>
                  <a-input class="app-version-input" v-model="lawyerApp.android_check_version" />
                </div>

                <div class="checkbox-update" @click="lawyerApp.is_android_mandatory = lawyerApp.is_android_mandatory === 0 ? 1 : 0 ">
                  <img v-if="lawyerApp.is_android_mandatory" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                  <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                  <span style="margin-rigth: 5px;">是否强制更新</span>
                </div>
              </div>

              <div class="update-option-wrap" v-for="(index, key) in lawyerApp.android_update_info" :key="key">
                <span>{{ key + 1 + '. 更新内容：' }}</span>
                <a-input class="update-option-input" v-model="lawyerApp.android_update_info[key]"></a-input>
                <a-button v-if="key === 0" type="primary" @click="lawyerApp.android_update_info.push('')">再加一条</a-button>
                <a-button v-else type="danger" @click="lawyerApp.android_update_info.splice(key, 1)">删除此条</a-button>
              </div>

              <div class="android-url">
                <span>安装包地址：</span>
                <span>{{ lawyerApp.android_url }}</span>
                <a-button type="primary" style="margin-left: 20px;" @click="chooseAndroidApkFile('lawyerApp')">选择文件</a-button>
              </div>
            </div>
          </div>
          <div class="app-item-right">
            <a-popconfirm title="是否更新「律师端」版本信息?" @confirm="postAppVersion(3)">
              <a-button type="primary">更新保存</a-button>
            </a-popconfirm>
          </div>
        </div>

        <a-divider />

        <!-- 企业律云 -->
        <div class="app-item">
          <div class="app-item-left">
            <div class="app-name">
              <span>企业律云</span>
              <a @click="getAppHistoryVersion(2)">版本更新记录 <img :src="require('@/assets/common/sm_arrow.png')" /></a>
            </div>
            <!-- ios -->
            <div class="app-client">
              <div class="app-version-wrap">
                <div class="app-device" style="background: #ff9900;">IOS</div>
                <div class="app-version-item">
                  <div class="app-version-title">当前最新版本：</div>
                  <a-input class="app-version-input" v-model="qiyeApp.ios_newest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">最低版本：</div>
                  <a-input class="app-version-input" v-model="qiyeApp.ios_oldest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">审核版本：</div>
                  <a-input class="app-version-input" v-model="qiyeApp.ios_check_version" />
                </div>

                <div class="checkbox-update" @click="qiyeApp.is_ios_mandatory = qiyeApp.is_ios_mandatory === 0 ? 1 : 0 ">
                  <img v-if="qiyeApp.is_ios_mandatory" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                  <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                  <span style="margin-rigth: 5px;">是否强制更新</span>
                </div>
              </div>

              <div class="update-option-wrap" v-for="(index, key) in qiyeApp.ios_update_info" :key="key">
                <span>{{ key + 1 + '. 更新内容：' }}</span>
                <a-input class="update-option-input" v-model="qiyeApp.ios_update_info[key]"></a-input>
                <a-button v-if="key === 0" type="primary" @click="qiyeApp.ios_update_info.push('')">再加一条</a-button>
                <a-button v-else type="danger" @click="qiyeApp.ios_update_info.splice(key, 1)">删除此条</a-button>
              </div>
            </div>
            <!-- 安卓 -->
            <div class="app-client">
              <div class="app-version-wrap">
                <div class="app-device" style="background: #ff9900;">安卓</div>
                <div class="app-version-item">
                  <div class="app-version-title">当前最新版本：</div>
                  <a-input class="app-version-input" v-model="qiyeApp.android_newest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">最低版本：</div>
                  <a-input class="app-version-input" v-model="qiyeApp.android_oldest_version" />
                </div>
                <div class="app-version-item">
                  <div class="app-version-title">审核版本：</div>
                  <a-input class="app-version-input" v-model="qiyeApp.android_check_version" />
                </div>

                <div class="checkbox-update" @click="qiyeApp.is_android_mandatory = qiyeApp.is_android_mandatory === 0 ? 1 : 0 ">
                  <img v-if="qiyeApp.is_android_mandatory" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                  <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                  <span style="margin-rigth: 5px;">是否强制更新</span>
                </div>
              </div>

              <div class="update-option-wrap" v-for="(index, key) in qiyeApp.android_update_info" :key="key">
                <span>{{ key + 1 + '. 更新内容：' }}</span>
                <a-input class="update-option-input" v-model="qiyeApp.android_update_info[key]"></a-input>
                <a-button v-if="key === 0" type="primary" @click="qiyeApp.android_update_info.push('')">再加一条</a-button>
                <a-button v-else type="danger" @click="qiyeApp.android_update_info.splice(key, 1)">删除此条</a-button>
              </div>

              <div class="android-url">
                <span>安装包地址：</span>
                <span>{{ qiyeApp.android_url }}</span>
                <a-button type="primary" style="margin-left: 20px;" @click="chooseAndroidApkFile('qiyeApp')">选择文件</a-button>
              </div>
            </div>
          </div>
          <div class="app-item-right">
            <a-popconfirm title="是否更新「企业律云」版本信息?" @confirm="postAppVersion(2)">
              <a-button type="primary">更新保存</a-button>
            </a-popconfirm>
          </div>
        </div>

        <a-divider />

        <!-- 上传文件 input -->
        <input
          v-if="isShowFileInput"
          id="input"
          ref="fileInputRef"
          type="file"
          style="display: none;"
          @change="onChangeInputFile"
        >

        <!-- 版本更新记录 modal -->
        <a-modal v-model="isShowHistoryModal" title="版本更新记录" :footer="null">
          <div style="height: 500px; overflow: auto">
            <div v-for="(i, key) in appHistoryVersionList" :key="key * 45646">
              <span>IOS</span> <span style="color: #3980ea">({{ i.ios_newest_version }})</span>
              <label for="" style="width: 70%; color: #787e8d; padding: 10px">{{ i.created_at }}</label>
              <div style="background-color: #f7f8fa; width: 100%; min-height: 131px; margin: 10px 0; padding: 20px">
                <p style="color: #787e8d; font-size: 14px" v-for="(index, iIndex) in i.ios_update_info" :key="iIndex">
                  {{ key + 1 }} . {{ index }}
                </p>
              </div>
              <span>安卓</span> <span style="color: #3980ea">({{ i.android_newest_version }})</span>
              <label for="" style="width: 70%; color: #787e8d; padding: 10px">{{ i.created_at }}</label>
              <div style="background-color: #f7f8fa; width: 100%; min-height: 131px; margin: 10px 0; padding: 20px">
                <p style="color: #787e8d; font-size: 14px" v-for="(index, aIndex) in i.android_update_info" :key="aIndex">
                  {{ key + 1 }} . {{ index }}
                </p>
              </div>
            </div>
          </div>
        </a-modal>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import * as appApi from '@/api/app'
import * as commonApi from '@/api/common'
const OSS = require('ali-oss')

export default {
  name: 'AppVersion',
  data() {
    return {
      isShowSpinning: false, // 是否显示加载状态
      
      baixingApp: {}, // 百姓律师
      lawyerApp: {}, // 律师端
      qiyeApp: {}, // 企业律云
      isShowHistoryModal: false, // 是否显示版本历史记录 modal

      appHistoryVersionList: [], // app 历史版本记录
      isShowFileInput: true, // 是否显示文件 input
      androidApkType: '', // baixingApp, lawyerApp, qiyeApp
    }
  },
  created() {
    this._getAppVersion(0) // 百姓律师
    this._getAppVersion(3) // 律师端
    this._getAppVersion(2) // 企业律云
  },
  methods: {
    /**
     * 获取最新 app 版本
     */
     async _getAppVersion(appSource = 0) {
      this.isShowSpinning = true

       try {
         const { data: appVersinoData } = await appApi.getAppVersionApi({ source_type: appSource })
         appSource === 0 && (this.baixingApp = appVersinoData)
         appSource === 3 && (this.lawyerApp = appVersinoData)
         appSource === 2 && (this.qiyeApp = appVersinoData)
         this.isShowSpinning = false
       } catch (error) {
        this.isShowSpinning = false
         console.log(error)
       }
    },
    /**
     * 最新 app 版本信息
     */
     async postAppVersion(appSource = 0) {
      const param = { source_type: appSource }
      // 百姓律师
      if (appSource === 0) {
        // ios
        param.ios_version = JSON.stringify({
          max: this.baixingApp.ios_newest_version.trim(),
          min: this.baixingApp.ios_oldest_version.trim(),
          check: this.baixingApp.ios_check_version.trim(),
        })
        param.is_ios_mandatory = this.baixingApp.is_ios_mandatory
        param.ios_update_info = JSON.stringify(this.baixingApp.ios_update_info)
        // android
        param.android_version = JSON.stringify({
          max: this.baixingApp.android_newest_version.trim(),
          min: this.baixingApp.android_oldest_version.trim(),
          check: this.baixingApp.android_check_version.trim(),
        })
        param.is_android_mandatory = this.baixingApp.is_android_mandatory
        param.android_update_info = JSON.stringify(this.baixingApp.android_update_info)
        param.android_url = this.baixingApp.android_url
      // 律师端
      } else if (appSource === 3) {
        // ios
        param.ios_version = JSON.stringify({
          max: this.lawyerApp.ios_newest_version.trim(),
          min: this.lawyerApp.ios_oldest_version.trim(),
          check: this.lawyerApp.ios_check_version.trim(),
        })
        param.is_ios_mandatory = this.lawyerApp.is_ios_mandatory
        param.ios_update_info = JSON.stringify(this.lawyerApp.ios_update_info)
        // android
        param.android_version = JSON.stringify({
          max: this.lawyerApp.android_newest_version.trim(),
          min: this.lawyerApp.android_oldest_version.trim(),
          check: this.lawyerApp.android_check_version.trim(),
        })
        param.is_android_mandatory = this.lawyerApp.is_android_mandatory
        param.android_update_info = JSON.stringify(this.lawyerApp.android_update_info)
        param.android_url = this.lawyerApp.android_url
      // 企业律云
      } else if (appSource === 2) {
        // ios
        param.ios_version = JSON.stringify({
          max: this.qiyeApp.ios_newest_version.trim(),
          min: this.qiyeApp.ios_oldest_version.trim(),
          check: this.qiyeApp.ios_check_version.trim(),
        })
        param.is_ios_mandatory = this.qiyeApp.is_ios_mandatory
        param.ios_update_info = JSON.stringify(this.qiyeApp.ios_update_info)
        // android
        param.android_version = JSON.stringify({
          max: this.qiyeApp.android_newest_version.trim(),
          min: this.qiyeApp.android_oldest_version.trim(),
          check: this.qiyeApp.android_check_version.trim(),
        })
        param.is_android_mandatory = this.qiyeApp.is_android_mandatory
        param.android_update_info = JSON.stringify(this.qiyeApp.android_update_info)
        param.android_url = this.qiyeApp.android_url
      }
      this.isShowSpinning = true

       try {
         const { data: appVersinoData } = await appApi.postAppVersionApi(param)

         appSource === 0 && this._getAppVersion(0) // 百姓律师
         appSource === 3 && this._getAppVersion(3) // 律师端
         appSource === 2 && this._getAppVersion(2) // 企业律云
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取 app 历史版本信息
     */
    async getAppHistoryVersion(appSource = 0) {
      this.isShowSpinning = true
      try {
         const { data: appVersinoData } = await appApi.getAppHistoryVersionApi({ source_type: appSource, page: 1 })
         this.appHistoryVersionList = appVersinoData.data
         this.isShowHistoryModal = true
         this.isShowSpinning = false
       } catch (error) {
         this.isShowSpinning = false
         console.log(error)
       }
    },

    /**
     * 选择 android 安装包文件
     * https://juejin.cn/post/6844903697667850248
     */
    chooseAndroidApkFile(androidApkType) {
      this.isShowFileInput = true
      this.androidApkType = androidApkType
      this.$nextTick(() => {
        this.$refs.fileInputRef.click() 
        // this.$refs.fileInputRef.dispatchEvent(new MouseEvent('click'))
      })
    },
    /**
     * 选择文件
     */
    async onChangeInputFile(event) {
      const { androidApkType } = this
      const file = event.target.files[0]
      console.log(file)
      this.isShowSpinning = true
      
      try {
        const ossRes = await commonApi.getOSSConfigApi()
        const ossClient = new OSS({
          region: 'oss-cn-beijing',
          bucket: 'lvkuaidaapp',
          accessKeyId: ossRes.AccessKeyId,
          accessKeySecret: ossRes.AccessKeySecret,
          stsToken: ossRes.SecurityToken,
        })

        let fileName = 'app-release.apk'

        if (androidApkType === 'baixingApp') fileName = 'app-release.apk'
        if (androidApkType === 'lawyerApp') fileName = 'lawyer.apk'
        if (androidApkType === 'qiyeApp') fileName = 'qyly.apk'
        // oss 只传
        const ossUploadRes = await ossClient.put(fileName, file)
        console.log(ossUploadRes)
        this.androidApkType = ''
        this.isShowSpinning = false
        this.isShowFileInput = false
        this._getAppVersion(0)
      } catch (error) {
        this.androidApkType = ''
        this.isShowSpinning = false
        this.isShowFileInput = false
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
.title {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 20px;
  img {
    height: 20px;
    width: 20px;
  }
  span {
    font-size: 22px;
    color: #222222;
    margin: 0 10px;
  }
  a {
    margin: 0 10px;
    img {
      height: 11px;
      width: 6px;
    }
  }
}

.app-device {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 26px;
  border-radius: 4px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  background: #1e8fff;
  margin-right: 10px;
}

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  margin-left: auto;
  cursor: pointer;
}

.checkbox-update {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.app-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  .app-item-left {
    flex: 1;
    .app-name {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      a {
        font-size: 15px;
        margin: 0 10px;
        img {
          width: 6px;
          height: 11px;
        }
      }
    }
    .app-client {
      margin-bottom: 40px;
      &:last-child { margin-bottom: 0; }
      .app-version-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 20px;
        .app-version-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-right: 20px;
          .app-version-title {
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }
          .app-version-input {
            width: 100px;
          }
        }
      }
      .update-option-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
        .update-option-input {
          width: 500px;
          margin: 0 10px;
        }
      }
      .android-url {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
    }
  }
  .app-item-right {
    margin-left: auto;
  }
}
</style>
