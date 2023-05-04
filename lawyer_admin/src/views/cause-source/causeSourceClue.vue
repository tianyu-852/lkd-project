<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">线索数量：{{ pagination.total }}</span>
      
      <!-- 时间筛选 -->
      <a-range-picker
        @change="onRangePickerChange"
        @ok="_getCauseSourceClueData(1)"
        style="width: 340px;"
        format="YYYY-MM-DD HH:mm:ss"
        :default-value="[timeFactorInfo.startDate, timeFactorInfo.endDate]"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
      />

      <!-- <span style="font-size: 14px; font-weight: 500; margin-left: 30px; margin-right: 4px;">用户行为筛选：</span>
      <a-select style="width: 140px; margin-top: 5px;" v-model="userActionId" allowClear @change="onLabelSelectChangeEvt">
        <a-select-option v-for="sItem in userActionSelectList" :value="sItem.value" :key="sItem.value">
          {{ sItem.label }}
        </a-select-option>
      </a-select> -->

      <!-- 导出文件按钮 -->
      <a-button v-if="(userInfo && !lawManagerRoleList.map(item => item.accountId).includes(userInfo.id + ''))" style="margin-left: auto; background: #2cbf78; border-color: #2cbf78; color: #fff" @click="openExportClueModal">导出数据</a-button>
    </a-layout-header>

    <a-layout-header class="data-statistics">
      <a-tabs v-model="activeNavTabKey" :animated="false" @change="onNavTabChangeEvt">
        <a-tab-pane v-for="tItem in navTabList" :key="tItem.key" :tab="tItem.name"></a-tab-pane>
      </a-tabs>

      <span style="font-size: 14px; font-weight: 500; margin-left: 30px; margin-right: 4px;">标签筛选：</span>
      <a-select style="width: 140px; margin-top: 5px;" v-model="factorLabelId" allowClear @change="onLabelSelectChangeEvt">
        <a-select-option v-for="sItem in labelSelectList" :value="sItem.value" :key="sItem.value">
          {{ sItem.label }}
        </a-select-option>
      </a-select>

      <span style="font-size: 14px; font-weight: 500; margin-left: 30px; margin-right: 4px;">地区筛选：</span>
      <a-cascader :options="regionCascaderList" placeholder="请选择地区" @change="onUserRegionCascaderChangeEvt" />
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button v-if="activeNavTabKey == 1" style="margin-right: 20px;" size="small" type="primary" @click="assignModal.assignNum = (pagination.total + ''); assignModal.isShowAssignModal = true">分配</a-button>
        <div v-if="['1', '2', '3'].includes(activeNavTabKey)" class="assign-data-wrap">
          <div v-for="(aItem, aIndex) in assignData" :key="aIndex" class="assign-data-item">
            法务: {{ aItem.admin_nickname }} ({{ aItem.ready }}/{{ aItem.all }})
          </div>
        </div>
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getCauseSourceClueData(1)">刷新</a-button>
      </div>

      <!-- 线索表格 -->
      <a-spin :spinning="isShowSpinning">
        <div class="table-clue">
          <div v-for="(tItem, tIndex) in tableDataList" :key="tIndex" class="clue-table-item">
            <!-- 表格数据 -->
            <div class="table-column-wrap">
              <div class="column-cell" style="flex: none; flex-basis: 50px;">
                <div v-if="tIndex === 0" class="column-head"><span>序号</span></div>
                <div class="column-body">{{ tIndex + 1 }}</div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>用户/手机号</span></div>
                <div class="column-body" style="flex-direction: column;">
                  <span>{{ tItem.user.nickname }}</span>
                  <span>{{ tItem.user.mobile }}</span>
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>地区</span></div>
                <div class="column-body">
                  <span>{{ tItem.user.location_province }}/{{ tItem.user.location_city }}</span>
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>标签</span></div>
                <div class="column-body colum-body-label">
                  <div v-if="tItem.label && tItem.label.length" class="column-label-wrap" @click="openPutLabelModal(tItem, 1)">
                    <a-tag v-for="(lItem, lIndex) in tItem.label" :key="lIndex" color="blue">{{ lItem.name }}</a-tag>
                  </div>
                  <a-icon v-if="userInfo && !userInfo.role.permissionList.includes('cause_source_remark_edit')" type="plus-circle" @click="openPutLabelModal(tItem, 0)" />
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>标签法务</span></div>
                <div class="column-body">
                  <span>{{ tItem.process_user_ids | lawManagerNameFilter }}</span>
                  <!-- <span>{{ tItem.process_user_ids ? tItem.process_user_ids.admin_name : '' }}</span> -->
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>记录更新时间</span></div>
                <div class="column-body">
                  <span>{{ tItem.updated_at }}</span>
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>用户行为最新时间</span></div>
                <div class="column-body">
                  <span>{{ tItem.user_updated_at }}</span>
                </div>
              </div>

              <div v-if="['4'].includes(activeNavTabKey)" class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>操作</span></div>
                <div class="column-body">
                  <a-button type="link" style="padding: 0;" @click="$refs.causeSourceFeatureDrawerRef.openPublishCauseSourceDrawer(tItem)">发布</a-button>
                </div>
              </div>
            </div>

            <div class="remark-wrap" @click="openAddRemarkModal(tItem)">
              <span style="font-size: 14px; font-weight: 600; color: #333;">线索备注：</span>
              <span style="padding-right: 6px;">{{ tItem.remark }}</span>
              <a-icon v-if="userInfo && !userInfo.role.permissionList.includes('cause_source_remark_edit')" type="plus-circle" />
            </div>

            <a-collapse accordion expandIconPosition="right">
              <!-- 发帖 -->
              <a-collapse-panel key="1">
                <div slot="header">
                  <div class="collapse-panel-header-dynamic">
                    <div class="num-value"><span class="value-title">发帖</span><span style="color: #41b583;">（{{ tItem.dynamicInfo.dynamicTotal }}）</span></div>
                    <div class="dynamic-overview">
                      <span class="value-title">帖子1：</span>
                      <span @click.stop="openDynamicContentModal(tItem.dynamicInfo.dynamicList[0].title)">{{ tItem.dynamicInfo.dynamicList[0] ? tItem.dynamicInfo.dynamicList[0].title : '暂未发帖' }}</span>
                    </div>
                    <div class="dynamic-num"><span class="value-title">浏览：</span><span style="color: #409EFF;">{{ tItem.dynamicInfo.dynamicList[0] ? tItem.dynamicInfo.dynamicList[0].view_number : 0 }}</span></div>
                    <div class="dynamic-num"><span class="value-title">评论：</span><span style="color: #409EFF;">{{ tItem.dynamicInfo.dynamicList[0] ? tItem.dynamicInfo.dynamicList[0].comment_number : 0 }}</span></div>
                    <div class="dynamic-num"><span class="value-title">点赞：</span><span style="color: #409EFF;">{{ tItem.dynamicInfo.dynamicList[0] ? tItem.dynamicInfo.dynamicList[0].like_number : 0 }}</span></div>
                    <div class="dynamic-num"><span class="value-title">发布时间：</span><span style="color: #409EFF;">{{ tItem.dynamicInfo.dynamicList[0] ? tItem.dynamicInfo.dynamicList[0].created_at : '--' }}</span></div>
                    <div v-if="tItem.dynamicInfo.dynamicList[0]" class="dynamic-btn" @click.stop="navToDynamicDetail(tItem.dynamicInfo.dynamicList[0])">
                      <span>查看详情</span>
                      <a-icon type="double-right" style="color: #409EFF; margin-left: 2px;" />
                    </div>
                  </div>
                </div>

                <div class="collapse-panel-body-dynamic">
                  <div v-for="(dItem, dIndex) in tItem.dynamicInfo.dynamicList.slice(1)" :key="dIndex" class="dynamic-item">
                    <div class="dynamic-overview">
                      <span class="value-title">帖子{{ dIndex + 2 }}：</span>
                      <span @click.stop="openDynamicContentModal(dItem.title)">{{ dItem.title }}</span>
                    </div>
                    <div class="dynamic-num"><span class="value-title">浏览：</span><span style="color: #409EFF;">{{ dItem.view_number }}</span></div>
                    <div class="dynamic-num"><span class="value-title">评论：</span><span style="color: #409EFF;">{{ dItem.comment_number }}</span></div>
                    <div class="dynamic-num"><span class="value-title">点赞：</span><span style="color: #409EFF;">{{ dItem.like_number }}</span></div>
                    <div class="dynamic-num"><span class="value-title">发布时间：</span><span style="color: #409EFF;">{{ dItem.created_at }}</span></div>
                    <div class="dynamic-btn" @click.stop="navToDynamicDetail(dItem)">
                      <span>查看详情</span>
                      <a-icon type="double-right" style="color: #409EFF; margin-left: 2px;" />
                    </div>
                  </div>
                </div>
              </a-collapse-panel>
              
              <!-- 录音 -->
              <a-collapse-panel key="2">
                <div slot="header">
                  <div class="collapse-panel-header-voice">
                    <div class="num-value"><span class="value-title">录音</span><span style="color: #ff9900;">（{{ tItem.voiceInfo.voiceTotal }}）</span></div>
                    <div class="voice-wrap">
                      <div v-for="(vItem, vIndex) in tItem.voiceInfo.voiceList.slice(0, 6)" :key="vIndex" class="voice-item">
                        <div class="voice-info">{{ vItem.other.nickname }}, {{ vItem.duration }}秒</div>
                        <a-button type="link" size="small" style="padding: 0; margin-right: 5px;" @click.stop="translateVoice(vItem)">翻译</a-button>
                        <a-button type="link" size="small" style="padding: 0;" @click.stop="playVoice(vItem)">播放</a-button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="collapse-panel-body-voice">
                  <div v-for="(vItem, vIndex) in tItem.voiceInfo.voiceList.slice(6)" :key="vIndex" class="voice-item">
                    <div class="voice-info">{{ vItem.other.nickname }}, {{ vItem.duration }}秒</div>
                    <a-button type="link" size="small" style="padding: 0; margin-right: 5px;" @click.stop="translateVoice(vItem)">翻译</a-button>
                    <a-button type="link" size="small" style="padding: 0;" @click.stop="playVoice(vItem)">播放</a-button>
                  </div>
                </div>
              </a-collapse-panel>

              <!-- 私信-->
              <a-collapse-panel key="3">
                <div slot="header">
                  <div class="collapse-panel-header-chat">
                    <div class="num-value"><span class="value-title">私信</span><span style="color: #F56C6C;">（{{ tItem.chatInfo.chatTotal }}）</span></div>
                    <div v-for="(cItem, cIndex) in tItem.chatInfo.chatList.slice(0, 6)" :key="cIndex" class="chat-item">
                      <div class="chat-info">{{ cItem.user && cItem.user.nickname }}</div>
                      <a-button type="link" size="small" style="padding: 0;" @click.stop="openChatModal(tItem.user, cItem)">查看</a-button>
                    </div>
                  </div>
                </div>

                <div class="collapse-panel-body-chat">
                  <div v-for="(cItem, cIndex) in tItem.chatInfo.chatList.slice(6)" :key="cIndex" class="chat-item">
                    <div class="chat-info">{{ cItem.user && cItem.user.nickname }}</div>
                    <a-button type="link" size="small" style="padding: 0;" @click.stop="openChatModal(tItem.user, cItem)">查看</a-button>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
        
        <!-- table 分页器 -->
        <div class="table-bottom">
          <a-pagination
            style="margin-left: auto;"
            show-quick-jumper
            v-model="pagination.current"
            :pageSize="pagination.pageSize"
            :total="pagination.total"
            @change="onPaginationChangeEvt" />
        </div>
      </a-spin>
    </a-card>

    <!-- 案源精选 组件 -->
    <causeSourceFeatureDrawer ref="causeSourceFeatureDrawerRef" />

    <!-- 语音翻译 modal -->
    <voice-translate-modal ref="voiceTranslateModalRef" />

    <!-- 帖子详情 -->
    <a-modal title="帖子详情" :footer="null" v-model="isShowDynamicModal">
      <p class="dynamic-modal-box">{{ dynamicModalContent }}</p>
    </a-modal>

    <!-- 分配线索 -->
    <a-modal
      title="分配「该时间段」内的线索"
      v-model="assignModal.isShowAssignModal"
      :afterClose="onAssignModalAfterCloseEvt"
      destroyOnClose
      @ok="onClueAssignModalOkEvt"
    >
      <div class="assign-modal-box">
        <div class="assign-title">标签法务：</div>
        <a-checkbox-group @change="onLawManagerCheckboxChange">
          <a-row>
            <a-col v-for="lItem in lawManagerRoleList" :key="lItem.admin_id" :span="6">
              <a-checkbox :value="lItem.admin_id">{{ lItem.nickname }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>

        <div class="assign-title">分配方式：</div>
        <div class="assign-mode">*平均分配</div>

        <div class="assign-title">分配数量：</div>
        <div class="assign-num-wrap">
          <a-input v-model="assignModal.assignNum" :maxLength="20" style="width: 160px; margin-right: 20px;" placeholder="请输入分配数量" allowClear />

          <img v-if="Number(assignModal.assignNum) >= pagination.total" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
          <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
          <a-button type="link" size="small" @click="assignModal.assignNum = pagination.total">全部</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 添加线索标签 modal -->
    <a-modal
      v-model="isShowLabelModal"
      :width="600"
      :afterClose="() => labelCheckedIds = []"
      :footer="null"
      destroyOnClose
    >
      <div class="label-modal">
        <div class="modal-header">{{ labelModalType === 1 ? '更新标签' : '添加标签' }}</div>
        <div class="modal-body">
          <a-checkbox-group :defaultValue="labelCheckedIds" @change="onLabelCheckboxChange">
            <a-row>
              <a-col v-for="lItem in labelCheckboxList" :key="lItem.customer_label_id" :span="8">
                <a-checkbox :value="lItem.customer_label_id">{{ lItem.name }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>

        <div class="modal-footer">
          <a-button @click="isShowLabelModal = false">取消</a-button>
          <a-button type="primary" style="background: #1790ff; border-color: #1790ff; margin-left: 20px;" @click="onLabelModalOkEvt">确定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 备注信息 modal -->
    <a-modal
      v-model="remarkModal.isShowRemarkModal"
      :width="500"
      :afterClose="() => { remarkModal.remark = ''; remarkModal.recordId = 0; }"
      class="remark-modal"
      :footer="null"
      destroyOnClose
    >
      <div class="remark-modal-box">
        <div class="modal-header">更新备注</div>
        <div class="modal-body">
          <a-textarea v-model="remarkModal.remark" placeholder="请输入备注信息" :auto-size="{ minRows: 7 }" />
        </div>

        <div class="modal-footer">
          <a-button @click="remarkModal.isShowRemarkModal = false">取消</a-button>
          <a-button type="primary" style="background: #1790ff; border-color: #1790ff; margin-left: 20px;" @click="addRemarkRecord">确定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 录音 modal -->
    <a-modal
      v-model="voiceModal.isShowVoiceModal"
      title="录音播放"
      :width="400"
      :footer="null"
      class="voice-modal"
      destroyOnClose>
      <div class="voice-modal-box">
        <audio ref="audioRef" controls="controls" src="" id="audio" />
      </div>
    </a-modal>

    <!-- 导出线索 modal -->
    <a-modal
      v-model="exportClueModal.isShowExportModal"
      :width="500"
      :afterClose="() => exportClueModal.exportLabelCheckedIds = []"
      :footer="null"
      destroyOnClose
    >
      <div class="label-modal">
        <div class="modal-header" style="margin-bottom: 0;">选择标签导出线索数据</div>
        <div style="margin-bottom: 20px; color: #999;">提示: 导出的是已标记的新线索 !</div>
        <div class="modal-body">
          <a-checkbox-group @change="onExportModalCheckboxChangeEvt">
            <a-row>
              <a-col v-for="lItem in exportClueModal.exportLabelCheckboxList" :key="lItem.customer_label_id" :span="8">
                <a-checkbox :value="lItem.customer_label_id">{{ lItem.name }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>

        <div class="modal-footer">
          <a-button @click="exportClueModal.isShowExportModal = false">取消</a-button>
          <a-button type="primary" style="background: #1790ff; border-color: #1790ff; margin-left: 20px;" @click="confirmExportClueData">确定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 聊天记录 modal -->
    <a-modal v-model="chatModal.isShowChatModal" :footer="null" :width="500" class="chat-modal" :afterClose="onChatRecordModalAfterClose">
      <div class="addIntendedUser">
        <div class="addIntendedUser-title">
          <a-date-picker style="width: 140px" v-model="chatModal.chatDate" @change="onChateRecordModalDateChangeEvt" />
          <span>聊天记录</span>
          <div style="width: 140px"></div>
        </div>
        <div class="addIntendedUser-main">
          <div
            v-for="(i, key) in chatModal.chatRecordList"
            :key="key"
            style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center"
          >
            <div :class="i.from_user.nickname === chatModal.chatRecordList[0].from_user.nickname ? 'leftUser' : 'rightUser'">
              <div v-show="i.from_user.nickname === chatModal.chatRecordList[0].from_user.nickname" class="avatarDiv">
                <img :src="i.from_user.avatar" />
              </div>

              <div
                style="display: flex; flex-direction: column; align-items: flex-start; flex-wrap: nowrap; margin: 0 8px"
                :style="
                  i.from_user.nickname !== chatModal.chatRecordList[0].from_user.nickname ? 'align-items: flex-end;' : ''
                "
              >
                <span>
                  {{ i.from_user.nickname }}
                </span>
                <div
                  :class="
                    i.from_user.nickname === chatModal.chatRecordList[0].from_user.nickname ? 'leftChatUser' : 'rightChatUser'
                  "
                >
                  {{ i.content }}
                </div>
              </div>

              <div v-show="i.from_user.nickname !== chatModal.chatRecordList[0].from_user.nickname" class="avatarDiv">
                <img :src="i.from_user.avatar" />
              </div>
            </div>
            <!-- <div class="chatTitle" v-show="calculationTime(key)"> -->
            <div class="chatTitle" v-show="calculationTime(key)">
              {{ i.created_at }}
            </div>
          </div>

          <div class="chatTitle" v-if="chatModal.chatRecordList.length < chatModal.chatRecordTotal && !chatModal.isShowMoreChatRecordLoading" @click="loadMoreChatRecord">查看更多</div>
          <div v-if="chatModal.isShowMoreChatRecordLoading">正在加载 <a-icon type="sync" spin /></div>
        </div>
        <div class="addIntendedUser-action">
          <a-button @click="chatModal.isShowChatModal = false" type="primary" style="background: #3764ff; border-color: #3764ff">关闭</a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import JSONbig from 'json-bigint'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import causeSourceFeatureDrawer from './components/causeSourceFeatureDrawer'
import voiceTranslateModal from '@/components/voice-translate-modal/voice-translate-modal'
import * as causeSourceApi from '@/api/causeSourceApi'
import * as chatApi from '@/api/user'
import * as sellApi from '@/api/sellApi'
import { mapState } from 'vuex'

// 跟进记录 modal info
const REMARK_MODAL_INFO = {
  remark: '', // 备注内容
  isShowRemarkModal: false, // 是否显示
  recordId: 0, // 待操作记录 id
}

// 分配 modal
const ASSIGN_MODAL = {
  isShowAssignModal: false, // 是否显示分配 modal
  assignLawManagerCheckedIds: [], // 分配法务 ids
  assignNum: '', // 分配数量
}

let that

export default {
  name: 'CauseSourceCluePage',
  components: { TextWithRowButton, voiceTranslateModal, causeSourceFeatureDrawer },
  filters: {
    lawManagerNameFilter(lawManager) {
      let  _lawManagerName = '未分配'
      if (lawManager) {
        const findLawManager = that.lawManagerRoleList.find(item => (item.admin_id + '') === lawManager.labeler_admin_id)
        findLawManager && (_lawManagerName = findLawManager.nickname)
      }
      return _lawManagerName
    }
  },
  data() {
    return {
      navTabList: [{ name: '新线索', key: '1' }, { name: '已分配', key: '2' }, { name: '已标记', key: '3' }, { name: '已导出', key: '5' }],
      activeNavTabKey: '1', // 当前激活导航 tab key
      lawManagerRoleList: [], // 标签法务列表

      isShowSpinning: false, // 是否显示加载状态
      tableDataList: [],
      pagination: { total: 0, current: 1, pageSize: 5, },

      assignData: [], // 法务分配数据信息

      // 时间条件
      timeFactorInfo: {
        startDate: moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss'), // 开始时间
        endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'), // 结束时间
      },

      labelSelectList: [], // 标签 select 列表
      factorLabelId: '', // 选中的标签 id

      userActionSelectList: [{ label: '存在发帖', value: 1 }, { label: '存在录音', value: 2 }, { label: '存在私信', value: 3 }], // 用户行为 select 列表
      userActionId: '', // 用户行为 id

      regionCascaderList: [], // 地区 cascader 列表
      regionFactorInfo: { province_id: '', city_id: '' }, // 地区条件

      isShowDynamicModal: false, // 是否显示帖子内容 modal
      dynamicModalContent: '', // 动态内容

      chatModal: {
        isShowChatModal: false, // 是否显示帖子内容 modal
        chatFromUserId: '',
        chatReceiveUserId: '',
        chatDate: '',
        chatRecordList: [],
        chatRecordPage: 1,
        chatRecordTotal: 0,
        isShowMoreChatRecordLoading: false,
      },

      isShowLabelModal: false, // 是否打开添加标签 Modal
      labelCheckboxList: [], // 标签 checkbox 列表
      labelCheckedIds: [], // 选中的标签 ids
      labelModalType: 0, // 标签 Modal 类型 0: 添加 1: 更新
      putClueUserId: 0, // 待更新线索用户 id

      voiceModal: {
        isShowVoiceModal: false, // 是否显示 voice Modal
      },

      exportClueModal: {
        isShowExportModal: false, // 是否打开导出标签 Modal
        exportLabelCheckboxList: [], // 导出 标签 checkbox 列表
        exportLabelCheckedIds: [], // 导出 选中的标签 ids
      },

      remarkModal: { ...REMARK_MODAL_INFO }, // 备注 modal 
      assignModal: { ...ASSIGN_MODAL }, // 分配 modal 
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  beforeCreate() { that = this },
  async created() {
    // 生产环境 => 65: 高忆涵后台账号 12: 标签=企业
    // 直接进入「已标记 tab」, 并且标签筛选选中「企业」
    if ([65].includes(this.userInfo.id)) {
      this.navTabList.shift()
      this.navTabList.shift()
      this.navTabList.pop()
      this.activeNavTabKey = '3'
      this.factorLabelId = 12 // 企业标签
      try {
         // 清空消息提醒数据
         const qiYeSetParam = { type: 'set', val: 0 }
         await causeSourceApi.getCauseSourceClueQiyeDataApi(qiYeSetParam)
       } catch (error) {
         console.log(error)
       }
    }

    // 有标签权限的 后台账号
    if (this.userInfo.customer_label_ids) {
      this.navTabList.shift()
      this.navTabList.shift()
      this.navTabList.pop()
      this.activeNavTabKey = '3'
    }

    this._getlawManagerRoleList()
    this._getCauseSourceClueLabelList()
    this._getRegionList()
    this._getCauseSourceClueData()
  },
  methods: {
    moment,

    /**
     * 获取标签法务列表
     */
     async _getlawManagerRoleList() {
       try {
         const { data: lawManagerRoleData } = await causeSourceApi.getlawManagerRoleApi()
         this.lawManagerRoleList = lawManagerRoleData

         if (this.lawManagerRoleList.findIndex(item => item.admin_id == this.userInfo.id) >= 0) {
          this.navTabList.shift()
          this.activeNavTabKey = '2'
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取标签列表
     */
     async _getCauseSourceClueLabelList() {
       const param = { page: 1, size: 100, type: 2 }

       try {
         const { data: labelListData } = await sellApi.getSellLabelListApi(param)
         this.labelCheckboxList = labelListData.data
         this.exportClueModal.exportLabelCheckboxList = labelListData.data

         // 标签筛选 select 列表
         for (const lItem of labelListData.data) {
           const selectOpt = { label: lItem.name, value: lItem.customer_label_id }
           this.labelSelectList.push(selectOpt)
         }

         //  有标签权限的 后台账号 过滤出相应的标签
         if (this.userInfo.customer_label_ids) {
           this.labelSelectList = this.labelSelectList.filter(item => {
            return JSON.parse(this.userInfo.customer_label_ids).includes(item.value)
           })
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取地区列表
     */
    async _getRegionList() {
      try {
        const { data: lawyerRegionData } = await causeSourceApi.getLawyerRegionListApi()
        const regionCommonCityList = lawyerRegionData.cities

        var _regioinOptionList = []
        for (let i = 0; i < regionCommonCityList.length; i++) {
          _regioinOptionList.push({ label: regionCommonCityList[i].name, value: regionCommonCityList[i].district_id, children: [] })
          for (let j = 0; j < regionCommonCityList[i].cities.length; j++) {
            _regioinOptionList[i].children.push({ label: regionCommonCityList[i].cities[j].name, value: regionCommonCityList[i].cities[j].district_id })
          }
        }

        this.regionCascaderList = _regioinOptionList
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 案源线索分配数据
     */
    async _getCauseSourceClueAssignData() {
      try {
        const { data: clueAssignData } = await causeSourceApi.getCauseSourceClueAssignDataApi()
        this.assignData = clueAssignData
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听地区筛选选择 事件
     */
    onUserRegionCascaderChangeEvt(value, selectedOptions) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]
      this._getCauseSourceClueData()
    },

    /**
     * 监听导航 tab 切换面板的回调
     */
    onNavTabChangeEvt(activeKey) {
      this.pagination.current = 1
      this._getCauseSourceClueData()
    },

    /**
     * 监听标签 select change 事件
     */
    onLabelSelectChangeEvt() {
      this._getCauseSourceClueData()
    },

    /**
     * 获取案源线索数据
     */
    async _getCauseSourceClueData() {
      const { timeFactorInfo, pagination } = this

      this.isShowSpinning = true
      const param = {
        page: pagination.current,
        size: pagination.pageSize,
        status: Number(this.activeNavTabKey),
        start_time: timeFactorInfo.startDate,
        end_time: timeFactorInfo.endDate,
       }
       // 标签筛选
       this.factorLabelId && (param.label = JSON.stringify([this.factorLabelId]))
       // 地区筛选
       this.regionFactorInfo.city_id && (param.city_id = this.regionFactorInfo.city_id)

       try {
         const { data: causeSourceClueData } = await causeSourceApi.getCauseSourceClueListApi(param)
         this.tableDataList = causeSourceClueData.data.map(item => {
          item.dynamicInfo = { dynamicList: [], dynamicTotal: 0 }
          item.voiceInfo = { voiceList: [], voiceTotal: 0 }
          item.chatInfo = { chatList: [], chatTotal: 0 }
          return item
         })
         this.pagination.total = causeSourceClueData.total

         this.tableDataList.forEach((item, index) => {
           this._getUserDynamicList(item.user.user_id, index)
           this._getUserVoiceRecordList(item.user.user_id, index)
           this._getUserChatRecordList(item.user.user_id, index)
         })
         this._getCauseSourceClueAssignData()

         this.isShowSpinning = false
       } catch (error) {
         this.isShowSpinning = false
         console.log(error)
       }
    },

    /**
     * 获取案源线索用户帖子列表
     */
    async _getUserDynamicList(userId, tableIndex) {
      const param = {
        user_id: JSONbig.stringify(userId),
        page: 1,
        search_type: 0,
        order_type: 1,
       }

       try {
         const { data: dynamicData } = await causeSourceApi.getCauseSourceClueUserDynamicListApi(param)
         this.tableDataList[tableIndex].dynamicInfo.dynamicList = dynamicData.data
         this.tableDataList[tableIndex].dynamicInfo.dynamicTotal = dynamicData.total
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取用户录音记录列表
     */
     async _getUserVoiceRecordList(userId, tableIndex) {
       const param = { page: 1, user_id: JSONbig.stringify(userId), }

       try {
         const { data: voiceRecordData } = await causeSourceApi.getCauseSourceClueUserVoiceListApi(param)
         this.tableDataList[tableIndex].voiceInfo.voiceList = voiceRecordData.data
         this.tableDataList[tableIndex].voiceInfo.voiceTotal = voiceRecordData.total
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取用户聊天记录列表
     */
     async _getUserChatRecordList(userId, tableIndex) {
       const param = {
         page: 1,
         user_id: JSONbig.stringify(userId),
       }

       try {
         const { data: chatRecordData } = await causeSourceApi.getCauseSourceClueUserChatListApi(param)
         this.tableDataList[tableIndex].chatInfo.chatList = chatRecordData
         this.tableDataList[tableIndex].chatInfo.chatTotal = chatRecordData.length
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听 pagination 页码改变回调
     */
    onPaginationChangeEvt(page) {
      this._getCauseSourceClueData()
    },
    
    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.timeFactorInfo.startDate = dateStrAry[0]
      this.timeFactorInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getCauseSourceClueData()
    },

    /**
     * 导航进入动态详情页
     */
    navToDynamicDetail(record) {
      sessionStorage.setItem('user_id', JSON.stringify(record.user_id))
      const questionId = String(record.question_id)
      this.$router.push({ name: 'QuestionDetail', params: { questionId }, })
    },

    /**
     * 打开动态内容 modal
     */
    openDynamicContentModal(dyanmicContent) {
      this.dynamicModalContent = dyanmicContent
      this.isShowDynamicModal = true
    },

    /**
     * 翻译语音
     */
    async translateVoice(record) {
      const voiceUrl = record.record_path
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')
      this.isShowSpinning = true
      await this.$refs.voiceTranslateModalRef.translateVoiceFile(voiceUrl)
      this.isShowSpinning = false
    },

    /**
     * 播放语音
     */
    playVoice(record) {
      const voiceUrl = record.record_path
      if (!voiceUrl) return this.$message.warning('请先选择录音文件')
      this.voiceModal.isShowVoiceModal = true

      setTimeout(() => {
        this.$refs.audioRef.src = voiceUrl
        this.$refs.audioRef.load()
        this.$refs.audioRef.play()
      }, 0)
    },

    /**
     * 计算聊天时间
     */
    calculationTime(key) {
      const newTime = new Date(this.chatModal.chatRecordList[key].created_at)
      let oldTime = 0
      if (key < this.chatModal.chatRecordList.length - 1) {
        oldTime = new Date(this.chatModal.chatRecordList[key + 1].created_at)
        const a = newTime.getTime() - oldTime.getTime()
        // return a > 1800000 ? true : false
        return true
      } else {
        return false
      }
    },

    /**
     * 打开聊天 modal
     */
    async openChatModal(chatFromItem, chatReceiveItem) {
      const chatFromUserId = chatFromItem.user_id // 发送人
      const chatReceiveUserId = chatReceiveItem.user_id // 接收人
      this.chatModal.chatFromUserId = chatFromUserId
      this.chatModal.chatReceiveUserId = chatReceiveUserId
      this.chatModal.chatDate = moment(chatReceiveItem.chat_time).format('YYYY-MM-DD')
      const page = 1
      this.isShowSpinning = true
      // return
      try {
         const { data: chatRecordData } = await chatApi.getRongChat(page, JSONbig.stringify(this.chatModal.chatFromUserId), JSONbig.stringify(this.chatModal.chatReceiveUserId), this.chatModal.chatDate)
         chatRecordData.data.reverse()
         
         this.chatModal.chatRecordList.push(...chatRecordData.data) 
         this.chatModal.chatRecordTotal = chatRecordData.total
         this.chatModal.chatRecordPage = 1

         this.isShowSpinning = false
         this.chatModal.isShowChatModal = true
       } catch (error) {
         this.isShowSpinning = false
         console.log(error)
       }
    },

    /**
     * 加载更多聊天记录
     */
    async loadMoreChatRecord() {
      const page = this.chatModal.chatRecordPage + 1
      this.chatModal.isShowMoreChatRecordLoading = true

      try {
         const { data: chatRecordData } = await chatApi.getRongChat(page, JSONbig.stringify(this.chatModal.chatFromUserId), JSONbig.stringify(this.chatModal.chatReceiveUserId), moment(this.chatModal.chatDate).format('YYYY-MM-DD'))
         chatRecordData.data.reverse()
         
         this.chatModal.chatRecordList.push(...chatRecordData.data) 
         this.chatModal.chatRecordTotal = chatRecordData.total
         this.chatModal.chatRecordPage = page
         this.chatModal.isShowMoreChatRecordLoading = false
       } catch (error) {
         this.chatModal.isShowMoreChatRecordLoading = false
         console.log(error)
       }
    },

    /**
     * 聊天记录 Modal 完全关闭后的回调
     */
    onChatRecordModalAfterClose() {
      this.chatModal.chatFromUserId = ''
      this.chatModal.chatReceiveUserId = ''
      this.chatModal.chatDate = ''
      this.chatModal.chatRecordList = []
      this.chatModal.chatRecordPage = 1
      this.chatModal.chatRecordTotal = 0
      this.chatModal.isShowMoreChatRecordLoading = false
    },

    onChateRecordModalDateChangeEvt(data, value) {
      this.chatModal.chatRecordList = []
      this.chatModal.chatRecordPage = 0
      this.chatModal.chatRecordTotal = 0
      this.chatModal.isShowMoreChatRecordLoading = false
      this.loadMoreChatRecord()
    },

    /**
     * 打开 添加标签 modal
     */
    async openPutLabelModal(record, labelModalType) {
      this.labelModalType = labelModalType
      this.putClueUserId = record.user.user_id // 待更新用户 id
      this.labelCheckedIds = record.label_ids ? record.label_ids : []
      this.isShowLabelModal = true
    },

    /**
     * 添加标题 checkbox 变化时回调事件
     */
    onLabelCheckboxChange(checkedValues) {
      this.labelCheckedIds = checkedValues
    },

    /**
     * 确定标签事件
     */
    async onLabelModalOkEvt() {
      const { labelCheckedIds } = this
      if (!labelCheckedIds.length) return this.$message.warning('请至少选中一个标签')

      this._putClueLabel(labelCheckedIds)
      this.isShowLabelModal = false
    },

    /**
     * 更新线索标签
     */
    async _putClueLabel(labelCheckedIds) {
      const { putClueUserId } = this
      if (!putClueUserId) return

      const param = { label: JSON.stringify(labelCheckedIds), user_id: this.putClueUserId, type: 1 }

      try {
        const { data } = await causeSourceApi.putCauseSourceClueLabelApi(param)
        this._getCauseSourceClueData(this.pagination.current)
        this.putClueUserId = 0
        this.$notification.success({ message: '更新标签成功', duration: 3 })

        // 存在企业标签 则设置销售主管 通知消息+1
        const qiyeLabelId = process.env.NODE_ENV === 'production' ? 12 : 8
        if (labelCheckedIds.includes(qiyeLabelId)) {
          const { data: qiYeData } = await causeSourceApi.getCauseSourceClueQiyeDataApi({ type: 'get' })
          let clueQiyeLabelNumed = qiYeData.num
          // 设置线索 企业标签数
          const qiYeSetParam = { type: 'set', val: ++clueQiyeLabelNumed }
          await causeSourceApi.getCauseSourceClueQiyeDataApi(qiYeSetParam)
        }
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开添加跟进记录 modal
     */
    openAddRemarkModal(record) {
      this.remarkModal.recordId = record.user.user_id
      this.remarkModal.remark = record.remark
      this.remarkModal.isShowRemarkModal = true
    },

    /**
     * 添加跟进记录
     */
    async addRemarkRecord() {
      // if (!this.remarkModal.remark.trim().length) return this.$message.warning('请输入跟进记录')
      const param = { remark: this.remarkModal.remark.trim(), user_id: this.remarkModal.recordId, type: 2 }
      this.remarkModal.isShowRemarkModal = false

      try {
         const data = await causeSourceApi.putCauseSourceClueLabelApi(param)

         this.$notification.success({ message: '添加备注成功', duration: 3 })
         // 更新当页数据
         this._getCauseSourceClueData(this.pagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听分配法务 checkbox change事件
     */
    onLawManagerCheckboxChange(checkedValue) {
      this.assignModal.assignLawManagerCheckedIds = checkedValue
    },

    /**
     * 监听分配 modal ok 事件
     */
    async onClueAssignModalOkEvt() {
      const { assignModal, timeFactorInfo } = this
      if (!assignModal.assignLawManagerCheckedIds.length) return this.$message.warning('请选择分配法务')
      if (!assignModal.assignNum.trim()) return this.$message.warning('请输入分配数量')

      const param = {
        admin_ids: JSON.stringify(assignModal.assignLawManagerCheckedIds),
        limit: assignModal.assignNum,
        start_time: timeFactorInfo.startDate,
        end_time: timeFactorInfo.endDate,
      }
      this.assignModal.isShowAssignModal = false
      try {
         const data = await causeSourceApi.postCauseSourceClueAssignApi(param)

         this.$notification.success({ message: '分配成功', duration: 3 })
         this._getCauseSourceClueData(this.pagination.current)
       } catch (error) {
         console.log(error)
       }

      console.log(assignModal)
    },

    /**
     * 分配 Modal 完全关闭后的回调
     */
    onAssignModalAfterCloseEvt() {
      this.assignModal = Object.assign({}, ASSIGN_MODAL)
    },

    /**
     * 打开 导出数据 modal
     */
    async openExportClueModal() {
      this.exportClueModal.isShowExportModal = true
    },

    /**
     * 添加导出 checkbox 变化时回调事件
     */
    onExportModalCheckboxChangeEvt(checkedValues) {
      this.exportClueModal.exportLabelCheckedIds = checkedValues
    },

    /**
     * 确定导出案源线索数据
     */
    async confirmExportClueData() {
      if (!this.exportClueModal.exportLabelCheckedIds.length) return this.$message.warning('请至少选择一个标签')
      
      const params = {}
      this.timeFactorInfo.startDate && (params.start_time = this.timeFactorInfo.startDate)
      this.timeFactorInfo.endDate && (params.end_time = this.timeFactorInfo.endDate)
      params.label = JSON.stringify(this.exportClueModal.exportLabelCheckedIds)
      this.exportClueModal.isShowExportModal = false
      
      try {
        return new Promise((resolve, reject) => {
          axios({
            url: process.env.VUE_APP_API_BASE_URL + '/web/excel/user/havior',
            methods: 'get',
            params,
            responseType: 'blob',
            headers: {
              Authorization: this.$store.getters.token,
              'X-Timestamp': new Date().getTime().toString().substr(0, 10),
              'X-Nonce': Math.random().toString(36).slice(-10),
              'X-Api-Version': 'v1',
              'X-Device-Type': 'admin',
            },
          }).then(response => {
            console.log(response)
            if (response.data.type === 'application/json') {
              const reader = new FileReader()
              reader.readAsText(response.data, 'utf-8')
              reader.onload = () => {
                this.$message.error(JSON.parse(reader.result).message)
              }
            } else {
              const name = '线索记录'
              var blob = new Blob([response.data], {
                // type: 'application/zip',
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              })
              var downloadElement = document.createElement('a')
              var href = window.URL.createObjectURL(blob)
              downloadElement.href = href
              downloadElement.download = name
              document.body.appendChild(downloadElement)
              downloadElement.click()
              document.body.removeChild(downloadElement)
              window.URL.revokeObjectURL(href)
            }
            resolve()
          })
        })
       } catch (error) {
         console.log(error)
       }
    },
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 90px;
    .focus-text {
      margin-right: 28px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }
}

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  margin-left: auto;
  cursor: pointer;
}

.data-statistics {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  height: 60px;
  .company-name {
    font-size: 16px;
    font-weight: 600;
  }
  .data-num {
    font-size: 14px;
    font-weight: 600;
  }
  .assign-num-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
    .assign-data-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .assign-data-item {
        font-size: 14px;
        font-weight: 600;
        margin-right: 20px;
        &:last-child { margin-right: 0; }
      }
    }
  }
}

.table-clue {
  .clue-table-item {
    margin-bottom: 40px;
    &:last-child { margin-bottom: 0; }
    .table-column-wrap {
      display: flex;
      border: 1px solid #d9d9d9;
      border-bottom: none;
      background: #fafafa;
      .column-cell {
        flex: 1;
        .column-head {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          font-weight: 600;
          background: #fff;
          min-height: 54px;
        }
        .column-body {
          font-size: 14px;
          font-weight: bold;
          min-height: 54px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
          // 标签
          &.colum-body-label {
            .column-label-wrap {
              padding: 10px 0;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-gap: 3px;
              margin-right: 4px;
              cursor: pointer;
              .ant-tag {
                margin-right: 0;
                max-width: 100px;
                cursor: pointer;
                
                -webkit-line-clamp: 1;
                white-space: normal;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
          // 备注
          &.colum-body-remark {
            .remark-text {
              font-size: 14px;
              font-weight: bold;
              max-width: 120px;
              margin-right: 4px;
              white-space: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              /* ! autoprefixer: off */
              -webkit-box-orient: vertical;
              cursor: pointer;
            }
          }
        }
      }
    }
    .remark-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 50px;
      padding-left: 20px;
      border: 1px solid #d9d9d9;
      border-bottom: none;
      background: #fafafa;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      cursor: pointer;
    }
    // 折叠面板用户帖子 头部
    .collapse-panel-header-dynamic {
      display: flex;
      justify-content: flex-start;
      .value-title {
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }
      .num-value {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-right: 20px;
      }
      .dynamic-overview {
        font-size: 14px;
        font-weight: bold;
        width: 300px;
        margin-right: 60px;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /* ! autoprefixer: off */
        -webkit-box-orient: vertical;
      }
      .dynamic-num {
        margin-right: 30px;
        font-weight: bold;
      }
      .dynamic-btn {
        font-size: 14px;
        font-weight: bold;
        color: #409EFF;
      }
    }
    // 折叠面板用户帖子 body
    .collapse-panel-body-dynamic {
      .dynamic-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        &:last-child { margin-bottom: 0; }
        .dynamic-overview {
          font-size: 14px;
          font-weight: bold;
          width: 300px;
          margin-right: 60px;
          cursor: pointer;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          /* ! autoprefixer: off */
          -webkit-box-orient: vertical;
        }
        .dynamic-num {
          margin-right: 30px;
          font-weight: bold;
        }
        .dynamic-btn {
          font-size: 14px;
          font-weight: bold;
          color: #409EFF;
          cursor: pointer;
        }
      }
    }
    // 折叠面板用户录音 头部
    .collapse-panel-header-voice {
      display: flex;
      justify-content: flex-start;
      .num-value {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-right: 20px;
      }
      .voice-wrap {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-right: 40px;
        .voice-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-right: 20px;
          .voice-info {
            font-size: 12px;
            font-weight: bold;
            padding: 0 4px;
            border-radius: 4px;
            border: 1px solid #e8e8e8;
            margin-right: 4px;
          }
        }
      }
    }
    // 折叠面板用户录音 body 
    .collapse-panel-body-voice {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .voice-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-right: 20px;
        .voice-info {
          font-size: 12px;
          font-weight: bold;
          padding: 0 4px;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
          margin-right: 4px;
        }
      }
    }
    // 折叠面板用户私信 头部
    .collapse-panel-header-chat {
      display: flex;
      justify-content: flex-start;
      .num-value {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-right: 20px;
      }
      .chat-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-right: 20px;
        .chat-info {
          font-size: 12px;
          font-weight: bold;
          padding: 0 4px;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
          margin-right: 4px;
        }
      }
    }
    // 折叠面板用户私信 body
    .collapse-panel-body-chat {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .chat-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-right: 20px;
        margin-bottom: 20px;
        .chat-info {
          font-size: 12px;
          font-weight: bold;
          padding: 0 4px;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
          margin-right: 4px;
        }
      }
    }
  }
}

.table-bottom {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 30px;
}

.dynamic-modal-box {
  font-size: 16px;
  font-weight: 500;
}

.chat-modal {
  /deep/.ant-modal-body {
    padding: 0;
  }
}

.addIntendedUser {
  &-title {
    background: #ebeef5;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 48px;
    border-radius: 16px 8px 0 0;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    line-height: 34px;
    color: #222222;
    opacity: 1;
  }
  &-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    max-height: 450px;
    overflow: auto;
    &-option {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      width: 100%;
      margin: 5px 0;
      span {
        width: 56px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
        margin-right: 20px;
        opacity: 1;
      }
      &-inputDiv {
        background: #f5f7fa;
        border: 1px solid #e1e6ee;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9ea5ae;
        width: 300px;
        height: 32px;
        opacity: 1;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        align-content: center;
        padding: 0 10px;
      }
    }
  }
  &-action {
    height: 60px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      width: 178px;
      height: 36px;
    }
  }
}
.avatarDiv {
  img {
    width: 36px;
    height: 36px;
    border-radius: 18px;
  }
}
.chatTitle {
  background: #000724;
  opacity: 0.16;
  border-radius: 4px;
  cursor: pointer;
  color: #ffffff;
  padding: 5px 10px;
}
.leftUser {
  margin: 5px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.leftChatUser {
  max-width: 450px;
  width: auto;
  margin: 5px 0 0 5px;
  border-radius: 2px 12px 12px 12px;
  background: #dbe0eb;
  padding: 5px 10px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 20px;
  color: #222222;
  opacity: 1;
}
.rightUser {
  margin: 10px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.rightChatUser {
  max-width: 450px;
  width: auto;
  margin: 5px 5px 0 0;
  background: #3980ea;
  border-radius: 12px 2px 12px 12px;
  padding: 5px 10px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
  opacity: 1;
}

.label-modal {
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .modal-body {
    height: 200px;
    overflow-y: auto;
    .ant-checkbox-group {
      width: 100%;
      .ant-row {
        .ant-col {
          margin-bottom: 20px;
        }
      }
    }
  }
  .modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    button {
      width: 80px;
      height: 30px;
    }
  }
}

// 分配 modal
.assign-modal-box {
  .ant-checkbox-group {
    width: 100%;
    .ant-row {
      .ant-col {
        margin-bottom: 20px;
      }
    }
  }
  .assign-title {
    font-size: 15px;
    font-weight: 800;
    margin-bottom: 10px;
  }
  .assign-mode {
    font-size: 15px;
    color: #409EFF;
    margin-bottom: 20px;
  }
}

// 备注 modal
.remark-modal {
  /deep/.ant-modal-body {
    padding: 0;
  }
  .remark-modal-box {
    padding: 20px;
    .modal-header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .modal-footer {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      button {
        width: 80px;
        height: 30px;
      }
    }
  }
}

.voice-modal {
  .voice-modal-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
