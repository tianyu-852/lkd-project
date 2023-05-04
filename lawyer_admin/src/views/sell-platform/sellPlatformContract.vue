<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <span class="focus-text">合同模板总数：{{ pagination.total }}</span>

      <!-- <a-button type="primary" style="margin: 0 10px" @click="openAddContractModal">添加合同</a-button> -->
    </a-layout-header>

    <a-card class="content">
      <!-- 工具面板 -->
      <div class="tool-wrap">
        <a-button icon="sync" size="small" style="margin-left: auto;" @click="_getContractTmpList(pagination.current);">刷新</a-button>
      </div>

      <!-- 表格 -->
      <a-table
        :data-source="tabelDataList"
        :loading="tabelDataLoading"
        :pagination="pagination"
        :rowKey="(record) => String(record.sales_contract_template_id)"
        bordered
      >
        <!-- id -->
        <a-table-column dataIndex="sales_contract_template_id" title="ID" align="center" />

        <!-- 创建时间 -->
        <a-table-column key="created_at" dataIndex="created_at" title="创建时间" align="center" />

        <!-- 模板名称 -->
        <a-table-column dataIndex="name" title="模板名称" align="center" />

        <!-- VIP等级 -->
        <a-table-column dataIndex="enterprise_vip_name" title="VIP等级" align="center" />

        <!-- 操作 -->
        <a-table-column key="action" title="操作" align="center">
          <template slot-scope="record">
            <a-button type="link" style="padding: 0; margin-right: 10px;" @click="openPutContractModal(record)">更新</a-button>
            <a-popconfirm title="请确认是否删除该用户?" ok-text="删除" cancel-text="取消" @confirm="delSellPlatformUser(record)">
              <a-button type="link" style="padding: 0; margin-right: 10px;">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
    </a-card>

    <!-- 合同 modal -->
    <a-modal
      v-model="contractModalInfo.isShowContractModal"
      :title="contractModalInfo.contractModalType ? '更新合同' : '新增合同'"
      :width="800"
      :afterClose="onContractModalAfterClose"
      destroyOnClose
      @ok="onContractModalOkEvt"
    >
      <div class="contract-modal">
        <!-- <div class="input-item">
          <div class="input-title">合同附件：</div>
          <a-button type="primary" style="height: 26px;" @click="chooseFile">上传</a-button>
          <div class="file-title">{{ contractModalInfo.contractFile && contractModalInfo.contractFile.name }}</div>
        </div> -->
        <!-- 合同名称 -->
        <div class="input-item">
          <div class="input-title">合同名称：</div>
          <a-input
            v-model="contractModalInfo.contractName"
            class="input"
            style="width: 300px"
            :maxLength="50"
            :disabled="contractModalInfo.contractModalType ? true : false"
            placeholder="请输入名称"
            allowClear
          />
        </div>
        <!-- VIP等级 -->
        <!-- <div class="input-item">
          <div class="input-title">VIP等级：</div>
          <a-select style="width: 120px;" v-model="contractModalInfo.vip">
            <a-select-option v-for="vItem in vipLevelSelectList" :value="vItem.value" :key="vItem.value">
              {{ vItem.label }}
            </a-select-option>
          </a-select>
        </div> -->

        <!-- 合同名称 -->
        <div class="input-item">
          <div class="input-title" style="align-self: flex-start;">合同权限：</div>
          <div class="right-box">
            <div class="checkbox-wrap">
              <a-checkbox :checked="contractModalInfo.innerPermissionsChecked" @change="contractModalInfo.innerPermissionsChecked = !contractModalInfo.innerPermissionsChecked">内部公开</a-checkbox>
              <a-checkbox :checked="contractModalInfo.outerPermissionsChecked" @change="contractModalInfo.outerPermissionsChecked = !contractModalInfo.outerPermissionsChecked">指定加盟商</a-checkbox>
            </div>
            <div v-show="contractModalInfo.outerPermissionsChecked" class="permissions-wrap">
              <div v-for="(pItem, pIndex) in contractModalInfo.outerPermissionsList" :key="pIndex" class="permissions-item">
                <div class="checkbox-wrap" @click.stop="changeOuterPermissionsCheckAll(pItem.isCheckedAllSeller, pIndex)">
                  <img v-if="pItem.isCheckedAllSeller" class="checkbox-img" src="@/assets/sellPlatform/icon-checkbox.png" />
                  <img v-else class="checkbox-img" src="@/assets/sellPlatform/icon-no-checkbox.png" />
                  <span>全选</span>
                </div>
                <!-- 加盟商 select -->
                <a-select
                  style="width: 200px;"
                  v-model="contractModalInfo.outerPermissionsList[pIndex].companySelectedId"
                  :defaultValue="pItem.companySelectedId"
                  :disabled="pItem.isDisableCompanySelect"
                  placeholder="请选择加盟商"
                  @change="onCompanySelectChangeEvt"
                >
                  <a-select-option v-for="(cItem, cIndex) in pItem.companySelectList" :value="cItem.value" :key="cIndex">
                    {{ cItem.label }}
                  </a-select-option>
                </a-select>

                <!-- 水平分割线 -->
                <div class="divide-hor"></div>
                
                <!-- 销售 select -->
                <a-select style="flex: 1;" v-model="contractModalInfo.outerPermissionsList[pIndex].sellerSelectedList" mode="multiple" placeholder="请选择销售" @deselect="onSellerSelectChangeEvt(pIndex)">
                  <a-select-option v-for="(sItem, sIndex) in pItem.sellerSelectList" :value="sItem.value" :key="sIndex">
                    {{ sItem.label }}
                  </a-select-option>
                </a-select>
                <!-- 最后一个展示 -->
                <a-icon v-if="contractModalInfo.outerPermissionsList.length - 1 === pIndex" type="plus-circle" class="icon-plus" @click.stop="plusNewLeaguePermissions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 上传文件 input -->
    <!-- <input
      v-if="isShowFileInput"
      id="input"
      ref="fileInputRef"
      type="file"
      style="display: block;"
      accept=".doc,.docx"
      @change="onChangeInputFile"
    > -->
  </a-layout>
