<template>
  <div>
    <a-row :gutter="[8, 16]">
      <a-col :span="24">
        <a-card>
          <a-col :span="6">
            <div @click="goList" style="width: 150px; cursor: pointer; color: #222222; font-size: 22px">
              <b>
                <span> ←<span>返回列表</span> </span>
              </b>
            </div>
          </a-col>
          <a-col :span="10">
            <user-vip-cell
              :nickname="detailstService.admin.nickname"
              :avatar="detailstService.admin.avatar"
              :mobile="detailstService.admin.mobile"
            />
          </a-col>
          <a-col :span="6" v-if="$store.state.step.selectStep > 1 && userData.is_promote">
            <img :src="require('@/assets/Fundraising/组 6488@2x.png')" style="width: 16px; height: 16px" />
            <label style="color: #ff3333">平台介入推广</label>
          </a-col>
          <a-col :span="4" v-if="$store.state.step.selectStep === 0">
            <a-button @click="openmodal(0)" size="small">选择当事人</a-button>
          </a-col>
          <a-col :span="4" v-if="$store.state.step.selectStep === 0">
            <a-button @click="onServiceNumber" size="small" type="primary">发送认证</a-button>
          </a-col>
          <a-col :span="8" v-if="userData.litigant.nickname && $store.state.step.selectStep === 0">
            <label>{{ userData.litigant.mobile }}({{ userData.litigant.nickname }})</label>
          </a-col>
          <a-col :span="8" v-if="userData.litigant.nickname === '' && $store.state.step.selectStep === 0">
            <label v-if="serviceNumber === ''">请选择当事人</label>
            <label v-else>{{ serviceNumber }}({{ serviceName }})</label>
          </a-col>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
            <span class="titleStyle">发起人姓名：</span>
            <a-input type="text" v-model="userData.creator.nickname" style="width: 140px" />
            <div style="margin: 0 10px">
              <div v-if="userData.creator.is_auth === 1">
                <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span class="gray">已认证 </span>
              </div>
              <div v-else>
                <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span> 未认证</span>
              </div>
            </div>
            <div style="margin: 0 10px">
              <div v-if="userData.creator.is_register === 1">
                <img :src="require('@/assets/Fundraising/gx2_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span class="gray">已注册 </span>
              </div>
              <div v-else>
                <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span> 未注册</span>
              </div>
            </div>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
            <span class="titleStyle">发起人手机号码：</span>
            <a-input type="text" v-model="newData.creatorMobile" style="width: 200px">
              <a-button
                slot="suffix"
                size="small"
                v-if="userData.is_can_send === 1"
                type="primary"
                @click="sendSMS(newData.creatorMobile, 0)"
              >
                发送短信
              </a-button>
              <a-button slot="suffix" size="small" v-else>已发送</a-button>
            </a-input>
            <a-popconfirm ok-text="复制" cancel-text="关闭" @confirm="copyNumber">
              <div>
                <a-button
                  style="border-color: #2cbf78; background: #2cbf78; color: #fff; margin: 0 10px"
                  @click="sendSMS(newData.creatorMobile, 1)"
                >
                  拨打电话
                </a-button>
              </div>
              <a-icon slot="icon" type="question-circle-o" class="white" />
              <input id="input" :value="mobileNumber" slot="title" />
            </a-popconfirm>
          </a-col>
          <a-col :span="24" style="display: flex">
            <div v-for="(index, key) in userData.creator.records" :key="key" style="padding: 0 10px; width: 33.333%">
              <img :src="require('@/assets/Fundraising/luyin.png')" style="width: 18px; height: 18px" />
              <a @click="openRecord(index.record, 0)">录音{{ key + 1 }}</a
              >|
              <a @click="openRecord(index.record, 1)">下载</a>
              <span style="margin: 10px">{{ index.call_at }}</span>
            </div>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
            <span class="titleStyle">当事人姓名：</span>
            <a-input type="text" v-model="newData.litigantNickname" style="width: 140px" />
            <div style="margin: 0 10px">
              <div v-if="userData.litigant.is_auth === 1">
                <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span class="gray">已认证 </span>
              </div>
              <div v-else>
                <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span> 未认证</span>
              </div>
            </div>
            <div style="margin: 0 10px">
              <div v-if="userData.litigant.is_register === 1">
                <img :src="require('@/assets/Fundraising/gx2_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span class="gray">已注册 </span>
              </div>
              <div v-else>
                <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span> 未注册</span>
              </div>
            </div>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
            <span class="titleStyle">当事人手机号码：</span>
            <a-input type="text" v-model="newData.litigantMobile" style="width: 200px">
              <a-button
                slot="suffix"
                size="small"
                v-if="userData.is_can_send === 1"
                type="primary"
                @click="sendSMS(newData.litigantMobile, 0)"
              >
                发送短信
              </a-button>
              <a-button slot="suffix" size="small" v-else>已发送</a-button>
            </a-input>
            <a-popconfirm ok-text="复制" cancel-text="关闭" @confirm="copyNumber">
              <div>
                <a-button
                  style="border-color: #2cbf78; background: #2cbf78; color: #fff; margin: 0 10px"
                  @click="sendSMS(newData.litigantMobile, 1)"
                >
                  拨打电话
                </a-button>
              </div>
              <a-icon slot="icon" type="question-circle-o" class="white" />
              <input id="input" :value="mobileNumber" slot="title" />
            </a-popconfirm>
          </a-col>
          <a-col :span="24" style="display: flex">
            <div v-for="(index, key) in userData.litigant.records" :key="key" style="padding: 0 10px; width: 33.333%">
              <img :src="require('@/assets/Fundraising/luyin.png')" style="width: 18px; height: 18px" />
              <a @click="openRecord(index.record, 0)">录音{{ key + 1 }}</a
              >|
              <a @click="openRecord(index.record, 1)">下载</a>
              <span style="margin: 10px">{{ index.call_at }}</span>
            </div>
          </a-col>
          <!-- <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
            <span class="titleStyle">指定律师：</span>
            <a-input type="text" v-model="newData.litigantNickname" style="width: 140px" />
            <div style="margin: 0 10px">
              <div v-if="userData.litigant.is_auth === 1">
                <img :src="require('@/assets/Fundraising/gx1_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <spanclass="gray">已认证 </spanclass=>
              </div>
              <div v-else>
                <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span> 未认证</span>
              </div>
            </div>
            <div style="margin: 0 10px">
              <div v-if="userData.litigant.is_register === 1">
                <img :src="require('@/assets/Fundraising/gx2_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span class="gray">已注册 </span>
              </div>
              <div v-else>
                <img :src="require('@/assets/Fundraising/gx_icon_sel@2x.png')" style="width: 16px; height: 16px" />
                <span> 未注册</span>
              </div>
            </div>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row; align-items: center">
            <span class="titleStyle">手机号码：</span>
            <a-input type="text" v-model="userData.litigant.mobile" style="width: 200px">
              <a-button
                slot="suffix"
                size="small"
                v-if="userData.is_can_send === 1"
                type="primary"
                @click="sendSMS(userData.litigant.mobile, 0)"
              >
                发送短信
              </a-button>
              <a-button slot="suffix" size="small" v-else>已发送</a-button>
            </a-input>
            <a-popconfirm ok-text="复制" cancel-text="关闭" @confirm="copyNumber">
              <div>
                <a-button
                  style="border-color: #2cbf78;background: #2cbf78; color: #fff; margin: 0 10px"
                  @click="sendSMS(userData.litigant.mobile, 1)"
                >
                  拨打电话
                </a-button>
              </div>
              <a-icon slot="icon" type="question-circle-o" class="white" />
              <input id="input" :value="mobileNumber" slot="title" />
            </a-popconfirm>
          </a-col>
          <a-col :span="24" style="display: flex">
            <div v-for="(index, key) in userData.litigant.records" :key="key" style="padding: 0 10px; width: 33.333%">
              <img :src="require('@/assets/Fundraising/luyin.png')" style="width: 18px; height: 18px" />
              <a @click="openRecord(index.record, 0)">录音{{key+1}}</a>|
              <a @click="openRecord(index.record, 1)">下载</a>
              <span style="margin: 10px">{{ index.call_at }}</span>
            </div>
          </a-col> -->
          <!--  <a-col :span="24">
            <span class="titleStyle">案件类型：</span>
            {{ caseTypeChinese }}
             <Cascader
              v-model="caseType"
              :options="caseTypeList"
              :show-search="{ filter }"
              placeholder="案件类型"
              @change="chooseCaseType"
              size="small"
            /> 
          </a-col>-->
          <a-col :span="24">
            <div style="background-color: #eff1f5; padding: 10px; margin: 10px 0">
              <span style="font-weight: bold"> 当事人诉求：</span>
              <a-input
                type="textarea"
                style="
                  background-color: #eff1f5;
                  border: none;
                  width: 100%;
                  word-wrap: break-word;
                  word-break: normal;
                  padding: 10px;
                "
                :rows="3"
                v-model="newData.appeal"
              />
            </div>
            <div style="background-color: #eff1f5; padding: 10px">
              <span style="font-weight: bold"> 案件详情：</span>
              <a-input
                type="textarea"
                style="
                  background-color: #eff1f5;
                  border: none;
                  width: 100%;
                  word-wrap: break-word;
                  word-break: normal;
                  padding: 10px;
                "
                :rows="15"
                v-model="newData.content"
              />
            </div>
          </a-col>
          <a-col :span="24" style="color: #222222; font-size: 18px; padding: 16px">
            <span><b> 上传图片：</b></span>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: row; overflow: auto; height: auto">
            <div
              style="
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                flex-direction: row;
                flex-wrap: wrap;
                align-items: flex-start;
              "
            >
              <ImageViewer ref="imageViewer" :images="showImagesList" />
              <div v-for="(i, key) in newData.images" :key="key" style="position: relative">
                <div
                  style="
                    width: 90px;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: start;
                  "
                >
                  <div style="position: relative">
                    <img
                      v-show="$store.state.step.selectStep === 0"
                      :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                      style="
                        width: 14px;
                        height: 14px;
                        float: right;
                        position: absolute;
                        z-index: 2;
                        right: 5px;
                        top: 5px;
                        cursor: pointer;
                      "
                      @click="deleteF(key, 0)"
                    />
                    <img
                      style="
                        background-color: #eff1f5;
                        width: 80px;
                        height: 80px;
                        margin: 5px;
                        cursor: pointer;
                        object-fit: contain;
                      "
                      :src="i"
                    />
                    <div class="actionIcon" style="left: 5px; bottom: 5px">
                      <img
                        :src="require('@/assets/common/image_preview.png')"
                        style="width: 20px; height: 20px; z-index: 4; cursor: pointer; object-fit: contain"
                        @click="showImages(0)"
                      />
                      <img
                        :src="require('@/assets/common/image_download.png')"
                        style="width: 20px; height: 20px; z-index: 4; cursor: pointer; object-fit: contain"
                        @click="downloadFile(i)"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style="
                    width: 80px;
                    word-break: break-all;
                    height: auto;
                    display: flex;
                    justify-content: center;
                    margin: 0 5px;
                  "
                >
                  <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                </div>
              </div>
              <div
                @click="openImageDrag"
                class="triggersCss"
                style="margin: 5px"
                v-if="$store.state.step.selectStep === 0"
              >
                <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
                选择图片
              </div>
            </div>
          </a-col>
          <a-col :span="24" style="color: #222222; font-size: 18px; padding: 16px">
            <span><b> 上传文件：</b></span>
          </a-col>
          <a-col :span="24">
            <div
              style="
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                flex-direction: row;
                flex-wrap: wrap;
                align-items: flex-start;
              "
            >
              <div v-for="(i, key) in newData.check_files" :key="key" style="position: relative; margin: 5px">
                <img
                  v-show="$store.state.step.selectStep === 0"
                  :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                  style="
                    width: 18px;
                    height: 18px;
                    float: right;
                    position: absolute;
                    z-index: 2;
                    right: 10px;
                    top: 0px;
                    cursor: pointer;
                  "
                  @click="deleteF(key, 1)"
                />
                <div
                  style="
                    width: 80px;
                    height: 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    justify-content: start;
                    position: relative;
                  "
                >
                  <img
                    v-if="
                      i.substring(i.lastIndexOf('.') + 1) === 'docx' || i.substring(i.lastIndexOf('.') + 1) === 'doc'
                    "
                    :src="require('@/assets/Fundraising/doc_icon@2x.png')"
                    style="width: 80px; height: 80px"
                  />
                  <img
                    v-else-if="i.substring(i.lastIndexOf('.') + 1) === 'txt'"
                    :src="require('@/assets/Fundraising/txt_icon@2x.png')"
                    style="width: 80px; height: 80px"
                  />
                  <img
                    v-else-if="i.substring(i.lastIndexOf('.') + 1) === 'xls'"
                    :src="require('@/assets/Fundraising/xls_icon@2x.png')"
                    style="width: 80px; height: 80px"
                  />
                  <img v-else :src="require('@/assets/Fundraising/fj_icon@2x.png')" style="width: 80px; height: 80px" />
                  <div class="actionIcon" style="">
                    <img
                      :src="require('@/assets/common/image_download.png')"
                      style="width: 20px; height: 20px; z-index: 4; cursor: pointer"
                      @click="downloadFile(i)"
                    />
                  </div>
                </div>
                <div style="width: 80px; word-break: break-all; height: auto; display: flex; justify-content: center">
                  <span>{{ i.substring(i.lastIndexOf('/') + 1) }}</span>
                </div>
              </div>
              <div
                style="
                  height: 100px;
                  width: 100px;
                  background-color: 999999;
                  display: flex;
                  flex-direction: column;
                  flex-wrap: nowrap;
                  align-items: center;
                  justify-content: center;
                  border: 1px solid rgb(203, 209, 225);
                "
                v-if="state.beginUpload"
              >
                <a-spin />
                正在上传
              </div>
              <upload-video
                v-if="$store.state.step.selectStep === 0"
                @uploadVideo="getUrl"
                @beginUpload="beginUpload"
                height="80px"
                width="80px"
                style="margin: 5px"
              />
            </div>
          </a-col>
          <a-col :span="24" v-if="dataStatus === 5 && $store.state.step.selectStep === 0">
            <a-button @click="putData" type="primary" style="float: right; margin: 10px">保存</a-button>
          </a-col>
        </a-card>
      </a-col>
      <a-modal
        v-model="state.testLoading"
        title="预览视频"
        ok-text="确认"
        cancel-text="取消"
        @ok="state.testLoading = false"
      >
        <!-- 视频预览,视频文件拓展名AVI、mov、rmvb、rm、FLV、mp4、3GP -->
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          @pause="pausePlay($event)"
          :options="playerOptions"
        />
      </a-modal>
      <a-modal
        v-model="state.uploadOpenLoading"
        title="上传图片"
        ok-text="确认"
        cancel-text="取消"
        width="600px"
        @ok="uploadNewDemand"
        @cancel="cancelData"
      >
        <dragImageUpload @imageReturn="getImagesUrl" areaHeight="200px" areaWidth="552px" />
        <div
          style="
            width: 100%;
            height: 100px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
          "
        >
          <div v-for="(i, key) in newdemand.files" :key="key" style="position: relative">
            <div
              v-show="key < 3"
              style="
                width: 100px;
                height: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: start;
              "
            >
              <div>
                <img
                  :src="require('@/assets/Fundraising/sc_icon@2x.png')"
                  style="
                    width: 14px;
                    height: 14px;
                    float: right;
                    position: absolute;
                    z-index: 2;
                    right: 10px;
                    top: 10px;
                    cursor: pointer;
                  "
                  @click="deleteF(key, 2)"
                />
                <img
                  style="
                    background-color: #eff1f5;
                    width: 80px;
                    height: 80px;
                    margin: 10px;
                    cursor: pointer;
                    object-fit: contain;
                  "
                  :src="i"
                  @click="showImages(1)"
                />
              </div>
            </div>
            <div
              v-show="key === 3"
              style="
                position: relative;
                width: 80px;
                height: 80px;
                float: left;
                margin: 5px;
                background: rgba(0, 0, 0, 0.3);
              "
            >
              <img class="imagesShow" :src="i" />
              <span class="imagesSpan" @click="showImages(1)">+{{ newdemand.files.length - 3 }}</span>
              <!-- <img v-if="i.file_extension === 'doc'" :src="require('@/assets/Fundraising/doc_icon@2x.png')" style="width: 90px; height: 90px" />
                <img v-else-if="i.file_extension === 'txt'" :src="require('@/assets/Fundraising/txt_icon@2x.png')" style="width: 90px; height: 90px" />
                <img v-else-if="i.file_extension === 'xls'" :src=" require('@/assets/Fundraising/xls_icon@2x.png')" style="width: 90px; height: 90px" />
                <img v-else :src=" require('@/assets/Fundraising/fj_icon@2x.png')" style="width: 90px; height: 90px" />
                {{ i.file_name }} -->
            </div>
          </div>
          <div class="upLoadDiv" @click="triggers(1)">
            <img :src="require('@/assets/Fundraising/tj_icon@2x.png')" style="width: 26px; height: 26px" />
            <span>上传资料</span>
            <input
              type="file"
              id="imagesBtn1"
              ref="imagesBtn1"
              accept="image/*"
              @change="getFlies($event)"
              multiple="multiple"
              style="display: none"
            />
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model="state.addUser"
        :title="modalTitle"
        @ok="addUser"
        width="720px"
        ok-text="确认"
        cancel-text="取消"
        @cancel="search = ''"
      >
        <a-input-group compact>
          <a-input-search
            style="width: 30%; left: 70%; margin: 10px; padding: 10px"
            placeholder="请输入手机号/用户名"
            v-model="search"
            @search="onSearch"
          />
        </a-input-group>
        <a-table
          :row-selection="{ onChange: onSelectChange }"
          bordered
          :pagination="pagination"
          :loading="state.lawyerLoading"
          :data-source="LawyerData"
          :row-key="(record) => record.user_id"
        >
          <a-table-column key="index" align="center" title="序号">
            <template slot-scope="record">
              {{ record.index }}
            </template>
          </a-table-column>

          <a-table-column key="nickname" title="名字">
            <template slot-scope="record">
              <a-avatar :size="26" icon="user" :src="record.avatar" />
              <label>{{ record.nickname }}</label>
            </template>
          </a-table-column>
          <a-table-column key="mobile" align="center" title="电话号码">
            <template slot-scope="record">
              {{ record.mobile }}
            </template>
          </a-table-column>
        </a-table>
      </a-modal>
      <a-drawer
        title="录音播放"
        placement="right"
        :closable="false"
        :visible="state.recordVisible"
        @close="state.recordVisible = false"
        width="400"
      >
        <single-audio-player :src="currentPlayRecord" />
      </a-drawer>
    </a-row>
  </div>
