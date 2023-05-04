<template>
  <textarea
    class="comment-textarea"
    ref="commentTextarea"
    :value="value"
    @input="() => $emit('input', this.$refs.commentTextarea.value)"
  />
</template>

<script>
export default {
  name: "CommonTextarea",
  props: {
    value: {
      default: '',
      type: String,
    }
  }
}
</script>

<style scoped lang="less">
.comment-textarea {
  background: #EFF1F5;
  border-radius: 4px;
  border: none;
  width: 100%;
  height: 100%;
}
</style>