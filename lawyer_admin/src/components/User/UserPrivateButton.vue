<template>
  <div>
    <a-button
      type="primary"
      style="margin-right: 16px"
      size="small"
      @click="state.visible = true"
      :loading="state.isLoading"
    >
      官方客服私聊
    </a-button>
    <q-dialog v-model="state.visible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">发送内容</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="PrivateContent" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn flat label="发送" @click="mute" :loading="state.isLoading">
            <template #loading>
              <q-spinner-hourglass class="on-left" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { getUserBanned, userUnbanned } from '@/api/user'
export default {
  name: 'UserMutedButton',
  props: {
    userId: {
      type: String,
      default: '',
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      PrivateContent: '',
      state: {
        isLoading: false,
        visible: false,
      },
    }
  },
  methods: {
    mute() {
      this.state.isLoading = true
      console.log(this.PrivateContent)
      this.state.isLoading = false
      // getUserBanned(this.userId, this.bannedTime, this.PrivateContent)
      //   .then(() => {
      //     this.$emit('input', 1)
      //     this.state.visible = false
      //   })
      //   .finally(() => {
      //     this.state.isLoading = false
      //   })
    },
  },
}
</script>

<style scoped>
</style>