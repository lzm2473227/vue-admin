<template>
  <div>
    <el-button type="primary" @click="add" class="el-icon-plus">添加</el-button>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="TrademarkList"
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
        <!-- 
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
        <template slot-scope="scope">
          <img class="trademark-img" :src="scope.row.logoUrl" alt="img" />
        </template>
      </el-table-column>

      <el-table-column prop="city" label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            @click="updateTrademark(row)"
            icon="el-icon-edit "
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="delTrademark(row)"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!--
        sync修饰符
      :page-size.sync="limit"   可以让limit更新变成同步更新
      :current-page.sync="page" 可以让page更新变成同步更新

      $event
        1.  在DOM事件中代表 event
        <button @click="handle(123, $event)"></button>
        触发事件是浏览器的行为，所以$event代表event

        2. 在自定义事件中代表 第一个参数
          <button @aaa="handle($event)"></button>
          假设这样触发自定义事件： this.$emit('aaa', 123, 456);
          那么$event就为123（第一个参数）
    -->
    <el-pagination
      @size-change="getPageList(page, $event)"
      @current-change="getPageList($event, limit)"
      class="pagination"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page.sync="page"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!--对话框 -->
    <el-dialog
      :title="`${trademarkForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="visible"
      width="50%"
    >
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
      loading: false, //loading加载的开关
      trademarkForm: {
        //表单的数据
        tmName: "", //品牌名称
        logoUrl: "", //
      },
      //效验规则
      rules: {
        tmName: [
          {
            // required: true,   必填项
            /*rule  校验的字段名value, 校验的字段值callback ,决定表单校验成功/失败*/
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
      // 校验表单
      this.$refs[form].validate(async (valid) => {
        if (valid) {
          const { trademarkForm } = this;
          // 代表是否是更新
          const isUpdate = !!trademarkForm.id;

          // 如果是修改需要验证
          //   if (isUpdate) {
          //     const tm = this.TrademarkList.find(
          //       (tm) => tm.id === trademarkForm.id
          //     );
          //   }

          // 表单校验通过
        //   console.log(trademarkForm);
          let result;
        //判断是修改还是添加，有id就是添加，没有就走else新增
          if (isUpdate) {
            result = await this.$API.trademark.updateTrademark(trademarkForm);
          } else {
            result = await this.$API.trademark.addTrademark(trademarkForm);
          }
          console.log(result);

          if (result.code === 200) {
            this.$message.success(`${isUpdate ? "修改" : "添加"}品牌数据成功~`);
            this.visible = false; // 隐藏对话框
            this.getPageList(this.page, this.limit); // 请求加载新数据
          } else {
            this.$message.error(result.message);
          }
        }
      });
    },
    // 上传图片成功的回调
    handleAvatarSuccess(res) {
      this.trademarkForm.logoUrl = res.data;
      console.log(res);
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
        this.$message.error("上传品牌LOGO大小不能超过 2000 kb");
      }
      return isValidType && isLt;
    },
    //更新获取页面
    async getPageList(page, limit) {
      this.loading = true;
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
      this.loading = false;
    },
    //删除商品
    async delTrademark(data) {
      const re = await this.$API.trademark.delTrademark(data.id);
      //   console.log(re);
      this.getPageList(this.page, this.limit);
    },
    //点击修改商品后重新点击添加要清空数据
    add(row) {
      // 清空表单的校验
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.visible = true;
      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //修改商品
    updateTrademark(row) {
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      //显示对话框
      this.visible = true;
      this.trademarkForm = { ...row };
      //  结构多复杂的时候用下面这种方法，没有函数就不用深度拷贝
      // this.trademarkForm=JSON.parse(JSON.stringify(row))
      this.getPageList(this.page, this.limit);
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
