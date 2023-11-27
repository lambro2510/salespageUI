import { useEffect, useState } from "react";
import ProfileCard from "../profile/ProfileCard";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { handleErrorResponse } from "../../utils";
import ListProduct from "./ListProduct";
import { Product } from "../../interfaces/models/product";
import { ProductDataResponse, ProductInfoResponse } from "../../interfaces/interface";
import Carousel from "../layout/Carousel";
import { ProCard } from "@ant-design/pro-components";
import { Col, Divider, Row, Space } from "antd";
import HomeBanner from "./HomeBanner";
import ListCategories from "./Category";
import HotProduct from "./HotProduct";
import ListCardProduct from "./ListCardProduct";
import ListHotStore from "./ListHotStore";
import FooterBanner from "./FooterBanner";
import Support from "./Support";
import BasePageContainer from "../layout/PageContainer";
import ListReview from "./ListProduct";

const imageUrls = [
    "https://cf.shopee.vn/file/vn-50009109-2eb798374b65de905510aa91380aaf62_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-3b4844af326ff3b9c1e1793d0dbda9f3_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-31751216f4ecebd91cd98b2aabe69c70_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-1f18bb1d3f752570668b28ee92501320_xxhdpi",
    "https://cf.shopee.vn/file/vn-50009109-0fffe0b1b0b7e9af17ad1e53346f4311_xhdpi"
]
const Home = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [hotProducts, setHotProducts] = useState<ProductDataResponse[]>([]);
    const [allProducts, setAllProduct] = useState<ProductDataResponse[]>([]);
    const [saleProducts, setSaleProducts] = useState<[]>([]);
    const [suggestProduct, setSuggestProduct] = useState<[]>([]);

    const loadHotProduct = async () => {
        await http.get(`${apiRoutes.products}/hot-product`)
            .then((response) => {
                setHotProducts(response?.data?.data as ProductDataResponse[]);
            })
            .catch((err) => {
                handleErrorResponse(err);
            })
    }

    const loadAllProduct = async () => {
        try {
            const response = await http.get(`${apiRoutes.products}`);
            setAllProduct(response?.data?.data?.data)
        } catch (error) {
            handleErrorResponse(error);
        }
    }

    useEffect(() => {
        Promise.all([loadHotProduct()])
            .then(() => {
                setLoading(false)
            })
            .catch((error) => {
                handleErrorResponse(error);
            });
        loadAllProduct();
    }, []);

    return (
        <BasePageContainer loading={loading}>
            <Row className="bg-base">
                <Col span={24}>
                    <HomeBanner />
                </Col>
                <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <ListCategories />
                </Col>
                <Divider className="mb-20" />
                <Col span={24}>
                    <h1 className="text-center">Khuyến mãi Giới hạn</h1>
                </Col>
                <Col span={24} className="">
                    <h2 className="text-center">Flash Sale</h2>
                </Col>
                <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <HotProduct />
                </Col>
                <Divider className="mb-20" />
                <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <ListCardProduct products={hotProducts} />
                </Col>
                <Col span={24} style={{ paddingRight: '5%', paddingLeft: '5%' }}>
                    <ListHotStore />
                </Col>
                <Col span={24} style={{ marginTop: '2%', paddingRight: '15%', paddingLeft: '15%' }}>
                    <FooterBanner />
                </Col>
                <Col  span={24} style={{ marginTop: '2%', paddingRight: '5%', paddingLeft: '5%' }}>
                    <Support />
                </Col>
                <Col span={24}>
                    <ListReview />
                </Col>

            </Row>
        </BasePageContainer>
    )
}

export default Home;