
<template>
  <view v-if="isShowTimePicker">
    <picker-view :value="valueIndexList" indicator-class="picker-indicator" class="picker-view" @change="onPickViewChange">
      <!-- 年 -->
      <picker-view-column>
        <view v-for="(yItem, yIndex) in dataYearList" :key="yIndex" class="item-time">{{ yItem }}年</view>
      </picker-view-column>
      <!-- 月 -->
      <picker-view-column>
        <view v-for="(mItem, mIndex) in dataMonthList" :key="mIndex" class="item-time">{{ mItem }}月</view>
      </picker-view-column>
      <!-- 日 -->
      <picker-view-column>
        <view v-for="(dItem, dIndex) in dataDayList" :key="dIndex" class="item-time">{{ dItem }}日</view>
      </picker-view-column>
    </picker-view>
  </view>
</template>

<script>
// 生成递进的数组
const	generateArray = (start, end) => {
  // 转为数值格式，否则用户给end-year等传递字符串值时，下面的end+1会导致字符串拼接，而不是相加
  start = Number(start);
  end = Number(end);
  end = end > start ? end : start;
  // 生成数组，获取其中的索引，并剪出来
  return [...Array(end + 1).keys()].slice(start);
};

export default {
  name: 'TimePicker',
  props: {
    startYear: { type: [String, Number], default: 2020 }, // 年份开始时间
    endYear: { type: [String, Number], default: 2025 }, // 年份结束时间
    defaultTime: { type: [Date, String], default: '' }, // 默认时间
  },
  data() {
    return {
      valueIndexList: [0, 0, 0], // 选中下标列表

      dataYearList: [], // 数据年列表
      dataMonthList: [], // 数据月列表
      dataDayList: [], // 数据日列表

      isShowTimePicker: false, // 是否打开时间选择器
    };
  },
  created() {
    this._initData();
    this._getTimePickerValueIndexs(this.defaultTime);
  },
  methods: {
    /**
     * 初始时间 picker list
     */
    _initData() {
      this._setYears();
      this._setMonths();
      const curYear = this.$dayjs().year(); // 当前年份
      const curMonth = this.$dayjs().month() + 1; // 当前月份
      this._setDays(curYear, curMonth);

      this.isShowTimePicker = true;
    },
    /**
     * 生成时间选择器初始下标
     */
    _getTimePickerValueIndexs(initTime) {
      const timeDate = initTime ? this.$dayjs(initTime) : this.$dayjs();
      const timeYear = timeDate.year();
      const timeMonth = timeDate.month();
      const timeDay = timeDate.date();

      const _timeYearIndex = this.dataYearList.indexOf(timeYear) >= 0 ? this.dataYearList.indexOf(timeYear) : 0; // 年下标
      const _timeMonthIndex = timeMonth; // 月下标
      const _timeDayIndex = timeDay - 1; // 日下标

      this.valueIndexList = [_timeYearIndex, _timeMonthIndex, _timeDayIndex];
    },
    /**
     * 设置 time picker 年
     */
    _setYears() {
      const _yearList = generateArray(this.startYear, this.endYear);
      this.dataYearList = _yearList;
    },
    /**
     * 设置 time picker 月
     */
    _setMonths() {
      const _monthList = generateArray(1, 12);
      this.dataMonthList = _monthList;
    },
    /**
     * 设置 time picker 日
     */
    _setDays(year, month) {
      const monthTotalDay = this.$dayjs(`${ year }-${ month }-1`).daysInMonth();
      const _dayList = generateArray(1, monthTotalDay);

      this.dataDayList = _dayList;
    },
    /**
     * 打开时间选择器 父组件调用
     */
    _openTimePicker() {
      this.isShowTimePicker = true;
    },
    /**
     * 关闭时间选择器
     */
    closeTimePicker() {
      this.isShowTimePicker = false;
    },
    /**
     * 当滚动选择触发
     */
    onPickViewChange(event) {
      const _valueIndexList = event.detail.value;
      const changeYear = this.dataYearList[_valueIndexList[0]];
      const changeMonth = this.dataMonthList[_valueIndexList[1]];

      this._setDays(changeYear, changeMonth); // 更改数据日列表
      this.valueIndexList = _valueIndexList;

      const confirmYear = this.dataYearList[this.valueIndexList[0]];
      const confirmMonth = this.dataMonthList[this.valueIndexList[1]];
      const confirmDay = this.dataDayList[this.valueIndexList[2]];
      const confirmDate = this.$dayjs(`${ confirmYear }-${ confirmMonth }-${ confirmDay }`).format('YYYY-MM-DD HH:mm:ss');
      this.$emit('changeTimePick', confirmDate);
    },
    /**
     * 确认日期选择
     */
    confirmTimePick() {
      const confirmYear = this.dataYearList[this.valueIndexList[0]];
      const confirmMonth = this.dataMonthList[this.valueIndexList[1]];
      const confirmDay = this.dataDayList[this.valueIndexList[2]];
      const confirmDate = this.$dayjs(`${ confirmYear }-${ confirmMonth }-${ confirmDay }`).format('YYYY-MM-DD HH:mm:ss');
      this.$emit('confirmTimePick', confirmDate);
    }
  }
};
</script>

<style lang="scss">
.picker-indicator {
  height: 40px;
  background-color: #F5F5F5;
  z-index: 0;
}
</style>

<style lang="scss" scoped>
  @import './style.scss';
</style>
