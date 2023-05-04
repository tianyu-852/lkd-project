<template>
  <div>
    <a-skeleton active :loading="state.skeletonLoading">
      <div class="top">
        <a-card class="top-left">
          <a-tabs v-model="activeTabKey">
            <!-- 律师资料 -->
            <a-tab-pane key="1" tab="律师资料">
              <div class="top-left-container">
                <div class="top-title">
                  <div @click="goList">
                    <span>←<span>律师资料</span> </span>
                  </div>
                  <ImageViewer ref="imageViewer" :images="images" />
                  <a-modal
                    v-model="state.imagesModal"
                    title="审核图片"
                    ok-text="保存修改"
                    cancel-text="取消修改"
                    @cancel="cancelUpload"
                    @ok="uploadNewLawyer"
                  >
                    <div class="showLawyerIDcard">
                      <div v-for="(index, key) in images" :key="key" class="showLawyerIDcard-li">
                        <img :src="index" alt="" />
                        <div class="actionIcon">
                          <img :src="require('@/assets/common/image_preview.png')" @click="$refs.imageViewer.show()" />
                          <img :src="require('@/assets/common/image_edit.png')" @click="openMosaic(index, key)" />
                        </div>
                      </div>
                    </div>
                  </a-modal>

                  <a-modal
                    v-model="state.mosaicDialog"
                    title="编辑图片"
                    ok-text="保存"
                    cancel-text="取消"
                    @ok="saveImage"
                    @cancel="cancelImage"
                    width="900px">
                    <p>鼠标点击添加马赛克</p>
                    <ImageMosaic :imgSrc="mosaicImage" ref="ImageMosaic" @save="save" />
                  </a-modal>
                  
                  <a-button v-if="(userInfo && dataRoleList.includes(userInfo.name))" type="link" size="small" @click="showImages">律师审核图 ></a-button>
                </div>

                <!-- 顶部数据 -->
                <div class="top-number">
                  <div class="top-numbers">
                    <h3>{{ lawyerInfo.question_number }}</h3>
                    <h6>发帖数</h6>
                  </div>
                  <div class="top-numbers">
                    <h3>{{ lawyerInfo.call_phone_bind_number }}</h3>
                    <h6>已咨询电话</h6>
                  </div>
                  <div class="top-numbers">
                    <h3>{{ lawyerInfo.call_phone_success_number }}</h3>
                    <h6>已接通电话</h6>
                  </div>
                  <div class="top-numbers">
                    <h3 style="color: red">
                      {{ lawyerInfo.call_phone_bind_number - lawyerInfo.call_phone_success_number }}
                    </h3>
                    <h6 style="color: red">未接通电话</h6>
                  </div>
                </div>

                <div class="cell-wrap">
                  <!-- 律师基本信息 -->
                  <div class="top-info" v-for="lawyerItem in lawyerArray" :key="lawyerItem.title">
                    <span>{{ lawyerItem.title }}： </span>
                    <!-- 保障金 -->
                    <span v-if="lawyerItem.title === '保障金'" style="color: #3980ea">{{ lawyerItem.value }}</span>
                    <!-- 登录号码/接听电话 -->
                    <span v-else-if="['登录号码', '接听电话'].includes(lawyerItem.title)">{{ userInfo && dataRoleList.includes(userInfo.name) ? lawyerItem.value : hidePhoneFunc(lawyerItem.value) }}</span>
                    <!-- 用户余额 -->
                    <router-link v-else-if="lawyerItem.title === '用户余额'" :to="{ name: 'moneyDetail', path: '/money/detail', query: { id: String($route.params.userId) } }" >
                      {{ lawyerItem.value }}
                    </router-link>
                    <!-- 优选套餐 -->
                    <template v-else-if="['优选套餐', '优选开始时间', '优选结束时间' ].includes(lawyerItem.title)">
                      <span v-if="lawyerItem.title === '优选套餐'" style="color: #41b583">{{ lawyerItem.value || '无' }}</span>
                      <span v-if="lawyerItem.title === '优选开始时间'" style="color: #41b583">{{ lawyerItem.value || '/' }}</span>
                      <span v-if="lawyerItem.title === '优选结束时间'" style="color: #41b583">{{ lawyerItem.value || '/' }}</span>
                    </template>
                    <!-- 案源套餐 -->
                    <!-- <template v-else-if="['案源套餐', '案源开始时间', '案源结束时间' ].includes(lawyerItem.title)">
                      <span v-if="lawyerItem.title === '案源套餐'" style="color: #f56c6c">{{ lawyerItem.value || '无' }}</span>
                      <span v-if="lawyerItem.title === '案源开始时间'" style="color: #f56c6c">{{ lawyerItem.value || '/' }}</span>
                      <span v-if="lawyerItem.title === '案源结束时间'" style="color: #f56c6c">{{ lawyerItem.value || '/' }}</span>
                    </template> -->

                    <!-- else 普通值 -->
                    <span v-else> {{ lawyerItem.value }} </span>

                    <!-- <a-button
                      v-if="
                        lawyerItem.title === '保障金' &&
                          lawyerItem.value !== '0.00元' &&
                          lawyerInfo.is_show_guarantee_refund === 1
                      "
                      type="primary"
                      style="margin: 0 20px 0 10px"
                      @click="state.refundDialog = true"
                    >
                      退款
                    </a-button> -->
                    <!-- 保障金 -->
                    <a-popconfirm v-if="(userInfo && dataRoleList.includes(userInfo.name) && lawyerItem.title === '保障金' && lawyerItem.value !== '0.00')" title="确定取消保证金（不会退款）" @confirm="confirmCancelGuaranteeMoney">
                      <a-button type="primary" size="small" style="margin-left: 10px;">取消保证金</a-button>
                    </a-popconfirm>

                    <!-- 余额扣款 -->
                    <template v-if="(userInfo && dataRoleList.includes(userInfo.name))">
                      <a-button v-if="lawyerItem.title === '用户余额' && lawyerItem.value !== '0.00元'" type="primary" size="small" style="margin-left: 10px;" @click="balanceModalInfo.balanceType = 1; balanceModalInfo.isShowBalanceModal = true" >扣款</a-button>
                      <a-button v-if="lawyerItem.title === '用户余额'" type="primary" size="small" style="margin-left: 10px;" @click="balanceModalInfo.balanceType = 0; balanceModalInfo.isShowBalanceModal = true">增款</a-button>
                    </template>
                  </div>
                </div>

                <div class="top-introduction">
                  <span>{{ lawyerInfo.introduction.substr(0, 150) + (isShowDetail ? '...' : '') }}</span>
                  <a-button type="link" size="small" v-if="isShowDetail" @click="state.introductionVisible = true">
                    查看详情
                  </a-button>
                  <a-modal v-model="state.introductionVisible" title="律师简介" @ok="state.introductionVisible = false">
                    <p>{{ lawyerInfo.introduction }}</p>
                  </a-modal>
                </div>

                <div class="top-good-at flex-column-center">
                  <span>擅长领域：</span>
                  <span>{{ lawyerInfo.lawyer_tags.join(',') }}</span>
                </div>

                <div class="top-showImages" style="display: flex; flex-wrap: wrap; flex-direction: row">
                  <div
                    v-for="(i, key) in lawyerInfo.honor_certificates"
                    :key="key"
                    style=" width: 100px; height: 120px; margin: 10px 5px; display: flex; flex-direction: column; align-items: center; "
                    @click="openShowList">
                    <img :src="i.image" style="width: 100px; height: 100px; cursor: pointer; object-fit: contain" />
                    <span>{{ i.title }}</span>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            
            <!-- 注册 -->
            <a-tab-pane key="2" tab="注册">
              <div v-if="lawyerRegisterLogList.length" class="tab-item-row">
                <div v-if="!lawyerRegisterLogList[0].staff.name || (userInfo && openVipRoleList.includes(userInfo.name)) || (String(lawyerRegisterLogList[0].staff.staff_user_id) === String(userInfo.user_id))" class="tab-item">
                  <span>跟进销售：</span>
                  <a-select v-model="lawyerRegisterLogList[0].staff.staff_user_id" :disabled="(userInfo && openVipRoleList.includes(userInfo.name)) || !lawyerRegisterLogList[0].staff.name ? false : true" allowClear style="width: 160px">
                    <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                  <a-popconfirm v-if="(userInfo && openVipRoleList.includes(userInfo.name)) || !lawyerRegisterLogList[0].staff.name" title="是否更新销售?" @confirm="confirmSelectLawManager(2)">
                    <a-button type="primary" style="margin-left: 6px;">更新</a-button>
                  </a-popconfirm>
                </div>
              </div>
              <div v-if="lawyerRegisterLogList.length" class="tab-item-row">
                <div class="tab-item">
                  <span>{{ lawyerRegisterLogList[0].remark }}</span>
                </div>
              </div>

              <a-empty v-else />
            </a-tab-pane>

            <!-- 认证 -->
            <a-tab-pane key="3" tab="认证">
              <div v-if="lawyerAuthLogList.length" class="tab-item-row">
                <div v-if="!lawyerAuthLogList[0].staff.name || (userInfo && openVipRoleList.includes(userInfo.name)) || (String(lawyerAuthLogList[0].staff.staff_user_id) === String(userInfo.user_id))" class="tab-item">
                  <!-- <div v-if="(userInfo && openVipRoleList.includes(userInfo.name)) || (String(lawyerAuthLogList[0].staff.staff_user_id) === String(userInfo.user_id))" class="tab-item"> -->
                  <span>跟进销售：</span>
                  <a-select v-model="lawyerAuthLogList[0].staff.staff_user_id" :disabled="(userInfo && openVipRoleList.includes(userInfo.name)) || !lawyerAuthLogList[0].staff.name ? false : true" allowClear style="width: 160px">
                    <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                  <a-popconfirm v-if="(userInfo && openVipRoleList.includes(userInfo.name)) || !lawyerAuthLogList[0].staff.name" title="是否更新销售?" @confirm="confirmSelectLawManager(3)">
                    <a-button type="primary" style="margin-left: 6px;">更新</a-button>
                  </a-popconfirm>
                </div>
              </div>
              <div v-if="lawyerAuthLogList[0]" class="tab-item-row">
                <div class="tab-item">
                  <span>{{ lawyerAuthLogList[0].remark }}</span>
                </div>
              </div>
              <a-empty v-else />
            </a-tab-pane>

            <!-- 体验 -->
            <a-tab-pane key="4" tab="体验期">
              <div v-if="lawyerExpVipLogList.length" class="tab-item-row">
                <div v-if="!lawyerExpVipLogList[0].staff.name || (userInfo && openVipRoleList.includes(userInfo.name)) || (String(lawyerExpVipLogList[0].staff.staff_user_id) === String(userInfo.user_id))" class="tab-item">
                  <span>跟进销售：</span>
                  <a-select v-model="lawyerExpVipLogList[0].staff.staff_user_id" :disabled="(userInfo && openVipRoleList.includes(userInfo.name)) || !lawyerExpVipLogList[0].staff.name ? false : true" allowClear style="width: 160px">
                    <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                  <a-popconfirm v-if="(userInfo && openVipRoleList.includes(userInfo.name)) || !lawyerExpVipLogList[0].staff.name" title="是否更新销售?" @confirm="confirmSelectLawManager(4)">
                    <a-button type="primary" style="margin-left: 6px;">更新</a-button>
                  </a-popconfirm>
                </div>
              </div>
              <div v-if="lawyerExpVipLogList[0]" class="tab-item-row">
                <div class="tab-item">
                  <span>{{ lawyerExpVipLogList[0].remark }}</span>
                </div>
              </div>
              <a-empty v-else />
            </a-tab-pane>
            
            <!-- 月 -->
            <a-tab-pane key="5" tab="月卡">
              <div class="tab-item-row">
                <div v-for="(upItem, upIndex) in lawyerMonthVipLogList" :key="upIndex" class="tab-item">
                  <div>
                    <div>{{ upItem.remark.split(';')[0] }}</div>
                    <div>{{ upItem.remark.split(';')[1] }}</div>
                  </div>
                  <a-select v-if="!upItem.staff.name || (userInfo && openVipRoleList.includes(userInfo.name)) || (String(upItem.staff.staff_user_id) === String(userInfo.user_id))" v-model="upItem.staff.staff_user_id" :disabled="(userInfo && openVipRoleList.includes(userInfo.name)) || !upItem.staff.name ? false : true" allowClear style="width: 140px; margin-left: 20px;">
                    <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                  <a-popconfirm v-if="(userInfo && openVipRoleList.includes(userInfo.name)) || !upItem.staff.name" title="是否更新销售?" @confirm="confirmSelectLawManager(5, upItem.lawyer_staff_log_id, upItem.staff.staff_user_id)">
                    <a-button type="primary" style="margin-left: 6px;">更新</a-button>
                  </a-popconfirm>
                </div>

                <a-empty v-if="!lawyerMonthVipLogList.length" />
              </div>
            </a-tab-pane>

            <!-- 年 -->
            <a-tab-pane key="6" tab="年卡">
              <div class="tab-item-row">
                <div v-for="(upItem, upIndex) in lawyerYearVipLogList" :key="upIndex" class="tab-item">
                  <div>
                    <div>{{ upItem.remark.split(';')[0] }}</div>
                    <div>{{ upItem.remark.split(';')[1] }}</div>
                  </div>
                  <a-select v-if="!upItem.staff.name || (userInfo && openVipRoleList.includes(userInfo.name)) || (String(upItem.staff.staff_user_id) === String(userInfo.user_id))" v-model="upItem.staff.staff_user_id" :disabled="(userInfo && openVipRoleList.includes(userInfo.name)) || !upItem.staff.name ? false : true" allowClear style="width: 140px; margin-left: 20px;">
                    <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                  <a-popconfirm v-if="(userInfo && openVipRoleList.includes(userInfo.name)) || !upItem.staff.name" title="是否更新销售?" @confirm="confirmSelectLawManager(6, upItem.lawyer_staff_log_id, upItem.staff.staff_user_id)">
                    <a-button type="primary" style="margin-left: 6px;">更新</a-button>
                  </a-popconfirm>
                </div>
                
                <a-empty v-if="!lawyerYearVipLogList.length" />
              </div>
            </a-tab-pane>

            <!-- 升级 -->
            <a-tab-pane key="7" tab="升级">
              <a-button type="primary" style="margin-bottom: 20px;" @click="openUpVipModal">添加升级套餐记录</a-button>

              <div class="tab-item-row">
                <div v-for="(upItem, upIndex) in lawyerUpVipLogList" :key="upIndex" class="tab-item">
                  <div>
                    <div>{{ upItem.remark.split(';')[0] }}</div>
                    <div>{{ upItem.remark.split(';')[1] }}</div>
                  </div>
                  <a-select v-if="!upItem.staff.name || (userInfo && openVipRoleList.includes(userInfo.name)) || (String(upItem.staff.staff_user_id) === String(userInfo.user_id))" v-model="upItem.staff.staff_user_id" :disabled="(userInfo && openVipRoleList.includes(userInfo.name)) || !upItem.staff.name ? false : true" allowClear style="width: 160px; margin-left: 20px;">
                    <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                  <a-popconfirm v-if="(userInfo && openVipRoleList.includes(userInfo.name)) || !upItem.staff.name" title="是否更新销售?" @confirm="confirmSelectLawManager(7, upItem.lawyer_staff_log_id, upItem.staff.staff_user_id)">
                    <a-button type="primary" style="margin-left: 6px;">更新</a-button>
                  </a-popconfirm>
                </div>

                <a-empty v-if="!lawyerUpVipLogList.length" />
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>

        <a-card class="top-right">
          <a-skeleton active :loading="state.skeletonLoading">
            <span>订单数量：{{ lawyerInfo.order_number }}</span>
            <!-- <v-chart :force-fit="true" :height="200" :data="pieData" :scale="pieScale">
              <v-tooltip :showTitle="false" dataKey="item*percent" />
              <v-axis />
              <v-legend dataKey="item" />
              <v-pie position="percent" color="item" :vStyle="pieStyle" />
              <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
            </v-chart> -->
          </a-skeleton>
          <div class="top-right-service" style="margin-top: 20px">
            <span>收费咨询</span>
            <span
              :style="lawyerInfo.is_enable_fee_consultation === 1 ? 'color: #73d0b5' : ''"
              style="cursor: pointer"
              @click="changeService(0)"
            >
              <div
                class="top-right-service-spot"
                :style="lawyerInfo.is_enable_fee_consultation === 1 ? 'background: #73d0b5' : ''"
              />
              {{ lawyerInfo.is_enable_fee_consultation === 1 ? '已开启' : '未开启' }}
            </span>
          </div>
          <div class="top-right-service">
            <span>服务地区</span>
            <span>
              {{ lawyerInfo.service_address }}
            </span>
          </div>

          <div class="top-right-service">
            <span>服务地区免费咨询</span>
            <span
              :style="lawyerInfo.is_free_call_phone === 1 ? 'color: #73d0b5' : ''"
              style="cursor: pointer"
              @click="changeService(1)"
            >
              <div
                class="top-right-service-spot"
                :style="lawyerInfo.is_free_call_phone === 1 ? 'background: #73d0b5' : ''"
              />
              {{ lawyerInfo.is_free_call_phone === 1 ? '已开启' : '未开启' }}
            </span>
          </div>
          <div class="top-right-evaluate">
            <div>
              <div class="top-right-service-spot" style="background: #5c90f9" />
              <span>
                好评: <span>{{ lawyerInfo.praise_number }}</span>
              </span>
            </div>
            <div>
              <div class="top-right-service-spot" style="background: #ffc64a" />
              <span>
                一般:<span>{{ lawyerInfo.secondary_number }}</span>
              </span>
            </div>
            <div>
              <div class="top-right-service-spot" style="background: #f78c6b" />
              <span>
                差评:<span>{{ lawyerInfo.bad_number }}</span>
              </span>
            </div>
          </div>
          <div>
            <span>法律小铺</span>
            <br />
            <div v-for="(index, key) in lawyerInfo.products" :key="key">
              <a-button
                type="primary"
                :style="'background-color:' + index.color + ';border-color:' + index.color"
                class="btnColor"
              >
                {{ index.name }}
              </a-button>
              <a
                :style="'color:' + index.color + ';margin:2px'"
                v-for="value in index.products"
                :key="value.lawyer_product_map_id"
                @click="$message.success('你选择了' + value.name + '' + value.price + '元')"
              >
                {{ value.name }} {{ value.price }}元</a
              >
            </div>
            <div v-if="lawyerInfo.products.length === 0">还没有相关的法律小铺哦！</div>
          </div>
        </a-card>
      </div>

      <!-- 律师订单列表 -->
      <a-card style="margin-top: 16px">
        <a-tabs default-active-key="1">
          <!-- 订单列表 -->
          <a-tab-pane key="1" tab="订单列表">
            <a-table :data-source="lawyerOrders" bordered :pagination="pagination" :loading="state.loading" :rowKey="(record) => record.order_no" >
              <!-- 用户 -->
              <a-table-column key="user" title="用户">
                <template slot-scope="record">
                  <user-vip-cell
                    :nickname="record.nickname"
                    :avatar="record.avatar"
                    :mobile="(userInfo && dataRoleList.includes(userInfo.name) ? record.mobile : hidePhoneFunc(record.mobile))"
                    :vip-icon="record.vip_icon"
                    :user-id="String(record.user_id)"
                    @open="openUser(String(record.user_id), 'user')"
                  />
                </template>
              </a-table-column>
              <!-- 订单时间 -->
              <a-table-column key="created_at" data-index="created_at" title="订单时间" align="center" />

              <!-- 订单类型 -->
              <a-table-column key="order_type_chinese" align="center">
                <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                  <span>订单类型</span>
                  <a-select v-model="lawyerOrderFactor" allowClear @change="getLawyerOrderPage()" style="width: 140px">
                    <a-select-option v-for="type in lawyerOrderSelectList" :value="type.value" :key="type.label">
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                </div>
                <template slot-scope="record">
                  <div>{{ record.order_type_chinese }}</div>
                </template>
              </a-table-column>

              <!-- 评价 -->
              <a-table-column key="service_time" align="center">
                <div slot="title" style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: center">
                  <span>评价</span>
                  <a-select v-model="tableSelect" style="width: 80px" ref="select" @change="tableSelectChange">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">满意</a-select-option>
                    <a-select-option value="2">一般</a-select-option>
                    <a-select-option value="3">不满意</a-select-option>
                  </a-select>
                </div>
                <template slot-scope="record">
                  <span
                    v-show="record.evaluate_score !== 1 && record.evaluate_score !== 2 && record.evaluate_score !== 3"
                  >
                    未评价
                  </span>
                  <img
                    v-show="[1, 2, 3].includes(record.evaluate_score)"
                    :src="
                      record.evaluate_score === 1
                        ? require('@/assets/Order/my_icon_sel@2x.png')
                        : record.evaluate_score === 2
                          ? require('@/assets/Order/yb_icon_sel@2x.png')
                          : require('@/assets/Order/bmy_icon_sel@2x.png')
                    "
                    style="width: 22px; height: 22px"
                  />
                  <span
                    v-show="[1, 2, 3].includes(record.evaluate_score)"
                    :style="
                      record.evaluate_score === 1
                        ? 'color: #ffa577'
                        : record.evaluate_score === 2
                          ? 'color: #ff7864'
                          : 'color: #9db4dd'
                    "
                  >
                    {{ record.evaluate_score === 1 ? '满意' : record.evaluate_score === 2 ? '一般' : '不满意' }}
                  </span>
                </template>
              </a-table-column>
              <!-- 录音 -->
              <a-table-column key="records" title="录音" align="center">
                <template slot-scope="record">
                  <a-select style="width: 120px" placeholder="请选择录音" @change="handleChange">
                    <a-select-option v-for="i in record.records" :key="i.record_path" :value="i.record_path">
                      {{ i.duration }}
                    </a-select-option>
                  </a-select>
                  <a @click="openRecord">播放</a>
                </template>
              </a-table-column>
              <!-- 订单状态 -->
              <a-table-column key="status" title="订单状态" align="center">
                <template slot-scope="record">
                  <span v-if="record.status === '已完成' || record.status === '已完成(未满有效时间)'" style="color: #787e8d" >
                    {{ record.status }}
                    <!-- 已完成(24小时内单次通话时长未达到55秒) -->
                  </span>
                  <span v-else-if="record.status === '未接单'" style="color: #ff524c">{{ record.status }}</span>
                  <span v-else-if="record.status === '未完成'" style="color: #ff9700">{{ record.status }}</span>
                  <span v-else-if="record.status === '待评价'" style="color: #2cbf78">{{ record.status }}</span>
                  <span v-else>{{ record.status }}</span>
                </template>
              </a-table-column>
              <!-- 费用(元) -->
              <a-table-column key="money_real" title="金额" align="center">
                <template slot-scope="record">
                  <div>{{ record.money_real }}</div>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>

          <!-- 案源报价 -->
          <a-tab-pane key="2" tab="案源报价">
            <a-table :data-source="offerTableDataList" bordered :pagination="offerPagination" :rowKey="(record) => record.order_no" >
              <!-- 用户 -->
              <a-table-column key="user" title="用户">
                <template slot-scope="record">
                  <user-vip-cell
                    :nickname="record.nickname"
                    :avatar="record.avatar"
                    :mobile="(userInfo && dataRoleList.includes(userInfo.name) ? record.mobile : hidePhoneFunc(record.mobile))"
                    :vip-icon="record.vip_icon"
                    :user-id="String(record.user_id)"
                    @open="openUser(String(record.user_id), 'user')"
                  />
                </template>
              </a-table-column>
              
              <!-- 发布时间 -->
              <a-table-column key="created_at" data-index="created_at" title="发布时间" align="center" />

              <!-- 订单类型 -->
              <a-table-column key="order_type_chinese" align="center">
                <template slot-scope="record">
                  <div>{{ record.order_type_chinese }}</div>
                </template>
              </a-table-column>

              <!-- 律师报价 -->
              <a-table-column data-index="price" title="律师报价" align="center" />

              <!-- 发表内容 -->
              <a-table-column data-index="content" title="发表内容" align="center" />
            </a-table>
          </a-tab-pane>

          <!-- 转账记录 -->
          <a-tab-pane key="3" tab="转账记录">
            <a-table
              :data-source="tableRecordList"
              :loading="tableRecordLoading"
              :pagination="tableRecordPagination"
              :rowKey="(record) => String(record.transfer_no)"
              bordered
            >

              <!-- 发起人 -->
              <a-table-column title="用户" align="center">
                <template slot-scope="record">
                  <user-vip-cell
                    :nickname="record.initiator.nickname"
                    :avatar="record.initiator.avatar"
                    :mobile="record.initiator.mobile"
                    :user-id="String(record.initiator.user_id)"
                  />
                </template>
              </a-table-column>

              <!-- 接收人 -->
              <a-table-column title="律师" align="center">
                <template slot-scope="record">
                  <user-vip-cell
                    :nickname="record.recipient.nickname"
                    :avatar="record.recipient.avatar"
                    :mobile="record.recipient.mobile"
                    :user-id="String(record.recipient.user_id)"
                  />
                </template>
              </a-table-column>

              <!-- 转账金额 -->
              <a-table-column dataIndex="money" title="转账金额" align="center" />

              <!-- 转账状态 -->
              <a-table-column dataIndex="status_text" title="转账状态" align="center" />

              <!-- 创建时间 -->
              <a-table-column dataIndex="created_at" title="创建时间" align="center" />

              <!-- 收款时间 -->
              <a-table-column title="收款时间" align="center">
                <template slot-scope="record">
                  <span v-if="record.status === 1">{{ record.updated_at }}</span>
                  <span v-else>无</span>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>

          <!-- 本地案源 -->
          <a-tab-pane key="4" tab="本地案源">
            <a-table
              :data-source="tableNativeCauseSourceList"
              :loading="tableNativeCauseSourceLoading"
              :pagination="tableNativeCauseSourcePagination"
              :rowKey="(record) => String(record.local_lawyer_case_source_id)"
              bordered
            >
              <!-- 用户 -->
              <a-table-column title="用户" align="center">
                <template slot-scope="record">
                  <user-vip-cell
                    :nickname="record.case_user.nickname"
                    :avatar="record.case_user.avatar"
                    :mobile="record.case_user.mobile"
                    :user-id="String(record.case_user.user_id)"
                  />
                </template>
              </a-table-column>

              <!-- 购买时间 -->
              <a-table-column dataIndex="pay_time" title="购买时间" align="center" />

              <!-- 线索信息 -->
              <a-table-column title="线索信息" align="center">
                <template slot-scope="record">
                  <div>{{ record.lawyer_tag }}</div>
                  <div>{{ record.province }}/{{ record.city }}</div>
                  <div>发布时间：{{ record.created_at }}</div>
                </template>
              </a-table-column>

              <!-- 金额 -->
              <a-table-column dataIndex="price" title="金额" align="center" />

              <!-- 线索状态 -->
              <a-table-column dataIndex="local_case_source_label" title="线索状态" align="center" />

              <!-- 备注 -->
              <a-table-column dataIndex="remark" title="备注" align="center" />

              <!-- 操作 -->
              <a-table-column title="操作" align="center">
                <template slot-scope="record">
                  <a-popconfirm title="是否确认要删除？" @confirm="delCauseSourceItem(record)">
                    <!-- <a-button type="primary" size="small" style="margin: 5px; background: #F56C6C; border-color: #F56C6C;">移除优选</a-button> -->
                    <a-button type="link" style="color: #f56c6c;" size="small">删除</a-button>
                  </a-popconfirm>
                  <a-button type="link" size="small" @click="openPhoneCallRecordModal(record)">通话记录</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-skeleton>
    
    <a-drawer
      title="录音播放"
      placement="right"
      :closable="false"
      :visible="state.recordVisible"
      @close="state.recordVisible = false"
      width="400" >
      <single-audio-player :src="currentPlayRecord" />
    </a-drawer>

    <q-dialog v-model="state.userDialog">
      <user-detail-dialog :user-id="currentUserId" :mode="typeUser" @close="state.userDialog = false" />
    </q-dialog>

    <q-dialog v-model="state.listWindowLoadiing">
      <common-dialog :title="listWindow.title" @close="state.listWindowLoadiing = false">
        <a-textarea
          class="textarea"
          placeholder="请输入对TA的回复"
          v-model="listWindow.reply"
          style="width：100%; min-height:200px"
        >
        </a-textarea>
        <div class="center" style="margin: 5px 0">
          <q-btn style="width: 120px; margin: 0 10px" @click="giveUser(0)">客服发送</q-btn>
          <q-btn color="primary" style="width: 120px; margin: 0 10px" @click="giveUser(1)">消息系统发送</q-btn>
        </div>
      </common-dialog>
    </q-dialog>

    <!-- 退保证金 modal -->
    <a-modal v-model="state.refundDialog" title="请确认是否退款" ok-text="确认" cancel-text="取消" @ok="refundChoose">
      <p>点击确认后, 律师将会退出保障计划</p>
    </a-modal>

    <!-- 余额增/扣款 modal -->
    <a-modal
      v-model="balanceModalInfo.isShowBalanceModal"
      :width="360"
      :title="balanceModalInfo.balanceType === 1 ? '余额扣款' : '余额增款'"
      destroyOnClose
      @ok="onBalanceModalOkEvt"
    >
      <div class="deduct-modal">
        <div class="input-item">
          <div class="input-title">{{ balanceModalInfo.balanceType === 1 ? '扣款金额' : '增款金额' }}：</div>
          <a-input class="input" style="width: 140px; margin-right: 8px;" v-model="balanceModalInfo.balanceMoney" placeholder="请输入金额" allowClear />
          <div>元</div>
        </div>

        <div class="input-item"><div class="input-title">{{ balanceModalInfo.balanceType === 1 ? '扣款原因' : '增款原因' }}：</div></div>
        <a-textarea v-model="balanceModalInfo.balanceReason" placeholder="请输入理由..." :auto-size="{ minRows: 4 }" />
      </div>
    </a-modal>
    <ImageViewer ref="imagesViewer" :images="imagesList" />

    <!-- 添加升级套餐记录 表单 modal -->
    <a-modal
      v-model="upVipFormModal.isShowUpVipFormModal"
      :width="450"
      title="添加升级套餐跟进记录"
      destroyOnClose
      :afterClose="onUpVipFormModalAfterClose"
      @ok="onUpVipFormModalOkEvt"
    >
      <div class="open-form-modal">
        <div class="open-form-item">
          <span class="form-key">现套餐类型:</span>
          <span>{{ lawyerInfo.optimal && lawyerInfo.optimal.optimization_plan_name }}</span>
        </div>
        <div class="open-form-item">
          <span class="form-key">现套餐次数:</span>
          <span>{{ lawyerInfo.optimal && lawyerInfo.optimal.total_num }}</span>
        </div>
        <div class="open-form-item">
          <span class="form-key">预计收益:</span>
          <span>{{ lawyerInfo.optimal && lawyerInfo.optimal.total_earnings }}</span>
        </div>
        <div class="open-form-item">
          <span class="form-key">赠送订单次数:</span>
          <span>{{ lawyerInfo.optimal && lawyerInfo.optimal.add_num || 0 }}</span>
        </div>
        <div class="open-form-item">
          <span class="form-key">套餐时间:</span>
          <span>{{ lawyerInfo.optimal && lawyerInfo.optimal.optimal_enjoy_open_time }}-{{ lawyerInfo.optimal && lawyerInfo.optimal.optimal_enjoy_end_time }}</span>
        </div>

        <a-divider>升级套餐</a-divider>

        <!-- 套餐类型 -->
        <div class="open-form-item">
          <span class="form-key">套餐类型:</span>
          <a-select style="width: 192px;" v-model="upVipFormModal.optimization_plan_id" @change="onUpVipFormSelectChangeEvt">
            <a-select-option v-for="sItem in mealSelectList" :value="sItem.value" :key="sItem.value">
              {{ sItem.label }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 订单次数 -->
        <div class="open-form-item">
          <span class="form-key">订单次数:</span>
          <a-input allow-clear placeholder="订单次数" v-model="upVipFormModal.total_num" style="width: 192px" />
        </div>
        <!-- 预计收益 -->
        <div class="open-form-item">
          <span class="form-key">预计收益:</span>
          <a-input allow-clear placeholder="预计收益" v-model="upVipFormModal.price" style="width: 192px" />
        </div>
        <!-- 赠送订单次数 -->
        <div class="open-form-item">
          <span class="form-key">赠送订单次数:</span>
          <a-input allow-clear placeholder="订单赠送次数(选填)" v-model="upVipFormModal.add_num" style="width: 192px" />
        </div>
        <!-- 开始时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐开始时间:</span>
          <a-date-picker
            v-model="upVipFormModal.start_time"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          />
        </div>
        <!-- 结束时间 -->
        <div class="open-form-item">
          <span class="form-key">套餐结束时间:</span>
          <a-date-picker
            v-model="upVipFormModal.end_time"
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          />
        </div>

        <!-- 销售 -->
        <div class="open-form-item">
          <span class="form-key">销售:</span>
          <a-select v-model="upVipFormModal.staff_user_id" allowClear style="width: 192px">
            <a-select-option v-for="type in lawManagerSelectList" :value="type.value" :key="type.label">
              {{ type.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>

    <!-- 通话记录 modal -->
    <a-modal
      v-model="callRecordModal.isShowCallRecrodModal"
      :width="460"
      title="通话记录"
      :footer="null"
      destroyOnClose
    >
      <div class="callRecord-modal">
        <div v-for="(cItem, cIndex) in callRecordModal.callRecrdList" :key="cIndex" class="callRecord-item">
          <div>
            <div class="callRecord-user">
              <span>{{ cItem.lawyer.nickname }}</span>
              <a-icon v-if="cItem.call_type === 0" type="arrow-right" style="margin: 10px;" />
              <a-icon v-else type="arrow-left" style="margin: 10px;" />
              <span>{{ cItem.case_user.nickname }}</span>

              <span v-if="cItem.is_call_success" class="call-status" style="color: #41b583;">通话成功</span>
              <span v-else class="call-status" style="color: #999;">未接通</span>
            </div>
          </div>
          <div class="callRecord-time">通话时间：{{ cItem.call_time }}</div>
          <audio v-if="cItem.is_call_success" ref="audioRef" controls="controls" :src="cItem.recording_file" class="audio" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getLawyerOrderPage as getLawyerOrderPageApi, getLawyerDetail, postLawyerGuarantee, putLawyerShowEnableCall, putLawyerImages, } from '@/api/lawyer'
import * as lawyerApi from '@/api/lawyer'
import * as causeSourceApi from '@/api/causeSourceApi'
import * as lawManagerApi from '@/api/lawManagerApi'
import * as assetsApi from '@/api/assets'
import { putOrderEvaluateComplaintReply, putOrderEvaluateComplaintRevokeReply, putOrderEvaluateComplaintRevokeDelete, } from '@/api/order'
import UserCell from '@/components/User/UserCell'
import SingleAudioPlayer from '@/components/AudioPlayer/SingleAudioPlayer'
import ImageViewer from '@/components/Image/ImageViewer'
import UserDetailDialog from '@/components/Order/UserDetailDialog'
import UserVipCell from '@/components/User/UserVipCell'
import CommonDialog from '@/components/Dialog/CommonDialog'
import ImageMosaic from '@/components/Image/ImageMosaic.vue'
const DataSet = require('@antv/data-set')
import moment from 'moment'
import { mapState } from 'vuex'

// 增/扣钱 modal 信息
const BALANCE_MODAL_INFO = {
  isShowBalanceModal: false,
  balanceType: 0, // 0 收入 1 支出
  balanceMoney: '',
  balanceReason: '',
}

// 升级套餐 表单 modal
const UPVIP_FORM_MODAL = {
  isShowUpVipFormModal: false,

  optimization_plan_id: '', // 优选会员套餐 id
  price: '', // 预计收益
  total_num: '', // 订单次数
  add_num: '0', // 赠送数量
  start_time: '', // 开始时间
  end_time: '', // 结束时间
  staff_user_id: '', // 销售 id
}

// 通话记录 modal 信息
const CALLRECORD_MODAL = {
  isShowCallRecrodModal: false,
  callRecrdList: []
}

export default {
  name: 'LawyerDetailPage',
  components: { ImageViewer, SingleAudioPlayer, UserCell, UserVipCell, UserDetailDialog, CommonDialog, ImageMosaic },
  data() {
    return {
      activeTabKey: '1',
      lawyerId: '', // 律师 id
      isLawyerFlag: 1, // 是否是律师 1/0
      
      listWindow: { title: '', reply: '', },
      activeKey: '1',
      evaluateScore: 0,
      tableSelect: '0',
      checked: true,
      lawyerData: [],
      currentPlayRecord: '',
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
      iconList: [
        { url: require('@/assets/user/zs_icon@2x.png'), }
      ],
      // 律师订单类型 select 列表
      lawyerOrderSelectList: [
        { label: '免费咨询订单', value: '1', },
        { label: '法律小铺订单', value: '2', },
        { label: '百姓律师订单', value: '3', },
        { label: '客服端订单', value: '4', },
      ],
      lawyerOrderFactor: '',

      lawyerOrders: [], // 律师订单列表
      pagination: {
        total: 0,
        current: 1,
        pageSize: 8,
        showQuickJumper: true,
        onChange: (page) => {
          this.pagination.current = page
          this.getLawyerOrderPage(page)
        },
      },

      // 案源报价列表
      offerTableDataList: [],
      // 案源报价 pagination
      offerPagination: {
        total: 0,
        current: 1,
        pageSize: 8,
        showQuickJumper: true,
        onChange: page => {
          this.offerPagination.current = page
          this._getLawyerCauseSourceOfferList(page)
        },
      },

      tableRecordList: [], // 转账记录列表
      tableRecordLoading: false,
      tableRecordPagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getTransferAccountRecordList(page)
          this.tableRecordPagination.current = page
        },
      },

      tableNativeCauseSourceList: [], // 本地案源列表
      tableNativeCauseSourceLoading: false,
      tableNativeCauseSourcePagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getNativeCauseSourceList(page)
          this.tableNativeCauseSourcePagination.current = page
        },
      },

      state: {
        skeletonLoading: false,
        introductionVisible: false,
        recordVisible: false,
        detailLoading: false,
        loading: false,
        userDialog: false,
        refundDialog: false,
        checkedLoading: false,
        listWindowLoadiing: false,
        imagesModal: false,
        mosaicDialog: false,
      },
      mosaicImage: '',
      mosaicImageKey: 0,
      currentUserId: '',
      typeUser: '',
      pieScale: [
        {
          dataKey: 'percent',
          min: 0,
          formatter: '.0%',
        },
      ],
      lawyerInfo: {
        nickname: '',
        is_better: 0,
        is_guarantee: 0,
        mobile: '',
        call_mobile: '',
        license_number: '',
        start_work_time: '',
        lawyer_office: '',
        vip_name: '',
        vip_expired_time: null,
        lawyer_tags: [],
        introduction: '',
        order_number: 0,
        praise_number: 0,
        secondary_number: 0,
        bad_number: 0,
        id_card_front_image: '',
        id_card_back_image: '',
        certificate_image: '',
        certificate_record_image: '',
        question_number: 0,
        call_phone_bind_number: 0,
        call_phone_success_number: 0,
        auth_period: '',
        better_period: '',
        guarantee_money: '',
        service_time: '',
        honor_certificates: [],
        products: [
          {
            id: 0,
            name: '',
            color: '',
            products: [
              {
                lawyer_product_map_id: 0,
                name: '',
                price: '',
              },
            ],
          },
        ],
      },
      balanceModalInfo: Object.assign({}, BALANCE_MODAL_INFO), // 增/扣款 modal 信息

      lawManagerSelectList: [], // 律师管家 select
      activeFactorLawManager: '', // 选中律师管家（销售）

      lawyerRegisterLogList: [], // 律师注册记录
      lawyerAuthLogList: [], // 律师认证记录
      lawyerExpVipLogList: [], // 律师 vip体验期 记录
      lawyerMonthVipLogList: [], // 律师 vip月卡 记录
      lawyerYearVipLogList: [], // 律师 vip年卡 记录
      lawyerUpVipLogList: [], // 律师 vip升级 记录

      upVipFormModal: { ...UPVIP_FORM_MODAL }, // 升级套餐 modal
      callRecordModal: { ...CALLRECORD_MODAL }, // 通话记录 modal
      mealSelectList: [], // 开通套餐 select 列表
    }
  },
  computed: {
    ...mapState(['dataRoleList', 'openVipRoleList']),
    ...mapState({ 'userInfo': state => state.user.info }),
    
    imagesList() {
      const imagesList = []
      for (let index = 0; index < this.lawyerInfo.honor_certificates.length; index++) {
        imagesList.push(this.lawyerInfo.honor_certificates[index].image)
      }
      return imagesList
    },
    images() {
      return [
        this.lawyerInfo.id_card_front_image,
        this.lawyerInfo.id_card_back_image,
        this.lawyerInfo.certificate_image,
        this.lawyerInfo.certificate_record_image,
      ]
    },
    pieData() {
      const dv = new DataSet.View().source([
        { item: '好评', count: this.lawyerInfo.praise_number },
        { item: '一般', count: this.lawyerInfo.secondary_number },
        { item: '差评', count: this.lawyerInfo.bad_number },
      ])
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent',
      })

      return dv.rows
    },
    isShowDetail() {
      return this.lawyerInfo.introduction.length > 150
    },
    lawyerArray() {
      return [
        {
          title: '用户昵称',
          value: this.lawyerInfo.nickname,
        },
        {
          title: '登录号码',
          value: this.lawyerInfo.mobile,
        },
        {
          title: '接听电话',
          value: this.lawyerInfo.mobile,
        },
        {
          title: '从业时间',
          value: this.lawyerInfo.start_work_time,
        },

        {
          title: '所属律所',
          value: this.lawyerInfo.lawyer_office,
        },
        {
          title: '执业证',
          value: this.lawyerInfo.license_number,
        },
        // {
        //   title: '认证律师',
        //   value: this.lawyerInfo.auth_period,
        // },
        // {
        //   title: '优选律师',
        //   value: this.lawyerInfo.better_period,
        // },
        {
          title: '保障金',
          value: this.lawyerInfo.guarantee_money,
        },
        {
          title: '上班时间',
          value: this.lawyerInfo.service_time,
          // this.lawyerInfo.vip_name.length > 0
          //   ? `${this.lawyerInfo.vip_name}(${this.lawyerInfo.vip_expired_time})`
          //   : `非会员`,
        },
        {
          title: '注册时间',
          value: this.lawyerInfo.register_at,
        },
        {
          title: 'APP版本',
          value: this.lawyerInfo.current_app_version,
        },
        {
          title: '设备类型',
          value: this.lawyerInfo.location_device_type,
        },
        {
          title: '用户余额',
          value: this.lawyerInfo.balance + '元',
        },
        {
          title: '优选套餐',
          value: this.lawyerInfo.optimal?.optimization_plan_name,
        },
        {
          title: '优选开始时间',
          value: this.lawyerInfo.optimal?.optimal_enjoy_open_time,
        },
        {
          title: '优选结束时间',
          value: this.lawyerInfo.optimal?.optimal_enjoy_end_time,
        },
        // {
        //   title: '案源套餐',
        //   value: this.lawyerInfo.source_match?.name,
        // },
        // {
        //   title: '案源开始时间',
        //   value: this.lawyerInfo.source_match?.open_time,
        // },
        // {
        //   title: '案源结束时间',
        //   value: this.lawyerInfo.source_match?.end_time,
        // },
      ]
    },
  },
  created() {
    if (this.$route.params.userId) this.lawyerId = this.$route.params.userId
    // 是否是律师标识
    if (this.$route.params.isLawyerFlag === 0) this.isLawyerFlag = this.$route.params.isLawyerFlag

    if (this.isLawyerFlag) {
      this.getLawyerDetail()
      this.getLawyerOrderPage()
      this._getLawyerCauseSourceOfferList()
      this._getTransferAccountRecordList()
      this._getNativeCauseSourceList()
    }

    this._getLawyerFollowLog()
    this._getLawManagerList()
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
           const selectOpt = { label: lItem.name, value: lItem.user.user_id }
           _tempSelectList.push(selectOpt)
         }
         this.lawManagerSelectList = _tempSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取律师跟进记录
     */
    async _getLawyerFollowLog() {
      
      try {
        // 注册 log
        const registerParam = { type: 1, user_id: this.$route.params.userId, page: 1 }
        const { data: registerLog } = await lawyerApi.getLawyerFollowLogApi(registerParam)
        this.lawyerRegisterLogList = registerLog.data

        // 认证 log
        const authParam = { type: 2, user_id: this.$route.params.userId, page: 1 }
        const { data: authLog } = await lawyerApi.getLawyerFollowLogApi(authParam)
        this.lawyerAuthLogList = authLog.data

        // vip体验期 log
        const vipExpParam = { type: 3, optimization_plan_type: 3, user_id: this.$route.params.userId, page: 1 }
        const { data: vipExpLog } = await lawyerApi.getLawyerFollowLogApi(vipExpParam)
        this.lawyerExpVipLogList = vipExpLog.data

        // vip月卡 log
        const vipMonthParam = { type: 3, optimization_plan_type: 1, user_id: this.$route.params.userId, page: 1 }
        const { data: vipMonthLog } = await lawyerApi.getLawyerFollowLogApi(vipMonthParam)
        this.lawyerMonthVipLogList = vipMonthLog.data

        // vip年卡 log
        const vipYearParam = { type: 3, optimization_plan_type: 2, user_id: this.$route.params.userId, page: 1 }
        const { data: vipYearLog } = await lawyerApi.getLawyerFollowLogApi(vipYearParam)
        this.lawyerYearVipLogList = vipYearLog.data

        // vip升级 log
        const vipUpParam = { type: 4, user_id: this.$route.params.userId, page: 1 }
        const { data: vipUpLog } = await lawyerApi.getLawyerFollowLogApi(vipUpParam)
        this.lawyerUpVipLogList = vipUpLog.data
       } catch (error) {
         console.log(error)
       }
    },

    openUser(userId, type) {
      this.state.userDialog = true
      this.currentUserId = userId
      this.typeUser = type
    },
    goList() {
      this.$router.back(-1)
      // this.$router.push({ name: 'Lawyer' })
    },
    showImages() {
      // this.$refs.imageViewer.show()
      this.state.imagesModal = true
    },
    openMosaic(value, key) {
      this.state.mosaicDialog = true
      this.mosaicImage = value
      this.mosaicImageKey = key
    },
    saveImage() {
      this.state.imageViewer = false
      this.state.imageViewer = true
      this.$refs.ImageMosaic.saveImage()
      this.state.mosaicDialog = false
    },
    cancelImage() {
      this.mosaicImage = ''
      this.mosaicImageKey = -1
      this.state.mosaicDialog = false
    },
    uploadNewLawyer() {
      putLawyerImages(
        this.$route.params.userId,
        this.lawyerInfo.id_card_front_image,
        this.lawyerInfo.id_card_back_image,
        this.lawyerInfo.certificate_image,
        this.lawyerInfo.certificate_record_image
      )
        .then(() => {
          this.$message.success('已修改成功')
        })
        .finally(() => {
          this.state.imagesModal = false
        })
    },
    cancelUpload() {
      this.mosaicImage = ''
      this.mosaicImageKey = -1
      this.state.imagesModal = false
      this.getLawyerDetail()
    },
    save(data) {
      switch (this.mosaicImageKey) {
        case 0:
          this.lawyerInfo.id_card_front_image = data
          break
        case 1:
          this.lawyerInfo.id_card_back_image = data
          break
        case 2:
          this.lawyerInfo.certificate_image = data
          break
        case 3:
          this.lawyerInfo.certificate_record_image = data
          break
        default:
          break
      }
      this.$message.success('修改成功')
    },
    getLawyerDetail() {
      this.state.detailLoading = true
      getLawyerDetail(this.$route.params.userId)
        .then(({ data }) => {
          this.lawyerInfo = data
          if (data.is_show_enable_call === 1) {
            this.checked = true
          } else {
            this.checked = false
          }
        })
        .finally(() => {
          this.state.detailLoading = false
          this.state.skeletonLoading = false
        })
    },
    /**
     * 获取律师订单列表
     */
    getLawyerOrderPage(page = 1) {
      this.state.loading = true
      const param = {
        // user_id: this.$route.params.userId,
        lawyer_user_id: this.$route.params.userId,
        page,
        evaluate_score: this.evaluateScore
      }

      // 订单类型
      if (this.lawyerOrderFactor) param.type = this.lawyerOrderFactor

      getLawyerOrderPageApi(param)
        .then(({ data }) => {
          this.lawyerOrders = data.data
          this.pagination.current = page
          this.pagination.total = data.total
        })
        .finally(() => {
          this.state.loading = false
          this.state.skeletonLoading = false
        })
    },
    /**
     * 获取律师案源报价列表
     */
    async _getLawyerCauseSourceOfferList(page = 1) {
      const param = {
        page,
        size: this.offerPagination.pageSize,
        user_id: this.$route.params.userId,
       }

       try {
         const { data: offerListData } = await lawyerApi.getLawyerCauseSourceOfferApi(param)
         this.offerTableDataList = offerListData.data
         this.offerPagination.total = offerListData.total
         this.offerPagination.current = page
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 获取转账记录列表
     */
     async _getTransferAccountRecordList(page = 1) {
       const param = { lawyer_user_id: this.lawyerId, page, size: this.tableRecordPagination.pageSize }
       this.tableRecordLoading = true

       try {
         const { data: labelListData } = await assetsApi.getTransferAccountRecordList(param)
         this.tableRecordList = labelListData.data
         this.tableRecordPagination.total = labelListData.total
         this.tableRecordPagination.current = page
         this.tableRecordLoading = false
       } catch (error) {
         this.tableRecordLoading = false
         console.log(error)
       }
    },

    /**
     * 获取本地案源列表
     */
     async _getNativeCauseSourceList(page = 1) {
       const param = { user_id: this.lawyerId, page, size: this.tableNativeCauseSourcePagination.pageSize }
       this.tableNativeCauseSourceLoading = true

       try {
         const { data: causeSourceNativeData } = await causeSourceApi.getLawyerCaseSourceNativeListApi(param)
         this.tableNativeCauseSourceList = causeSourceNativeData.data
         this.tableNativeCauseSourcePagination.total = causeSourceNativeData.total
         this.tableNativeCauseSourcePagination.current = page
         this.tableNativeCauseSourceLoading = false
       } catch (error) {
         this.tableNativeCauseSourceLoading = false
         console.log(error)
       }
    },

    handleChange(value) {
      this.currentPlayRecord = value
    },
    openRecord() {
      this.state.recordVisible = true
    },
    openShowList() {
      this.$refs.imagesViewer.show()
    },
    refundChoose() {
      postLawyerGuarantee(this.$route.params.userId).then(() => {
        this.$message.success('退款成功')
        this.getLawyerDetail()
        this.state.refundDialog = false
      })
    },
    changeEntrance() {
      let type = 0
      if (this.checked) {
        type = 1
      } else {
        type = 0
      }
      this.state.checkedLoading = true
      putLawyerShowEnableCall(this.$route.params.userId, type)
        .then(() => {})
        .catch(() => {
          this.checked = !this.checked // 请求失败时触发这个
        })
        .finally(() => {
          this.state.checkedLoading = false
        })
    },
    tableSelectChange(value) {
      this.evaluateScore = Number(value)
      this.getLawyerOrderPage(1)
    },
    openWindow(record, type) {
      this.state.listWindowLoadiing = true
      if (type === 1) {
        this.listWindow.title = '回复'
      } else {
        this.listWindow.title = '删除并回复'
      }
      this.chooseOrderNo = record.order_no
    },
    giveUser(type) {
      putOrderEvaluateComplaintReply(
        this.orderEvaluateComplaintId,
        this.listWindow.type,
        type,
        this.listWindow.reply
      ).then(() => {
        this.state.listWindowLoadiing = false
        this.$message.success('回复成功')
        this.getLawyerOrderPage(this.pagination.current)
      })
    },
    putOrderEvaluateComplaintRevokeReply(record) {
      putOrderEvaluateComplaintRevokeReply(record.order_evaluate_complaint_id).then(() => {
        this.$message.success('撤销成功')
        this.getLawyerOrderPage(this.pagination.current)
      })
    },
    putOrderEvaluateComplaintRevokeDelete(record) {
      putOrderEvaluateComplaintRevokeDelete(record.order_evaluate_complaint_id).then(() => {
        this.$message.success('撤销成功')
        this.getLawyerOrderPage(this.pagination.current)
      })
    },
    changeService(type) {
      console.log(type)
    },

    /**
     * 监听余额增/扣款 modal ok 事件
     */
    async onBalanceModalOkEvt() {
      if (!this.balanceModalInfo.balanceMoney.trim()) return this.$message.warning('请输入金额')
      if (!this.balanceModalInfo.balanceReason.trim()) return this.$message.warning('请输入原因')

      const param = {
        type: this.balanceModalInfo.balanceType,
        user_id: this.$route.params.userId,
        money: this.balanceModalInfo.balanceMoney.trim(),
        reason: this.balanceModalInfo.balanceReason.trim(),
      }
      this.balanceModalInfo.isShowBalanceModal = false

      try {
         await lawyerApi.updateUserbalanceApi(param)
         this.getLawyerDetail()
         this.balanceModalInfo.balanceMoney = ''
         this.balanceModalInfo.balanceReason = ''
         this.balanceModalInfo.balanceType = 0

         if (balanceModalInfo.balanceType === 1) {
          this.$notification.success({ message: '扣款成功', duration: 3 })
         } else {
           this.$notification.success({ message: '增款成功', duration: 3 })
         }
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 确认更新销售
     */
    async confirmSelectLawManager(tabKey, staffLogId, staffSellerId) {
      const { lawyerRegisterLogList, lawyerAuthLogList, lawyerExpVipLogList } = this
      
      try {
        // 更新注册跟进销售
        if (tabKey === 2) {
          const param = { lawyer_staff_log_id: lawyerRegisterLogList[0].lawyer_staff_log_id, staff_user_id: lawyerRegisterLogList[0].staff.staff_user_id }
          await lawyerApi.updateLawyerFollowLogSellerApi(param)
          this._getLawyerFollowLog()
        // 更新认证跟进销售
        } else if (tabKey === 3) {
          const param = { lawyer_staff_log_id: lawyerAuthLogList[0].lawyer_staff_log_id, staff_user_id: lawyerAuthLogList[0].staff.staff_user_id }
          await lawyerApi.updateLawyerFollowLogSellerApi(param)
          this._getLawyerFollowLog()
        // 更新体验期跟进销售
        } else if (tabKey === 4) {
          // console.log( lawyerExpVipLogList[0].staff.staff_user_id)
          const param = { lawyer_staff_log_id: lawyerExpVipLogList[0].lawyer_staff_log_id, staff_user_id: lawyerExpVipLogList[0].staff.staff_user_id }
          await lawyerApi.updateLawyerFollowLogSellerApi(param)
          this._getLawyerFollowLog()
          // 更新月卡跟进销售
        } else if (tabKey === 5) {
          const param = { lawyer_staff_log_id: staffLogId, staff_user_id: staffSellerId }
          await lawyerApi.updateLawyerFollowLogSellerApi(param)
          this._getLawyerFollowLog()
        // 更新年卡跟进销售
        } else if (tabKey === 6) {
          const param = { lawyer_staff_log_id: staffLogId, staff_user_id: staffSellerId }
          await lawyerApi.updateLawyerFollowLogSellerApi(param)
          this._getLawyerFollowLog()
        // 更新升级记录跟进销售
        } else if (tabKey === 7) {
          const param = { lawyer_staff_log_id: staffLogId, staff_user_id: staffSellerId }
          await lawyerApi.updateLawyerFollowLogSellerApi(param)
          this._getLawyerFollowLog()
        }
        this.$notification.success({ message: '选择销售成功', duration: 3 })
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
     * 监听 升级vip 套餐 select 选择事件
     */
    async onUpVipFormSelectChangeEvt(bestVipId) {
      const param = { optimization_plan_id: bestVipId }

      try {
        const { data: bestVipData } = await lawyerApi.getBestVipDetailApi(param)
        this.upVipFormModal.total_num = `${ bestVipData.num * bestVipData.day }`
        this.upVipFormModal.price = `${ bestVipData.price }`
        this.upVipFormModal.start_time = moment()
        this.upVipFormModal.end_time = moment().add(bestVipData.day, 'days')
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 打开 vip升级 modal
     */
    openUpVipModal() {
      this._getBestLawyerMealList()
      this.upVipFormModal.isShowUpVipFormModal = true
    },

    /**
     * 监听 覆盖优选表单 Modal 完全关闭后的回调
     */
    onUpVipFormModalAfterClose() {
      this.upVipFormModal = Object.assign({}, UPVIP_FORM_MODAL)
    },

    /**
     * 监听 升级优选套餐表单 modal ok 事件
     */
    async onUpVipFormModalOkEvt() {
      const { upVipFormModal, lawyerId } = this
      if (!lawyerId) return this.$message.warning('无律师id')
      if (!upVipFormModal.optimization_plan_id) return this.$message.warning('请选择升级优选套餐')
      if (!upVipFormModal.start_time) return this.$message.warning('请选择套餐开始时间')
      if (!upVipFormModal.staff_user_id) return this.$message.warning('请选择销售')
      
      const param = {
        user_id: lawyerId,
        optimization_plan_id: upVipFormModal.optimization_plan_id,
        price: upVipFormModal.price.trim(),
        total_num: upVipFormModal.total_num.trim(),
        add_num: upVipFormModal.add_num.trim(),
        start_time: moment(upVipFormModal.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: moment(upVipFormModal.end_time).format('YYYY-MM-DD HH:mm:ss'),
        staff_user_id: upVipFormModal.staff_user_id
      }
      this.upVipFormModal.isShowUpVipFormModal = false

      try {
        await lawyerApi.postUpBestVipLogApi(param)
        this._getLawyerFollowLog()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 确定取消保证经
     */
    async confirmCancelGuaranteeMoney() {
      const param = { user_id: this.lawyerId, }

      try {
        await lawyerApi.closeLawyerGuaranteeMoneyApi(param)
        this.getLawyerDetail()
        this.$notification.success({ message: '取消成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },
    /**
     * 打开电话记录 modal
     */
    async openPhoneCallRecordModal(record) {
      const param = { local_lawyer_case_source_id: record.local_lawyer_case_source_id, size: 100 }

      try {
        const { data: callRecordData } = await causeSourceApi.getLawyerCaseSourceNativeCallRecordApi(param)
        this.callRecordModal.callRecrdList = callRecordData.data
        this.callRecordModal.isShowCallRecrodModal = true
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 取消 定时开通优选会员
     */
    async delCauseSourceItem(record) {
      const param = { local_lawyer_case_source_id: record.local_lawyer_case_source_id }

      try {
        await lawyerApi.delLawyerCauseSourceItem(param)
        this._getNativeCauseSourceList(this.tableNativeCauseSourcePagination.current)
        this.$notification.success({ message: '删除成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.top {
  width: 100%;
  // height: 600px;
  display: flex;

  .top-left {
    width: 66%;
    margin-right: 19px;
    height: auto;

    .top-left-container {
      // display: grid;
      // grid-template-columns: repeat(3, 33.3%);
      // grid-template-rows: repeat(9, 50px);

      .top-title {
        display: flex;
        justify-content: space-between;
        grid-column-start: 1;
        grid-column-end: 4;

        div:first-child {
          cursor: pointer;

          span {
            font-size: 18px;
            font-weight: 800;
            line-height: 30px;
            color: #222222;
          }
        }
      }
      .cell-wrap {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        //  grid-column-gap: 20px;
        margin-top: 30px;
      }

      .top-info {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ebeef5;
        height: auto;
        // padding-bottom: 10px;
        height: 50px;
        .span-style();
      }

      .top-good-at {
        grid-column-start: 1;
        grid-column-end: 4;
        .span-style();
      }

      .top-introduction {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 10;
        grid-row-end: 14;
        background: #eff1f5;
        min-height: 120px;
        border-radius: 4px;
        overflow: hidden;
        padding: 10px;
        margin-bottom: 10px;
      }
      .top-showImages {
        grid-column-start: 1;
        grid-column-end: 4;
      }
      .top-number {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 2;
        grid-row-end: 5;
        display: flex;
        flex-direction: row;
        .top-numbers {
          text-align: center;
          display: flex;
          flex-direction: column;
          width: 25%;
          height: 100px;
        }
      }
    }
  }

  .top-right {
    width: 33%;
    padding: 5px 10px;
    span {
      font-size: 22px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #222222;
      opacity: 1;
    }
    &-service {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      margin: 12px 0;
      span {
        font-size: 20px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;
        opacity: 1;
      }
      span:last-child {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #787e8d;
        opacity: 1;
      }
      &-spot {
        background: #787e8d;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        opacity: 1;
        display: inline-block;
      }
    }

    &-evaluate {
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      padding: 24px 0;
      border-top: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      margin: 24px 0;

      span {
        margin: 0 10px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #787e8d;
        opacity: 1;
        span {
          color: #222222;
        }
      }
    }
  }

  .span-style {
    span {
      &:first-child {
        font-size: 15px;
        font-weight: 600;
        line-height: 25px;
        color: #222222;
        opacity: 1;
      }

      &:last-child {
        font-size: 15px;
        font-weight: 600;
        line-height: 25px;
        color: #787e8d;
        opacity: 1;
      }
    }
  }
}
.content {
  margin-top: 16px;
}
.btnColor {
  color: #fff;
  margin: 10px 0;
}
.showLawyerIDcard {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  &-li {
    position: relative;
    margin: 10px;
    background-color: #d8d8d8;
    img {
      height: 150px;
      width: 150px;
      object-fit: contain;
    }
    .actionIcon {
      width: 150px;
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
      img {
        width: 20px;
        height: 20px;
        z-index: 4;
        cursor: pointer;
        object-fit: contain;
      }
    }
  }
}

.deduct-modal {
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

.tab-item-row {
  // display: grid;
  // grid-template-columns: repeat(3, 1fr);
  // grid-gap: 20px;
  margin-bottom: 20px;
  .tab-item {
    display: flex;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
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

.callRecord-modal {
  .callRecord-item {
    margin-bottom: 20px;
    &:last-child { margin-bottom: 0; }
    .callRecord-user {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 15px;
      font-weight: 500;
      .call-status {
        margin-left: auto;
      }
    }
    .callRecord-time {
      font-size: 14px;
      color: #999;
    }
    .audio {
      width: 100%;
      height: 40px;
      margin-top: 10px;
    }
  }
}
</style>
