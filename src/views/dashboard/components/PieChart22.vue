<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
import resize from "./mixins/resize";
export default {
  mixins: [resize],
  data() {
    this.chartSettings = {
      //   roseType: "radius",
      dimension: "日期",
      metrics: "访问用户",
    };
    return {
      chartData: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "周一", 访问用户: 1393 },
          { 日期: "周二", 访问用户: 3530 },
          { 日期: "周三", 访问用户: 2923 },
          { 日期: "周四", 访问用户: 1723 },
          { 日期: "周五", 访问用户: 3792 },
          { 日期: "周六", 访问用户: 4593 },
        ],
      },
    };
  },
};
</script>