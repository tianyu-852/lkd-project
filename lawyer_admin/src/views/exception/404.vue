<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Exception404',
  computed: {
    ...mapState({ 'userInfo': state => state.user.info }),
  },
  methods: {
    toHome() {
      // 判断是加盟商账号 进入加盟商销页面
      if (this.userInfo.alliance) {
        const userLeagueId = this.userInfo.alliance.info.alliance_business_id
        this.$router.replace({ name: 'sellPlatformLeagueSell', params: { leagueId: Number(userLeagueId) } })
      } else {
        this.$router.replace({ path: '/' })
      }
    }
  }
}
</script>
