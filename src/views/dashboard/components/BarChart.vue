<template>
  <div style="width: 100%; height: 300px; overflow: hidden">
    <ve-histogram
      height="400px"
      :data="chartData"
      :settings="chartSettings"
    ></ve-histogram>
  </div>
</template>

<script>
export default {
  name: "BarChart",
  data() {
    this.chartSettings = {
      stack: { page: ["PageA", "PageB", "PageC"] },
      lableMap: {},
    };
    return {
      chartData: {
        columns: ["日期", "PageA", "PageB", "PageC"],
        rows: [
          {
            日期: "周一",
            PageA: 1393,
            PageB: 1093,
            PageC: 1093,
            stack: "vistors",
          },
          {
            日期: "周二",
            PageA: 3530,
            PageB: 3230,
            PageC: 3230,
            stack: "vistors",
          },
          {
            日期: "周三",
            PageA: 2923,
            PageB: 2623,
            PageC: 3230,
            stack: "vistors",
          },
          {
            日期: "周四",
            PageA: 1723,
            PageB: 1423,
            PageC: 3230,
            stack: "vistors",
          },
          {
            日期: "周五",
            PageA: 3792,
            PageB: 3492,
            PageC: 3230,
            stack: "vistors",
          },
          {
            日期: "周六",
            PageA: 4593,
            PageB: 4293,
            PageC: 3230,
            stack: "vistors",
          },
          {
            日期: "周日",
            PageA: 4593,
            PageB: 4293,
            PageC: 3230,
            stack: "vistors",
          },
        ],
      },
    };
  },
};
</script>