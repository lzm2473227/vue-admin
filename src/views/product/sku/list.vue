<template>
  <div>
    <el-card>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        stripe
        :data="skuTrademarkList"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          type="index"
          label="序号"
          width="80"
          align="center"
          row.key="id"
        >
        </el-table-column>
        <el-table-column prop="skuName" label="名称"> </el-table-column>
        <el-table-column prop="skuDesc" label="描述"></el-table-column>
        <el-table-column label="默认图片" align="center" width="130px">
          <template slot-scope="scope">
            <img
              class="trademark-img"
              style="width: 80px; height: 80px"
              :src="scope.row.skuDefaultImg"
              alt="img"
            />
          </template>
        </el-table-column>

        <el-table-column prop="weight" label="总量(KG)"> </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="info"
              v-if="row.isSale === true"
              icon="el-icon-top"
              @click="getOnSale(row.id)"
            ></el-button>
            <el-button
              v-else
              size="mini"
              type="success"
              icon="el-icon-bottom"
              @click="getCancelSale(row.id)"
            ></el-button>
            <el-button
              type="warning"
              size="mini"
              @click="updateTrademark(row)"
              icon="el-icon-edit "
            ></el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-info"
              @click="getSku(row.id)"
              :visible.sync="isShowSkuInfo"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              @click="getSkuRemove(row.id)"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="getSkuPageList(page, $event)"
        @current-change="getSkuPageList($event, limit)"
        class="pagination"
        :page-sizes="[3, 6, 9]"
        :page-size.sync="limit"
        :current-page.sync="page"
        layout="prev, pager, next, jumper,sizes,total"
        :total="total"
      >
      </el-pagination>

      <el-drawer
        title="我是sku单个详细的信息展示"
        :visible.sync="isShowSkuInfo"
        size="50%"
      >
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }}</el-col>
        </el-row>

        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              type="success"
              style="margin-right: 5px"
              v-for="value in skuInfo.skuAttrValueList"
              :key="value.id"
            >
              {{ value.attrId + "-" + value.valueId }}
            </el-tag>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              type="success"
              style="margin-right: 5px"
              v-for="value in skuInfo.skuSaleAttrValueList"
              :key="value.id"
            >
              {{ value.id + "-" + value.saleAttrValueId }}
            </el-tag>
          </el-col>
        </el-row>
        <div>
          <el-button @click="innerDrawer = true">轮播图</el-button>
          <el-drawer
            title="sku的单个图片轮播展示图"
            :append-to-body="true"
            :before-close="handleClose"
            :visible.sync="innerDrawer"
          >
            <el-row>
              <el-col :span="5" align="center">商品图片</el-col>
              <el-col :span="16">
                <el-carousel
                  class="sku-carousel"
                  trigger="click"
                  height="400px"
                >
                  <el-carousel-item
                    v-for="item in skuInfo.skuImageList"
                    :key="item.id"
                    style="border: 1px #ccc solid"
                  >
                    <img :src="item.imgUrl" alt="" />
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>
          </el-drawer>
        </div>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SKuList",
  data() {
    return {
      skuTrademarkList: [], //sku的所有的数据
      loading: false,
      page: 1, //当前页码
      limit: 3, // 每页条数
      total: 0, //总数
      isSale: true, //上架下架开关
      skuInfo: {}, //单个sku商品详细信息
      isShowSkuInfo: false, //控制抽屉开关
      innerDrawer: false, //element -ui里的属性
    };
  },
  methods: {
    //sku上架
    getOnSale(id) {
      const result = this.$API.sku.onSale(id);
    },
    //sku下架
    getCancelSale(id) {
      const result = this.$API.sku.cancelSale(id);
    },
    handleClose(done) {
      this.$confirm("确定关闭吗")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //查看sku单个商品
    async getSku(id) {
      this.isShowSkuInfo = true;
      const result = await this.$API.sku.getSku(id);
      this.skuInfo = result.data;
    },
    updateTrademark() {},
    //删除sku
    async getSkuRemove(id) {
      const result = await this.$API.sku.skuRemove(id);
      console.log(result);

      this.$message.success("删除sku成功");
      this.getSkuPageList(); //更新页面
    },
    // 更新获取页面
    async getSkuPageList(page = 1) {
      this.loading = true;
      this.page = page;
      const result = await this.$API.sku.skuPageList(this.page, this.limit);
      console.log(result);
      if (result.code === 200) {
        this.$message.success("获取sku分页成功");
        this.skuTrademarkList = result.data.records;
        this.total = result.data.total;
      } else {
        this.$message.error("获取品牌列表失败");
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getSkuPageList();
  },
};
</script>


<style type="text/css" scoped>
.el-row {
  height: 40px;
}
.el-col {
  line-height: 40px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.el-row .el-col.el-col-5[data-v-6842038a] {
  font-size: 18px;
  font-weight: bold;
  /* text-align: right; */
  margin-right: 20px;
}
</style>

