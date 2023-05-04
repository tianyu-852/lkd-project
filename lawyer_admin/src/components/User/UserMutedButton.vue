<template>
  <div style="width: auto; height: auto">
    <a-button
      v-if="value === 0"
      type="danger"
      style="margin: 5px"
      size="small"
      @click="state.visible = true"
      :loading="state.isLoading"
      :style="'background-color:' + backColor + ';border-color:' + backColor"
    >
      禁言
    </a-button>

    <a-button
      v-if="value !== 0"
      type="primary"
      style="margin: 5px"
      size="small"
      @click="unmute"
      :loading="state.isLoading"
    >
      解除禁言
    </a-button>

    <q-dialog v-model="state.visible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">禁言时间(分钟)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="bannedTime" autofocus />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">禁言详情</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="bannedDescription" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup />
          <q-btn flat label="禁言" @click="mute" :loading="state.isLoading">
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
    backColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      bannedTime: '',
      bannedDescription: '',
      state: {
        isLoading: false,
        visible: false,
      },
    }
  },
  methods: {
    mute() {
      this.state.isLoading = true
      getUserBanned(this.userId, this.bannedTime, this.bannedDescription)
        .then(() => {
          this.$emit('input', 1)
          this.state.visible = false
        })
        .finally(() => {
          this.state.isLoading = false
        })
    },
    unmute() {
      this.state.isLoading = true
      userUnbanned(this.userId)
        .then(() => {
          this.$emit('input', 0)
          this.state.visible = false
        })
        .finally(() => {
          this.state.isLoading = false
        })
    },
  },
}
</script>

<style scoped>
</style>