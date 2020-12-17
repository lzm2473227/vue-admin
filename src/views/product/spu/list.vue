<template>
  <div>
    <SkuList v-if="isShowSkuList" :spuItem="spuItem" />
    <!-- v-show因为是隐藏，但是组件还是加载了，必须在定义方法自己更新才可以，
    v-if才可以，因为他是直接卸载了组件 -->
    <div v-else>
      <Category />
      <SpuShowList
        v-if="isShowlist"
        @showUpdataList="showUpdataList"
        @showSpuList="showSpuList"
      />
      <SpuUpdataList v-else :item="item" @showList="showList" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdataList from "./spuUpdataList";
import SkuList from "./skuList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowlist: true,
      item: {},
      spuItem: {},
      isShowSkuList: false,
    };
  },
  methods: {
    showSpuList(row) {
      this.isShowSkuList = true;
      this.spuItem = { ...row };
    },
    showUpdataList(row) {
      this.isShowlist = false;
      this.item = { ...row };
      //   this.$bus.$emit("test", this.item);   //更新子组件数据的
    },
    showList(category) {
      this.isShowlist = true;
      // 等ShowList组件加载完成，在触发事件
      this.$nextTick(() => {
        this.$bus.$emit("change",category);
      });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdataList,
    SkuList,
  },
};
</script>
