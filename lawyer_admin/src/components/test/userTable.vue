<template>
  <div>
    <a-card>
      <a-input-search
        style="width: 600px"
        v-model="search"
        placeholder="请输入文件名"
        enter-button="搜索"
        size="large"
        @search="onSearch"
      />

      <a-button @click="state.uploadFile = true"> 上传文件</a-button>
      <br />
      <a>时间排序</a> <a>名称排序</a>
    </a-card>
    <a-card>
      <a-col :span="12">
        <a-table :data-source="data" bordered>
          <a-table-column key="status" title="文件信息" align="center">
            <template slot-scope="record">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: center">
                <img
                  v-show="record.type === 'txt'"
                  :src="require('@/assets/test/wj_txt_icon@2x.png')"
                  style="height: 50px; width: 50px; margin: 0 12px; object-fit: contain"
                />
                <img
                  v-show="record.type === 'word'"
                  :src="require('@/assets/test/wj_word_icon@2x.png')"
                  style="height: 50px; width: 50px; margin: 0 12px; object-fit: contain"
                />
                <img
                  v-show="record.type === 'execl'"
                  :src="require('@/assets/test/wj_execl_icon@2x.png')"
                  style="height: 50px; width: 50px; margin: 0 12px; object-fit: contain"
                />
                <img
                  v-show="record.type === 'pdf'"
                  :src="require('@/assets/test/wj_pdf_icon@2x.png')"
                  style="height: 50px; width: 50px; margin: 0 12px; object-fit: contain"
                />
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start">
                  <span>{{ record.firstName }}</span>
                  <span>文件大小，上传日期</span>
                </div>
              </div>
            </template>
          </a-table-column>
          <a-table-column key="action" title="操作" align="center">
            <template slot-scope="text, record">
              <a-button
                style="margin-right: 16px; margin-top: 5px"
                size="small"
                @click="
                  state.changeName = true
                  chooseData = record
                "
              >
                重命名
              </a-button>
              <a-button
                style="margin-right: 16px; margin-top: 5px"
                size="small"
                type="primary"
                @click="download(record)"
              >
                下载
              </a-button>
            </template>
          </a-table-column>
        </a-table>
      </a-col>
    </a-card>
    <a-modal v-model="state.changeName" title="请输入新的名字" @ok="changeName" ok-text="确定" cencel-text="取消">
      <a-input v-model="newName"></a-input>
    </a-modal>
    <a-modal
      v-model="state.uploadFile"
      title="上传新的文件"
      @ok="state.uploadFile = false"
      ok-text="确定"
      cencel-text="取消"
    >
      <dragImageUpload @imageReturn="getImagesUrl" />
    </a-modal>
    <a-modal v-model="state.userData" title="用户信息" @ok="state.userData = false" ok-text="确定" cencel-text="取消">
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center">
        <div style="margin: 10px; width: 240px">
          <img
            :src="require('@/assets/test/wj_pdf_icon@2x.png')"
            style="
              height: 64px;
              width: 64px;
              border: 1px solid #707070;
              border-radius: 50%;

              object-fit: contain;
            "
          />
          <span style="margin: 0 20px">{{}} 用户名称</span>
        </div>
        <a-button type="primary" style="margin: 10px; border-radius: 8px; width: 240px">联系客服</a-button>
        <a-button style="margin: 10px; border-radius: 8px; width: 240px">退出登录</a-button>
      </div>
    </a-modal>
  </div>
</template>
  <script>
import dragImageUpload from '@/components/Common/dragImageUpload.vue'
export default {
  name: 'Index',
  components: { dragImageUpload },
  props: {},
  data() {
    return {
      state: {
        changeName: false,
        uploadFile: false,
        userData: false,
      },
      chooseData: {},
      data: [
        {
          key: '1',
          type: 'txt',
          firstName: 'John',
          lastName: 'Brown',
          age: 32,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          type: 'word',
          firstName: 'Jim',
          lastName: 'Green',
          age: 42,
          address: 'London No. 1 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          type: 'execl',
          firstName: 'Joe',
          lastName: 'Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
      ],
      search: '',
      newName: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearch() {
      console.log(1)
    },
    download() {
      console.log(2)
    },
    changeName() {
      console.log(3, this.newName, this.chooseData)
      this.chooseData.firstName = this.newName
      this.state.changeName = false
    },
    getImagesUrl(data) {
      console.log(data)
    },
  },
}
</script>
 <style scoped>
</style>
