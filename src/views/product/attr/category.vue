<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <!-- Select 选择器 -->
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="handleSelectChange1"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="handleSelectChange2"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="handleSelectChange3"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      category: {
        category1Id: "", // 1级分类id
        category2Id: "",
        category3Id: "",
      },
      category1List: [], // 1级分类数据
      category2List: [],
      category3List: [],
    };
  },
  methods: {
    //获取二级分类
    async handleSelectChange1(category1Id) {
      // 重新选择一级分类后面清空列表和ID
      this.category2List = [];
      this.category3List = [];
      this.category.category3Id = "";
      this.category.category2Id = "";
      //   console.log(vaule);
      const result = await this.$API.attr.getCategorys2(category1Id);
      //   console.log(result);
      if (result.code === 200) {
        this.category2List = result.data;
      } else {
        this.$message.error("获取失败");
      }
    },
    // 获取三级分类
    async handleSelectChange2(category2Id) {
      // 重新选择二级分类后面清空列表和ID
      this.category.category3Id = "";
      this.category3List = [];

      const result = await this.$API.attr.getCategorys3(category2Id);
      //   console.log(result);
      if (result.code === 200) {
        this.category3List = result.data;
      } else {
        this.$message.error("获取失败");
      }
    },
    // 获取全部的分类id  获取分类对应的属性列表  
    async handleSelectChange3(category3Id) {
      const category = {
        ...this.category,
        category3Id,
      };
    //   console.log(category);
      this.$emit("change", category);  //自定义事件传过去
    },
  },
  async mounted() {
    const result = await this.$API.attr.getCategorys1();
    // console.log(result);
    if (result.code === 200) {
      this.category1List = result.data;
    } else {
      this.$message.error("获取失败");
    }
  },
};
</script>

<style>
</style>