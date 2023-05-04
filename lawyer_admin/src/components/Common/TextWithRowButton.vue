<template>
  <div class="text-with-row">
    {{ textHandle(text) }}

    <a v-if="isOverMax" @click="openTextDialog">{{ btnText }}</a>

    <q-dialog v-model="state.isOpenDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
          <div v-show="created_at !== ''">{{ created_at }}</div>
        </q-card-section>
        <q-card-section>
          {{ text }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'TextWithRowButton',
  props: {
    title: {
      type: String,
      default: '查看详情',
    },
    text: {
      type: String,
      default: '',
    },
    overMax: {
      type: Number,
      default: 0,
    },
    btnText: {
      type: String,
      default: '查看详情',
    },
    created_at: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      state: {
        isOpenDialog: false,
      },
    }
  },
  computed: {
    isOverMax() {
      return this.text.length > this.overMax
    },
  },
  methods: {
    openTextDialog() {
      this.state.isOpenDialog = true
    },
    textHandle(text) {
      if (this.isOverMax) {
        return text.substr(0, this.overMax) + '...'
      }

      return text
    },
  },
}
</script>

<style lang="less" scoped>
.text-with-row {
  width: 100%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
</style>