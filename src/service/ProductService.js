import axios from "axios";
import { URL } from "../constant";
import { getErrorFromResponse, header } from "../utils";
const ProductService = {
    async findProduct(productFilter) {
        try {
            const response = await axios.get(URL + '/v1/api/public/product', {
                params: {
                  productType: productFilter?.productType,
                  productName: productFilter?.productName,
                  minPrice: productFilter?.minPrice,
                  maxPrice: productFilter?.maxPrice,
                  storeName: productFilter?.storeName,
                  ownerStoreUsername: productFilter?.ownerStoreUsername,
                  page: productFilter?.page,
                  size: productFilter?.size,
                  sort: productFilter?.sort,
                },
                headers: header(),
              });              
            return response.data;
        } catch (error) {
            getErrorFromResponse(error);
        }
    },

    async getProductType(){
        try{
            const response = await axios.get(URL + '/v1/api/public/product/type', {});
            return response.data;
        }catch(error){
            getErrorFromResponse(error)
        }
    }
}

export default ProductService;