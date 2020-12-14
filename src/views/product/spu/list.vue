<template>
  <div>
    <Category />
    <SpuShowList v-show="isShowlist" />
    <SpuUpdataList v-show="!isShowlist" />
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
      isShowlist: false,
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdataList,
  },
};
</script>
