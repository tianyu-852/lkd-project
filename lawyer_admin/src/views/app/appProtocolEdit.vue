<template>
  <a-layout class="main">
    <a-layout-header class="top">
      <!-- <span class="focus-text">编辑协议：{{ protocolDetail.title }}</span> -->
      <div class="back-wrap" @click="$router.back()">
        <a-icon type="arrow-left" />
        <span>返回</span>
      </div>
      <span style="font-size: 14px; font-weight: 800;">协议标题：</span>
      <a-input allow-clear placeholder="协议标题" v-model="protocolTitle" style="width: 180px" />

      <span style="font-size: 14px; font-weight: 800; margin-left: 20px;">协议标识：</span>
      <a-input allow-clear placeholder="协议标识" v-model="protocolFlag" style="width: 180px" />

      <a-popconfirm :title="protocolId ? '请确认是否更新协议？' : '请确认是否新增协议？'" ok-text="确认" cancel-text="取消" @confirm="onProtocolConfirmEvt" >
        <a-button type="primary" style="margin-left: auto">确定</a-button>
      </a-popconfirm>
    </a-layout-header>

    <a-card class="content">
      <div style="border: 1px solid #ccc;">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height: 600px; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onWangEditorCreatedEvt"
        />
      </div>
    </a-card>
  </a-layout>
</template>

<script>
import * as appApi from '@/api/app'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  name: 'AppProtocolEdit',
  components: { Editor, Toolbar },
  data() {
    return {
      protocolId: '', // 协议 id
      protocolDetail: {}, // 协议详情
      protocolTitle: '', // 协议标题
      protocolFlag: 'protocal_default', // 协议标识
      
      editor: null,
      html: '',
      toolbarConfig: { },
      editorConfig: { placeholder: '请输入内容...' },
      mode: 'default', // or 'simple'
    }
  },
  created() {
    const { protocolId } = this.$route.query
    // 获取企业套餐信息
    if (protocolId) {
      this.protocolId = protocolId
    }
  },
  mounted() {
    this._getProtocolDetail()
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onWangEditorCreatedEvt(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },

    /**
     * 获取 app 协议详情
     */
     async _getProtocolDetail() {
       if (!this.protocolId) return
       const param = { agreement_id: this.protocolId }

       try {
         const { data: protocolDetailData } = await appApi.getAppProtocolDetailApi(param)
         this.protocolDetail = protocolDetailData
         this.protocolTitle = protocolDetailData.title
         this.protocolFlag = protocolDetailData.name
         this.editor.setHtml(protocolDetailData.content)
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 确定更新
     */
    async onProtocolConfirmEvt() {
      if (!this.protocolTitle.trim()) return this.$message.warning('请输入协议标题')
      if (!this.protocolFlag.trim()) return this.$message.warning('请输入协议标识')
      
      const htmlContent = this.editor.getHtml()
      const htmtResult = this._catchWangEditorData(htmlContent)
      let param = {}

      if (this.protocolId) {
        param = {
          agreement_id: this.protocolId,
          content: htmtResult,
          title: this.protocolTitle.trim(),
          name: this.protocolFlag.trim(),
        }
      } else {
        param = {
          content: htmtResult,
          title: this.protocolTitle.trim(),
          name: this.protocolFlag.trim(),
        }
      }
      
      try {
         const { data } = await appApi.postAppProtocolApi(param)
         this.$router.back()
       } catch (error) {
         console.log(error)
       }
    },

    /**
     * 加工处理生成的 富文本 内容
     */
    _catchWangEditorData(htmlContent) {
      let htmlDoc = htmlContent

      // 判断是否存在 border="0"
      const isBorderFlag = htmlDoc.match(`border="0"`)

      // 判断是否有匹配到相应的 table
      const isMatchWidthAuto = htmlDoc.match(`<table style="width: auto;">`)
      const isMatchWidth100 = htmlDoc.match(`<table style="width: 100%;">`)

      if (isBorderFlag) {
        htmlDoc = htmlDoc.replace(/border="0"/g, `border="1"`)
      }

      if (isMatchWidthAuto) {
        htmlDoc = htmlDoc.replace(/<table style="width: auto;">/g, `<table border="1" width="100%" cellpadding="0" cellspacing="0">`)
      } else if (isMatchWidth100) {
        htmlDoc = htmlDoc.replace(/<table style="width: 100%;">/g, `<table border="1" width="100%" cellpadding="0" cellspacing="0">`)
      }

      return htmlDoc
    }
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

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
    .back-wrap {
      font-size: 20px;
      color: #222222;
      font-weight: 800;
      cursor: pointer;
      margin-right: 20px;
    }
  }
}

.content {
  margin-top: 16px;
}

.label-modal {
  .input-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .input-title {
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex: 1;
    }
  }
}
</style>
