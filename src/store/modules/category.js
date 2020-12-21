import { Message } from "element-ui";
import * as API from "@/api";

export default {
  namespaced: true,
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  actions: {
    //获取一级分类列表
    async getCategory1List({ commit }) {
      const result = await API.attr.getCategorys1();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", result.data);
      } else {
        Message.error("获取失败");
      }
    },
    //获取二级分类
    async getCategory2List({ commit }, category1Id) {
      // 重新选择一级分类后面清空列表和ID
      //   this.category2List = [];
      //   this.category3List = [];
      //   this.category.category3Id = "";
      //   this.category.category2Id = "";
      const result = await API.attr.getCategorys2(category1Id);
      if (result.code === 200) {
        commit("GET_CATEGORY2_LIST_SUCCESS", {
          category2List: result.data,
          category1Id
        });
      } else {
        commit("GET_CATEGORY2_LIST_ERROR", category1Id);
        Message.error("获取失败");
      }
      //清空列表    全局事件总线这咯要加$bus
      //   this.$bus.$emit("clearList");
    },
    // 获取三级分类
    async getCategory3List({ commit }, category2Id) {
      // 重新选择二级分类后面清空列表和ID
      //   this.category.category3Id = "";
      //   this.category3List = [];

      const result = await API.attr.getCategorys3(category2Id);
      if (result.code === 200) {
        commit("GET_CATEGORY3_LIST_SUCCESS", {
          category3List: result.data,
          category2Id
        });
      } else {
        commit("GET_CATEGORY3_LIST_ERROR", category2Id);
        Message.error("获取失败");
      }
      //清空列表
      //   this.$bus.$emit("clearList");
    }
  },
  mutations: {
    GET_CATEGORY1_LIST(state, category1List) {
      // 获取1级分类列表（此时还未选择1级分类）
      state.category1List = category1List;
    },
    GET_CATEGORY2_LIST_SUCCESS(state, { category2List, category1Id }) {
      // 获取2级分类列表（此时选择了1级分类， 清空2级和3级分类）
      state.category2List = category2List;
      state.category.category1Id = category1Id;
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      state.category.category1Id = category1Id;
      state.category3List = [];
      state.category2List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_SUCCESS(state, { category2Id, category3List }) {
      state.category3List = category3List;
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      state.category.category2Id = category2Id;
      state.category3List = [];
      state.category.category3Id = "";
    },
    SET_CATEGORY3_ID(state, category3Id) {
      state.category.category3Id = category3Id;
    },
    RESET_CATEGORY_ID(state) {
      state.category.category1Id = "";
      state.category.category2Id = "";
      state.category.category3Id = "";
    }
  },
  getters: {}
};
