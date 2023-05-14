import axios from "axios";
import { URL } from "../constant";
import { getErrorFromResponse, Authorization, MultipartAuthorization } from "../utils";
const ProductService = {
    async findProduct(productFilter) {
        try {
            const response = await axios.get(URL + '/v1/api/public/product', {
                params: {
                    productId: productFilter?.productId,
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
                headers: Authorization(),
            });
            return response.data;
        } catch (error) {
            getErrorFromResponse(error);
        }
    },

    async updateProduct(product) {
        try {
            const response = await axios.put(URL + '/v1/api/product', {
                productName: product?.productName,
                description: product?.description,
                type: product?.type,
                productPrice: product?.productPrice,
                sellingAddress: product?.sellingAddress,
                storeId: product?.storeId,
                imageUrl: product?.imageUrl,
                productId: product?.productId
            }, {
                headers: Authorization()
            });
            return response?.data;
        } catch (error) {
            getErrorFromResponse(error);
        }
    },

    async getProductType() {
        try {
            const response = await axios.get(URL + '/v1/api/public/product/type', {});
            return response.data;
        } catch (error) {
            getErrorFromResponse(error)
        }
    },

    async getProductDetail(productId) {
        try {
            const response = await axios.get(URL + '/v1/api/public/product/detail' + `?productId=${productId}`, {});
            return response.data;
        } catch (error) {
            getErrorFromResponse(error)
        }
    },

    async uploadProductImage(productId, files) {
        try {
            const response = await axios.post(
                URL + '/v1/api/product/upload-images' + `?productId=${productId}`,
                files,
                {
                    headers: { ...Authorization(), 'Content-Type': 'multipart/form-data' }
                }
            );
            return response.data;
        } catch (error) {
            getErrorFromResponse(error)
        }
    },

    async deleteProductImages(productId, listImage) {
        try {
            const response = await axios.delete(URL + '/v1/api/product/delete-images' + `?productId=${productId}`, 
            listImage,
            {
                headers: Authorization()
            });
            return response?.data;
        } catch (error) {
            getErrorFromResponse(error);
        }
    }

}

export default ProductService;