</template>

<script>
import * as sellPlatformApi from '@/api/sellPlatformApi'

const CONTRACT_INFO = {
  contractFile: null, // 合同文件
  contractName: '', // 合同名称
  vip: '',
  isShowContractModal: false, // 是否显示合同 modal
  contractModalType: 0, // 合同 Modal 类型 0: 添加 1: 更新
  putContractTmpId: '', // 更新合同模板 id

  innerPermissionsChecked: false, // 内部权限
  outerPermissionsChecked: false, // 外部加盟商权限

  outerPermissionsList: [], // 外部加盟商权限数据列表
}

export default {
  name: 'SellPlatformContract',
  data() {
    return {
      tabelDataList: [], // 数据列表
      tabelDataLoading: true, // 数据是否加载中
      // 分页器
      pagination: {
        total: 0,
        current: 1,
        pageSize: 15,
        showQuickJumper: true,
        onChange: page => {
          this._getContractTmpList(page)
          this.pagination.current = page
        },
      },
      
      contractModalInfo: Object.assign({}, CONTRACT_INFO), // 合同 modal 信息
      isShowFileInput: true, // 是否显示文件 input
      vipLevelSelectList: [{ label: '基础版', value: 1 }, { label: '优享版', value: 2 }, { label: '尊享版', value: 3 } ], // VIP等级 select 列表
    }
  },
  created() {
    this._getContractTmpList()
  },
  methods: {
    /**
     * 获取合同模板列表
     */
     async _getContractTmpList(page = 1) {
       const param = { page, size: this.pagination.pageSize }

       try {
         const { data: labelListData } = await sellPlatformApi.getSellPlatformContractTmpListApi(param)
         this.tabelDataList = labelListData.data
         this.pagination.total = labelListData.total
         this.pagination.current = page
         this.tabelDataLoading = false
       } catch (error) {
         this.tabelDataLoading = false
         console.log(error)
       }
    },

    /**
     * 获取合同模板权限
     */
     async _getContractTmpPermissionsApi(contractTmpId) {
       const param = { sales_contract_template_id: contractTmpId }

       try {
         const { data: permissionsData } = await sellPlatformApi.getSellPlatformContractTmpPermissionsApi(param)
         const permissionsInfo = permissionsData.data
         // 内部公开
         if (permissionsInfo.is_internal === 1) this.contractModalInfo.innerPermissionsChecked = true
         // 外部公开
         if (permissionsInfo.alliance_data.length) this.contractModalInfo.outerPermissionsChecked = true

         const outerPermissionsList = []
         for (const pItem of permissionsInfo.alliance_data) {
            // 权限对象
            const objTemp = {
              companySelectList: [], // 加盟商 select 列表
              sellerSelectList: [], // 销售 select 列表
              isDisableCompanySelect: true, // 是否禁止加盟商 select
              isCheckedAllSeller: false, // 是否全选所有销售
              companySelectedId: '', // 选中的加盟商 id
              sellerSelectedList: [] // 选中的销售 id 列表
            }
            // 选中的加盟商公司
            objTemp.companySelectedId = pItem.alliance_business_id
            // 是否全选销售
            objTemp.isCheckedAllSeller = pItem.is_all ? true: false

            // 加盟商公司 select 
            objTemp.companySelectList = [{ label: pItem.name, value: pItem.alliance_business_id }]

            // 销售 select
            for (const sItem of pItem.sales_info) {
              const sellerOpt = { label: sItem.name, value: sItem.user_id, }
              objTemp.sellerSelectList.push(sellerOpt)
              // 选中的销售
              if (sItem.is_choose) objTemp.sellerSelectedList.push(sItem.user_id)
            }
            outerPermissionsList.push(objTemp)
          }
          // 外部加盟商权限列表
          this.contractModalInfo.outerPermissionsList = outerPermissionsList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 添加 新的加盟商权限
     */
    plusNewLeaguePermissions() {
      if (!this.contractModalInfo.outerPermissionsList[this.contractModalInfo.outerPermissionsList.length - 1].companySelectedId) return this.$message.warning('请先选择加盟商')
      
      const objTemp = {
        companySelectList: [],
        sellerSelectList: [],
        isDisableCompanySelect: false,
        isCheckedAllSeller: false,
        companySelectedId: '',
        sellerSelectedList: []
      }
      this.contractModalInfo.outerPermissionsList.push(objTemp)

      this._getSellPlatformLeagueListApi()
    },

    /**
     * 获取加盟商-公司列表
     */
     async _getSellPlatformLeagueListApi(page = 1) {
       const param = { page, size: 500 }

       try {
         const { data: leagueData } = await sellPlatformApi.getSellPlatformLeagueListApi(param)
         const companySelectList = []
         for (const dItem of leagueData.data) {
          //  排除掉已选的公司
          if (this.contractModalInfo.outerPermissionsList.findIndex(item => item.companySelectedId === dItem.alliance_business_id) < 0) {
            const selectOpt = { label: dItem.name, value: dItem.alliance_business_id }
            companySelectList.push(selectOpt)
          }
         }
         this.contractModalInfo.outerPermissionsList[this.contractModalInfo.outerPermissionsList.length - 1].companySelectList = companySelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 监听改变加盟商 select 事件
     */
    onCompanySelectChangeEvt(companyIdValue) {
      const permissionsIndex = this.contractModalInfo.outerPermissionsList.findIndex(item => item.companySelectedId === companyIdValue)
      // console.log(permissionsIndex)
      this._getSellPlatformLeagueSellerList(companyIdValue, permissionsIndex)
    },

    /**
     * 获取加盟商-销售列表
     */
     async _getSellPlatformLeagueSellerList(companyIdValue, permissionsIndex) {
       const param = { alliance_business_id: companyIdValue, page: 1, size: 300 }
       try {
         const { data: leagueSellerData } = await sellPlatformApi.getSellPlatformLeagueSellerListApi(param)

         const sellerSelectList = []
         // 销售 select
         for (const sItem of leagueSellerData.data) {
           const sellerOpt = { label: sItem.name, value: sItem.user_id, }
           sellerSelectList.push(sellerOpt)
         }
         // 销售人员赋值
         this.contractModalInfo.outerPermissionsList[permissionsIndex].sellerSelectList = sellerSelectList
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 改变权限全选 checkbox
     */
    changeOuterPermissionsCheckAll(checkedAllSeller, pIndex) {
      if (checkedAllSeller) return
      // 选中的加盟商项
      const outerPermissionsObj = this.contractModalInfo.outerPermissionsList[pIndex]
      if (!outerPermissionsObj.companySelectedId) return this.$message.warning('请先选择加盟商')
      if (!outerPermissionsObj.sellerSelectList.length) return
      // 改变全选状态
      this.contractModalInfo.outerPermissionsList[pIndex].isCheckedAllSeller = true
      // 改变全选销售人员 id
      const sellerAllList = outerPermissionsObj.sellerSelectList.map(item => item.value)
      this.contractModalInfo.outerPermissionsList[pIndex].sellerSelectedList = sellerAllList
    },

    /**
     * 监听销售 select 取消项事件
     */
    onSellerSelectChangeEvt(pIndex) {
      this.contractModalInfo.outerPermissionsList[pIndex].isCheckedAllSeller = false
    },

    /**
     * 打开「添加模式」合同 modal
     */
    openAddContractModal() {
      this.contractModalInfo.contractModalType = 0 // 添加模式
      this.contractModalInfo = Object.assign({}, CONTRACT_INFO)
      this.contractModalInfo.isShowContractModal = true
    },

    /**
     * 打开「更新模式」合同 modal
     */
    openPutContractModal(record) {
      this.contractModalInfo.contractModalType = 1 // 更新模式
      this.contractModalInfo.contractName = record.name
      this.contractModalInfo.putContractTmpId = record.sales_contract_template_id // 待更新合同模板 id
      // 获取权限列表
      this._getContractTmpPermissionsApi(this.contractModalInfo.putContractTmpId)

      this.contractModalInfo.isShowContractModal = true
    },

    /**
     * 合同 Modal 完全关闭后的回调
     */
    onContractModalAfterClose() {
      this.contractModalInfo = Object.assign({}, CONTRACT_INFO)
    },

    /**
     * 监听标签 modal ok 事件
     */
    onContractModalOkEvt() {
      const { contractModalInfo } = this
      const contractModalType = contractModalInfo.contractModalType
      if (!contractModalInfo.innerPermissionsChecked && !contractModalInfo.outerPermissionsChecked) return this.$message.warning('请至少选择一种权限')

      this.contractModalInfo.isShowContractModal = false
      // contractModalType === 1 ? 更新 : 添加
      contractModalType === 1 ? this._putContractTmp(contractModalInfo) : this._addContractTmp(contractModalInfo)
    },

    /**
     * 添加合同模板
     * TODO: 待完成
     */
     async _addContractTmp(contractModalInfo) {
      try {
        const { data } = await sellPlatformApi.postAddLabelApi(labelModalInfo)
        this._getContractTmpList()
        this.$notification.success({ message: '添加成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 更新合同模板
     */
    async _putContractTmp(contractModalInfo) {
      // 权限列表
      const companyPermissionsList = contractModalInfo.outerPermissionsList

      const companyPermissionsObj = {}
      if (contractModalInfo.outerPermissionsChecked) {
        for (const iItem of companyPermissionsList) {
          // 过滤掉未选择的公司 select
          if (iItem.companySelectedId) {
            companyPermissionsObj[iItem.companySelectedId] = {
              is_all: iItem.isCheckedAllSeller ? 1 : 0,
              data: iItem.sellerSelectedList
            }
          }
        }
      }

      // 公司权限列表
      const contractPermissions = {
        is_internal: contractModalInfo.innerPermissionsChecked ? 1 : 2,
        data: contractModalInfo.outerPermissionsChecked ? companyPermissionsObj : []
      }
      // console.log(JSON.stringify(contractPermissions))

      const param = {
        sales_contract_template_id: contractModalInfo.putContractTmpId,
        edit_info: JSON.stringify(contractPermissions)
      }

      try {
        const { data } = await sellPlatformApi.putSellPlatformContractTmpPermissionsApi(param)
        this._getContractTmpList(this.pagination.current)
        this.$notification.success({ message: '更新成功', duration: 3 })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 选择文件
     * https://juejin.cn/post/6844903697667850248
     */
    chooseFile() {
      this.isShowFileInput = true
      this.$nextTick(() => {
        this.$refs.fileInputRef.click() 
        // this.$refs.fileInputRef.dispatchEvent(new MouseEvent('click'))
      })
    },

    /**
     * 选择文件
     */
    onChangeInputFile(event) {
      // console.log(event)
      const file = event.target.files[0]
      console.log(file)
      const fileExtIndex = file.name.lastIndexOf(".") // 文件后缀
      const fileName = file.name.substring(0, fileExtIndex > 0 ? fileExtIndex : 100) // 文件名称
      
      this.contractModalInfo.contractFile = file
      this.contractModalInfo.contractName = fileName
      this.isShowFileInput = false

      // const fileTempPath = window.URL.createObjectURL(file)
      // console.log(fileTempPath)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

.content {
  margin-top: 16px;
  .tool-wrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 13px;
  }
}

.contract-modal {
  max-height: 450px;
  overflow-y: auto;
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
    .file-title {
      color: #999;
      font-size: 12px;
      margin-left: 10px;
    }
    .right-box {
      flex: 1;
      .permissions-wrap {
        margin-top: 10px;
        .permissions-item {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 10px;
          &:last-child { margin-bottom: 0; } 
          .checkbox-wrap {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-right: 6px;
            font-size: 14px;
            cursor: pointer;
            .checkbox-img {
              width: 18px;
              height: 18px;
              margin-right: 6px;
            }
          }
          .divide-hor {
            height: 2px;
            width: 20px;
            margin: 0 10px;
            background: #333;
          }
          .icon-plus {
            font-size: 20px;
            padding-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
