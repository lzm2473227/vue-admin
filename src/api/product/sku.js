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
//查询sku单个的详细信息
  getSku (skuId) {
    return request.get(`/admin/product/getSkuById/${skuId}`)
  },
};
