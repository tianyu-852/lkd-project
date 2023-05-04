<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">优选律师</span>
      <!-- 搜索输入框 -->
      <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索姓名/手机号" v-model="searchKey" @keyup.enter="refreshTableData" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="refreshTableData">搜索</a-button>
      </div>
      <!-- 地区 -->
      <a-cascader :options="regionCascaderList" style="margin-left: 6px;" placeholder="请选择地区" @change="onUserRegionCascaderChangeEvt" />

      <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
        <a-button type="primary" style="margin-left: auto; background: #ffba02; border-color: #ffba02;" @click="$router.push({ name: 'LawyerBestPush' })">优先推送设置</a-button>
        <a-button type="primary" style="margin-left: 10px; background: #41b583; border-color: #41b583;" @click="$router.push({ name: 'LawyerBestRightsSetRoute' })">律师权益设置</a-button>
        <a-button type="primary" style="margin-left: 10px; background: #e6a23c; border-color: #e6a23c;" @click="$router.push({ name: 'LawyerBestClock' })">定时开通优选会员</a-button>
        <a-button type="primary" style="margin-left: 10px;" @click="openOpenBestModal">开通优选会员</a-button>
      </template>
    </a-layout-header>

    <a-layout-header class="tool-module">
      <div style="margin-right: 16px;">
        <span style="font-weight: 500;">认证程度：</span>
        <a-select v-model="screen.lawyer_grade" style="width: 120px" allowClear @change="refreshTableData" >
          <a-select-option :value="i.value" v-for="(i, key) in lawyerTypes" :key="key">{{ i.label }}</a-select-option>
        </a-select>
      </div>

      <div style="margin-right: 16px;">
        <span style="font-weight: 500;">认证时间段：</span>
        <a-range-picker
          @change="onRangePickerChange"
          @ok="refreshTableData"
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
      <div style="margin-right: 16px;">
        <span style="font-weight: 500;">开通日期筛选：</span>
        <a-date-picker v-model="vipOpenDate" format="YYYY-MM-DD" style="width: 130px;" @change="refreshTableData" />
      </div>
      <!-- 律所搜索 -->
      <!-- <div class="mobile-input-wrap">
        <a-input allow-clear placeholder="搜索律所" v-model="searchLawOfficeKey" @keyup.enter="refreshTableData" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="refreshTableData">搜索</a-button>
      </div> -->
    </a-layout-header>

    <a-card class="content">
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="refreshTableData">刷新</a-button>
      </div>

      <a-tabs v-model="activeTabKey">
        <!-- 优选会员 -->
        <a-tab-pane key="1" :tab="'优选总会员 ' + '(' + tableTotalPagination.total + ')'">
          <a-table
            :data-source="tableTotalList"
            :loading="tableTotalLoading"
            :pagination="tableTotalPagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2900 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                    <div v-if="record.is_experience_time" style="font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                      <span>到期时间：{{ record.is_experience_time }}</span>
                    </div>
                  </template>
                  <!-- 余额需抵扣 -->
                  <div v-if="userInfo && openVipRoleList.includes(userInfo.name) && record.debt_remark" style="display: flex; justify-content: center; align-items: center; color: #409eff">
                    <span>余额需抵扣：{{ record.debt_remark }}元</span>
                    <a-tag color="#409eff" style="margin-left: 10px; border-radius: 4px;" @click="openBalanceModal(record)">抵扣</a-tag>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column align="center" width="230px">
              <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                <span>开通套餐</span>
                <a-select style="width: 160px; margin-top: 5px;" v-model="activeMealId" allowClear @change="_getBestTotalList()">
                  <a-select-option v-for="sItem in mealSelectList" :value="sItem.value" :key="sItem.value">
                    {{ sItem.label }}
                  </a-select-option>
                </a-select>
              </div>

              <template slot-scope="record">
                <!-- <div class="column-menu-wrap" :style="{ color: record.weight > 0 ? '#F56C6C' : '#666' }"> -->
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestTotalList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestTotalList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestTotalList()" style="width: 140px">
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
            <a-table-column title="标签" align="center">
              <template slot-scope="record">
                <div v-if="record.label_remark && record.label_remark.length" class="column-label-wrap" @click="openPutLabelModal(record, 1)">
                  <a-tag v-for="(lItem, lIndex) in record.label_remark" :key="lIndex" color="blue">{{ lItem.name }}</a-tag>
                </div>
                <a-tag v-else-if="userInfo && dataRoleList.includes(userInfo.name)" style="background: #fff; borderStyle: dashed; cursor: pointer;" @click="openPutLabelModal(record, 0)">
                  <a-icon type="plus" />添加标签
                </a-tag>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                    <!-- 移除优选会员 -->
                    <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                    </a-popconfirm>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                    <!-- 赠送本地案源条数 -->
                    <a-button style="margin: 5px" size="small" @click="openNativeNumModal(record)">赠送本地案源条数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 5日体验期 -->
        <a-tab-pane key="2" :tab="'5日体验期 ' + '(' + tableExpPagination.total + ')'">
          <a-table
            :data-source="tableExpList"
            :loading="tableExpLoading"
            :pagination="tableExpPagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                  </template>
                  <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                    <span>到期时间：{{ record.is_experience_time }}</span>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column title="开通套餐" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestExpList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 移除优选会员 -->
                  <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                  </a-popconfirm>
                  <!-- 关闭优先推送 -->
                  <a-popconfirm v-if="record.is_precedence" title="是否关闭优先推送?" @confirm="changeLawyerPriorityPush(record, 2)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #f56c6c; border-color: #f56c6c;">关闭优先推送</a-button>
                  </a-popconfirm>
                  <!-- 开启优先推送 -->
                  <a-popconfirm v-else title="是否开启优先推送?" @confirm="changeLawyerPriorityPush(record, 1)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #41b583; border-color: #41b583;">开启优先推送</a-button>
                  </a-popconfirm>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 首月体验期 -->
        <a-tab-pane key="3" :tab="'首月体验期 ' + '(' + tableMonthExpPagination.total + ')'">
          <a-table
            :data-source="tableMonthExpList"
            :loading="tableMonthExpLoading"
            :pagination="tableMonthExpPagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                  </template>
                  <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                    <span>到期时间：{{ record.is_experience_time }}</span>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column title="开通套餐" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestExpList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 移除优选会员 -->
                  <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                  </a-popconfirm>
                  <!-- 关闭优先推送 -->
                  <a-popconfirm v-if="record.is_precedence" title="是否关闭优先推送?" @confirm="changeLawyerPriorityPush(record, 2)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #f56c6c; border-color: #f56c6c;">关闭优先推送</a-button>
                  </a-popconfirm>
                  <!-- 开启优先推送 -->
                  <a-popconfirm v-else title="是否开启优先推送?" @confirm="changeLawyerPriorityPush(record, 1)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #41b583; border-color: #41b583;">开启优先推送</a-button>
                  </a-popconfirm>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 日均3次年卡 -->
        <a-tab-pane key="6" :tab="'日均3次年卡 ' + '(' + table3Pagination.total + ')'">
          <a-table
            :data-source="table3List"
            :loading="table3Loading"
            :pagination="table3Pagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                  </template>
                  <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                    <span>到期时间：{{ record.is_experience_time }}</span>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column title="开通套餐" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestExpList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 移除优选会员 -->
                  <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                  </a-popconfirm>
                  <!-- 关闭优先推送 -->
                  <a-popconfirm v-if="record.is_precedence" title="是否关闭优先推送?" @confirm="changeLawyerPriorityPush(record, 2)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #f56c6c; border-color: #f56c6c;">关闭优先推送</a-button>
                  </a-popconfirm>
                  <!-- 开启优先推送 -->
                  <a-popconfirm v-else title="是否开启优先推送?" @confirm="changeLawyerPriorityPush(record, 1)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #41b583; border-color: #41b583;">开启优先推送</a-button>
                  </a-popconfirm>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 日均6次年卡 -->
        <a-tab-pane key="9" :tab="'日均6次年卡 ' + '(' + table6Pagination.total + ')'">
          <a-table
            :data-source="table6List"
            :loading="table6Loading"
            :pagination="table6Pagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                  </template>
                  <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                    <span>到期时间：{{ record.is_experience_time }}</span>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column title="开通套餐" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestExpList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 移除优选会员 -->
                  <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                  </a-popconfirm>
                  <!-- 关闭优先推送 -->
                  <a-popconfirm v-if="record.is_precedence" title="是否关闭优先推送?" @confirm="changeLawyerPriorityPush(record, 2)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #f56c6c; border-color: #f56c6c;">关闭优先推送</a-button>
                  </a-popconfirm>
                  <!-- 开启优先推送 -->
                  <a-popconfirm v-else title="是否开启优先推送?" @confirm="changeLawyerPriorityPush(record, 1)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #41b583; border-color: #41b583;">开启优先推送</a-button>
                  </a-popconfirm>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 日均12次年卡 -->
        <a-tab-pane key="10" :tab="'日均12次年卡 ' + '(' + table12Pagination.total + ')'">
          <a-table
            :data-source="table12List"
            :loading="table12Loading"
            :pagination="table12Pagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                  </template>
                  <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                    <span>到期时间：{{ record.is_experience_time }}</span>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column title="开通套餐" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestExpList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 移除优选会员 -->
                  <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                  </a-popconfirm>
                  <!-- 关闭优先推送 -->
                  <a-popconfirm v-if="record.is_precedence" title="是否关闭优先推送?" @confirm="changeLawyerPriorityPush(record, 2)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #f56c6c; border-color: #f56c6c;">关闭优先推送</a-button>
                  </a-popconfirm>
                  <!-- 开启优先推送 -->
                  <a-popconfirm v-else title="是否开启优先推送?" @confirm="changeLawyerPriorityPush(record, 1)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #41b583; border-color: #41b583;">开启优先推送</a-button>
                  </a-popconfirm>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 日均5次年卡 -->
        <a-tab-pane key="7" :tab="'日均5次年卡 ' + '(' + table5Pagination.total + ')'">
          <a-table
            :data-source="table5List"
            :loading="table5Loading"
            :pagination="table5Pagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                  </template>
                  <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                    <span>到期时间：{{ record.is_experience_time }}</span>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column title="开通套餐" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestExpList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 移除优选会员 -->
                  <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                  </a-popconfirm>
                  <!-- 关闭优先推送 -->
                  <a-popconfirm v-if="record.is_precedence" title="是否关闭优先推送?" @confirm="changeLawyerPriorityPush(record, 2)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #f56c6c; border-color: #f56c6c;">关闭优先推送</a-button>
                  </a-popconfirm>
                  <!-- 开启优先推送 -->
                  <a-popconfirm v-else title="是否开启优先推送?" @confirm="changeLawyerPriorityPush(record, 1)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #41b583; border-color: #41b583;">开启优先推送</a-button>
                  </a-popconfirm>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 日均10次年卡 -->
        <a-tab-pane key="8" :tab="'日均10次年卡 ' + '(' + table10Pagination.total + ')'">
          <a-table
            :data-source="table10List"
            :loading="table10Loading"
            :pagination="table10Pagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2700 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                  </template>
                  <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                    <span>到期时间：{{ record.is_experience_time }}</span>
                  </div>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column title="开通套餐" align="center" width="220px">
              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestExpList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestExpList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 移除优选会员 -->
                  <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                  </a-popconfirm>
                  <!-- 关闭优先推送 -->
                  <a-popconfirm v-if="record.is_precedence" title="是否关闭优先推送?" @confirm="changeLawyerPriorityPush(record, 2)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #f56c6c; border-color: #f56c6c;">关闭优先推送</a-button>
                  </a-popconfirm>
                  <!-- 开启优先推送 -->
                  <a-popconfirm v-else title="是否开启优先推送?" @confirm="changeLawyerPriorityPush(record, 1)">
                    <a-button type="primary" size="small" style="padding: 0; margin: 5px; background: #41b583; border-color: #41b583;">开启优先推送</a-button>
                  </a-popconfirm>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>

                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>

                    <!-- 增加赠送次数 -->
                    <a-button type="primary" style="margin: 5px" size="small" @click="openAddOrderNumModal(record)">增加赠送次数</a-button>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 优选已过期 -->
        <a-tab-pane key="4" :tab="'优选已过期 ' + '(' + tableExpirePagination.total + ')'">
          <a-table
            :data-source="tableExpireList"
            :loading="tableExpireLoading"
            :pagination="tableExpirePagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2300 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column align="center" :width="220">
              <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                <span>开通套餐</span>
                <a-select style="width: 160px; margin-top: 5px;" v-model="activeMealId" allowClear @change="_getBestExpireList()">
                  <a-select-option v-for="sItem in mealSelectList" :value="sItem.value" :key="sItem.value">
                    {{ sItem.label }}
                  </a-select-option>
                </a-select>
              </div>

              <template slot-scope="record">
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.last_history_optimal_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.last_history_optimal_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 执业年限 -->
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column title="正式期销售" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestTotalList()" style="width: 140px">
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

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>

        <!-- 已暂停律师 -->
        <a-tab-pane key="5" :tab="'已暂停律师 ' + '(' + tablePausePagination.total + ')'">
          <a-table
            :data-source="tablePauseList"
            :loading="tablePauseLoading"
            :pagination="tablePausePagination"
            :rowKey="(record) => String(record.user_id)"
            :scroll="{ x: 2900 }"
            bordered
          >
            <!-- 律师 -->
            <a-table-column key="nickname" title="律师" align="center" :width="280">
              <template slot-scope="record">
                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; align-content: center; flex-wrap: nowrap; ">
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
                  <template>
                    <a-tag v-if="record.is_suspend_push_order" color="#f56c6c" style="border-radius: 4px;">已暂停接单</a-tag>
                    <div v-if="record.suspend_push_order_start_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停开始时间：{{ record.suspend_push_order_start_time }}</div>
                    <div v-if="record.suspend_push_order_end_time" style="margin-top: 0px; font-size: 14px;" :style="{ color: '#F56C6C' }">暂停结束时间：{{ record.suspend_push_order_end_time }}</div>
                  </template>
                  <template v-if="record.is_have_experience">
                    <a-tag v-if="moment(record.is_experience_time).isBefore(moment())" color="#F56C6C" style="margin-top: 4px; border-radius: 4px;">体验已到期</a-tag>
                    <a-tag v-else color="#41b583" style="margin-top: 4px; border-radius: 4px;">体验期</a-tag>
                    <div v-if="record.is_experience_time" style="margin-top: 4px; font-size: 14px;" :style="{ color: moment(record.is_experience_time).isBefore(moment()) ? '#F56C6C' : '#41b583' }">
                      <span>到期时间：{{ record.is_experience_time }}</span>
                    </div>
                  </template>
                  <br />
                  <span>最后登录：{{ record.login_at }}</span>
                  <span>登录地点：{{ record.location }}</span>
                </div>
              </template>
            </a-table-column>

            <!-- 开通套餐 -->
            <a-table-column align="center" width="220px">
              <div slot="title" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                <span>开通套餐</span>
                <a-select style="width: 160px; margin-top: 5px;" v-model="activeMealId" allowClear @change="_getBestTotalList()">
                  <a-select-option v-for="sItem in mealSelectList" :value="sItem.value" :key="sItem.value">
                    {{ sItem.label }}
                  </a-select-option>
                </a-select>
              </div>

              <template slot-scope="record">
                <!-- <div class="column-menu-wrap" :style="{ color: record.weight > 0 ? '#F56C6C' : '#666' }"> -->
                <div class="column-menu-wrap" :style="{ color:'#666' }">
                  <div>套餐类型: {{ record.optimization_plan || '' }}</div>
                  <div>订单次数: {{ record.optimization_order_num }}/{{ record.total_num }}</div>
                  <div>订单收益: ￥{{ record.earnings }}/{{ record.expected_earnings }}</div>
                  <div>实际到账金额: ￥<span style="color: #409eff">{{ Number(record.earnings) * 0.8 | numToFixedFilter(2) }}</span>/{{ record.expected_earnings }}</div>
                  <div>套餐购买金额: ￥{{ record.expected_earnings }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 套餐时间 -->
            <a-table-column title="套餐时间" align="center" width="200px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap" :style="{ color: '#666' }">
                  <div>{{ record.optimal_enjoy_open_time }}</div>
                  <div>至</div>
                  <div>{{ record.optimal_enjoy_end_time }}</div>
                </div>
              </template>
            </a-table-column>

            <!-- 今日次数/今日收益 -->
            <a-table-column title="今日次数/今日收益" align="center" width="160px">
              <template slot-scope="record">
                <!-- <div>{{ record.today_num_to_achieve ? '是' : '否' }} / {{ record.today_earnings_to_achieve ? '是' : '否' }}</div> -->
                <div>{{ record.today_num }} / {{ record.today_earnings }}</div>
              </template>
            </a-table-column>

            <!-- 账户余额 -->
            <a-table-column title="账户余额" align="center" width="120px">
              <template slot-scope="record">
                <div class="column-menuTime-wrap">
                  <div>￥{{ record.balance }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="是否优先推送" align="center" width="120px">
              <template slot-scope="record">
                <span v-if="record.is_precedence" style="color: #41b583">是</span>
                <span v-else>否</span>
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
            <a-table-column key="register_at" align="center" :width="240">
              <div slot="title">执业年限/认证时间</div>
              <template slot-scope="record">
                <div style="text-align: center">
                  工作时间: {{ record.start_work_time }}开始，{{ record.work_year ? '执业' + record.work_year + '年' : '' }}
                  <br />
                  认证时间: {{ record.register_at }}
                  <br />
                </div>
              </template>
            </a-table-column>

            <!-- 最后登录时间地点 -->
            <a-table-column key="login_info" align="center" :width="180">
              <div slot="title">最后登录时间地点</div>
              <template slot-scope="record">
                <div>
                  {{ record.login_at }}
                  <br />
                  {{ record.location }}
                </div>
              </template>
            </a-table-column>

            <!-- 体验期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>体验期销售</span>
                <a-select v-model="activeFactorLawManager" allowClear @change="_getBestTotalList()" style="width: 140px">
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
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 1)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 正式期销售 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>正式期销售</span>
                <a-select v-model="activeOfficialFactorLawManager" allowClear @change="_getBestTotalList()" style="width: 140px">
                  <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </div>
              <template slot-scope="record">
                <div class="column-remark-wrap">
                  <div class="remark-info">
                    <div v-if="record.other_remark" class="remark">{{ record.other_remark.officialSeller }}</div>
                  </div>
                  
                  <div v-if="userInfo && dataRoleList.includes(userInfo.name)" class="remark-plus" @click="openUpdateBestLawyerSellerModal(record, 3)">
                    <a-icon type="plus-circle" />
                  </div>
                </div>
              </template>
            </a-table-column>

            <!-- 手机品牌 -->
            <a-table-column align="center" width="200px">
              <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                <span>手机品牌</span>
                <a-select v-model="phoneBrandFactor" allowClear @change="_getBestTotalList()" style="width: 140px">
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
            <a-table-column title="标签" align="center">
              <template slot-scope="record">
                <div v-if="record.label_remark && record.label_remark.length" class="column-label-wrap" @click="openPutLabelModal(record, 1)">
                  <a-tag v-for="(lItem, lIndex) in record.label_remark" :key="lIndex" color="blue">{{ lItem.name }}</a-tag>
                </div>
                <a-tag v-else-if="userInfo && dataRoleList.includes(userInfo.name)" style="background: #fff; borderStyle: dashed; cursor: pointer;" @click="openPutLabelModal(record, 0)">
                  <a-icon type="plus" />添加标签
                </a-tag>
              </template>
            </a-table-column>

            <!-- 操作 -->
            <a-table-column key="action" title="操作" align="center" fixed="right" width="290px">
              <template slot-scope="text, record">
                <div style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center">
                  <!-- 查看 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="redirectDetail(record)">查看</a-button>
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 续费 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #67C23A; border-color: #67C23A;" @click="navToBestVipContinuePage(record)">续费</a-button>
                    <!-- 覆盖套餐 -->
                    <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openCoverFormModal(record)">覆盖</a-button>
                    <!-- 移除优选会员 -->
                    <a-popconfirm title="是否确认要移除优选？" @confirm="removeLawyerBestVip(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button>
                    </a-popconfirm>
                  </template>
                  <!-- 权益详情 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToBestLawyerDetail(record)">权益详情</a-button>
                  <!-- 消费记录 -->
                  <a-button type="primary" style="margin: 5px" size="small" @click="navToLawyerExpenseRecordPage(record)">消费记录</a-button>
                  
                  <template v-if="userInfo && openVipRoleList.includes(userInfo.name)">
                    <!-- 打开暂停接单 -->
                    <a-button v-if="record.is_suspend_push_display_button" type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;" @click="openPauseFormModal(record)">打开暂停接单</a-button>
                    <!-- 关闭暂停接单 -->
                    <a-popconfirm v-else title="请确认要取消暂停接单？" @confirm="closeBestReceiveOrder(record)">
                      <a-button type="primary" size="small" style="margin: 5px; background: #41b583; border-color: #41b583;">取消暂停接单</a-button>
                    </a-popconfirm>
                  </template>
                </div>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 销售姓名 modal -->
    <a-modal
      v-model="remarkModal.isShowRemarkModal"
      :width="400"
      :afterClose="() => { remarkModal.sellerName = ''; remarkModal.userId = 0; }"
      destroyOnClose
      @ok="onUpdateBestLawyerSeller"
    >
      <div class="remark-modal">
        <div class="modal-header">更新销售</div>
        <!-- <div class="modal-body">
          <a-input v-model="remarkModal.sellerName" placeholder="请输入销售姓名" />
        </div> -->
        <a-select v-model="remarkModal.sellerName" allowClear style="width: 100%;">
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

    <!-- 增加订单次数 modal -->
    <a-modal
      v-model="orderNumModal.isShowOrderNumModal"
      title="增加订单次数"
      :width="300"
      :afterClose="() => { orderNumModal.num = ''; orderNumModal.userId = 0; }"
      destroyOnClose
      @ok="onAddOrderNumModalOkEvt"
    >
      <div class="remark-modal">
        <div class="modal-body">
          <a-input v-model="orderNumModal.num" placeholder="请输入赠送订单次数" />
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

    <!-- 暂停接单 modal -->
    <a-modal
      v-model="pauseFormModal.isShowPauseFormModal"
      title="设置暂停接单时间"
      :width="480"
      destroyOnClose
      @ok="onPauseFormModalOkEvt"
    >
      <div class="pause-modal">
        <!-- 已选律师 -->
        <div class="pause-form-item">
          <span class="form-key">已选律师:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="pauseFormModal.lawyer.avatar" />
          <div class="">
            <div>{{ pauseFormModal.lawyer.nickname }}</div>
            <div style="font-size: 15px; color: #999;">{{ pauseFormModal.lawyer.mobile }}</div>
          </div>
        </div>
        <div class="pause-form-item">
          <span class="form-key">暂停时间段:</span>
          <a-range-picker
            @change="onPauseFormRangePickerChange"
            style="width: 340px;"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
            }"
          />
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

    <!-- 开通优选 选择律师 modal -->
    <a-modal
      v-model="openBestModal.isShowOpenLawyerModal"
      :width="600"
      destroyOnClose
      @ok="onOpenModalOkEvt"
    >
      <div slot="title">
        <span style="font-size: 18px; font-wight: 500; margin-right: 8px;">选择律师</span>
        <a-input allow-clear placeholder="搜索姓名/手机号" v-model="openBestModal.searchLawyerKeyword" @keyup.enter="openOpenBestModal" style="margin: 0 5px; width: 180px" />
        <a-button type="primary" @click="openOpenBestModal">搜索</a-button>
      </div>
      <div class="open-modal">
        <a-spin :spinning="openBestModal.isSpinning">
          <div class="open-body" @scroll="onOpenModalScrollEvt">
            <div v-for="(cItem, cIndex) in openBestModal.waitOpenBestLawyerList" :key="cIndex" class="checked-item" @click="openBestModal.activeLawyer = cItem">
              <img :src="cItem.avatar" style="width: 30px; height: 30px; margin-right: 6px;" />
              <div>
                <div>{{ cItem.nickname }}</div>
                <div style="font-size: 14px; color: #999;">{{ cItem.mobile }}</div>
              </div>
              <img v-if="cItem.user_id === openBestModal.activeLawyer.user_id" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
              <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
            </div>
          </div>
        </a-spin>
      </div>
    </a-modal>

    <!-- 开通套餐 表单 modal -->
    <a-modal
      v-model="openBestFormModal.isShowOpenFormModal"
      :width="450"
      title="开通优选会员"
      destroyOnClose
      :afterClose="onOpenBestFormModalAfterClose"
      @ok="onOpenFormModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 已选律师 -->
        <div class="open-form-item">
          <span class="form-key">已选律师:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="openBestFormModal.lawyer.avatar" />
          <div class="">
            <div>{{ openBestFormModal.lawyer.nickname }}</div>
            <div style="font-size: 15px; color: #999;">{{ openBestFormModal.lawyer.mobile }}</div>
          </div>
        </div>

        <!-- 是否缴纳保证金 -->
        <!-- <div v-if="!openBestFormModal.lawyer.is_guarantee" class="open-form-item">
          <span class="form-key">是否缴纳保证金:</span>
          <a-switch style="margin-left: 20px;" v-model="openBestFormModal.is_post_security_deposit" />
        </div> -->

        <!-- 套餐类型 -->
        <div class="open-form-item">
          <span class="form-key">套餐类型:</span>
          <a-select style="width: 192px;" v-model="openBestFormModal.optimization_plan_id" @change="onOpenFormBestVipChangeEvt">
            <a-select-option v-for="sItem in mealSelectList.slice(1)" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 预计收益 -->
        <div class="open-form-item">
          <span class="form-key">预计收益:</span>
          <a-input allow-clear placeholder="预计收益" v-model="openBestFormModal.price" style="width: 192px" />
        </div>
        <!-- 订单次数 -->
        <div class="open-form-item">
          <span class="form-key">订单次数:</span>
          <a-input allow-clear placeholder="订单次数" v-model="openBestFormModal.total_num" style="width: 192px" />
        </div>
        <!-- 赠送订单次数 -->
        <div class="open-form-item">
          <span class="form-key">赠送订单次数:</span>
          <a-input allow-clear placeholder="赠送订单次数(选填)" v-model="openBestFormModal.add_num" style="width: 192px" />
        </div>
        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐结束时间:</span>
          <a-date-picker
            v-model="openBestFormModal.end_time"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          />
        </div>
        <!-- 体验期销售 -->
        <div class="open-form-item">
          <span class="form-key">体验期销售:</span>
          <!-- <a-input allow-clear placeholder="体验期销售(选填)" v-model="openBestFormModal.customer_remark" style="width: 192px" /> -->
          <a-select v-model="openBestFormModal.customer_remark" allowClear style="width: 192px">
            <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
              {{ type.label }}
            </a-select-option>
          </a-select>
          <span style="margin-left: 6px;">(可选)</span>
        </div>
        <!-- 正式期销售 -->
        <div class="open-form-item">
          <span class="form-key">正式期销售:</span>
          <!-- <a-input allow-clear placeholder="正式期销售(选填)" v-model="openBestFormModal.other_remark" style="width: 192px" /> -->
          <a-select v-model="openBestFormModal.other_remark" allowClear style="width: 192px">
            <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
              {{ type.label }}
            </a-select-option>
          </a-select>
          <span style="margin-left: 6px;">(可选)</span>
        </div>
      </div>
    </a-modal>

    <!-- 覆盖套餐 表单 modal -->
    <a-modal
      v-model="coverBestFormModal.isShowCoverFormModal"
      :width="450"
      title="覆盖优选会员"
      destroyOnClose
      :afterClose="onCoverBestFormModalAfterClose"
      @ok="onCoverFormModalOkEvt"
    >
      <div class="open-form-modal">
        <!-- 已选律师 -->
        <div class="open-form-item">
          <span class="form-key">已选律师:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="coverBestFormModal.lawyer.avatar" />
          <div class="">
            <div>{{ coverBestFormModal.lawyer.nickname }}</div>
            <div style="font-size: 15px; color: #999;">{{ coverBestFormModal.lawyer.mobile }}</div>
          </div>
        </div>

        <!-- 是否缴纳保证金 -->
        <!-- <div v-if="!coverBestFormModal.lawyer.is_guarantee" class="open-form-item">
          <span class="form-key">是否缴纳保证金:</span>
          <a-switch style="margin-left: 20px;" v-model="coverBestFormModal.is_post_security_deposit" />
        </div> -->

        <!-- 套餐类型 -->
        <div class="open-form-item">
          <span class="form-key">套餐类型:</span>
          <a-select style="width: 192px;" v-model="coverBestFormModal.optimization_plan_id" @change="onCoverFormBestVipChangeEvt">
            <a-select-option v-for="sItem in mealSelectList.slice(1)" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 预计收益 -->
        <div class="open-form-item">
          <span class="form-key">预计收益:</span>
          <a-input allow-clear placeholder="预计收益" v-model="coverBestFormModal.price" style="width: 192px" />
        </div>
        <!-- 订单次数 -->
        <div class="open-form-item">
          <span class="form-key">订单次数:</span>
          <a-input allow-clear placeholder="订单次数" v-model="coverBestFormModal.total_num" style="width: 192px" />
        </div>
        <!-- 赠送订单次数 -->
        <div class="open-form-item">
          <span class="form-key">赠送订单次数:</span>
          <a-input allow-clear placeholder="赠送订单次数(选填)" v-model="coverBestFormModal.add_num" style="width: 192px" />
        </div>
        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐结束时间:</span>
          <a-date-picker
            v-model="coverBestFormModal.end_time"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          />
        </div>
      </div>
    </a-modal>

    <!-- 余额增/扣款 modal -->
    <a-modal
      v-model="balanceModalInfo.isShowBalanceModal"
      :width="360"
      title="余额抵扣"
      destroyOnClose
      @ok="onBalanceModalOkEvt"
    >
      <div class="deduct-modal">
        <!-- 已选律师 -->
        <div class="pause-form-item">
          <span class="form-key">已选律师:</span>
          <img style="width: 50px; height: 50px; border-radius: 50%; margin-right: 6px;" :src="balanceModalInfo.lawyer.avatar" />
          <div class="">
            <div>{{ balanceModalInfo.lawyer.nickname }}</div>
            <div style="font-size: 15px; color: #999;">{{ balanceModalInfo.lawyer.mobile }}</div>
          </div>
        </div>

        <div class="input-item">
          <div class="input-title">账户金额：</div>
          <div>{{ balanceModalInfo.lawyer.balance }}</div>
          <div>元</div>
        </div>

        <div class="input-item">
          <div class="input-title">扣款金额：</div>
          <a-input class="input" style="width: 140px; margin-right: 8px;" v-model="balanceModalInfo.balanceMoney" placeholder="请输入金额" allowClear />
          <div>元</div>
        </div>

        <!-- <div class="input-item"><div class="input-title">{{ balanceModalInfo.balanceType === 1 ? '扣款原因' : '增款原因' }}：</div></div>
        <a-textarea v-model="balanceModalInfo.balanceReason" placeholder="请输入理由..." :auto-size="{ minRows: 4 }" /> -->
      </div>
    </a-modal>
  </a-layout>
