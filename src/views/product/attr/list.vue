<template>
  <div>
    <!-- 这个组件和list子父关系，用自定义事件方便 -->
    <!-- <Category @change="getAttrList" @clearList="clearList" /> -->

    <!-- 全局事件总线 -->
    <Category @change="getAttrList" @clearList="clearList" />

    <el-card v-show="isShowList" class="box-card" style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!category.category3Id"
        @click="add"
        >添加属性</el-button
      >

      <el-table :data="attrList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>

        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              type="warning"
              v-for="attrVal in row.attrValueList"
              :key="attrVal.id"
            >
              {{ attrVal.valueName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template v-slot="{ row }">
            <el-button
              @click="updata(row)"
              type="warning"
              size="mini"
              icon="el-icon-edit "
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-show="!isShowList" style="margin-top: 20px">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>

      <el-button
        type="primary"
        round
        icon="el-icon-plus"
        @click="attrAddValue"
        :disabled="!attr.attrName"
        >添加属性值</el-button
      >
      <el-button round>取消</el-button>
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <!-- 
             事件修饰符：
                .native
                专门给组件绑定事件使用的
                会给组件中的第一个标签绑定相应的原生DOM事件
          -->
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editCom(row, $index)"
              @keyup.enter.native="editCom(row, $index)"
              ref="input"
              size="mini"
            ></el-input>
            <span
              style="display: block; width: 100%"
              v-else
              @click="edit(row)"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              :title="`确定删除${row.valueName}吗？`"
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
      <el-button round type="primary" @click="save">保存</el-button>
      <el-button round @click="isShowList = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category";
export default {
  name: "AttrList",
  data() {
    return {
      attrList: [], //全部的数据
      isShowList: true, //页面切换的开关
      attr: {
        attrName: "",
        attrValueList: [],
      },
      category: {
        category3Id: "",
      },
    };
  },

  methods: {
    //清空列表的数据
    clearList() {
      this.attrList = [];
      //   禁用按钮
      this.category.category3Id = "";
    },
    //添加属性列表
    add() {
      this.isShowList = false;
      this.attr.attrName = "";
      this.attr.attrValueList = [];
      //   id也要清空
      this.attr.id = "";
    },
    //如果是空没有valueName，就直接把自己删掉
    editCom(row, index) {
      if (!row.valueName) {
        this.attr.attrName.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    //添加后保存
    async save() {
      // 添加  需要判断它的id，没有id才是新添加的
      const isAdd = !this.attr.id;
      const data = this.attr;
      if (isAdd) {
        // this.attr里面只有attrName和attrValueList
        // 还需要categoryId和categoryLevel
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      // 修改    就直接修改
      const result = await this.$API.attr.saveAttrInfo(data);
      if (result.code === 200) {
        this.$message.success("更新成功");
        //保存后页面切换回去
        this.isShowList = true;
        this.getAttrList(this.category);
      } else {
        this.$message.error(result.message);
      }
    },
    //删除对应下标的商品
    delAttrList(index) {
      this.attr.attrValueList.splice(index, 1);
    },
    //添加新的值
    attrAddValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    updata(attr) {
      //   this.attr = {
      //     ...attr,
      //   };
      //这里用深度克隆，这样就会防止对象中对象还有引用关系
      this.attr = JSON.parse(JSON.stringify(attr));
      this.isShowList = false;
    },
    async getAttrList(category) {
      this.category = category;
      const result = await this.$API.attr.getAttrList(category);
      console.log(result);
      if (result.code === 200) {
        this.attrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  //全局事件总线
  mounted() {
    this.$bus.$on("change", this.getAttrList);
    this.$bus.$on("clearList", this.clearList);
  },
  //全局事件总线一定要记得收尾，解绑这些事件
  beforeDestroy() {
    this.$bus.$off("change", this.handleCategoryChange);
    this.$bus.$off("clearList", this.clearList);
  },
  components: {
    Category,
  },
};
Category;
</script>
