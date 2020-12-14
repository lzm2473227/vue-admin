<template>
  <el-card style="margin-top: 20px">
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select>
          <el-option>111</el-option>
          <el-option>222</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="SPU描述"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :action="`${$BASE_API}/admin/product/fileUpload`"
          :show-file-list="false"
        >
          <img v-if="false" :src="trademarkForm.logoUrl" class="avatar" />
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>只能上传jpg,png文件，且不超过2000kb</span>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select placeholder="还有三个未选择">
          <el-option>111</el-option>
          <el-option>222</el-option>
        </el-select>
        <el-button type="primary" class="el-icon-plus">添加销售属性</el-button>
      </el-form-item>

      <el-form-item>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="[]"
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
          <el-table-column prop="tmName" label="品牌名称"> </el-table-column>

          <el-table-column label="品牌LOGO">
            <template slot-scope="scope">
              <img class="trademark-img" :src="scope.row.logoUrl" alt="img" />
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template>
              <el-button type="warning" size="mini" icon="el-icon-edit "
                >修改</el-button
              >
              <el-button type="danger" size="mini" icon="el-icon-delete"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>

    <el-button round type="primary">保存</el-button>
    <el-button round>取消</el-button>
  </el-card>
</template>

<script>
export default {
  name: "SpuUpdataList",
  data() {
    return {
    //   TrademarkList: [],
      loading: false,
    };
  },
};
</script>

<style>
</style>