<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <div class="back">
        <span class="icon-back" @click="$router.back(-1)">←</span>
        <span style="font-size: 16px; font-weight: 600; margin-right: 20px;">全国线索数量：{{ pagination.total }}</span>

        <span style="font-size: 14px; font-weight: 500; margin-right: 4px;">地区筛选：</span>
        <a-cascader style="margin-right: 10px;" :options="regionCascaderList" placeholder="请选择地区" @change="onUserRegionCascaderChangeEvt" />

        <!-- 时间筛选 -->
        <a-range-picker
          @change="onRangePickerChange"
          @ok="_getCauseSourceClueData(1)"
          style="width: 340px; margin-right: 10px;"
          format="YYYY-MM-DD HH:mm:ss"
          :default-value="[timeFactorInfo.startDate, timeFactorInfo.endDate]"
          :show-time="{
            hideDisabledOptions: true,
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }"
        />

        <span style="margin-right: 10px;">12小时内: </span>
        <a-switch v-model="time12HourFactor" @change="onTime12HourSwitchChangeEvt" />

        <span style="margin-left: 10px; margin-right: 10px;">24小时内: </span>
        <a-switch v-model="time24HourFactor" @change="onTime24HourSwitchChangeEvt" />

      </div>
      <a-button style="margin-left: auto;" type="primary" @click="remarkModal.isShowRemarkModal = true">多条匹配</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="createClueModal.isShowCreateClueModal = true">创建新线索</a-button>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
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
                  <div v-if="tItem.label && tItem.label.length" class="column-label-wrap">
                    <a-tag v-for="(lItem, lIndex) in tItem.label" :key="lIndex" color="blue">{{ lItem.name }}</a-tag>
                  </div>
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>标签法务</span></div>
                <div class="column-body">
                  <span v-if="tItem.process_user_ids">{{ tItem.process_user_ids.admin_name }}</span>
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>用户行为最新时间</span></div>
                <div class="column-body">
                  <span>{{ tItem.user_updated_at }}</span>
                </div>
              </div>

              <div class="column-cell">
                <div v-if="tIndex === 0" class="column-head"><span>操作</span></div>
                <div class="column-body">
                  <!-- <a-button v-if="!tItem.upper" type="primary">单条匹配</a-button> -->
                  <a-button type="primary" @click="openSelectLawyerModal(tItem)">单条匹配 ({{ tItem.use_num }}/{{ tItem.upper }})</a-button>
                  <!-- <a-button v-else-if="tItem.use_num < tItem.upper" type="primary" @click="openSelectLawyerModal(tItem)">单条匹配 ({{ tItem.use_num }}/{{ tItem.upper }})</a-button>
                  <a-button v-else disabled type="primary">匹配已满 ({{ tItem.use_num }}/{{ tItem.upper }})</a-button> -->
                </div>
              </div>
            </div>

            <div class="remark-wrap">
              <span style="font-size: 14px; font-weight: 600; color: #333;">线索备注：</span>
              <span style="padding-right: 6px;">{{ tItem.remark }}</span>
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

    <!-- 语音翻译 modal -->
    <voice-translate-modal ref="voiceTranslateModalRef" />

    <!-- 帖子详情 -->
    <a-modal title="帖子详情" :footer="null" v-model="isShowDynamicModal">
      <p class="dynamic-modal-box">{{ dynamicModalContent }}</p>
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

    <!-- 多条匹配 modal -->
    <a-modal
      v-model="remarkModal.isShowRemarkModal"
      :width="400"
      title="多条匹配"
      :afterClose="() => (remarkModal.matchNum = '')"
      destroyOnClose
      @ok="onMultiMatchModalOkEvt"
    >
      <div class="remark-modal">
        <a-input v-model="remarkModal.matchNum" placeholder="请输入匹配数量" />
      </div>
    </a-modal>

    <!-- 选择律师 表单 modal -->
    <a-modal
      v-model="selectLawyerModal.isShowSelectLawyerModal"
      :width="700"
      title="选择律师"
      destroyOnClose
      :afterClose="onSelectLawyerModalCloseEvt"
    >
      <div class="select-lawyer-modal">
        <div v-for="(cItem, cIndex) in selectLawyerModal.selectLawyerList" :key="cIndex" class="checked-item" @click="selectLawyerModal.activeLawyer = cItem.user">
          <img v-if="cItem.user.user_id === selectLawyerModal.activeLawyer.user_id" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
          <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />

          <div class="checked-item-right">
            <div class="lawyer-info">
              <img :src="cItem.user.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
              <div>
                <span style="margin-right: 4px;">{{ cItem.user.nickname }}</span>
                <span v-if="cItem.type === 1" style="color: #41b583">普通</span>
                <span v-else style="color: #f56c6c">独家</span>
              </div>
            </div>
            <div v-if="cItem.today_match_num < cItem.day_num" class="lawyer-match" style="color: #f56c6c;">今日已匹配数：{{ cItem.today_match_num }}/{{ cItem.day_num }}</div>
            <div v-else class="lawyer-match">今日已匹配数：{{ cItem.today_match_num }}/{{ cItem.day_num }}</div>
          </div>
        </div>
      </div>

      <div slot="footer">
        <a-button @click="selectLawyerModal.isShowSelectLawyerModal = false">取消</a-button>
        <a-popconfirm @confirm="onSelectLawyerModalOkEvt">
          <p slot="icon"></p>
          <template slot="title">
            <div style="margin-bottom: 4px;">是否将这条线索匹配给「'{{ selectLawyerModal.activeLawyer.nickname }}'」?</div>
            <a-input v-model="selectLawyerModal.matching_remark" placeholder="备注（可选）" />
          </template>
          <a-button style="margin-left: 10px" type="primary">确定</a-button>
        </a-popconfirm>
      </div>
    </a-modal>

    <!-- 创建新线索 modal -->
    <a-modal
      v-model="createClueModal.isShowCreateClueModal"
      :width="500"
      title="创建新线索"
      destroyOnClose
      :afterClose="onCreateClueModalCloseEvt"
      @ok="onCreateClueModalOkEvt"
    >
      <div class="createClue-modal">
        <div class="createClue-item">
          <div class="createClue-item-left">用户手机号</div>
          <div class="createClue-item-right">
            <a-input v-model="remarkModal.matchNum" placeholder="请输入用户手机号" />
          </div>
        </div>
        <div class="createClue-item">
          <div class="createClue-item-left">用户地区</div>
          <div class="createClue-item-right">
            <a-cascader :options="regionCascaderList" placeholder="请选择地区" @change="onUserRegionCascaderChangeEvt" />
          </div>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import JSONbig from 'json-bigint'
