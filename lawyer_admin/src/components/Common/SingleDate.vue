<template>
  <div class="single-date">
    <q-btn icon="event" round color="primary" size="md">
      <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
        <q-date v-model="proxyDate" mask="YYYY-MM-DD">
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn label="取消" color="primary" flat v-close-popup/>
            <q-btn label="确定" color="primary" flat @click="save" v-close-popup/>
          </div>
        </q-date>
      </q-popup-proxy>
    </q-btn>

    <span class="single-date-font">{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: "SingleDate",
  props: {
    value: {
      type: String,
      default: '',
    }
  },
  created() {
    this.proxyDate = this.value
  },
  data() {
    return {
      proxyDate: '',
    }
  },
  methods: {
    updateProxy() {
      this.proxyDate = this.value
    },
    save() {
      this.$emit('input', this.proxyDate)
    }
  },
}
</script>

<style scoped lang="less">
  .single-date {
    display: flex;
    align-items: center;

    &-font {
      font-size: 17px;
      margin-left: 12px;
    }
  }
</style>