import { useEffect, useState } from "react";
import { UserVoucherResponse } from "../../interfaces/interface";
import http from "../../utils/http";
import { apiRoutes } from "../../routes/api";
import { convertToVietnamTime, handleErrorResponse } from "../../utils";
import { Button, Col, Modal, Row } from "antd";


interface UserVoucherProps {
    productId: string;
    open: boolean;
    setOpen: (value: boolean) => void;
    setVoucher: (value: UserVoucherResponse) => void;
}

const SelectVoucherModel = ({ open, setOpen, setVoucher, productId }: UserVoucherProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [voucherList, setVoucherList] = useState<UserVoucherResponse[]>([]);
    const getProductVoucher = async (productId: string) => {
        try {
            setLoading(true);
            const response = await http.get(`${apiRoutes.voucher}/user/voucher`, {
                params: {
                    productId: productId
                }
            });
            const datas = response.data?.data as UserVoucherResponse[];
            setVoucherList(datas);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(productId) {
            getProductVoucher(productId);
        }
    }, [productId])
    return (
        <Modal title='Chọn mã giảm giá' open={open} onCancel={() => setOpen(false)}>
            <Row>
                {voucherList.map((voucher: UserVoucherResponse) => {
                    return (
                        <Col span={24} className="flex justify-between">
                            <Row className="p-5 w-10/12 flex items-center">
                                <Col lg={24}>
                                    {voucher.voucherStoreName}
                                </Col>
                                <Col lg={24}>
                                    {convertToVietnamTime(voucher.dayToExpireTime)}
                                </Col>
                            </Row>
                            <Row className="flex items-center">
                                <Button onClick={() => setVoucher(voucher)}>
                                    Sử dụng
                                </Button>
                            </Row>
                        </Col>
                    )
                })}
            </Row>
        </Modal>
    )
}

export default SelectVoucherModel;