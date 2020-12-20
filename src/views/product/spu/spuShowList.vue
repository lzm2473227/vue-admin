<template>
  <el-card class="box-card" style="margin-top: 20px">
    <el-button
      type="primary"
      icon="el-icon-plus"
      :disabled="!category.category3Id"
      @click="$emit('showUpdataList', { category3Id: category.category3Id })"
      >添加SPU</el-button
    >
    <el-table
      :data="spuList"
      v-loading="loading"
      border
      style="width: 100% margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>

      <el-table-column prop="description" label="SPU描述"> </el-table-column>

      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            @click="$emit('showSpuList', { ...row, ...category })"
            size="mini"
            icon="el-icon-plus"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="$emit('showUpdataList', { ...row, ...category })"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-info"
            @click="getListBySpuId(row.id)"
          ></el-button>
          <el-button
            @click="delUpdataList"
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      :title="`${spu.spuName} => SKU列表`"
      :visible.sync="isShowsku"
    >
      <el-table :data="skuList" v-loading="loading">
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column property="price" label="价格(元)"></el-table-column>
        <el-table-column property="weight" label="重量(KG)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
import { spu } from "@/api";
import { mapState } from "vuex";
export default {
  name: "SpuShowList",
  data() {
    return {
      //   isShow: this.isShowlist,
      page: 1,
      limit: 3,
      total: 0,
      loading: false,
      spuList: [],
      isShowsku: false, // 是否显示sku列表的dialog
      spu: [],
      skuList: [], // spu里的sku商品查看展示
      //   category: {
      //     category1Id: "",
      //     category2Id: "",
      //     category3Id: "",
      //   },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  watch: {
    "category.category3Id": {
      handler(category3Id) {
        if (!category3Id) return;
        this.getPageList(this.page, this.limit);
      },
      immediate: true,
    },
    "category.category1Id"() {
      this.clearList();
    },
    "category.category2Id"() {
      this.clearList();
    },
  },
  methods: {
    async getListBySpuId(id) {
      this.loading = true; // 显示loading
      this.isShowsku = true;
      this.spu = spu;
      const result = await this.$API.sku.getListBySpuId(id);
      this.loading = false; // 隐藏loading
      const skuList = result.data;
      this.skuList = skuList;
    },
    delUpdataList() {
      const { id } = this.spuList;
    },
    // 获取SPU分页列表
    async getPageList(page, limit) {
      const { category3Id } = this.category;
      const result = await this.$API.spu.getSpuList({
        category3Id,
        page,
        limit,
      });

      if (result.code === 200) {
        this.$message.success("获取SUP分页列表成功");
        this.spuList = result.data.records;
        this.total = result.data.total;
        // console.log(result.data);
      } else {
        this.$message.error(result.message);
      }
    },
    // 处理category的change   当选中三级分类时会触发
    // handleCategoryChange(category) {
    //   //当选中3Id的时候会触发这个函数,一开始我就只写category3id,
    //   //但是后面要category全部的id,所以这里写category全部的id
    //   this.category = category;
    //   this.getPageList(this.page, this.limit);
    // },
    // 当选中1级或2级分类触发，清空下面列表的数据
    clearList() {
      this.page = 1;
      this.limit = 3;
      this.total = 0;
      this.spuList = [];
      //   this.category.category3Id = "";
    },
  },
  //全局事件总线
  mounted() {
    // this.$bus.$on("change", this.handleCategoryChange);
    // this.$bus.$on("clearList", this.clearList);
  },
  //全局事件总线一定要记得收尾，解绑这些事件
  beforeDestroy() {
    // this.$bus.$off("change", this.handleCategoryChange);
    // this.$bus.$off("clearList", this.clearList);
  },
};
</script>

<style>
</style>