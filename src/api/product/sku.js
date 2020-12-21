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
    return request.delete(`${api_name}/deleteSku/${skuId}`);
  },
  //GET /admin/product/getSkuById/{skuId}
  //sku的单个商品的信息详细展示
  getSku(skuId) {
    return request.get(`${api_name}/getSkuById/${skuId}`);
  },
  //根据SPU的id查询对应的sku列表
  getListBySpuId(spuId) {
    return request.get(`${api_name}/findBySpuId/${spuId}`);
  },
  //sku上架
  //GET /admin/product/onSale/{skuId}
  onSale(spuId) {
    return request.get(`${api_name}/onSale/${spuId}`);
  },
  //sku下架
  //GET /admin/product/cancelSale/{skuId}
  cancelSale(spuId) {
    return request.get(`${api_name}/cancelSale/${spuId}`);
  }
};
