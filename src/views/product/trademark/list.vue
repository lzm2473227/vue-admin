<template>
  <div>
    <el-button type="primary" @click="visible = true" class="el-icon-plus"
      >添加</el-button
    >
    <el-table :data="TrademarkList" border style="width: 100%; margin: 20px 0">
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

      <el-table-column prop="city" label="操作">
        <template>
          <el-button type="warning" icon="el-icon-edit ">修改</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- sync修饰符当页数跳转，跳转后的当前页面显示个数出现bug时就可以使用，他会修复这个bug -->
    <el-pagination
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      class="trademark-pagination"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page.sync="page"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!--对话框 -->
    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>

        <!-- 上传品牌logo  -->
        <el-form-item label="品牌Logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg,png文件，且不超过2000kb</span>
        </el-form-item>
      </el-form>
      <!-- 取消和确定的按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      TrademarkList: [], // 所有数据
      page: 1, //页码
      limit: 3, // 每页条数
      total: 0, //总数
      visible: false, //对话框开关显示或者隐藏
      trademarkForm: {
        //表单的数据
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          {
            required: true,
            min: 3,
            max: 5,
            message: "请输入活动名称,长度在 3 到 5 个字符",
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "请上传图片",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const result = await this.$API.trademark.addTrademark(
            this.trademarkForm
          );
        if (result.code === 200) {
            this.$message.success("添加品牌数据成功~");
            this.visible = false; // 隐藏对话框
            this.getPageList(this.page, this.limit); // 请求加载新数据
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
      console.log(res);
    },
    // beforeAvatarUpload() {},
    beforeAvatarUpload(file) {
      // console.log(file);
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      const isValidType = imgTypes.indexOf(file.type) > -1;
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 50 kb!");
      }
      return isValidType && isLt;
    },

    async getPageList(page, limit) {
      const result = await this.$API.trademark.getPageList(page, limit);
      //   console.log(result);
      if (result.code === 200) {
        this.$message.success("获取品牌列表成功");
        this.TrademarkList = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error("获取品牌列表失败");
      }
    },
  },
  mounted() {
    this.getPageList(this.page, this.limit);
  },
};
</script>
<style lang="sass" scoped>
.trademark-img
    width: 100px
.trademark-pagination
    text-align: right
>>>.el-pagination__sizes
    margin-left: 250px
>>>.avatar-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden
    &:hover
        border-color: #409EFF

>>>.avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

>>>.avatar
    width: 178px
    height: 178px
    display: block
</style>
