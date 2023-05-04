<template>
  <div>
    <a-modal
      v-model="isShowTranslateModal"
      title="语音翻译"
      :width="500"
      :footer="null"
      destroyOnClose
      @ok="isShowTranslateModal = false"
    >
      <div class="translate-modal">
        {{ translateContent }}
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as commonApi from '@/api/common'

export default {
  name: 'VoiceTranslateModal',
  data() {
    return {
      isShowTranslateModal: false,
      translateContent: '', // 翻译信息
    }
  },
  methods: {
    /**
     * 翻译语音文件信息
     */
    async translateVoiceFile(voiceFileUrl) {
       try {
         const { data: fileTaskData } = await commonApi.postOSSVoiceFileApi({ file: voiceFileUrl })
         const { data: translateData } = await commonApi.getOSSVoiceFileTranslateApi({ task_id: fileTaskData.task_id })
         this.translateContent = translateData.content
         this.isShowTranslateModal = true
       } catch (error) {
         console.log(error)
       }
    },
  }
}

</script>

<style lang="less" scoped>
.translate-modal {
  height: 300px;
  overflow: auto;
}
</style>
