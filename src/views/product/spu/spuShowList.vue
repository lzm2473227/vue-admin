<template>
  <el-card class="box-card" style="margin-top: 20px">
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>

    <el-table :data="[]" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="attrName" label="SPU名称"> </el-table-column>

      <el-table-column prop="attrName" label="SPU描述"> </el-table-column>

      <el-table-column label="操作">
        <template>
          <el-button type="primary" size="mini" icon="el-icon-plus"></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button type="info" size="mini" icon="el-icon-info"></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",
};
</script>

<style>
</style>