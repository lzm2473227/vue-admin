<template>
  <el-card>
    <el-form label-width="100px" :model="sku" ref="skuForm" :rules="rules">
      <el-form-item label="SPU名称">
        <span>{{ spu.spuName }}</span>
      </el-form-item>

      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SPU名称" v-model="sku.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)" prop="price">
        <el-input-number
          controls-position="right"
          v-model="sku.price"
          :min="1"
          :max="100000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="重量(千克)" prop="weight">
        <el-input-number
          controls-position="right"
          v-model="sku.weight"
          :min="0"
          :max="100000"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="规格描述" prop="skuDesc">
        <el-input
          placeholder="SPU规格描述"
          type="textarea"
          v-model="sku.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性" prop="skuAttrValueList">
        <div
          class="skulist-select-container"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <el-form-item :label="attr.attrName" style="display: inline-block">
            <el-select
              placeholder="请选择品牌"
              v-model="sku.skuAttrValueList[index]"
              @change="clearValidate('skuAttrValueList')"
            >
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :label="value.valueName"
                :value="`${attr.id}-${value.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="销售属性" prop="skuSaleAttrValueList">
        <div
          class="skulist-select-container"
          v-for="(sale, index) in spuSaleAttrList"
          :key="sale.id"
        >
          <el-form-item
            :label="sale.saleAttrName"
            style="display: inline-block"
          >
            <el-select
              placeholder="请选择品牌"
              v-model="sku.skuSaleAttrValueList[index]"
              @change="clearValidate('skuSaleAttrValueList')"
            >
              <el-option
                v-for="value in sale.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="value.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="图片列表" prop="skuImageList">
        <el-table
          ref="multipleTable"
          border
          :data="imageList"
          style="width: 100%; margin: 20px 0"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column
            type="selection"
            reserve-selection
            width="55"
            prop="isCheck"
          >
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope"
              ><img
                style="display: inline-block; height: 100px; weight: 100px"
                :src="scope.row.imgUrl"
                :alt="scope.row.imgName"
            /></template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                v-if="!row.isDefault"
                @click="setDefault($index)"
                >设为默认</el-button
              >
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
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
      sku: {
        // sku数据
        skuSaleAttrValueList: [], //sku销售属性列表
        skuAttrValueList: [], //sku平台属性值列表
        skuImageList: [], //sku图片列表
      },
      rules: {
        skuName: [
          { required: true, message: "请输入SKU名称", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入SKU价格", trigger: "blur" }],
        weight: [
          { required: true, message: "请输入SKU重量(", trigger: "blur" },
        ],
        skuDesc: [
          { required: true, message: "请规格SKU描述", trigger: "blur" },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    //保存
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          //先拿所有要的数据
          const { category3Id, id: spuId, tmId } = this.spu;
          const skuAttrValueList = this.sku.skuAttrValueList.map((attr) => {
            const { attrId, valueId } = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });
          const skuSaleAttrValueList = this.sku.skuAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );
          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;
          let sku = {
            ...this.sku,
            skuSaleAttrValueList,
            skuDefaultImg,
            skuAttrValueList,
            category3Id,
            spuId,
            tmId,
          };
          const result = await this.$API.sku.saveSku(sku);
          if (result.code === 200) {
            this.$message.success("保存成功");
            this.$emit("showList");
          } else {
            this.$message.error(result.result);
          }
          console.log("通过了");
        }
      });
    },
    clearValidate(prop) {
      // 清空表单校验
      this.$refs.skuForm.clearValidate(prop);
    },
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
      } = this;
      if (skuImageList.length === 0) {
        callback(new Error("请选择至少一张图片"));
        return;
      }
      //   if (!skuImageList.some((img) => img.isDefault)) {
      //     callback(new Error("请最少设置一张图片"));
      //   }
      callback();
    },
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback(new Error("请对所有销售属性进行选择"));
        return;
      }
      callback();
    },
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrList,
        sku: { skuAttrValueList },
      } = this;
      if (
        skuAttrValueList.length !== attrList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback(new Error("请对所有平台属性进行选择"));
        return;
      }
      callback();
    },
    handleSelectionChange(skuImageList) {
      this.sku.skuImageList = skuImageList;
    },
    setDefault(i) {
      this.clearValidate("skuImageList");
      this.imageList = this.imageList.map((img, index) => {
        return {
          ...img,
          isDefault: i === index ? true : false,
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((img, index) => {
        return {
          ...img,
          isDefault: i === index ? true : false,
        };
      });
    },
    //获取SPU的图片列表
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      //   console.log(result.id);
      //   console.log(result);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        this.imageList = result.data.map((img) => {
          return {
            ...img,
            isCheck: true,
          };
        });
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
    width: 30%
    margin-bottom: 10px
</style>