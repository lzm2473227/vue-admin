<template>
  <el-card>
    <el-form label-width="100px" :model="sku" ref="spuForm">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input-number controls-position="right" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input-number controls-position="right" :min="0"></el-input-number>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input placeholder="SPU规格描述" type="textarea"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <div
          class="skulist-select-container"
          v-for="attr in attrList"
          :key="attr.id"
        >
          <span>{{ attr.attrName }}</span>
          <el-select value="adc" placeholder="请选择品牌" v-model="spu.attrId">
            <el-option
              v-for="value in attr.attrValueList"
              :key="value.id"
              :label="value.valueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="销售属性">
        <div
          class="skulist-select-container"
          v-for="sale in spuSaleAttrList"
          :key="sale.id"
        >
          <span>{{ sale.saleAttrName }}</span>
          <el-select value="adc" placeholder="请选择品牌">
            <el-option
              v-for="value in sale.spuSaleAttrValueList"
              :key="value.id"
              :label="value.saleAttrValueName"
              :value="value.id"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" prop="isCheck">
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img :src="scope.row.imgUrl" :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip>
            <template>
              <el-button type="primary" size="mini">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "spuItem",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spu: this.spuItem, // spu数据
      imageList: [], // 图片列表
      spuSaleAttrList: [], //销售属性列表
      attrList: [], //平台属性值列表
      sku: {}, // sku数据
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    handleSelectionChange() {},
    //获取SPU的图片列表
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      //   console.log(result.id);
      //   console.log(result);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        this.imageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性列表成功");
        this.spuSaleAttrList = result.data;
        // console.log(result);
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有平台属性列表
    async getAttrList() {
      //   const result = await this.$API.attr.getAttrList({
      //     category1Id: this.spu.category1Id,
      //     category2Id: this.spu.category2Id,
      //     category3Id: this.spu.category3Id,
      //   });
      const result = await this.$API.attr.getAttrList(this.category);
      if (result.code === 200) {
        this.$message.success("获取所有销售属性列表成功");
        this.attrList = result.data;
        console.log(result);
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrList();
  },
};
</script>

<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
    text-align: left
.skulist-select-container
    display: inline-block
    margin-right: 20px
</style>