<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">律师总数：{{ pagination.total }}</span>

      <div @click="changeScreen(2)" class="screenArea" style="margin-right: 16px;">
        <img :src="screen.is_guarantee === 0 ? screenIconList[0].url : screenIconList[1].url" />
        <span>保障计划</span>
      </div>
      <div @click="changeScreen(3)" class="screenArea" style="margin-right: 16px;">
        <img :src="screen.is_lawyer_store === 0 ? screenIconList[0].url : screenIconList[1].url" />
        <span>法律小铺</span>
      </div>
      <div style="margin-right: 16px;">
        好评率:
        <a-select ref="select" :value="sortValue" style="width: 100px" @change="sortChange">
          <a-select-option :value="0">默认排序</a-select-option>
          <a-select-option :value="1">升序</a-select-option>
          <a-select-option :value="2">降序</a-select-option>
        </a-select>
      </div>

      <div style="margin-right: 16px;">
        标签筛选：
        <a-cascader
          :options="lawyerTagOptionList"
          placeholder="请选择律师标签"
          @change="onLawyerTagCascaderChangeEvt"
        />
      </div>
      <!-- 搜索用户名 -->
      <a-input
        allow-clear
        placeholder="搜索用户名/手机号"
        v-model="search"
        @keyup.enter="getSearchPage"
        style="width: 180px"
      />
      <a-button type="primary" @click="getSearchPage" style="margin-left: 10px">搜索</a-button>
    </a-layout-header>

    <a-layout-header class="tool-module">
      <div style="margin-right: 16px;">
        <span style="font-weight: 500;">认证程度：</span>
        <a-select :default-value="screen.lawyer_grade === -1 ? '全部' : screen.lawyer_grade" style="width: 120px" allowClear @change="chooseScreen">
          <a-select-option :value="i.value" v-for="(i, key) in lawyerTypes" :key="key">{{ i.label }}</a-select-option>
        </a-select>
      </div>

      <div style="margin-right: 16px;">
        <span style="font-weight: 500;">认证时间段：</span>
        <a-range-picker
          @change="onRangePickerChange"
          @ok="getLawyerPage(1)"
          style="width: 340px;"
          format="YYYY-MM-DD HH:mm:ss"
          :show-time="{
            hideDisabledOptions: true,
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }"
        />
      </div>

      <div style="margin-right: 16px;">
        <span style="font-weight: 500;">执业年限：</span>
        <a-select v-model="workYearStartFactor" style="width: 120px" placeholder="执业开始年限" allowClear>
          <a-select-option v-for="(i, key) in workYearSelectList" :key="key" :value="i.value">{{ i.label }}</a-select-option>
        </a-select>
        <span style="margin: 0 10px;">~</span>
        <a-select v-model="workYearEndFactor" style="width: 120px" placeholder="执业结束年限" allowClear>
          <a-select-option v-for="(i, key) in workYearSelectList" :key="key" :value="i.value">{{ i.label }}</a-select-option>
        </a-select>
        <a-button type="primary" @click="confirmWorkYearFactorSearch" style="margin-left: 10px">确定</a-button>
      </div>
    </a-layout-header>

    <a-layout-header class="tool-module">
      <span>地区筛选：</span>
      <Cascader
        v-model="cityCascade"
        :options="options"
        :show-search="{ filter }"
        placeholder="搜索城市"
        @change="onChange"
      />

      <!-- 律所搜索 -->
      <div style="margin-left: 10px;">
        <a-input allow-clear placeholder="搜索律所" v-model="searchLawOfficeKey" @keyup.enter="getSearchPage" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="getSearchPage">搜索</a-button>
      </div>
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="getLawyerPage(pagination.current)">刷新</a-button>
      </div>
      
      <a-table
        :data-source="data"
        :pagination="pagination"
        :loading="state.loading"
        :rowKey="record => String(record.user_id)"
        :scroll="{ x: 2500 }"
        bordered
      >
        <a-table-column key="nickname" title="姓名" align="center" :width="260">
          <template slot-scope="record">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap;">
              <user-vip-cell
                :nickname="record.nickname"
                :avatar="record.avatar"
                :mobile="(userInfo && dataRoleList.includes(userInfo.name) ? record.mobile : hidePhoneFunc(record.mobile))"
                :user-id="String(record.user_id)"
                size="sm"
                @open="openUser(record.user_id, 'lawyer')"
              />
              <span>{{ record.lawyer_grade }}</span>
              <a-tag v-if="record.is_earnest" color="#e6a23c" style="margin-bottom: 6px; border-radius: 4px;">保障金</a-tag>

              <!-- 案源会员 -->
              <a-tag v-if="record.local_num" color="#41b583" style="margin-top: 4px; border-radius: 4px;">剩余条数: {{ record.local_num }}</a-tag>
              <template v-if="record.local_user_package_end_time">
                <a-tag color="#409eff" style="margin-top: 4px; border-radius: 4px;">365套餐</a-tag>
                <span style="color: #409eff;">到期时间：{{ record.local_user_package_end_time }}</span>
              </template>

              <!-- <template v-if="record.is_have_experience">
                <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                  <span>到期时间：{{ record.is_experience_time }}</span>
                </div>
              </template> -->
            </div>
          </template>
        </a-table-column>

        <!-- 负责销售 -->
        <a-table-column v-if="userInfo && dataRoleList.includes(userInfo.name)" key="remark" align="center" width="200px">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>负责销售</span>
            <a-select v-model="activeFactorLawManager" allowClear @change="getSearchPage" style="width: 140px">
              <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <div class="column-remark-wrap">
              <div class="remark-info">
                <div class="remark">{{ record.customer_remark }}</div>
              </div>
              
              <div class="remark-plus" @click="openAddRemarkModal(record)">
                <a-icon type="plus-circle" />
              </div>
            </div>
          </template>
        </a-table-column>

        <a-table-column title="账户余额" align="center">
          <template slot-scope="record">
            <div class="column-menuTime-wrap">
              <div>￥{{ record.balance }}</div>
            </div>
          </template>
        </a-table-column>

        <!-- 所属律师所 -->
        <a-table-column key="lawyer_office" title="所属律师所" align="center" :width="270">
          <template slot-scope="record">
            <div>
              <span>{{ record.lawyer_office }}</span>
              <div>
                <span style="margin-right: 10px;">经度:{{ record.lawyer_office_lng }}</span>
                <span>纬度:{{ record.lawyer_office_lat }}</span>
              </div>
              <div>
                <span>地址:{{ record.lawyer_office_address }}</span>
              </div>
            </div>
          </template>
        </a-table-column>

        <!-- 执业年限 -->
        <a-table-column key="register_at" align="center" :width="230">
          <div slot="title">
            执业年限/认证时间
          </div>
          <template slot-scope="record">
            <div style="text-align: center">
              工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
              <br />
              认证时间: {{ record.register_at }}
              <br />
            </div>
          </template>
        </a-table-column>

        <!-- 手机品牌 -->
        <a-table-column align="center" width="180px">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>手机品牌</span>
            <a-select v-model="phoneBrandFactor" allowClear @change="getSearchPage" style="width: 140px">
              <a-select-option v-for="type in phoneBrandSelectList" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <div class="column-remark-wrap">
              <div class="remark-info">
                <div v-if="record.phone_brand" class="remark">{{ record.phone_brand }}</div>
              </div>
              
              <div class="remark-plus" @click="openUpdateUserPhoneBrandModal(record)">
                <a-icon type="plus-circle" />
              </div>
            </div>
          </template>
        </a-table-column>

        <!-- 标签 -->
        <a-table-column title="标签" align="center" :width="300">
          <template slot-scope="record">
            <div v-if="record.label_remark && record.label_remark.length" class="column-label-wrap" @click="openPutLabelModal(record, 1)">
              <a-tag v-for="(lItem, lIndex) in record.label_remark" :key="lIndex" color="blue">{{ lItem.name }}</a-tag>
            </div>
            <a-tag v-else style="background: #fff; borderStyle: dashed; cursor: pointer;" @click="openPutLabelModal(record, 0)">
              <a-icon type="plus" />添加标签
            </a-tag>
          </template>
        </a-table-column>

        <!-- 支付宝 -->
        <!-- <a-table-column title="支付宝" align="center" width="200px">
          <template slot-scope="record">
            <div class="column-lawyerTag">
              用户： {{ record.ali_pay_name }}
            </div>
            <div class="column-lawyerTag">
              账号： {{ record.ali_pay_account }}
            </div>
          </template>
        </a-table-column> -->
        
        <!-- 总/好/中/差 -->
        <a-table-column key="evaluation" align="center">
          <div slot="title">
            总/好/中/差
            <br />
            接通率
          </div>
          <template slot-scope="record">
            <div style="text-align: center">
              {{ record.order_number }}/{{ record.praise_number }}/{{ record.secondary_number }}/{{ record.bad_number }}
              <br />
              <span>{{ record.call_rate }}</span>
            </div>
          </template>
        </a-table-column>

        <!-- 法律小铺 -->
        <a-table-column key="start_work_time" title="法律小铺" align="center">
          <template slot-scope="record">
            <div style="text-align: center">
              <span :style="record.is_lawyer_store === 1 ? 'color:#2CBF78' : 'color:#FF9700'">
                {{ record.is_lawyer_store === 1 ? '已开启' : '未开启' }}
              </span>
            </div>
          </template>
        </a-table-column>

        <!-- 律师端 -->
        <a-table-column key="lawyer_grade" align="center">
          <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
            <span>律师端</span>
            <a-select v-model="loginStatus" @change="getSearchPage" style="width: 80px">
              <a-select-option v-for="type in loginStatusList" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <div style="text-align: center">
              {{ record.is_login_lawyer_app === 1 ? '已登入' : '未登入' }}
            </div>
          </template>
        </a-table-column>
        
        <!-- 最后登录时间地点 -->
        <a-table-column key="login_info" align="center">
          <div slot="title">
            最后登录时间地点
            <br />
            <a-select v-model="loginTimeSort" @change="getSearchPage" style="width: 80px">
              <a-select-option v-for="type in loginTimeSortList" :value="type.value" :key="type.label">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </div>
          <template slot-scope="record">
            <div>
              {{ record.login_at }}
              <br />
              {{ record.location }}
            </div>
          </template>
        </a-table-column>

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center" fixed="right" width="270px">
          <template slot-scope="text, record, index">
            <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
              <a-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
              <a-button
                v-if="userInfo && openVipRoleList.includes(userInfo.name)"
                size="small"
                type="primary"
                @click="onTransfer(record, 0)"
                style="margin: 5px; color: #fff; background-color: #2cbf78; border-color: #2cbf78"
                :disabled="record.iconloading"
              >
                推荐
              </a-button>
              <user-muted-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" v-model="record.is_muted" :user-id="String(record.user_id)" backColor="#f1c40f" />
              <a-modal
                v-model="record.visible"
                title="选择被推荐的用户"
                ok-text="确定"
                cancel-text="取消"
                @ok="onvisiblechange(record)"
                @cancel="() => setModal1Visible(record)"
              >
                <a-input-search
                  allow-clear
                  placeholder="搜索用户名/手机号"
                  enter-button
                  @search="onSearch"
                  v-model="search1"
                />
                <a-table
                  :row-selection="{ type: 'radio', onChange: onSelectChange }"
                  bordered
                  :pagination="pagination1"
                  :columns="columns"
                  :data-source="userdata"
                  @onChange="getuserid()"
                  :loading="state.userLoading"
                  :rowKey="(record) => String(record.user_id)"
                >
                  <a slot="name" slot-scope="text">{{ text }}</a>
                </a-table>
              </a-modal>
              
              <a-popconfirm
                v-if="userInfo && openVipRoleList.includes(userInfo.name)"
                placement="leftBottom"
                ok-text="确认"
                cancel-text="不行"
                @confirm="deleteLawyer(record.user_id, index)"
              >
                <template slot="title"> 是否确认要删除该律师？</template>
                <a-button type="danger" size="small" style="margin: 5px">删除</a-button>
              </a-popconfirm>
              <!-- 更新支付宝 -->
              <a-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" style="margin: 5px" type="primary" size="small" @click="openUpdateAliPayModal(record)">更新支付宝</a-button>
              <!-- 消费记录 -->
              <a-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>
              <!-- 赠送本地案源条数 -->
              <a-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" style="margin: 5px" size="small" @click="openNativeNumModal(record)">赠送本地案源条数</a-button>
              <!-- 案源条数详情 -->
              <a-button v-if="userInfo && openVipRoleList.includes(userInfo.name)" style="margin: 5px" type="primary" size="small" @click="navToLawyerCauseSoruceUseRecordPage(record)">案源条数详情</a-button>
            </div>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <q-dialog v-model="state.userDialog">
      <user-detail-dialog
        :user-id="String(currentUserId)"
        mode="lawyer"
        @close="state.userDialog = false"
        :transferData="conditionData"
      />
    </q-dialog>

    <!-- 支付宝账户 modal -->
    <a-modal
      v-model="aliPayModal.isShowAliPayModal"
      title="更新支付宝信息"
      :afterClose="onAliPayModalAfterClose"
      @ok="onAliPayModalOkEvt"
    >
      <div class="aliPay-modal">
        <div class="input-item">
          <div class="input-title">支付宝账户姓名：</div>
          <a-input class="input" v-model="aliPayModal.ali_pay_name" :maxLength="10" placeholder="请输入支付宝账户姓名" allowClear />
        </div>
        <div class="input-item">
          <div class="input-title">支付宝账户号码：</div>
          <a-input class="input" v-model="aliPayModal.ali_pay_account" placeholder="请输入支付宝账户号码" allowClear />
        </div>
      </div>
    </a-modal>

    <!-- 销售姓名 modal -->
    <a-modal
      v-model="remarkModal.isShowRemarkModal"
      :width="400"
      :afterClose="() => { remarkModal.remark = ''; remarkModal.userId = 0; }"
      destroyOnClose
      @ok="updateBestLawyerRemark"
    >
      <div class="remark-modal">
        <div class="modal-header">更新销售</div>
        <!-- <div class="modal-body">
          <a-input v-model="remarkModal.remark" placeholder="请输入销售姓名" />
        </div> -->
        <a-select v-model="remarkModal.remark" allowClear style="width: 100%;">
          <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
            {{ type.label }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>

    <!-- 手机品牌 modal -->
    <a-modal
      v-model="phoneBrandModal.isShowPhoneBrandModal"
      title="更新手机品牌"
      :width="400"
      :afterClose="() => { phoneBrandModal.phone_brand = ''; phoneBrandModal.userId = 0; }"
      destroyOnClose
      @ok="onUpdateUserPhoneBrandModalOkEvt"
    >
      <div class="remark-modal">
        <div class="modal-body">
          <a-input v-model="phoneBrandModal.phone_brand" placeholder="请输入手机品牌" />
        </div>
      </div>
    </a-modal>

    <!-- 标签 modal -->
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
              <a-col v-for="lItem in labelCheckboxList" :key="lItem.user_label_id" :span="8">
                <a-checkbox :value="lItem.user_label_id">{{ lItem.name }}</a-checkbox>
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

    <!-- 赠送本地案源条数 modal -->
    <a-modal
      v-model="nativeNumModal.isShowNativeNumModal"
      title="赠送本地案源条数"
      :width="400"
      :afterClose="() => { nativeNumModal.num = ''; nativeNumModal.curNum = 0; nativeNumModal.userId = 0; nativeNumModal.end_time = ''; }"
      destroyOnClose
      @ok="onNativeNumModalOkEvt"
    >
      <div class="nativeNum-modal">
        <div class="nativeNum-item">
          <div class="form-key">律师现有条数：</div>
          <div>{{ nativeNumModal.curNum }}</div>
        </div>
        <div class="nativeNum-item">
          <div class="form-key">赠送条数：</div>
          <a-input v-model="nativeNumModal.num" placeholder="请输入赠送条数" />
        </div>
        <div class="nativeNum-item">
          <div class="form-key">截止时间：</div>
          <a-date-picker v-model="nativeNumModal.end_time" format="YYYY-MM-DD HH:mm:ss" style="width: 180px;" />
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import moment from 'moment'
import { deleteLawyer, getLawyerPage as getLawyerPageApi, getLawyerBetter, getLawyerDistricts, getLawyerMessage } from '@/api/lawyer'
import * as lawyerApi from '@/api/lawyer'
import * as assetsApi from '@/api/assets'
import * as lawManagerApi from '@/api/lawManagerApi'
import { getUserPage } from '@/api/user'
import { Cascader } from 'ant-design-vue'
import UserMutedButton from '@/components/User/UserMutedButton'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import { mapState } from 'vuex'

const columns = [
  { title: '用户', dataIndex: 'nickname', scopedSlots: { customRender: 'nickname' }, },
  { title: '手机号', dataIndex: 'mobile', },
]

// 备注信息 modal info
const REMARK_MODAL_INFO = {
  remark: '', // 备注内容
  isShowRemarkModal: false, // 是否显示
  userId: 0, // 待操作记录 id
}

// 手机品牌 modal
const PHONE_BRAND_MODAL = {
  isShowPhoneBrandModal: false,
  userId: 0, // 待 id
  phone_brand: '',
}

// 赠送本地案源条数 modal
const NATIVE_NUM_MODAL = {
  isShowNativeNumModal: false,
  userId: 0,
  num: '',
  curNum: 0, // 现有条数
  end_time: '',
}

export default {
  name: 'LawyerIndexPage',
  components: { Cascader, UserDetailDialog, UserVipCell, UserMutedButton },
  data() {
    return {
      lawyerTypes: [
        { label: '全部', value: -1, },
        { label: '专职律师', value: 0, },
        { label: '实习律师', value: 1, },
        { label: '兼职律师', value: 2, },
        { label: '法律服务工作者', value: 3, },
        { label: '公职律师', value: 4, },
        { label: '法学生', value: 5, },
        { label: '公司律师', value: 6, },
        { label: '法援律师', value: 7, },
      ],
      screen: {
        is_auth: 0,
        is_better: 0,
        is_guarantee: 0,
        is_lawyer_store: 0,
        lawyer_grade: -1,
      },
      screenIconList: [
        { url: require('@/assets/common/dx_icon@2x.png'), },
        { url: require('@/assets/common/dx_icon_sel@2x.png'), },
      ],
      options: [],
      data: [],
      columns,
      userdata: [],
      search: '', // 搜索用户过关键字
      search1: '',
      searchLawOfficeKey: '', // 搜索律所关键字

      state: {
        userLoading: true,
        loading: false,
        userDialog: false,
      },
      cityName: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getLawyerPage(page, this.search)
          this.pagination.current = page
        },
      },

      // 时间过滤条件
      timeFactorInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },
      
      pagination1: {
        total: 0,
        current: 1,
        pageSize: 10, // 默认每页显示数量
        showQuickJumper: true,
        onChange: (page) => {
          this.getUserPageData(page)
          // this.getUserPage(page)
          this.pagination1.current = page
        },
      },
      provinceDistrictId: 0,
      cityDistrictId: 0,
      currentUserId: 0,
      cityCascade: [],
      uploadId: [
        {
          lawyerid: 0,
          userid: 0,
        },
      ],
      sortValue: 0,
      loginStatus: -1,
      loginTimeSort: -1,

      lawyerTagOptionList: [], // 律师标签 option 列表
      lawyerTagId: -1, // 选中的律师标签 id

      // 支付宝 modal 信息
      aliPayModal: {
        isShowAliPayModal: false,
        putUserId: '', // 待更新用户 id
        ali_pay_name: '',
        ali_pay_account: '',
      },

      remarkModal: { ...REMARK_MODAL_INFO }, // 跟进记录 modal 
      phoneBrandModal: { ...PHONE_BRAND_MODAL }, // 手机品牌 modal

      isShowLabelModal: false, // 是否打开标签 Modal
      labelCheckboxList: [], // 标签 checkbox 列表
      labelCheckedIds: [], // 选中的标签 ids
      labelModalType: 0, // 标签 Modal 类型 0: 添加 1: 更新
      putLawyerUserId: 0, // 待更新律师 id

      phoneBrandSelectList: [
        { label: '苹果', value: '苹果', },
        { label: '华为', value: '华为', },
        { label: '三星', value: '三星', },
        { label: 'vivo', value: 'vivo', },
        { label: 'OPPO', value: 'OPPO', },
        { label: '魅族', value: '魅族', },
        { label: '其他', value: '其他', },
      ],
      phoneBrandFactor: '',

      workYearSelectList: [...new Array(50).keys()].map(i=> ({ label: `执业${ i }年`, value: i })),
      workYearStartFactor: '', // 执业开始
      workYearEndFactor: '', // 执业结束

      lawManagerSelectList: [], // 律师管家 select
      activeFactorLawManager: '', // 选中的筛选律师管家

      nativeNumModal: { ...NATIVE_NUM_MODAL }, // 赠送本地案源条数 modal
    }
  },
  created() {
    if (this.$route.query) {
      this.cityName = this.$route.query
      if (this.cityName.parent_district_id === 0) {
        this.provinceDistrictId = this.cityName.district_id
        this.cityDistrictId = null
      } else {
        this.provinceDistrictId = this.cityName.parent_district_id
        this.cityDistrictId = this.cityName.district_id
      }
      this.cityCascade = [this.provinceDistrictId, this.cityDistrictId]
    }
    const condition = JSON.parse(sessionStorage.getItem('lawyerCondition'))

    if (condition) {
      this.pagination.current = condition.current
      this.search = condition.search
      this.screen = condition.screen
      this.cityDistrictId = condition.cityDistrictId
      this.sortValue = condition.sortValue
      this.loginStatus = condition.loginStatus
      this.loginTimeSort = condition.loginTimeSort
      // window.sessionStorage.removeItem('lawyerCondition')
      sessionStorage.clear()
      // this.getLawyerPage(condition.current, condition.search)
    } else {
      // this.getLawyerPage(1, '')
    }
    this._getLawManagerList()
    this.getLawyerPage(1, '')
    this.getDistricts()
    this._getLawyerTagList()
    this._getLawyerLabelList()
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
    
    conditionData() {
      const condition = {}
      condition['current'] = this.pagination.current
      condition['search'] = this.search
      condition['screen'] = this.screen
      condition['sortValue'] = this.sortValue
      condition['cityDistrictId'] = this.cityDistrictId
      condition['loginStatus'] = this.loginStatus
      condition['loginTimeSort'] = this.loginTimeSort
      return condition
    },
    loginStatusList() {
      return [
        { label: '全部', value: -1, },
        { label: '已登入', value: 1, },
        { label: '未登入', value: 0, },
      ]
    },
    loginTimeSortList() {
      return [
        { label: '默认', value: -1, },
        { label: '正序', value: 1, },
        { label: '倒序', value: 0, },
      ]
    },
  },
  mounted() {
    window.addEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadFn(e))
  },
  methods: {
    moment,
    /**
     * 获取律师管家列表
     */
     async _getLawManagerList(page = 1) {
       const param = { page, size: 100, source_type: 0 }

       try {
         const { data: lawManagerData } = await lawManagerApi.getLawManagerListApi(param)
         const _tempSelectList = []
         for (const lItem of lawManagerData.data) {
           const selectOpt = { label: lItem.name, value: lItem.name }
           _tempSelectList.push(selectOpt)
         }
         this.lawManagerSelectList = _tempSelectList
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.timeFactorInfo.startDate = dateStrAry[0]
      this.timeFactorInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) this.getLawyerPage(1)
    },

    // 隐藏手机号码中间4位数
    hidePhoneFunc(phone) {
      const reg = /^(\d{3})\d{4}(\d{4})$/
      return phone.replace(reg, '$1****$2')
    },
    beforeunloadFn(e) {
      sessionStorage.setItem('lawyerCondition', JSON.stringify(this.conditionData))
    },
    openUser(record) {
      if (this.userInfo && this.openVipRoleList.includes(this.userInfo.name)) {
        this.state.userDialog = true
        this.currentUserId = record
      }
    },
    /**
     * 搜索被推荐用户
     */
    onSearch(value) {
      this.state.userLoading = true

      const param = { page: 1, vip_type: 0, search: value.trim(), is_view_deleted: '', }
      getUserPage(param)
        .then((data) => {
          this.userdata = data.data.data
          this.pagination1.total = data.data.total
        })
        .finally(() => {
          this.state.userLoading = false
        })
    },
    /**
     * 打开推荐用户列表
     */
    onTransfer(record, num) {
      const param = {
        page: 1,
        vip_type: 0,
        search: this.search1,
        is_view_deleted: '',
      }
      getUserPage(param).then((data) => {
        this.userdata = data.data.data
        this.pagination1.total = data.data.total
        this.state.userLoading = false
      })
      this.uploadId.lawyerid = record.user_id
      // 按钮弹窗
      if (num === 0) {
        // 打开对应弹窗要读取对应的权限设置
        record.iconloading = true
        record.visible = true
      } else {
        record.iconLoading = true
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.uploadId.userid = selectedRows[0].user_id
      // 保存选中id
    },
    onvisiblechange(record) {
      // 推荐对话框确认 事件
      getLawyerMessage(this.uploadId.userid, this.uploadId.lawyerid).then((data) => {
        this.uploadId.userid = 0
        this.uploadId.lawyerid = 0
        this.$message.success('成功推荐')
      })
      record.iconloading = false
      record.visible = false
      this.search1 = ''
      this.pagination1.current = 1
    },
    setModal1Visible(record) {
      // 对话框取消按钮事件,取消按钮的loading
      record.iconloading = false
      record.iconLoading = false
      this.search1 = ''
      this.pagination1.current = 1
    },
    onChange(value, selectedOptions) {
      this.pagination.current = 1
      this.provinceDistrictId = value[0]
      this.cityDistrictId = value[1]
      this.getLawyerPage(1)
    },
    filter(inputValue, path) {
      return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    redirectDetail(record) {
      sessionStorage.setItem('lawyerCondition', JSON.stringify(this.conditionData))
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
    deleteLawyer(userId, index) {
      this.state.loading = true
      deleteLawyer(userId)
        .then(() => {
          this.pagination.total -= 1
          this.data.splice(index, 1)
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    getSearchPage() {
      this.pagination.current = 1
      this.getLawyerPage(1)
    },
    getDistricts() {
      getLawyerDistricts().then((data) => {
        var list = []
        for (let i = 0; i < data.data.length; i++) {
          list.push({ label: data.data[i].name, value: data.data[i].district_id, children: [] })
          for (let j = 0; j < data.data[i].cities.length; j++) {
            list[i].children.push({ label: data.data[i].cities[j].name, value: data.data[i].cities[j].district_id })
          }
        }
        this.options = list
      })
    },
    /**
     * 下一页推荐用户
     */
    getUserPageData(page) {
      this.state.userLoading = true
      const param = { page: page, vip_type: 0, search: this.search1.trim(), is_view_deleted: '', }

      getUserPage(param)
        .then((data) => {
          this.userdata = data.data.data
          this.pagination1.total = data.data.total
        })
        .finally(() => {
          this.state.userLoading = false
        })
    },
    /**
     * 获取律师标签列表
     */
    async _getLawyerTagList() {
      try {
        const { data: causeSourceCategoryData } = await lawyerApi.getLawyerTagListListApi()

        const _categoryoptionList = []
        for (let i = 0; i < causeSourceCategoryData.length; i++) {
          if (causeSourceCategoryData[i].lawyer_tag_group) {
            _categoryoptionList.push({ label: causeSourceCategoryData[i].lawyer_tag_group, value: causeSourceCategoryData[i].lawyer_tag_group, children: [] })
            for (let j = 0; j < causeSourceCategoryData[i].lawyer_tags.length; j++) {
              _categoryoptionList[i].children.push({ label: causeSourceCategoryData[i].lawyer_tags[j].lawyer_tag, value: causeSourceCategoryData[i].lawyer_tags[j].lawyer_tag_id })
            }
          }
        }
        this.lawyerTagOptionList = _categoryoptionList
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 监听律师标签选择 事件
     */
    onLawyerTagCascaderChangeEvt(value, selectedOptions) {
      if (value.length) {
        this.lawyerTagId = value[1]
        this.getLawyerPage(1)
      } else {
        this.lawyerTagId = -1
        this.getLawyerPage(1)
      }
    },
    /**
     * 获取律师列表
     */
    getLawyerPage(page = 1) {
      this.state.loading = true
      const param = {
        page,
        search: this.search,
        province_district_id: this.provinceDistrictId,
        city_district_id: this.cityDistrictId,
        pre_page: this.pagination.prePage,
        is_auth: this.screen.is_auth,
        is_better: this.screen.is_better,
        is_guarantee: this.screen.is_guarantee,
        lawyer_grade: this.screen.lawyer_grade,
        praise_sort: this.sortValue,
        is_login_lawyer_app: this.loginStatus,
        active_sort: this.loginTimeSort,
        lawyer_tag_id: this.lawyerTagId,
        register_start_time: this.timeFactorInfo.startDate,
        register_end_time: this.timeFactorInfo.endDate,
        register_sort: 0,
        lawyer_office: this.searchLawOfficeKey.trim()
      }

      // 销售筛选
      this.activeFactorLawManager && (param.customer_remark = this.activeFactorLawManager.trim())

      // 添加执业年限筛选
      if (!['', undefined].includes(this.workYearStartFactor) && !['', undefined].includes(this.workYearEndFactor)) {
        param.start_work_time_start = this.workYearStartFactor
        param.start_work_time_end = this.workYearEndFactor
      }

      // 添加手机品牌筛选
      if (this.phoneBrandFactor) {
        if (this.phoneBrandFactor === '其他') {
          param.is_other = 1
          param.phone = JSON.stringify(this.phoneBrandSelectList.map(item => item.value).filter(itm => itm !== '其他'))
        } else {
          param.phone = this.phoneBrandFactor
        }
      }
      
      getLawyerPageApi(param)
        .then(({ data }) => {
          this.pagination.total = data.total
          this.pagination.current = page
          for (let i = 0; i < data.data.length; i++) {
            data.data[i]['iconLoading'] = false
            data.data[i]['iconloading'] = false
            data.data[i]['visible'] = false
          }
          this.data = data.data
        })
        .finally(() => {
          this.state.loading = false
        })
    },
    /**
     * 确定搜索执业年限 筛选
     */
    confirmWorkYearFactorSearch() {
      const { workYearStartFactor, workYearEndFactor } = this
      if (['', undefined].includes(workYearStartFactor)) return this.$message.warning('请输入执业开始年限')
      if (['', undefined].includes(workYearEndFactor)) return this.$message.warning('请输入执业结束年限')
      if (workYearStartFactor >= workYearEndFactor) return this.$message.warning('请输入正确的年限时间段')
      this.getLawyerPage()
    },

    setPreferred(record) {
      record.iconLoading = true
      if (record.is_better === 1) {
        record.is_better = 0
      } else {
        record.is_better = 1
      }
      getLawyerBetter(record.user_id, record.is_better)
        .then((data) => {
          this.$message.success('修改成功')
        })
        .finally(() => {
          record.iconLoading = false
        })
    },
    changeScreen(e) {
      if (e === 0) {
        if (this.screen.is_auth === 1) {
          this.screen.is_auth = 0
        } else {
          this.screen.is_auth = 1
        }
      } else if (e === 1) {
        if (this.screen.is_better === 1) {
          this.screen.is_better = 0
        } else {
          this.screen.is_better = 1
        }
      } else if (e === 2) {
        if (this.screen.is_guarantee === 1) {
          this.screen.is_guarantee = 0
        } else {
          this.screen.is_guarantee = 1
        }
      } else if (e === 3) {
        if (this.screen.is_lawyer_store === 1) {
          this.screen.is_lawyer_store = 0
        } else {
          this.screen.is_lawyer_store = 1
        }
      } else {
        if (this.screen.is_lawyer_store === 1) {
          this.screen.is_lawyer_store = 0
        } else {
          this.screen.is_lawyer_store = 1
        }
      }
      this.getLawyerPage(1, '')
    },
    chooseScreen(data) {
      this.screen.lawyer_grade = data
      this.getLawyerPage(1, '')
    },
    sortChange(value) {
      this.sortValue = value
      this.getLawyerPage(1)
    },

    /**
     * 打开更新 支付宝 modal
     */
    openUpdateAliPayModal(record) {
      this.aliPayModal.putUserId = record.user_id
      this.aliPayModal.ali_pay_name = record.ali_pay_name || ''
      this.aliPayModal.ali_pay_account = record.ali_pay_account || ''
      this.aliPayModal.isShowAliPayModal = true
    },

    /**
     * 支付宝 Modal 完全关闭后的回调
     */
    onAliPayModalAfterClose() {
      this.aliPayModal.putUserId = ''
      this.aliPayModal.ali_pay_name = ''
      this.aliPayModal.ali_pay_account = ''
      this.aliPayModal.isShowAliPayModal = false
    },
    
    /**
     * 更新支付宝账号信息
     */
    async onAliPayModalOkEvt() {
      const { aliPayModal } = this

      if (!aliPayModal.ali_pay_name.trim()) return this.$message.warning('请输入账户姓名')
      if (!aliPayModal.ali_pay_account.trim()) return this.$message.warning('请输入账户号码')

      const param = {
        user_id: aliPayModal.putUserId,
        ali_pay_name: aliPayModal.ali_pay_name.trim(),
        ali_pay_account: aliPayModal.ali_pay_account.trim(),
      }
      this.aliPayModal.isShowAliPayModal = false

      try {
        const { data: aliPayData } = await assetsApi.updateAliPayAccountApi(param)
        this.getLawyerPage(this.pagination.current)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开添加跟进记录 modal
     */
    openAddRemarkModal(record) {
      this.remarkModal.userId = record.user_id
      this.remarkModal.remark = record.customer_remark
      this.remarkModal.isShowRemarkModal = true
    },

    /**
     * 获取优选律师备注
     */
    async updateBestLawyerRemark() {
      const param = { type: 1, customer_remark: this.remarkModal.remark.trim(), user_id: this.remarkModal.userId }
      this.remarkModal.isShowRemarkModal = false
      
      try {
         const data = await lawyerApi.updateBestLawyerRemarkApi(param)

         this.$notification.success({ message: '更新销售成功', duration: 3 })
         // 更新当页数据
         this.getLawyerPage(this.pagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取标签列表
     */
     async _getLawyerLabelList() {
       const param = { page: 1, size: 100 }

       try {
         const { data: labelListData } = await lawyerApi.getLawyerLabelListApi(param)
         this.labelCheckboxList = labelListData.data
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开 添加标签 modal
     */
    async openPutLabelModal(record, labelModalType) {
      this.labelModalType = labelModalType
      this.putLawyerUserId = record.user_id // 待更新用户 id

      this._getLawyerLabelList()

      if (this.labelModalType === 1) {
        const labelCheckedIds = record.label_remark.map(item => item.id)
        this.labelCheckedIds = labelCheckedIds
      }

      this.isShowLabelModal = true
    },

    /**
     * checkbox 变化时回调事件
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

      this._putClientLabel(labelCheckedIds)
      this.isShowLabelModal = false
    },

    /**
     * 更新客户标签
     */
    async _putClientLabel(labelCheckedIds) {
      const { putLawyerUserId } = this
      if (!putLawyerUserId) return

      const param = { type: 2, label_remark: JSON.stringify(labelCheckedIds), user_id: this.putLawyerUserId }
      
      try {
        const { data } = await lawyerApi.updateBestLawyerRemarkApi(param)
        this.getLawyerPage(this.pagination.current)
        this.putLawyerUserId = 0
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开更新手机品牌 modal
     */
    openUpdateUserPhoneBrandModal(record) {
      this.phoneBrandModal.userId = record.user_id
      this.phoneBrandModal.phone_brand = record.phone_brand
      this.phoneBrandModal.isShowPhoneBrandModal = true
    },

    /**
     * 更新手机品牌
     */
    async onUpdateUserPhoneBrandModalOkEvt() {
      const { phoneBrandModal } = this
      const param = {
        user_id: phoneBrandModal.userId,
        phone_brand: phoneBrandModal.phone_brand.trim(),
      }

      this.phoneBrandModal.isShowPhoneBrandModal = false

      try {
         await lawyerApi.updateUserPhoneBrandApi(param)
         this.$notification.success({ message: '更新成功', duration: 3 })
         this.getLawyerPage(this.pagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 导航律师消费记录页面
     */
    navToLawyerExpenseRecordPage(record) {
      sessionStorage.setItem('lawyerInfoSession', JSON.stringify({ avatar: record.avatar, nickname: record.nickname, mobile: record.mobile, user_id: record.user_id }))
      this.$router.push({ name: 'LawyerExpenseRecordRoute' })
    },

    /**
     * 导航 律师案源套餐时间记录页面
     */
    navToLawyerCauseSoruceUseRecordPage(record) {
      sessionStorage.setItem('lawyerInfoSession', JSON.stringify({ avatar: record.avatar, nickname: record.nickname, mobile: record.mobile, user_id: record.user_id, causeSourceNum: record.local_num }))
      this.$router.push({ name: 'CauseSourceVipUseRecordRoute', query: { userId: String(record.user_id) } })
    },

    /**
     * 打开增加订单次数 modal
     */
    async openNativeNumModal(record) {
      try {
         const { data: caseSourceData } = await lawyerApi.getLawyerCaseSourceNativeNumApi({ user_id: String(record.user_id) })
         this.nativeNumModal.curNum = caseSourceData.count
         this.nativeNumModal.userId = record.user_id
         this.nativeNumModal.isShowNativeNumModal = true
       } catch (error) {
         console.log(error)
       }
    },
    /**
     * 监听赠送本地案源条数 ok 事件
     */
    async onNativeNumModalOkEvt() {
      const { nativeNumModal } = this
      if (!nativeNumModal.num.trim()) return this.$message.warning('请输入赠送条数')
      if (!nativeNumModal.end_time) return this.$message.warning('请选择截止时间')

      const param = {
        user_id: nativeNumModal.userId,
        num: nativeNumModal.num.trim(),
        end_time: moment(nativeNumModal.end_time).format('YYYY-MM-DD HH:mm:ss')
      }

      this.nativeNumModal.isShowNativeNumModal = false

      try {
         await lawyerApi.giveToLawyerNativeNumApi(param)
         this.$notification.success({ message: '赠送本地案源条数成功', duration: 3 })
         this._getBestTotalList(this.tableTotalPagination.current)
         this._getBestExpList(this.tableExpPagination.current)
         this._getBestExpireList(this.tableExpirePagination.current)
       } catch (error) {
         console.log(error)
       }
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  .top {
    padding: 0 10px;
    height: 90px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;

    &-select {
      margin-right: 20px;
      width: 120px;
    }

    input {
      width: 150px;
      margin-right: 10px;
    }

    .focus-text {
      // width: 170px;
      margin-right: 5px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
    }
  }

  .content {
    margin-top: 16px;
    .tool-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 13px;
    }
    // 列 律师标签
    .column-lawyerTag-wrap {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 2px;
    }
    // 销售记录
    .column-remark-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .remark-info {
        width: 140px;
        margin-right: 5px;
        text-align: left;
        .remark {
          color: #333;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .remark-plus {
        cursor: pointer;
        .anticon-plus-circle {
          cursor: pointer;
        }
      }
    }
    // 列 标签
    .column-label-wrap {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 5px;
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
}
.screenArea {
  cursor: pointer;
  margin: 0 5px;
  width: 75px;
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
}

.aliPay-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}

.remark-modal {
  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
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

.tool-module {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 16px;
  height: 60px;
  padding: 0;
  padding-left: 10px;
  .company-name {
    font-size: 16px;
    font-weight: 600;
  }
  .data-num {
    font-size: 14px;
    font-weight: 600;
  }
}

.nativeNum-modal {
  .nativeNum-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 80px;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>
