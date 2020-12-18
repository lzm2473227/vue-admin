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
  }
};