</template>

<script>
import * as lawyerApi from '@/api/lawyer'
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawManagerApi from '@/api/lawManagerApi'
import UserVipCell from '@/components/User/UserVipCell'
import UserMutedButton from '@/components/User/UserMutedButton'
import { mapState } from 'vuex'
import moment from 'moment'

// 销售名字 modal
const SELLNAME_MODAL_INFO = {
  isShowRemarkModal: false,
  sellerName: '', // 销售名字
  userId: 0, // 待操作记录 id
  updateType: 0, // 1: 体验期销售，3: 正式期销售
}

// 手机品牌 modal
const PHONE_BRAND_MODAL = {
  isShowPhoneBrandModal: false,
  userId: 0,
  phone_brand: '',
}
// 订单次数 modal
const ORDER_NUM_MODAL = {
  isShowOrderNumModal: false,
  userId: 0,
  num: '',
}

// 赠送本地案源条数 modal
const NATIVE_NUM_MODAL = {
  isShowNativeNumModal: false,
  userId: 0,
  num: '',
  curNum: 0, // 现有条数
  end_time: '',
}

// 开通优选 选择律师 modal
const OPENBEST_MODAL = {
  isShowOpenLawyerModal: false,
  waitOpenBestLawyerList: [], // 待开通优选律师列表
  page: 1,
  total: 0,
  isSpinning: false, // 是否真正加载中
  searchLawyerKeyword: '', // 搜索律师关键字
  activeLawyer: {}, // 选中的律师 id
}

