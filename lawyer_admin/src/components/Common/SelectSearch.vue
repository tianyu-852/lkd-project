<template>
  <div class="select-search-container">
    <select
      class="select-search-container-select"
      ref="searchSelect"
      v-model="selected"
    >
      <option
        v-for="(option, index) in options"
        :value="option.value"
        :key="'select_' + option.label"
      >
        {{ option.label }}
      </option>
    </select>

    <div class="select-search-container-input-div">
      <input
        v-model="searchValue"
        @keyup.enter="search"
      />
      <img
        :src="searchSrc"
        class="clickable"
        @mousemove="searchSrc = searchHoverIcon"
        @mouseleave="searchSrc = searchIcon"
        @click="search"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectSearch",
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchSrc: require('@/assets/icons/search.png'),
      searchIcon: require('@/assets/icons/search.png'),
      searchHoverIcon: require('@/assets/icons/search-blue.png'),
      selected: 0,
      searchValue: '',
    }
  },
  methods: {
    search() {
      this.$emit('search', this.selected, this.searchValue)
    },
  }
}
</script>

<style lang="less" scoped>
.select-search-container {
  display: flex;

  &-select {
    width: 63px;
    height: 32px;
    background: #EBECF1;
    opacity: 1;
    border-radius: 16px 0 0 16px;
    text-align: center;
    text-align-last: center;
    font-size: 12px;
    border: none;

    &:focus {
      outline: none;
    }
  }

  &-input-div {
    width: 240px;
    border: 1px solid #EBECF1;
    color: #9EA5AE;
    border-radius: 0 16px 16px 0;
    padding: 0 10px;
    display: flex;
    align-items: center;

    input {
      height: 100%;
      width: 202px;
      border: none;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 500;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>