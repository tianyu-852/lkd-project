<template>
  <common-dialog :title="title" @close="close">
    <div class="main">
      <div class="content">
        <div class="content-item">
          <span>渠道编号：</span>
          <q-input
            filled
            class="content-item-input"
            placeholder="英文即可"
            v-model="value.promotion_channel_no"
            v-if="isNormal()"
          />
          <span class="content-item-input" v-else>{{ value.promotion_channel_no }}</span>
        </div>
        <div class="content-item">
          <span>渠道名称：</span>
          <q-input
            filled
            class="content-item-input"
            placeholder="中文，方便区分即可"
            v-model="value.promotion_channel_name"
            v-if="isNormal()"
          />
          <span class="content-item-input" v-else>{{ value.promotion_channel_name }}</span>
        </div>
        <div class="content-item" style="height: 100px">
          <span>URL通道：</span>
          <a-radio-group v-model="UrlType" style="width: 220px">
            <a-radio v-for="(i, key) in UrlTypeList" :key="key" :value="i.value" style="margin: 5px 0">{{
              i.title
            }}</a-radio>
          </a-radio-group>
          <a-button @click="openNewWindow">预览</a-button>
          <!-- <q-input
            filled
            class="content-item-input"
            placeholder="路径名称"
            v-model="value.download_url"
            v-if="isNormal()"
          />
          <span class="content-item-input" v-else>{{ value.download_url }}</span> -->
        </div>

        <div class="hr" v-if="isConsume()"></div>

        <div class="content-item" v-if="isConsume()">
          <span>选择日期</span>
          <q-input filled class="content-item-input" placeholder="点击选择日期" v-model="value.close_at">
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>

            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="value.close_at" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-input>
        </div>

        <div class="content-item" v-if="!isNormal()">
          <span>消费金额</span>
          <q-input filled class="content-item-input" placeholder="请输入当日消费金额" v-model="value.consume" />
        </div>

        <q-btn
          class="content-btn"
          color="primary"
          @click="isNormal() ? setStatistical() : setStatisticalConsume()"
          :loading="state.isLoading"
        >
          提交
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            提交中 ...
          </template>
        </q-btn>
      </div>
    </div>
  </common-dialog>
</template>

<script>
import CommonDialog from '@/components/Dialog/CommonDialog'
import { setStatisticalChannel, setStatisticalChannelConsume, getPromotionChannelUrls } from '@/api/statistical'

export default {
  name: 'SetStatisticalChannel',
  components: { CommonDialog },
  props: {
    title: String,
    value: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String, // normal 正常修改 | consume 消费
      default: 'normal',
    },
  },
  data() {
    return {
      state: {
        isLoading: false,
      },
      UrlType: '',
      UrlTypeList: [],
    }
  },
  created() {
    getPromotionChannelUrls().then((data) => {
      for (let i = 0; i < data.data.length; i++) {
        const element = { title: '', value: '' }
        element.title = data.data[i].name
        element.value = data.data[i].download_url
        this.UrlTypeList.push(element)
      }
      console.log(this.UrlTypeList)
    })
    const downLoadUrl = this.value.download_url.split('?')
    this.UrlType = downLoadUrl[0].replace(':12229', '')
  },
  watch: {
    value(value) {
      const downLoadUrl = value.download_url.split('?')
      this.UrlType = downLoadUrl[0].replace(':12229', '')
      this.value = value
    },
  },
  methods: {
    setStatistical() {
      this.state.isLoading = true
      const downloadString = this.UrlType + '?promotion_channel_tag=' + this.value.promotion_channel_no
      setStatisticalChannel(
        this.value.promotion_channel_no,
        this.value.promotion_channel_name,
        downloadString,
        this.value.promotion_channel_id
      )
        .then(() => {
          this.$emit('add')
          this.$message.success('保存成功')
          this.close()
        })
        .finally(() => {
          this.state.isLoading = false
        })
    },
    setStatisticalConsume() {
      this.state.isLoading = true
      setStatisticalChannelConsume(this.value.promotion_channel_id, this.value.close_at, this.value.consume)
        .then(() => {
          this.$message.success('保存成功')
          this.$emit('add')
          this.close()
        })
        .finally(() => {
          this.state.isLoading = false
        })
    },
    close() {
      this.$emit('close')
    },
    isNormal() {
      return this.mode === 'normal'
    },
    isConsume() {
      return this.mode === 'consume'
    },
    openNewWindow() {
      window.open(this.UrlType + '?promotion_channel_tag=' + this.value.promotion_channel_no)
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  padding: 12px 24px;
  display: flex;
  align-items: center;
}

.content {
  width: 450px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-btn {
    margin: 48px 0;
    width: 370px;
    height: 48px;
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    height: 60px;

    span {
      color: #222222;
      font-size: 14px;
      font-weight: 500;
      margin-right: 8px;
    }

    &-input {
      width: 280px;
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
}
</style>