</template>
  <script>
import dragImageUpload from '@/components/Common/dragImageUpload.vue'
import uploadVideo from '@/components/Common/uploadVideo.vue'
import ImageViewer from '@/components/Image/ImageViewer'
import { uploadImage, UploadFiles } from '@/api/common'
import {
  postFundraisingMessage,
  putFundraisingRegistration,
  putFundraisingLitigant,
  postFundraisingMobile,
  postFundraisingSms,
  putFundraisingPutData,
  getFundraisingQuestionTags,
} from '@/api/fundraising'
import { getUserDialog } from '@/api/user'
export default {
  name: 'UserList',
  components: {
    uploadVideo,
    ImageViewer,
    dragImageUpload,
  },
  props: {
    condition: {
      type: Object,
      default: () => {
        return {}
      },
    },
    fundraisingProgressId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showImagesList: [],
      caseType: '',
      caseTypeList: [],
      newdemand: {
        files: [],
      },
      search: '',
      addtype: null,
      userMobile: null,
      LawyerData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getUserDialog(page, this.search)
          this.pagination.current = page
        },
      },
      state: {
        loading: false,
        recordVisible: false,
        addUser: false,
        lawyerLoading: false,
        uploadOpenLoading: false,
        testLoading: false,
        beginUpload: false,
      },
      modalTitle: '',
      currentPlayRecord: '',
      serviceNumber: '',
      serviceName: '',
      mobileNumber: '',
      newData: {
        creatorNickname: '',
        creatorMobile: '',
        litigantNickname: '',
        litigantMobile: '',
        appeal: '',
        content: '',
        images: [],
        check_files: [],
      },
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        autoplay: false,
        muted: false,
        loop: false,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [
          {
            // 类型
            type: 'video/mp4',
            // url地址
            src: '',
          },
        ],
        poster: '',
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,
        },
      },
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
    caseTypeChinese() {
      const value = this.userData.lawyer_tag_id
      let label = ''
      for (let i = 0; i < this.caseTypeList.length; i++) {
        for (let j = 0; j < this.caseTypeList[i].lawyer_tags.length; j++) {
          if (this.caseTypeList[i].lawyer_tags[j].lawyer_tag_id === value) {
            label = this.caseTypeList[i].lawyer_tags[j].lawyer_tag
          }
        }
      }
      return label
    },
  },
  watch: {},
  created() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    this.newData.litigantNickname = this.userData.litigant.nickname
    this.newData.litigantMobile = this.userData.litigant.mobile
    this.newData.creatorNickname = this.userData.creator.nickname
    this.newData.creatorMobile = this.userData.creator.mobile
    this.newData.appeal = this.userData.appeal
    this.newData.content = this.userData.content
    this.newData.images = this.userData.images
    this.newData.check_files = this.userData.check_files
    this.detailstService = JSON.parse(sessionStorage.getItem('订单详情'))
    this.dataStatus = this.detailstService.status
    this.fundraisingRegistrationId = this.detailstService.fundraising_registration_id
    this.getFundraisingQuestionTags()
  },
  mounted() {},
  methods: {
    beginUpload(data) {
      this.state.beginUpload = data
    },
    getUrl(data) {
      this.newData.check_files.push(data)
    },
    getFundraisingQuestionTags() {
      getFundraisingQuestionTags().then((data) => {
        this.caseTypeList = data.data
      })
    },
    downloadFile(value) {
      window.open(value)
    },
    goList() {
      const condition = this.condition
      this.$router.push({ name: 'FundraisingService', params: { condition } })
    },
    openRecord(value, e) {
      this.currentPlayRecord = value
      this.state.recordVisible = true
    },
    openmodal(addtype) {
      this.addtype = addtype
      this.state.addUser = true
      this.modalTitle = '选择用户'
      this.state.lawyerLoading = true
      this.getUserDialog(this.pagination.current, this.search)
    },
    addUser() {
      this.serviceNumber = this.userMobile
      this.serviceName = this.userName
      this.state.addUser = false
      const userId = this.userId
      putFundraisingLitigant(this.fundraisingRegistrationId, userId).then(() => {
        this.$message.success('成功选择当事人')
      })
      this.search = ''
    },
    getUserDialog(page, search) {
      getUserDialog(page, search)
        .then((data) => {
          this.LawyerData = data.data.data
          this.pagination.total = data.data.total
          this.pagination.pageSize = 6
          for (let i = 0; i < this.LawyerData.length; i++) {
            this.LawyerData[i].index = i + 1
          }
        })
        .finally(() => {
          this.state.lawyerLoading = false
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      if (selectedRows.length === 0) {
      } else {
        this.userMobile = selectedRows[0].mobile
        this.userName = selectedRows[0].nickname
        this.userId = selectedRows[0].user_id
      }
    },
    onSearch(value) {
      this.getUserDialog(1, value)
    },
    // handleCancel() {
    //   this.search = ''
    // },
    copyNumber() {
      var input = document.getElementById('input')
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('已复制！')
      } else {
        this.$message.error('复制失败！')
      }
    },
    onServiceNumber() {
      const Id = this.fundraisingRegistrationId
      const nickname = this.userData.nickname
      const mobile = this.userData.mobile
      const content = this.userData.content
      const images = this.userData.images
      if (
        this.userData.litigant.nickname === null ||
        this.userData.litigant.mobile === '' ||
        this.userData.content === null ||
        this.userData.images === []
      ) {
        const that = this
        that.$confirm({
          title: '请确认是否保存当事人信息?',
          okText: '保存',
          cancelText: '取消',
          onOk() {
            if (images.length === 0) {
              that.$message.error('请上传案件经过图片')
            } else {
              putFundraisingRegistration(Id, nickname, mobile, content, JSON.stringify(images)).then((data) => {
                that.userData.litigant.nickname = nickname
                that.userData.litigant.mobile = mobile
                that.userData.content = content
                that.userData.images = images
                that.$message.success('保存成功')
              })
            }
          },
          onCancel() {},
          class: 'test',
        })
      } else {
        const serviceNumber = String(this.serviceNumber)
        postFundraisingMessage(this.fundraisingRegistrationId, serviceNumber)
          .then(() => {
            this.$message.success('提醒成功')
          })
          .catch(() => {
            this.$message.warning('请确认发送认证的号码')
          })
      }
    },
    sendSMS(e, type) {
      if (type === 0) {
        postFundraisingSms(e, this.fundraisingRegistrationId).then((data) => {
          this.$message.success('发送成功')
        })
      } else {
        postFundraisingMobile(e, this.fundraisingRegistrationId).then((data) => {
          this.mobileNumber = data.data.mobile
        })
      }
    },
    getFlies(event) {
      if (event.target) {
        var images1 = []
        for (let i = 0; i < event.target.files.length; i++) {
          images1.push(event.target.files[i])
        }
        console.log(images1)
        UploadFiles(images1).then((data) => {
          console.log(data.data)
          for (let index = 0; index < data.data.length; index++) {
            this.newdemand.files.push(data.data[index].url)
          }
          event.target.value = ''
          this.$message.success('上传成功')
        })
      }
    },
    deleteF(e, type) {
      if (type === 0) {
        this.newData.images.splice(e, 1)
      } else if (type === 1) {
        this.newData.check_files.splice(e, 1)
      } else if (type === 2) {
        this.newdemand.files.splice(e, 1)
      }
    },
    triggers(e) {
      if (e === 0) {
        this.$refs.imagesBtn.dispatchEvent(new MouseEvent('click'))
      } else {
        this.$refs.imagesBtn1.dispatchEvent(new MouseEvent('click'))
      }
    },
    showImages(type) {
      if (type === 0) {
        this.showImagesList = this.newData.images
      } else {
        this.showImagesList = this.newdemand.files
      }
      this.$refs['imageViewer'].show()
    },
    putData(type) {
      const Id = this.fundraisingRegistrationId
      const creatorNickname = this.newData.creatorNickname
      const creatorMobile = this.newData.creatorMobile
      const litigantNickname = this.newData.litigantNickname
      const litigantMobile = this.newData.litigantMobile
      const appeal = this.newData.appeal
      const content = this.newData.content
      const images = this.newData.images
      const checkFiles = this.newData.check_files
      this.userData.litigant.nickname = this.newData.litigantNickname
      this.userData.litigant.mobile = this.newData.litigantMobile
      this.userData.creator.nickname = this.newData.creatorNickname
      this.userData.creator.mobile = this.newData.creatorMobile
      this.userData.appeal = this.newData.appeal
      this.userData.content = this.newData.content
      this.userData.images = this.newData.images
      this.userData.check_files = this.newData.check_files
      putFundraisingPutData(
        Id,
        creatorNickname,
        creatorMobile,
        litigantNickname,
        litigantMobile,
        content,
        appeal,
        JSON.stringify(images),
        JSON.stringify(checkFiles)
      ).then((data) => {
        sessionStorage.setItem('userData', JSON.stringify(this.userData))
        if (type !== 1) {
          this.$message.success('保存成功')
        }
      })
    },
    uploadFile() {
      this.state.uploadOpenLoading = false
      console.log('上传资料')
    },
    // 根据选择框改视频内容
    changeVideo(value) {
      switch (value) {
        case 'jack':
          this.playerOptions.sources[0].src = ''
          break
        case 'lucy':
          this.playerOptions.sources[0].src = ''
          break
        case 'Yiminghe':
          this.playerOptions.sources[0].src = ''
          break
        default:
          break
      }
    },
    pausePlay(player) {
      // 关闭弹窗-停止播放
      this.player.pause()
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      // 设置视频src
      if (this.$refs.videoPlayer === undefined) {
        this.playerOptions.sources[0] = {
          type: 'video/mp4',
          src: row.video,
        }
      } else {
        // 防止页面重复打开会播放同一个视频||暂时替代方案
        const palyer = this.$refs.videoPlayer.player
        palyer.src(row.video)
      }
    },

    uploadNewDemand() {
      // vue 数组实时更新，转化json再转回来可以避免
      this.newData.images = JSON.parse(JSON.stringify(this.newdemand.files))
      this.state.uploadOpenLoading = false
    },
    cancelData() {
      this.newdemand.files = []
      this.state.uploadOpenLoading = false
    },
    getImagesUrl(data) {
      for (let i = 0; i < data.length; i++) {
        this.newdemand.files.push(data[i].url)
      }
      console.log(data)
    },
    openImageDrag() {
      this.state.uploadOpenLoading = true
      this.newdemand.files = JSON.parse(JSON.stringify(this.newData.images))
    },
  },
}
</script>
 <style scoped lang="less">
.triggersCss {
  cursor: pointer;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  justify-content: center;
  border: 2px dashed #0000004c;
}
.titleStyle {
  font-size: 18px;
  font-weight: bold;
  color: #222222;
}
.upLoadDiv {
  width: 96px;
  height: 96px;
  border: 2px dashed rgb(203, 209, 225);
  border-radius: 8px;
  margin-top: 10px;
  color: #787e8d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.labelClass {
  height: 96px;
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  border: 1px solid #cbd1e1;
  border-radius: 0 4px 4px 0;
  overflow: auto;
}
.imagesShow {
  object-fit: contain;
  background-color: #eff1f5;
  width: 80px;
  height: 80px;
  cursor: pointer;
  top: 50%;
  text-align: center;
}

.imagesSpan {
  cursor: pointer;
  width: 80px;
  height: 80px;
  display: block;
  padding-left: 20px;
  line-height: 80px;
  background-color: rgba(0, 0, 0, 0.9);
  opacity: 0.9;
  position: absolute;
  bottom: 0;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.actionIcon {
  width: 80px;
  height: 40px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.9;
  position: absolute;
  z-index: 999;
  color: #fff;
  font-size: 32px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
}
</style>
