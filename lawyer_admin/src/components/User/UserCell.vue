<template>
  <div class="user-cell">
    <a-avatar :style="avatarStyle" :size="avatarSize" icon="user" :src="avatar" />
    <div class="user-cell-bottom">
      <div class="user-cell-bottom-nickname" :style="titleStyle">
        <span class="margin-right-8">
          {{ nickname }}
        </span>
        <span v-if="oldNickname !== ''">({{ oldNickname }})</span>
        <div
          v-for="(i, key) in TagArray"
          :key="key"
          class="userLabel"
          style="
            background-color: #ff524c19;
            color: #ff524c;
            font-size: 12px;
            height: 20px;
            width: auto;
            padding: 0 12px;
          "
          :style="'background-color:' + i.backgroundColor + '; color:' + i.color"
        >
          {{ i.value }}
        </div>
        <div
          v-if="is_deleted === 1"
          class="userLabel"
          style="background-color: #ff524c19; color: #ff524c; font-size: 12px; width: 54px; height: 20px"
        >
          已注销
        </div>
        <div
          v-if="isCreator === 1 || mode === 0"
          class="userLabel"
          style="background-color: #d6ffeb; color: #2cbf78; font-size: 12px; width: 54px; height: 20px"
        >
          发起人
        </div>
        <div
          v-else-if="isLitigant === 1 || mode === 1"
          class="userLabel"
          style="background-color: #deefff; color: #3980ea; font-size: 12px; width: 54px; height: 20px"
        >
          当事人
        </div>
        <div
          class="userLabel"
          v-else-if="isAppointed === 1 || mode === 2"
          style="background-color: #ffeacc; color: #ff9700; font-size: 12px; width: 54px; height: 20px"
        >
          委托律师
        </div>
        <div
          class="userLabel"
          v-if="isAppointed === 3"
          style="background-color: #ffeacc; color: #ff9700; font-size: 12px; width: 54px; height: 20px"
        >
          意向律师
        </div>
        <div
          class="userLabel"
          v-if="mode === 4"
          style="background-color: #d6ffeb; color: #2cbf78; font-size: 12px; width: 54px; height: 20px"
        >
          用户
        </div>
        <div
          class="userLabel"
          v-if="mode === 5"
          style="background-color: #deefff; color: #3980ea; font-size: 12px; width: 54px; height: 20px"
        >
          律师
        </div>
        <img style="width: 32px; height: 16px" v-if="mode === 6" :src="require('@/assets/user/zs_icon@2x.png')" />
        <img style="width: 32px; height: 16px" v-if="isBot === 0" :src="require('@/assets/user/real.png')" />
        <img style="width: 32px; height: 16px" v-if="isBot === 7" :src="require('@/assets/user/zs_icon@2x.png')" />
        <img style="width: 13px; height: 15px" v-if="logo !== ''" :src="logo" />
      </div>
      <div class="user-cell-bottom-mobile" :style="contentStyle">
        {{ mobile }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCell',
  props: {
    mode: {
      type: Number,
      default: -1,
    },
    avatar: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      default: '',
    },
    oldNickname: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
    },
    isBot: {
      type: Number,
      default: 1,
    },
    isCreator: {
      type: Number,
      default: 2,
    },
    isLitigant: {
      type: Number,
      default: 2,
    },
    isAppointed: {
      type: Number,
      default: 2,
    },
    logo: {
      type: String,
      default: '',
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    TagArray: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    avatarStyle() {
      return {
        marginRight: this.avatarMarginRight + 'px',
      }
    },
    titleStyle() {
      return {
        fontSize: this.titleFontSize + 'px',
        marginBottom: this.titleMarginBottom + 'px',
      }
    },
    contentStyle() {
      return {
        fontSize: this.contentFontSize + 'px',
      }
    },
  },
  created() {
    switch (this.size) {
      case 'md':
        this.avatarSize = 42
        this.titleFontSize = 15
        this.contentFontSize = 14
        this.titleMarginBottom = 0
        this.avatarMarginRight = 0
        break
      case 'big':
        this.avatarSize = 64
        this.titleFontSize = this.contentFontSize = 18
        this.titleMarginBottom = 8
        this.avatarMarginRight = 16
        break
      case 'sm':
        this.avatarSize = 24
        this.titleFontSize = this.contentFontSize = 8
        this.titleMarginBottom = 0
        this.avatarMarginRight = 0
        break
    }
  },
  data() {
    return {
      avatarSize: 42,
      titleFontSize: 15,
      contentFontSize: 14,
      titleMarginBottom: 0,
      avatarMarginRight: 0,
    }
  },
}
</script>

<style lang="less" scoped>
.user-cell {
  display: flex;
  div {
    margin-left: 3px;
  }
  &-bottom {
    width: auto;
    &-nickname {
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: bold;
      line-height: 21px;
      color: #222222;
      display: flex;
      align-items: center;
    }
    &-mobile {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #787e8d;
    }
  }
}
.userLabel {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
}
.margin-right-8 {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
