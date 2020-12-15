<template>
  <div>
    <Category />
    <!-- v-show因为是隐藏，但是组件还是加载了，必须在定义方法自己更新才可以，
    v-if才可以，因为他是直接卸载了组件 -->
    <SpuShowList v-if="isShowlist" @showUpdataList="showUpdataList" :isShowlist="isShowlist"/>
    <SpuUpdataList v-else :item="item" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdataList from "./spuUpdataList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowlist: true,
      item: {},
    };
  },
  methods: {
    showUpdataList(row) {
      this.isShowlist = false;
      this.item = { ...row };
    //   this.$bus.$emit("test", this.item);   //更新子组件数据的
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdataList,
  },
};
</script>
