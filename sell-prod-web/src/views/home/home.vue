<template>
  <div class="main">
    <div ref="one" class="one_line" />
    <div ref="two" class="two_bar" />
    <div ref="three" class="three_pie" />
  </div>
</template>

<script>
// 引入echarts主模块
const echarts = require('echarts/lib/echarts');

require('echarts/lib/component/grid');
// 单独引入基础折线图
require('echarts/lib/chart/line');
// 单独引入柱状图
require('echarts/lib/chart/bar');
// 引入饼图
require('echarts/lib/component/title');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/chart/pie');
export default {
  name: 'Home',
  mounted () {
    var myEchart = echarts.init(this.$refs.one);
    // 图表的元素一定要有宽和高
    myEchart.setOption({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    });
   
    var myEchart2 = echarts.init(this.$refs.two, null, { width: 600, height: 300 });
    myEchart2.setOption({
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    });
  
    var myEchart3 = echarts.init(this.$refs.three);
    myEchart3.setOption({
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
  },
};
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