// 开通优选套餐 表单 modal
const OPENBEST_FORM_MODAL = {
  isShowOpenFormModal: false,
  lawyer: {}, // 律师 信息
  optimization_plan_id: '', // 优选会员套餐 id
  price: '', // 预计收益
  total_num: '', // 订单次数
  add_num: '0', // 赠送数量
  end_time: '', // 结束时间
  is_post_security_deposit: false, // 是否缴纳保证金
  customer_remark: '', // 体验期销售
  other_remark: '', // 正式期销售
}

// 覆盖优选套餐 表单 modal
const COVERBEST_FORM_MODAL = {
  isShowCoverFormModal: false,
  lawyer: {}, // 律师 信息
  optimization_plan_id: '', // 优选会员套餐 id
  price: '', // 预计收益
  total_num: '', // 订单次数
  add_num: '0', // 赠送数量
  end_time: '', // 结束时间
  is_post_security_deposit: false, // 是否缴纳保证金
}

// 暂停 表单 modal
const PAUSE_FORM_MODAL = {
  isShowPauseFormModal: false,
  lawyer: {}, // 律师 信息
  start_time: '', // 开始时间
  end_time: '', // 结束时间
}

// 增/扣钱 modal 信息
const BALANCE_MODAL_INFO = {
  isShowBalanceModal: false,
  lawyer: {}, // 律师 信息
  balanceMoney: '',
  balanceReason: '',
}

