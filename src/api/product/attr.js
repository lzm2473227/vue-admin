import request from "@/utils/request";

const api_name = "/admin/product";
export default {
  //获取一级分类列表
  getCategorys1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  },

  //获取二级分类列表
  getCategorys2(category1Id) {
    return request({
      // url地址上模板字符串$前面一定要加/,要不然请求会报404
      //   url: `${api_name}/getCategory2${category1Id}`,
      url: `${api_name}/getCategory2/${category1Id}`,
      method: "GET"
    });
  },
  //获取三级分类列表
  getCategorys3(category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: "GET"
    });
  },
  //获取分类对应的属性列表
  getAttrList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },

  //删除对应的商品
  deleteList(attrId) {
    return request({
      url: `${api_name}/attrInfoList/${attrId}`,
      method: "DELETE"
    });
  },
  //更新保存商品
  saveAttrInfo(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data: attr
    });
  },

  //获取属性对应数据的列表
  getAttrValueList(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    });
  }
};
