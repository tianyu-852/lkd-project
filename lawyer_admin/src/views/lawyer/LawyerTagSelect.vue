<template>
  <div class="lawyer-tag-select-div">
    <img :src="lawyerTagIcon" />
    <select class="lawyer-tag-select" :value="value" @input="onInput">
      <option v-for="(option, index) in lawyerTags" :value="option.value" :key="'lawyer_tag' + option.label + index">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
import { getQuestionTagsDetail } from '@/api/question'

export default {
  name: 'LawyerTagSelect',
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      lawyerTags: [],
      lawyerTagIcon: require('@/assets/icons/lawyer_tag.png'),
    }
  },
  created() {
    this.getLawyerTags()
  },
  methods: {
    onInput(event) {
      const selectIndex = event.target.selectedIndex
      this.$emit('input', this.lawyerTags[selectIndex].value)
    },
    getLawyerTags() {
      const lawyerTags = []
      getQuestionTagsDetail().then(({ data }) => {
        this.lawyerTags = data.forEach((questionGroup) => {
          questionGroup.lawyer_tags.forEach((lawyerTag) => {
            lawyerTags.push({
              label: lawyerTag.lawyer_tag,
              value: lawyerTag.lawyer_tag_id,
            })
          })
        })
        this.$emit('input', lawyerTags[0].value)
        this.lawyerTags = lawyerTags
      })
    },
  },
}
</script>

<style lang="less" scoped>
.lawyer-tag-select-div {
  width: 100%;
  display: flex;
  align-items: center;
  background: #ebecf1;
  padding-left: 12px;

  img {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
}

.lawyer-tag-select {
  width: 100%;
  height: 32px;
  background: #ebecf1;
  opacity: 1;
  font-size: 12px;
  border: none;

  &:focus {
    outline: none;
  }
}
</style>