export default {
  name: 'LawyerBestPage',
  components: { UserVipCell, UserMutedButton },
  filters: {
    numToFixedFilter(num, s) {
      var times = Math.pow(10, s)
      var des = num * times + 0.5
      des = parseInt(des, 10) / times
      return des + ''
    }
  },
  data() {
    return {
      activeTabKey: '1',
      // 认证时间过滤条件
      approveTimeFactorInfo: {
        startDate: '', // 开始时间
        endDate: '', // 结束时间
      },

      regionCascaderList: [], // 地区 cascader 列表
      regionFactorInfo: { province_id: '', city_id: '' }, // 地区条件

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
        lawyer_grade: -1,
      },

      workYearSelectList: [...new Array(50).keys()].map(i=> ({ label: `执业${ i }年`, value: i })),
      workYearStartFactor: '', // 执业开始
      workYearEndFactor: '', // 执业结束

      vipOpenDate: '', // 律师套餐开通时间

      tableTotalList: [], // 优选全部列表
      tableTotalLoading: false,
      tableTotalPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getBestTotalList(page)
          this.tableTotalPagination.current = page
        },
      },

      tableExpList: [], // 5日体验列表
      tableExpLoading: false,
      tableExpPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getBestExpList(page)
          this.tableExpPagination.current = page
        },
      },
      
      tableMonthExpList: [], // 月卡体验列表
      tableMonthExpLoading: false,
      tableMonthExpPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getBestExpList(page)
          this.tableExpPagination.current = page
        },
      },

      tableExpireList: [], // 优选过期列表
      tableExpireLoading: false,
      tableExpirePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getBestExpireList(page)
          this.tableExpirePagination.current = page
        },
      },

      tablePauseList: [], // 暂停列表
      tablePauseLoading: false,
      tablePausePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getBestPauseList(page)
          this.tablePausePagination.current = page
        },
      },

      table3List: [], // 3次年卡
      table3Loading: false,
      table3Pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getOtherTotalList(page, 2)
          this.table3Pagination.current = page
        },
      },

      table5List: [], // 5次年卡
      table5Loading: false,
      table5Pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getOtherTotalList(page, 4)
          this.table5Pagination.current = page
        },
      },

      table10List: [], // 10次年卡
      table10Loading: false,
      table10Pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getOtherTotalList(page, 6)
          this.table10Pagination.current = page
        },
      },

      table6List: [], // 6次年卡
      table6Loading: false,
      table6Pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getOtherTotalList(page, 11)
          this.table10Pagination.current = page
        },
      },

      table12List: [], // 12次年卡
      table12Loading: false,
      table12Pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getOtherTotalList(page, 12)
          this.table12Pagination.current = page
        },
      },

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

      searchKey: '', // 搜索用户过关键字
      searchLawOfficeKey: '', // 搜索律所关键字

      mealSourceList: [], // 套餐源数据列表
      mealSelectList: [{ label: '全部', value: '' }], // 开通套餐 select 列表
      activeMealId: '', // 选中的套餐 id

      remarkModal: { ...SELLNAME_MODAL_INFO }, // 销售名 modal

      isShowLabelModal: false, // 是否打开标签 Modal
      labelCheckboxList: [], // 标签 checkbox 列表
      labelCheckedIds: [], // 选中的标签 ids
      labelModalType: 0, // 标签 Modal 类型 0: 添加 1: 更新
      putLawyerUserId: 0, // 待更新律师 id

      openBestModal: { ...OPENBEST_MODAL }, // 开通优选律师 modal
      openBestFormModal: { ...OPENBEST_FORM_MODAL }, // 开通优选律师 modal
      coverBestFormModal: { ...COVERBEST_FORM_MODAL }, // 覆盖优选律师 modal
      phoneBrandModal: { ...PHONE_BRAND_MODAL }, // 手机品牌 modal
      orderNumModal: { ...ORDER_NUM_MODAL }, // 订单次数 modal
      pauseFormModal: { ...PAUSE_FORM_MODAL }, // 暂停 modal
      nativeNumModal: { ...NATIVE_NUM_MODAL }, // 赠送本地案源条数 modal

      balanceModalInfo: Object.assign({}, BALANCE_MODAL_INFO), // 增/扣款 modal 信息

      lawManagerSelectList: [], // 律师管家 select
      activeFactorLawManager: '', // 选中的筛选律师管家 (体验期)
      activeOfficialFactorLawManager: '', // 选中的筛选律师管家 (正式期)
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  created() {
    const { curDate } = this.$route.query
    if (curDate) this.vipOpenDate = moment().format('YYYY-MM-DD')

    this._getLawManagerList()
    this._getBestLawyerMealList()
    this._getRegionList()
    this._getBestTotalList()
    this._getBestExpList()
    this._getBestMonthExpList()
    this._getBestExpireList()
    this._getBestPauseList()
    this._getLawyerLabelList()

    this._getOtherTotalList(1, 2) // 3次年卡
    this._getOtherTotalList(1, 4) // 5次年卡
    this._getOtherTotalList(1, 6) // 10次年卡
    this._getOtherTotalList(1, 11) // 6次年卡
    this._getOtherTotalList(1, 12) // 12次年卡
  },
  methods: {
    moment,
    // 隐藏手机号码中间4位数
    hidePhoneFunc(phone) {
      const reg = /^(\d{3})\d{4}(\d{4})$/
      return phone.replace(reg, '$1****$2')
    },

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
         console.log(error)
       }
    },

    /**
     * 获取优选律师开通套餐 列表
     */
     async _getBestLawyerMealList() {
       try {
         const { data: mealData } = await lawyerApi.getBestLawyerMealListApi()
         const serverMenuObj = { 1: '/月卡', 2: '/年卡', 3: '' }
         // 处理销售列表
         for (const mItem of mealData.data) {
           const selectOpt = { label: `${ mItem.name }${ serverMenuObj[mItem.version] }`, value: mItem.optimization_plan_id }
           this.mealSelectList.push(selectOpt)
         }

         this.mealSourceList = mealData.data // 套餐数据源列表
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
     * 监听地区筛选选择 事件
     */
    onUserRegionCascaderChangeEvt(value, selectedOptions) {
      this.regionFactorInfo.province_id = value[0]
      this.regionFactorInfo.city_id = value[1]
      if (this.activeTabKey === '1') this._getBestTotalList(this.tableTotalPagination.current)
      if (this.activeTabKey === '2') this._getBestExpList(this.tableExpPagination.current)
      if (this.activeTabKey === '3') this._getBestMonthExpList(this.tableMonthExpPagination.current)
      if (this.activeTabKey === '4') this._getBestExpireList(this.tableExpirePagination.current)
    },

    /**
     * 获取优选 全部列表
     */
     async _getBestTotalList(page = 1) {
       const param = {
        page,
        size: this.tableTotalPagination.pageSize,
        optimization_plan_id: this.activeMealId,
        mobile_or_nickname: this.searchKey.trim(),
        register_start_time: this.approveTimeFactorInfo.startDate,
        register_end_time: this.approveTimeFactorInfo.endDate,
        lawyer_grade: this.screen.lawyer_grade,
       }

       // 日期开通筛选
       if (this.vipOpenDate) param.optimization_plan_start_time = moment(this.vipOpenDate).format('YYYY-MM-DD')
       // 体验期销售筛选
       this.activeFactorLawManager && (param.customer_remark = this.activeFactorLawManager.trim())
       // 正式期销售筛选
       this.activeOfficialFactorLawManager && (param.official_seller = this.activeOfficialFactorLawManager.trim())
       // 律所搜索
       this.searchLawOfficeKey.trim() && (param.lawyer_office = this.searchLawOfficeKey.trim())

       // 地区筛选
       if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_district_id = this.regionFactorInfo.province_id
        param.city_district_id = this.regionFactorInfo.city_id
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
       // 添加执业年限筛选
       if (!['', undefined].includes(this.workYearStartFactor) && !['', undefined].includes(this.workYearEndFactor)) {
        param.start_work_time_start = this.workYearStartFactor
        param.start_work_time_end = this.workYearEndFactor
       }

       this.tableTotalLoading = true

       try {
         const { data: bestTotalData } = await lawyerApi.getBestLawyerListApi(param)
         this.tableTotalList = bestTotalData.data
         this.tableTotalPagination.total = bestTotalData.total
         this.tableTotalPagination.current = page
         this.tableTotalLoading = false
       } catch (error) {
         this.tableTotalLoading = false
         console.log(error)
       }
     },

    /**
     * 获取优选 5日体验期 列表
     */
     async _getBestExpList(page = 1) {
       const param = {
        page,
        size: this.tableTotalPagination.pageSize,
        optimization_plan_id: this.activeMealId,
        mobile_or_nickname: this.searchKey.trim(),
        is_experience: 1,
        register_start_time: this.approveTimeFactorInfo.startDate,
        register_end_time: this.approveTimeFactorInfo.endDate,
        lawyer_grade: this.screen.lawyer_grade,
       }

       // 日期开通筛选
       if (this.vipOpenDate) param.optimization_plan_start_time = moment(this.vipOpenDate).format('YYYY-MM-DD')

       // 体验期销售筛选
       this.activeFactorLawManager && (param.customer_remark = this.activeFactorLawManager.trim())
       // 正式期销售筛选
       this.activeOfficialFactorLawManager && (param.official_seller = this.activeOfficialFactorLawManager.trim())
       // 律所搜索
       this.searchLawOfficeKey.trim() && (param.lawyer_office = this.searchLawOfficeKey.trim())
       
       // 地区筛选
       if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_district_id = this.regionFactorInfo.province_id
        param.city_district_id = this.regionFactorInfo.city_id
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
        // 添加执业年限筛选
        if (!['', undefined].includes(this.workYearStartFactor) && !['', undefined].includes(this.workYearEndFactor)) {
         param.start_work_time_start = this.workYearStartFactor
         param.start_work_time_end = this.workYearEndFactor
        }
       this.tableExpLoading = true

       try {
         const { data: bestExpData } = await lawyerApi.getBestLawyerListApi(param)
         this.tableExpList = bestExpData.data
         this.tableExpPagination.total = bestExpData.total
         this.tableExpPagination.current = page
         this.tableExpLoading = false
       } catch (error) {
         this.tableExpLoading = false
         console.log(error)
       }
     },

     /**
     * 获取优选 首月体验期 列表
     */
     async _getBestMonthExpList(page = 1) {
       const param = {
        page,
        size: this.tableMonthExpPagination.pageSize,
        optimization_plan_id: this.activeMealId,
        mobile_or_nickname: this.searchKey.trim(),
        is_experience: 2,
        register_start_time: this.approveTimeFactorInfo.startDate,
        register_end_time: this.approveTimeFactorInfo.endDate,
        lawyer_grade: this.screen.lawyer_grade,
       }

       // 日期开通筛选
       if (this.vipOpenDate) param.optimization_plan_start_time = moment(this.vipOpenDate).format('YYYY-MM-DD')

       // 体验期销售筛选
       this.activeFactorLawManager && (param.customer_remark = this.activeFactorLawManager.trim())
       // 正式期销售筛选
       this.activeOfficialFactorLawManager && (param.official_seller = this.activeOfficialFactorLawManager.trim())
       // 律所搜索
       this.searchLawOfficeKey.trim() && (param.lawyer_office = this.searchLawOfficeKey.trim())
       
       // 地区筛选
       if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_district_id = this.regionFactorInfo.province_id
        param.city_district_id = this.regionFactorInfo.city_id
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
        // 添加执业年限筛选
        if (!['', undefined].includes(this.workYearStartFactor) && !['', undefined].includes(this.workYearEndFactor)) {
         param.start_work_time_start = this.workYearStartFactor
         param.start_work_time_end = this.workYearEndFactor
        }
       this.tableMonthExpLoading = true

       try {
         const { data: bestMonthExpData } = await lawyerApi.getBestLawyerListApi(param)
         this.tableMonthExpList = bestMonthExpData.data
         this.tableMonthExpPagination.total = bestMonthExpData.total
         this.tableMonthExpPagination.current = page
         this.tableMonthExpLoading = false
       } catch (error) {
         this.tableMonthExpLoading = false
         console.log(error)
       }
     },

    /**
     * 获取优选 已过期 列表
     */
     async _getBestExpireList(page = 1) {
       const param = {
        page,
        size: this.tableTotalPagination.pageSize,
        optimization_plan_id: this.activeMealId,
        mobile_or_nickname: this.searchKey.trim(),
        only_end: 1,
        register_start_time: this.approveTimeFactorInfo.startDate,
        register_end_time: this.approveTimeFactorInfo.endDate,
        lawyer_grade: this.screen.lawyer_grade,
       }
       
       // 日期开通筛选
       if (this.vipOpenDate) param.optimization_plan_start_time = moment(this.vipOpenDate).format('YYYY-MM-DD')
       // 地区筛选
       if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_district_id = this.regionFactorInfo.province_id
        param.city_district_id = this.regionFactorInfo.city_id
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
        // 添加执业年限筛选
        if (!['', undefined].includes(this.workYearStartFactor) && !['', undefined].includes(this.workYearEndFactor)) {
         param.start_work_time_start = this.workYearStartFactor
         param.start_work_time_end = this.workYearEndFactor
        }

       this.tableExpireLoading = true

       try {
         const { data: bestExpireData } = await lawyerApi.getBestLawyerListApi(param)
         this.tableExpireList = bestExpireData.data
         this.tableExpirePagination.total = bestExpireData.total
         this.tableExpirePagination.current = page
         this.tableExpireLoading = false
       } catch (error) {
         this.tableExpireLoading = false
         console.log(error)
       }
     },

     /**
     * 获取优选 暂停列表
     */
     async _getBestPauseList(page = 1) {
       const param = {
        page,
        size: this.tablePausePagination.pageSize,
        optimization_plan_id: this.activeMealId,
        mobile_or_nickname: this.searchKey.trim(),
        register_start_time: this.approveTimeFactorInfo.startDate,
        register_end_time: this.approveTimeFactorInfo.endDate,
        lawyer_grade: this.screen.lawyer_grade,
        is_suspend_push_order: 1,
       }

       // 日期开通筛选
       if (this.vipOpenDate) param.optimization_plan_start_time = moment(this.vipOpenDate).format('YYYY-MM-DD')
       // 体验期销售筛选
       this.activeFactorLawManager && (param.customer_remark = this.activeFactorLawManager.trim())
       // 正式期销售筛选
       this.activeOfficialFactorLawManager && (param.official_seller = this.activeOfficialFactorLawManager.trim())
       // 律所搜索
       this.searchLawOfficeKey.trim() && (param.lawyer_office = this.searchLawOfficeKey.trim())

       // 地区筛选
       if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_district_id = this.regionFactorInfo.province_id
        param.city_district_id = this.regionFactorInfo.city_id
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
       // 添加执业年限筛选
       if (!['', undefined].includes(this.workYearStartFactor) && !['', undefined].includes(this.workYearEndFactor)) {
        param.start_work_time_start = this.workYearStartFactor
        param.start_work_time_end = this.workYearEndFactor
       }

       this.tablePauseLoading = true

       try {
         const { data: bestTotalData } = await lawyerApi.getBestLawyerListApi(param)
         this.tablePauseList = bestTotalData.data
         this.tablePausePagination.total = bestTotalData.total
         this.tablePausePagination.current = page
         this.tablePauseLoading = false
       } catch (error) {
         this.tablePauseLoading = false
         console.log(error)
       }
     },

     /**
     * 获取优选 其他套餐列表
     */
     async _getOtherTotalList(page = 1, optimizationPlanId = 2) {

       const param = {
        page,
        size: this.tableTotalPagination.pageSize,
        optimization_plan_id: optimizationPlanId,
        mobile_or_nickname: this.searchKey.trim(),
        register_start_time: this.approveTimeFactorInfo.startDate,
        register_end_time: this.approveTimeFactorInfo.endDate,
        lawyer_grade: this.screen.lawyer_grade,
       }

       // 日期开通筛选
       if (this.vipOpenDate) param.optimization_plan_start_time = moment(this.vipOpenDate).format('YYYY-MM-DD')
       // 体验期销售筛选
       this.activeFactorLawManager && (param.customer_remark = this.activeFactorLawManager.trim())
       // 正式期销售筛选
       this.activeOfficialFactorLawManager && (param.official_seller = this.activeOfficialFactorLawManager.trim())
       // 律所搜索
       this.searchLawOfficeKey.trim() && (param.lawyer_office = this.searchLawOfficeKey.trim())

       // 地区筛选
       if (this.regionFactorInfo.province_id && this.regionFactorInfo.city_id) {
        param.province_district_id = this.regionFactorInfo.province_id
        param.city_district_id = this.regionFactorInfo.city_id
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
       // 添加执业年限筛选
       if (!['', undefined].includes(this.workYearStartFactor) && !['', undefined].includes(this.workYearEndFactor)) {
        param.start_work_time_start = this.workYearStartFactor
        param.start_work_time_end = this.workYearEndFactor
       }

       this.tableTotalLoading = true

       try {
         const { data: bestTotalData } = await lawyerApi.getBestLawyerListApi(param)

         // 3次年卡
         if (optimizationPlanId === 2) {
           this.table3List = bestTotalData.data
           this.table3Pagination.total = bestTotalData.total
           this.table3Pagination.current = page
           this.table3Loading = false
         // 5次年卡
         } else if (optimizationPlanId === 4) {
           this.table5List = bestTotalData.data
           this.table5Pagination.total = bestTotalData.total
           this.table5Pagination.current = page
           this.table5Loading = false
         // 10次年卡
         } else if (optimizationPlanId === 6) {
           this.table10List = bestTotalData.data
           this.table10Pagination.total = bestTotalData.total
           this.table10Pagination.current = page
           this.table10Loading = false
         // 6次年卡
         } else if (optimizationPlanId === 11) {
           this.table6List = bestTotalData.data
           this.table6Pagination.total = bestTotalData.total
           this.table6Pagination.current = page
           this.table6Loading = false
         // 12次年卡
         } else if (optimizationPlanId === 12) {
           this.table12List = bestTotalData.data
           this.table12Pagination.total = bestTotalData.total
           this.table12Pagination.current = page
           this.table12Loading = false
         }
       } catch (error) {
         this.tableTotalLoading = false
         console.log(error)
       }
     },

    /**
     * 刷新 table 数据
     */
    refreshTableData() {
      if (this.activeTabKey === '1') this._getBestTotalList(this.tableTotalPagination.current)
      if (this.activeTabKey === '2') this._getBestExpList(this.tableExpPagination.current)
      if (this.activeTabKey === '3') this._getBestMonthExpList(this.tableMonthExpPagination.current)
      if (this.activeTabKey === '4') this._getBestExpireList(this.tableExpirePagination.current)
      if (this.activeTabKey === '5') this._getBestPauseList(this.tablePausePagination.current)
    },

    /**
     * RangePicker 发生变化的回调
     */
    onRangePickerChange(date, dateStrAry) {
      this.approveTimeFactorInfo.startDate = dateStrAry[0]
      this.approveTimeFactorInfo.endDate = dateStrAry[1]
      // 清空日期选择重新请求一次
      if (!dateStrAry[0] || !dateStrAry[1]) {
        if (this.activeTabKey === '1') this._getBestTotalList()
        if (this.activeTabKey === '2') this._getBestExpList()
        if (this.activeTabKey === '3') this._getBestMonthExpList()
        if (this.activeTabKey === '4') this._getBestExpireList()
        if (this.activeTabKey === '5') this._getBestPauseList()
      }
    },

    /**
     * 确定搜索执业年限 筛选
     */
    confirmWorkYearFactorSearch() {
      const { workYearStartFactor, workYearEndFactor } = this
      if (['', undefined].includes(workYearStartFactor)) return this.$message.warning('请输入执业开始年限')
      if (['', undefined].includes(workYearEndFactor)) return this.$message.warning('请输入执业结束年限')
      if (workYearStartFactor >= workYearEndFactor) return this.$message.warning('请输入正确的年限时间段')
      if (this.activeTabKey === '1') this._getBestTotalList()
      if (this.activeTabKey === '2') this._getBestExpList()
      if (this.activeTabKey === '3') this._getBestExpireList()
    },
    
    /**
     * 查看律详情
     */
    redirectDetail(record) {
      sessionStorage.setItem('lawyerCondition', JSON.stringify(this.conditionData))
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerDetail', params: { userId } })
    },
    /**
     * 进入优选律师详情
     */
    navToBestLawyerDetail(record) {
      sessionStorage.setItem('bestLawyerDetail', JSON.stringify(record))
      const userId = String(record.user_id)
      this.$router.push({ name: 'LawyerBestDetail', query: { lawyerUserId: userId } })
    },

    /**
     * 打开添加跟进记录 modal
     */
    openUpdateBestLawyerSellerModal(record, updateType) {
      this.remarkModal.userId = record.user_id
      // 体验期销售
      if (updateType === 1) {
        this.remarkModal.sellerName = record.customer_remark
      // 正式期销售
      } else if (updateType === 3 && record.other_remark) {
        this.remarkModal.sellerName = record.other_remark.officialSeller
      }
      this.remarkModal.updateType = updateType
      this.remarkModal.isShowRemarkModal = true
    },

    /**
     * 更新优选律师销售
     */
    async onUpdateBestLawyerSeller() {
      const param = {
        type: this.remarkModal.updateType,
        user_id: this.remarkModal.userId,
      }

      // 体验期销售
      if (this.remarkModal.updateType === 1) param.customer_remark = this.remarkModal.sellerName.trim()
      // 正式期销售
      if (this.remarkModal.updateType === 3) param.other_remark = JSON.stringify({ officialSeller: this.remarkModal.sellerName.trim() })

      this.remarkModal.isShowRemarkModal = false

      try {
         const data = await lawyerApi.updateBestLawyerRemarkApi(param)

         this.$notification.success({ message: '更新销售成功', duration: 3 })
         // 更新当页数据
         this._getBestTotalList(this.tableTotalPagination.current)
         this._getBestExpList(this.tableExpPagination.current)
         this._getBestExpireList(this.tableExpirePagination.current)
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
         this._getBestTotalList(this.tableTotalPagination.current)
         this._getBestExpList(this.tableExpPagination.current)
         this._getBestExpireList(this.tableExpirePagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 打开增加订单次数 modal
     */
    openAddOrderNumModal(record) {
      this.orderNumModal.userId = record.user_id
      this.orderNumModal.isShowOrderNumModal = true
    },

    /**
     * 添加订单次数 ok 事件
     */
    async onAddOrderNumModalOkEvt() {
      const { orderNumModal } = this
      const param = {
        user_id: orderNumModal.userId,
        num: orderNumModal.num.trim(),
      }

      this.orderNumModal.isShowOrderNumModal = false

      try {
         await lawyerApi.addLawyerOrderNumApi(param)
         this.$notification.success({ message: '增加订单次数成功', duration: 3 })
         this._getBestTotalList(this.tableTotalPagination.current)
         this._getBestExpList(this.tableExpPagination.current)
         this._getBestExpireList(this.tableExpirePagination.current)
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
     * 更新体验期销售
     */
    async _putClientLabel(labelCheckedIds) {
      const { putLawyerUserId } = this
      if (!putLawyerUserId) return

      const param = { type: 2, label_remark: JSON.stringify(labelCheckedIds), user_id: this.putLawyerUserId }
      
      try {
        const { data } = await lawyerApi.updateBestLawyerRemarkApi(param)
        this._getBestTotalList(this.tableTotalPagination.current)
        this.putLawyerUserId = 0
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开开通优选 modal
     */
    async openOpenBestModal() {
      if (this.openBestModal.searchLawyerKeyword.trim()) this.openBestModal.page = 1
      const param = { page: this.openBestModal.page, size: 20, type: 1, nickname: this.openBestModal.searchLawyerKeyword.trim() }
      try {
        const { data: waitOpenBestData } = await lawyerApi.getWaitOpenBestLawyerListApi(param)
        if (this.openBestModal.page === 1) this.openBestModal.waitOpenBestLawyerList = []

        this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data)
        this.openBestModal.total = waitOpenBestData.total
        this.openBestModal.isShowOpenLawyerModal = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听 开通律师列表 modal scroll 事件
     */
    async onOpenModalScrollEvt(event) {
      const openModalScrollTop = event.target.scrollTop
      const openModalClientHeight = event.target.clientHeight
      const openModalScrollHeight = event.target.scrollHeight

      if (openModalScrollTop + openModalClientHeight >= openModalScrollHeight - 50) {
          if (this.openBestModal.waitOpenBestLawyerList.length >= this.openBestModal.total) return
          if (this.openBestModal.isSpinning) return

          ++this.openBestModal.page
          const param = { page: this.openBestModal.page, size: 20, type: 1 }
          this.openBestModal.isSpinning = true
          try {
            const { data: waitOpenBestData } = await lawyerApi.getWaitOpenBestLawyerListApi(param)
            this.openBestModal.waitOpenBestLawyerList.push(...waitOpenBestData.data)
            this.openBestModal.total = waitOpenBestData.total
            this.openBestModal.isSpinning = false
          } catch (error) {
            this.openBestModal.isSpinning = false
            console.log(error)
          }
       }
    },

    /**
     * 监听开通优选律师列表 modal ok 事件
     */
    onOpenModalOkEvt() {
      const { openBestModal } = this
      if (!openBestModal.activeLawyer.user_id) return this.$message.warning('请选择开通律师')

      this.openBestFormModal.lawyer = openBestModal.activeLawyer
      this.openBestModal.isShowOpenLawyerModal = false
      this.openBestFormModal.isShowOpenFormModal = true
    },

    /**
     * 获取优先会员详情
     */
    async onOpenFormBestVipChangeEvt(bestVipId) {
      const param = { optimization_plan_id: bestVipId }

      try {
        const { data: bestVipData } = await lawyerApi.getBestVipDetailApi(param)
        this.openBestFormModal.total_num = `${ bestVipData.num * bestVipData.day }`
        this.openBestFormModal.price = `${ bestVipData.price }`
        this.openBestFormModal.end_time = moment().add(bestVipData.day, 'days')
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听开通优选表单 Modal 完全关闭后的回调
     */
    onOpenBestFormModalAfterClose() {
      this.openBestFormModal = Object.assign({}, OPENBEST_FORM_MODAL)
    },

    /**
     * 监听开通优选表单 modal ok 事件
     */
    async onOpenFormModalOkEvt() {
      const { openBestFormModal } = this
      if (!openBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      if (!openBestFormModal.optimization_plan_id) return this.$message.warning('请选择开通优选套餐')
      
      const param = {
        optimization_plan_id: openBestFormModal.optimization_plan_id,
        user_id: openBestFormModal.lawyer.user_id,
        price: openBestFormModal.price.trim(),
        total_num: openBestFormModal.total_num.trim(),
        add_num: openBestFormModal.add_num.trim(),
        end_time: moment(openBestFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
        is_post_security_deposit: openBestFormModal.is_post_security_deposit ? 1 : 0,
        customer_remark: openBestFormModal.customer_remark ? openBestFormModal.customer_remark.trim() : '',
        other_remark: openBestFormModal.other_remark ? JSON.stringify({ officialSeller: openBestFormModal.other_remark.trim() }) : '',
      }
      this.openBestFormModal.isShowOpenFormModal = false

      try {
        await lawyerApi.postOpenBestVipApi(param)
        this._getBestTotalList()

        if (this.mealSourceList.find(item => item.optimization_plan_id === openBestFormModal.optimization_plan_id)) {
          const _findMealItem = this.mealSourceList.find(item => item.optimization_plan_id === openBestFormModal.optimization_plan_id)
          console.log('套餐:', _findMealItem)
          // 体验期套餐 自动开启优先推送
          if (_findMealItem.type === 3) this.changeLawyerPriorityPush({ user_id: openBestFormModal.lawyer.user_id }, 1)
        }
        this.$notification.success({ message: '开通成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开 覆盖优选套餐 表单
     */
    openCoverFormModal(record) {
      this.coverBestFormModal.lawyer = {
        nickname: record.nickname,
        avatar: record.avatar,
        mobile: record.mobile,
        user_id: record.user_id,
        // is_guarantee: record.is_guarantee
      }
      this.coverBestFormModal.isShowCoverFormModal = true
    },

    /**
     * 获取优先会员详情
     */
    async onCoverFormBestVipChangeEvt(bestVipId) {
      const param = { optimization_plan_id: bestVipId }

      try {
        const { data: bestVipData } = await lawyerApi.getBestVipDetailApi(param)
        this.coverBestFormModal.total_num = `${ bestVipData.num * bestVipData.day }`
        this.coverBestFormModal.price = `${ bestVipData.price }`
        this.coverBestFormModal.end_time = moment().add(bestVipData.day, 'days')
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 监听 覆盖优选套餐表单 modal ok 事件
     */
    async onCoverFormModalOkEvt() {
      const { coverBestFormModal } = this
      if (!coverBestFormModal.lawyer.user_id) return this.$message.warning('请选择律师')
      if (!coverBestFormModal.optimization_plan_id) return this.$message.warning('请选择开通优选套餐')
      
      const param = {
        optimization_plan_id: coverBestFormModal.optimization_plan_id,
        user_id: coverBestFormModal.lawyer.user_id,
        price: coverBestFormModal.price.trim(),
        total_num: coverBestFormModal.total_num.trim(),
        add_num: coverBestFormModal.add_num.trim(),
        end_time: moment(coverBestFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
        is_post_security_deposit: coverBestFormModal.is_post_security_deposit ? 1 : 0,
      }
      this.coverBestFormModal.isShowCoverFormModal = false

      try {
        await lawyerApi.coverBestVipApi(param)
        this._getBestTotalList(this.tableTotalPagination.current)
        this.$notification.success({ message: '覆盖成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },


    /**
     * 取消 定时开通优选会员
     */
    async removeLawyerBestVip(record) {
      const param = { user_id: record.user_id }

      try {
        await lawyerApi.removeLawyerBestVipApi(param)
        this._getBestTotalList(this.tableTotalPagination.current)
        this._getBestExpList(this.tableExpPagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 更新体验期优选律师 优先推送状态
     */
    async changeLawyerPriorityPush(record, pushType) {
      const userId = typeof record.user_id === 'number' ? JSON.stringify(record.user_id) : record.user_id
      const param = { type: pushType }
      // 开启优先推送
      if (pushType === 1) param.user_id = JSON.stringify([userId])
      // 关闭优先推送
      if (pushType === 2) param.user_id = userId
      console.log(param)

      try {
         const { data } = await lawyerApi.updateBestLawyerPushApi(param)
         this.$notification.success({ message: '操作成功', duration: 3 })
         this.refreshTableData()
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听 覆盖优选表单 Modal 完全关闭后的回调
     */
    onCoverBestFormModalAfterClose() {
      this.coverBestFormModal = Object.assign({}, COVERBEST_FORM_MODAL)
    },

    /**
     * 打开 暂停接单表单
     */
    openPauseFormModal(record) {
      this.pauseFormModal.lawyer = {
        nickname: record.nickname,
        avatar: record.avatar,
        mobile: record.mobile,
        user_id: record.user_id,
      }
      this.pauseFormModal.isShowPauseFormModal = true
    },

    /**
     * 暂停接单表单 RangePicker 发生变化的回调
     */
    onPauseFormRangePickerChange(date, dateStrAry) {
      this.pauseFormModal.start_time = dateStrAry[0]
      this.pauseFormModal.end_time = dateStrAry[1]
    },

    /**
     * 监听 暂停接单表单 ok事件
     */
    async onPauseFormModalOkEvt() {
      const { pauseFormModal } = this
      if (!pauseFormModal.start_time || !pauseFormModal.end_time) return this.$message.warning('请选择时间段')
      const param = {
        user_id: pauseFormModal.lawyer.user_id,
        suspend_push_order_start_time: moment(pauseFormModal.start_time).format('YYYY-MM-DD HH:mm:ss'),
        suspend_push_order_end_time: moment(pauseFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
      }

      this.pauseFormModal.isShowPauseFormModal = false

      try {
         await lawyerApi.openBestReceiveOrderApi(param)
         this.$notification.success({ message: '已开启暂停', duration: 3 })
         this._getBestTotalList(this.tableTotalPagination.current)
         this._getBestExpList(this.tableExpPagination.current)
         this._getBestExpireList(this.tableExpirePagination.current)
         this._getBestPauseList(this.tablePausePagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 关闭 暂停接单
     */
    async closeBestReceiveOrder(record) {
      const param = { user_id: record.user_id, }

      try {
         await lawyerApi.closeBestReceiveOrderApi(param)
         this.$notification.success({ message: '已关闭暂停', duration: 3 })
         this._getBestTotalList(this.tableTotalPagination.current)
         this._getBestExpList(this.tableExpPagination.current)
         this._getBestExpireList(this.tableExpirePagination.current)
         this._getBestPauseList(this.tablePausePagination.current)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 导航优选会员续费页面
     */
    navToBestVipContinuePage(record) {
      sessionStorage.setItem('lawyerInfoSession', JSON.stringify({ avatar: record.avatar, nickname: record.nickname, mobile: record.mobile, user_id: record.user_id }))
      this.$router.push({ name: 'LawyerBestContinue' })
    },

    /**
     * 导航律师消费记录页面
     */
    navToLawyerExpenseRecordPage(record) {
      sessionStorage.setItem('lawyerInfoSession', JSON.stringify({ avatar: record.avatar, nickname: record.nickname, mobile: record.mobile, user_id: record.user_id }))
      this.$router.push({ name: 'LawyerExpenseRecordRoute' })
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

    /**
     * 监听余额增/扣款 modal ok 事件
     */
    async openBalanceModal(record) {
      this.balanceModalInfo.lawyer = {
        nickname: record.nickname,
        avatar: record.avatar,
        mobile: record.mobile,
        user_id: record.user_id,
        balance: record.balance
      }
      // 扣款金额
      this.balanceModalInfo.balanceMoney = record.debt_remark
      this.balanceModalInfo.isShowBalanceModal = true
    },

    /**
     * 监听余额增/扣款 modal ok 事件
     */
    async onBalanceModalOkEvt() {
      if (!this.balanceModalInfo.balanceMoney.trim()) return this.$message.warning('请输入金额')

      const param = {
        type: 1, // 1 支出
        user_id: this.balanceModalInfo.lawyer.user_id,
        money: this.balanceModalInfo.balanceMoney.trim(),
        reason: '优选抵扣',
      }
      this.balanceModalInfo.isShowBalanceModal = false

      // console.log(param)
      // return

      try {
         await lawyerApi.updateUserbalanceApi(param)
         await lawyerApi.updateBestLawyerRemarkApi({ user_id: this.balanceModalInfo.lawyer.user_id, type: 4, debt_remark: '' })
         this.refreshTableData()
         this.$notification.success({ message: '抵扣成功', duration: 3 })
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
    justify-content: flex-start;
    align-items: center;
    height: 90px;
    padding: 0 10px;
    .focus-text {
      margin-right: 10px;
      font-size: 20px;
      font-weight: 800;
      line-height: 28px;
      color: #222222;
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

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
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
  .column-menu-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 600;
  }
  .column-menuTime-wrap {
    font-weight: 600;
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

.open-modal {
  .open-body {
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
      height: 50px;
      border-radius: 6px;
      padding: 0 4px;
      border: 1px solid #ccc;
      cursor: pointer;
      .checkbox-img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        margin-left: auto;
      }
    }
  }
}

.open-form-modal {
  .open-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 100px;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

.pause-modal {
  .pause-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 100px;
      font-size: 14px;
      font-weight: 600;
    }
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

.deduct-modal {
  .pause-form-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .form-key {
      min-width: 100px;
      font-size: 14px;
      font-weight: 600;
    }
  }
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
      margin-left: auto;
    }
  }
}
</style>
