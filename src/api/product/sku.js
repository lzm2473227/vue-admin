import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //请求SKU数据
  saveSku(sku) {
    return request({
      url: `${api_name}/saveSkuInfo`,
      method: "POST",
      data: sku
    });
  },
  //sku的分页数据获取
  skuPageList(page, limit) {
    return request({
      url: `${api_name}/list/${page}/${limit}`,
      method: "GET"
    });
  },
  //删除指定id的sku
  skuRemove(skuId) {
    return request.delete(`/admin/product/deleteSku/${skuId}`);
  },
  //根据SPU的id查询对应的sku列表
  getListBySpuId(spuId) {
    return request.get(`/admin/product/findBySpuId/${spuId}`);
  }
};