import TextWithRowButton from '@/components/Common/TextWithRowButton'
import voiceTranslateModal from '@/components/voice-translate-modal/voice-translate-modal'
import * as causeSourceApi from '@/api/causeSourceApi'
import * as chatApi from '@/api/user'
import * as sellApi from '@/api/sellApi'
import { mapState } from 'vuex'

// 销售 modal info
const REMARK_MODAL_INFO = {
  isShowRemarkModal: false, // 是否显示
  matchNum: '', // 待操作记录 id
  sales_user_id: '', // 销售用户 id
}

// 选择律师 modal
const SELECT_LAWYER_MODAL = {
  isShowSelectLawyerModal: false,
  selectLawyerList: [], // 待选择律师列表
  activeLawyer: {}, // 选中的律师
  matching_remark: '',
}

// 创建新线索 modal
const CREATE_CLUE_MODAL = {
  isShowCreateClueModal: false,
  userPhone: '',
  province_id: '',
  city_id: '',
  matching_remark: '',
}

let that

export default {
  name: 'CauseSourceNationCluePage',
  components: { TextWithRowButton, voiceTranslateModal },
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
      lawyerUserId: 0, // 用户 id
      
      isShowSpinning: false, // 是否显示加载状态
      tableDataList: [], // 列表数据
      pagination: { total: 0, current: 1, pageSize: 5 },

      // 时间条件
      timeFactorInfo: {
        startDate: moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss'), // 开始时间
        endDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'), // 结束时间
      },

      regionCascaderList: [], // 地区 cascader 列表
      regionFactorInfo: { province_id: '', city_id: '' }, // 地区条件

      time12HourFactor: false,
      time24HourFactor: false,

      labelSelectList: [], // 标签 select 列表
      factorLabelId: '', // 选中的标签 id

      isShowDynamicModal: false, // 是否显示帖子内容 modal
      dynamicModalContent: '', // 动态内容

      // 聊天 modal
      chatModal: {
        isShowChatModal: false,
        chatFromUserId: '',
        chatReceiveUserId: '',
        chatDate: '',
        chatRecordList: [],
        chatRecordPage: 1,
        chatRecordTotal: 0,
        isShowMoreChatRecordLoading: false,
      },
      // 是否显示 voice Modal
      voiceModal: { isShowVoiceModal: false, },
      remarkModal: { ...REMARK_MODAL_INFO }, // 多条匹配 modal 

      selectLawyerModal: { ...SELECT_LAWYER_MODAL }, // 选择律师 modal
      createClueModal: { ...CREATE_CLUE_MODAL }, // 创建新线索 modal

      singleMatchRemark: '', // 单条匹配备注
    }
  },
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  beforeCreate() { that = this },
  created() {
    this._getRegionList()
    this._getCauseSourceClueLabelList()
    this._getCauseSourceClueData()
  },
  methods: {
    moment,

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
     * 监听地区筛选选择 事件
     */
    onUserRegionCascaderChangeEvt(value, selectedOptions) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]
      this._getCauseSourceClueData()
    },

    /**
     * 获取标签筛选列表
     */
     async _getCauseSourceClueLabelList() {
       const param = { page: 1, size: 100, type: 2 }

       try {
         const { data: labelListData } = await sellApi.getSellLabelListApi(param)
         // 标签筛选 select 列表
         for (const lItem of labelListData.data) {
           const selectOpt = { label: lItem.name, value: lItem.customer_label_id }
           this.labelSelectList.push(selectOpt)
         }
       } catch (error) {
         console.log(error)
       }
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
        start_time: timeFactorInfo.startDate,
        end_time: timeFactorInfo.endDate,
       }
       // 地区筛选
       if (this.regionFactorInfo.city_id) param.city_id = this.regionFactorInfo.city_id

       // 12小时内
       if (this.time12HourFactor) {
        param.start_time = moment().add(-12, 'hours').format('YYYY-MM-DD HH:mm:ss')
        param.end_time = moment().format('YYYY-MM-DD HH:mm:ss')
       }
       // 24小时内
       if (this.time24HourFactor) {
        param.start_time = moment().add(-24, 'hours').format('YYYY-MM-DD HH:mm:ss')
        param.end_time = moment().format('YYYY-MM-DD HH:mm:ss')
       }

       try {
         const { data: causeSourceClueData } = await causeSourceApi.getCaseSourceMatchClueListApi(param)
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

         this.isShowSpinning = false
       } catch (error) {
         this.isShowSpinning = false
         console.log(error)
       }
    },

    /**
     * 获取用户帖子列表
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
     * 时间 RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.timeFactorInfo.startDate = dateStrAry[0]
      this.timeFactorInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this._getCauseSourceClueData()
    },
    /**
     * 12小时内
     */
    onTime12HourSwitchChangeEvt(checked) {
      // if (checked) this.time24HourFactor = false
      this._getCauseSourceClueData()
    },
    /**
     * 24小时内
     */
    onTime24HourSwitchChangeEvt(checked) {
      // if (checked) this.time12HourFactor = false
      this._getCauseSourceClueData()
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
     * 监听多个匹配 ok事件
     */
    async onMultiMatchModalOkEvt() {
      const { remarkModal } = this
      if (!remarkModal.matchNum.trim()) return this.$message.warning('请输入匹配数量')

      const param = {
        num: remarkModal.matchNum.trim(),
        lawyer_user_id: this.lawyerUserId,
      }
      this.remarkModal.isShowRemarkModal = false
      try {
         await causeSourceApi.postCaseSourceVipMatchClueApi(param)
         this.$notification.success({ message: '分配成功', duration: 3 })
         this._getCauseSourceClueData()
       } catch (error) {
         console.log(error)
       }
    },
    /**
     * 打开选择律师 modal
     */
    async openSelectLawyerModal(record) {
      const param = { user_id: JSONbig.stringify(record.user.user_id) }
      try {
         const { data: selectLawyerData } = await causeSourceApi.getCaseSourceRegionLawyerListApi(param)
         this.selectLawyerModal.selectLawyerList = selectLawyerData
         this.selectLawyerModal.isShowSelectLawyerModal = true
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听选择律师 modal close 事件
     */
    onSelectLawyerModalCloseEvt() {
      this.selectLawyerModal = { ...SELECT_LAWYER_MODAL }
    },

    /**
     * 监听选择律师 modal ok 事件
     */
    async onSelectLawyerModalOkEvt() {
      const { selectLawyerModal } = this
      console.log(selectLawyerModal)
      const param = { lawyer_user_id: this.selectLawyerModal.activeLawyer.user_id, user_id: record.user.user_id, matching_remark: this.singleMatchRemark.trim()  }

      console.log(param)

      try {
        // await causeSourceApi.postCaseSourceVipMatchClueApi(param)
        // this.$notification.success({ message: '分配成功', duration: 3 })
        this._getCauseSourceClueData()
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听创建新线索 modal close 事件
     */
    onCreateClueModalCloseEvt() {
      this.createClueModal = { ...CREATE_CLUE_MODAL }
    },

    /**
     * 监听创建新线索 modal ok 事件
     */
    async onCreateClueModalOkEvt() {
      // const param = { user_id: JSONbig.stringify(record.user.user_id) }
      try {
        //  const { data: selectLawyerData } = await causeSourceApi.getCaseSourceRegionLawyerListApi(param)
        //  this.selectLawyerModal.selectLawyerList = selectLawyerData
        //  this.selectLawyerModal.isShowSelectLawyerModal = true
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
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .back {
      margin-right: 28px;
      font-size: 16px;
      font-weight: 800;
      line-height: 28px;
      color: #222;
      .icon-back {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}

.checkbox-img {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  // margin-left: auto;
  cursor: pointer;
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

.select-lawyer-modal {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  max-height: 300px;
  overflow: auto;
  .checked-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    min-height: 50px;
    border-radius: 6px;
    padding: 10px 4px;
    border: 1px solid #ccc;
    cursor: pointer;
    .checkbox-img {
      margin-right: 10px;
    }
    .checked-item-right {
      .lawyer-info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        font-weight: 500;
      }
      .lawyer-match {
        margin-top: 6px;
      }
    }
  }
}

.createClue-modal {
  .createClue-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .createClue-item-left {
      font-size: 14px;
      font-weight: bold;
      min-width: 80px;
    }
    .createClue-item-right {
      flex: 1;
    }
  }
}
</style>
