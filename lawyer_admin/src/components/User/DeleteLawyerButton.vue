<template>
  <div>
    <a-button
      type="danger"
      size="small"
      style="margin-right: 16px"
      :loading="state.loading"
      @click="state.isConfirm = true"
    >
      删除
    </a-button>

    <q-dialog v-model="state.isConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red" text-color="white" />
          <span class="q-ml-sm">是否确认要删除该律师？</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn flat label="确认" color="primary" @click="deleteLawyer(userId)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <!--  <a-popconfirm-->
  <!--    placement="leftBottom"-->
  <!--    ok-text="确认"-->
  <!--    cancel-text="不行"-->
  <!--    @confirm="deleteLawyer(userId)"-->
  <!--  >-->
  <!--    <template slot="title"> 是否确认要删除该律师？</template>-->
  <!--    <a-button-->
  <!--      type="danger"-->
  <!--      size="small"-->
  <!--      :loading="state.loading"-->
  <!--    >-->
  <!--      删除-->
  <!--    </a-button>-->
  <!--  </a-popconfirm>-->
</template>

<script>
import { deleteLawyer } from '@/api/lawyer'

export default {
  name: 'DeleteLawyerButton',
  props: {
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      state: {
        loading: false,
        isConfirm: false,
      },
    }
  },
  methods: {
    deleteLawyer(userId) {
      this.state.loading = true

      deleteLawyer(userId)
        .then(() => {
          this.$message.success('删除成功')
          this.$emit('success')
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
        .finally(() => {
          this.state.loading = false
        })
    },
  },
}
</script>

<style scoped>
</style>