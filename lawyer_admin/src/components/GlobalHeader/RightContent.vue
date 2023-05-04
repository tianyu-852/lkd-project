<template>
  <div :class="wrpCls">
    <!-- <a style="margin-right: 100px">有<span style="color: red"> xxx</span>等待审核</a> -->
    <avatar-dropdown :menu="showMenu" :current-user="{ avatar: user.avatar, name: user.name }" :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { mapState } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action',
    },
    isMobile: {
      type: Boolean,
      default: () => false,
    },
    topMenu: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showMenu: true,
    }
  },
  computed: {
    ...mapState(['user']),
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true,
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.currentUser = {
        name: 'Serati Ma',
      }
    }, 1500)
  },
}
</script>
