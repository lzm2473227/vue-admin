<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px" :model="spu" ref="spuForm">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌" prop="tmId">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="tm in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :file-list="formatImageList"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg,png文件，且不超过1000kb</span>
      </el-form-item>

      <el-form-item label="销售属性" prop="saleAttrId">
        <el-select
          :placeholder="`还有个${filterSaleAttrList.length}未选择`"
          v-model="spu.saleAttrId"
        >
          <el-option
            v-for="sale in filterSaleAttrList"
            :label="sale.name"
            :value="sale.id"
            :key="sale.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          class="el-icon-plus"
          :disabled="!spu.saleAttrId"
          @click="addSpuSaleAttr"
          >添加销售属性</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="spuSaleAttrList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名称">
          </el-table-column>

          <el-table-column label="属性值列表">
            <template v-slot="{ row}">
              <el-tag
                @close="delTag(index, row)"
                closable
                style="margin-right: 5px"
                v-for="(attrVal, index) in row.spuSaleAttrValueList"
                :key="attrVal.id"
                >{{ attrVal.saleAttrValueName }}</el-tag
              >
              <el-input
                v-if="row.edit"
                v-model="saleAttrValueText"
                @blur="editCom(row)"
                @keyup.enter.native="editCom(row)"
                ref="input"
                size="mini"
              ></el-input>
              <el-button
                icon="el-icon-plus"
                size="mini"
                v-else
                @click="edit(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.saleAttrName}吗？`"
                @onConfirm="delAttrList($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('showList', spu.category3Id)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="visible">
      <img width="100%" :src="previewImgUrl" alt="img" />
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "SpuUpdataList",
  props: {
    item: Object,
  },
  data() {
    return {
      spu: this.item,
      trademarkList: [], // 所有品牌数据
      imageList: [], // 所有图片列表
      saleAttrList: [], // 所有销售属性列表
      spuSaleAttrList: [], // 当前SPU销售属性列表
      previewImgUrl: "", // 图片地址
      visible: false, // 图片对话框显示&隐藏
      loading: false, //loading的开关
      saleAttrValueText: "", //销售属性值添加的值   移动，联通等
    };
  },
  computed: {
    formatImageList() {
      return this.imageList.map((img) => {
          //处理数据，因为数据名字不一样，所以要改成一样的才可以加进去
          return {
            name: img.imgName,
            url: img.imgUrl,
            uid: img.uid || img.id,
          };
        });
    },

    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        // this.spuSaleAttrList.indexOf() // 只适用于数组中是基本类型
        // 找到了返回{}  没有找到返回undefined
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        ); // 适用于数组中是引用类型
      });
    },
  },
  methods: {
    save() {
      this.$refs.spuForm.validate(async (valid) => {
        if (valid) {
          console.log("效验通过");
          //收集数据
          const spu = {
            ...this.spu,
            spuImageList: this.imageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };
          //发送数据
          const result = await this.$API.spu.updateSpu(spu);
        //   console.log(result);
          if (result.code === 200) {
            this.$message.success("更新SPU成功");
            this.$emit("showList", this.spu.category3Id);
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 删除单个属性值
    delTag(index, row) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //删除整个销售属性
    delAttrList(index) {
      this.spuSaleAttrList.splice(index, 1);
    },
    // 显示编辑输入框
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 添加销售属性值
    editCom(row) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        this.saleAttrValueText = "";
      }
      row.edit = false;
    },
    //添加销售属性
    addSpuSaleAttr() {
      const { id, saleAttrId } = this.spu;
      const sale = this.saleAttrList.find((sale) => sale.id === saleAttrId);
      // 将销售属性添加到商品中
      this.spuSaleAttrList.push({
        baseSaleAttrId: sale.id, // 所有销售属性id
        saleAttrName: sale.name, // 所有销售属性名称
        spuId: id,
        spuSaleAttrValueList: [], // 销售属性值列表
      });
      //清空选中的销售属性id
      this.spu.saleAttrId = "";
    },
    //上传图片之前的回调函数
    beforeAvatarUpload(file) {
      //   console.log(file);
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      const isValidType = imgTypes.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 1024;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 10240 kb");
      }
      return isValidType && isLt;
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res, file) {
      this.imageList.push({
        ingName: file.name, // 文件名称
        imgUrl: res.data, //图片地址
        uid: file.uid, // SPU id
      });
    },
    // 处理删除图片
    handleRemove(file) {
      // console.log(file,fileList);
      //我这里不是用计算属性的，所以得用处理后的数据，这里是url   img.url
      this.imageList = this.imageList.filter((img) => img.imgUrl !== file.url);
    },
    // 处理图片预览
    handlePictureCardPreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    // 获取所有品牌数据
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.$message.success("获取所有品牌成功");
        this.trademarkList = result.data;
        // console.log(result);
      } else {
        this.$message.error(result.message);
      }
    },
    //获取SPU的图片列表
    async getSpuImageList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuImageList(id);
      //   console.log(result.id);
      //   console.log(result);
      if (result.code === 200) {
        this.$message.success("获取所有图片成功~");
        this.imageList = result.data
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取所有销售属性列表
    async getSaleAttrList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.$message.success("获取所有销售属性列表成功");
        this.saleAttrList = result.data;
        // console.log(result);
      } else {
        this.$message.error(result.message);
      }
    },
    //  //获取SPU的销售属性列表
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性列表成功");
        this.spuSaleAttrList = result.data;
        console.log(result);
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSaleAttrList();
    this.getSpuSaleAttrList();

    // this.$bus.$on("test", (data) => {
    //   this.spu = data; //更新data的数据
    // });
  },
};
</script>

<style>
</style>