<template>
  <div class="user text-btn" @click="$emit('open', userId)">
    <div>
      <img class="user-vip-icon" :src="vipIcon" />
    </div>
    <div class="user-cell-div">
      <user-cell
        :avatar="avatar"
        :mobile="mobile"
        :nickname="nickname"
        :oldNickname="oldNickname"
        :is-bot="isBot"
        :fundraisingType="fundraisingType"
        :size="size"
        :isCreator="isCreator"
        :isLitigant="isLitigant"
        :isAppointed="isAppointed"
        :mode="mode"
        :logo="logo"
        :is_deleted="is_deleted"
        :TagArray="TagArray"
      />
    </div>
  </div>
</template>

<script>
import UserCell from '@/components/User/UserCell'
export default {
  name: 'UserVipCell',
  components: { UserCell },
  props: {
    userId: {
      type: String,
      default: '',
    },
    mode: {
      type: Number,
      default: -1,
    },
    vipIcon: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    mobile: {
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
    isBot: {
      type: Number,
      default: 1,
    },
    fundraisingType: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: 'md',
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
    is_deleted: {
      type: Number,
      default: 0,
    },
    logo: {
      type: String,
      default: '',
    },
    TagArray: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="less" scoped>
.user {
  position: relative;

  &-vip-icon {
    position: absolute;
    top: -16px;
    left: -16px;
  }

  &-cell-div {
    margin-left: 10px;
  }
}
</style>
