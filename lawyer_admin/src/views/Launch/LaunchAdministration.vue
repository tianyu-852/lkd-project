<template>
  <div>
    <a-card>
      <div class="bannerAd">
        <div class="bannerAd-title">
          <img :src="require('@/assets/common/ring-blue-28.png')" />
          <span> BANNER广告</span>
        </div>
        <div class="bannerAd-div">
          <div v-for="(i, key) in PositionsData[0].positions" :key="key" class="bannerAd-div-switch">
            <span> {{ i.title }}</span>
            <a-switch v-model="i.is_enable" @change="changePositions(i)" />
          </div>
        </div>
      </div>
      <a-divider />
      <div class="suspensionAd">
        <div class="suspensionAd-title">
          <img :src="require('@/assets/common/ring-red.png')" />
          <span> 悬浮窗广告</span>
        </div>
        <div class="bannerAd-div">
          <div v-for="(i, key) in PositionsData[1].positions" :key="key" class="bannerAd-div-switch">
            <span> {{ i.title }}</span>
            <a-switch v-model="i.is_enable" @change="changePositions(i)" />
          </div>
        </div>
      </div>
      <a-divider />
      <div class="lawyerAd">
        <div class="lawyerAd-title">
          <img :src="require('@/assets/common/ring-yellow.png')" />
          <span> 律师广告</span>
        </div>
        <div class="bannerAd-div">
          <div v-for="(i, key) in PositionsData[2].positions" :key="key" class="bannerAd-div-switch">
            <span> {{ i.title }}</span>
            <a-switch v-model="i.is_enable" @change="changePositions(i)" />
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>
  <script>
import { getAdvertisementPositions, getAdvertisementPositionsEnable } from '@/api/launch'
export default {
  name: 'AdministrationIndex',
  components: {},
  props: {},
  data() {
    return {
      PositionsData: [
        {
          title: '',
          color: '',
          positions: [],
        },
        {
          title: '',
          color: '',
          positions: [],
        },
        {
          title: '',
          color: '',
          positions: [],
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {
    getAdvertisementPositions().then((data) => {
      this.PositionsData = data.data
      for (let i = 0; i < this.PositionsData.length; i++) {
        for (let j = 0; j < this.PositionsData[i].positions.length; j++) {
          if (this.PositionsData[i].positions[j].is_enable === 1) {
            this.PositionsData[i].positions[j].is_enable = true
          } else {
            this.PositionsData[i].positions[j].is_enable = false
          }
        }
      }
    })
  },
  mounted() {},
  methods: {
    changePositions(i) {
      let isEnable = null
      if (i.is_enable) {
        isEnable = 1
      } else {
        isEnable = 0
      }
      getAdvertisementPositionsEnable(i.advertisement_position_id, isEnable)
        .then(() => {
          this.$message.success('设置成功')
        })
        .catch(() => {
          if (i.is_enable === 1) {
            i.is_enable = 0
          } else {
            i.is_enable = 1
          }
        })
    },
  },
}
</script>
 <style scoped lang="less">
.bannerAd,
.suspensionAd,
.lawyerAd {
  padding: 0 32px;
  &-title {
    img {
      width: 14px;
      height: 14px;
    }
  }
  &-div {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    &-switch {
      display: flex;
      align-items: center;
      flex-direction: row;
      width: 160px;
      height: 100px;
      span {
        margin-right: 20px;
      }
    }
  }
}
</style>
