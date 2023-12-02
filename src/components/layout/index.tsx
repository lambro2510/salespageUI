import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { webRoutes } from '../../routes/web';
import { Badge, Button, Col, Popover, Input, Menu, Row, Typography, Dropdown, Card, Modal } from 'antd';
import { ProLayout, ProLayoutProps } from '@ant-design/pro-components';
import Icon, { LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { memo, useEffect, useState } from 'react';
import { sidebar } from './sidebar';
import { apiRoutes } from '../../routes/api';
import http from '../../utils/http';
import { handleErrorResponse } from '../../utils';
import { RiShieldUserFill } from 'react-icons/ri';
import { BiCart, BiNotification, BiSearch } from 'react-icons/bi';
import { MdOutlineNotificationsNone } from "react-icons/md";
import { RootState } from '../../store';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { ImProfile } from 'react-icons/im';
import { CartResponse, NotificationDetailResponse, NotificationResponse } from '../../interfaces/interface';
import { modalState } from '../../interfaces/models/data';
const { Title, Text } = Typography;
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  const [cartItems, setCartItems] = useState<CartResponse[]>([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [modalProps, setModalProps] = useState<modalState>(
    {
      isOpen: false,
      title: '',
      content: ''
    }
  )
  const defaultProps: ProLayoutProps = {
    title: CONFIG.appName,
    logo: '/icon.png',
    fixedHeader: true,
    fixSiderbar: true,
    layout: CONFIG.theme.sidebarLayout,
    route: {
      routes: sidebar,
    },
  };



  const logoutAdmin = () => {
    dispatch(logout());
    // navigate(webRoutes.login, {
    //   replace: true,
    // });
    // http.post(apiRoutes.logout).catch((error) => {
    //   handleErrorResponse(error);
    // });
  };

  const getNotification = async () => {
    try {
      const response = await http.get(`${apiRoutes.notification}/NOT_SEEN`, {
        params: {
          page: 0,
          size: 10
        }
      });
      setNotifications(response.data.data?.data);
    } catch (err) {
      handleErrorResponse(err)
    }
  };

  const getNotificationDetail = async (id: string) => {
    try {
      const response = await http.get(`${apiRoutes.notification}/detail`, {
        params: {
          notificationId: id,
        }
      });
      const responseData = response.data.data as NotificationDetailResponse;
      setModalProps({
        isOpen: true,
        title: responseData.title,
        content: responseData.content,
        createdAt: responseData.created
      })
    } catch (err) {
      handleErrorResponse(err)
    }
  };

  const getCart = async () => {
    try {
      const response = await http.get(`${apiRoutes.cart}/all`, {
        params: {
          page: 0,
          size: 10
        }
      });
      setCartItems(response.data.data.data)
    } catch (err) {
      handleErrorResponse(err)
    }
  };

  useEffect(() => {
    if (auth) {
      getCart();
      getNotification();

      const intervalId = setInterval(() => {
        getCart();
        getNotification();
      }, 3000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [auth]);



  const renderNotifiMenu = () => {
    return (

      <Popover
        content={
          <div className='max-w-xs'>
            {notifications.map((notify: NotificationResponse) => (
              <div className='flex items-center cursor-pointer pt-3 pb-3 hover:bg-card w-full' onClick={() => getNotificationDetail(notify.id)}>
                <Text key={notify.id} className='m-auto pl-1 line-clamp-1 w-full'>{notify.title}</Text>
              </div>
            ))}
          </div>
        }
        trigger={["hover", "click"]}
      >
        <Badge count={notifications.length}>
          <MdOutlineNotificationsNone className="m-1 text-lg" />
        </Badge>
      </Popover>
    );
  };

  const renderCardMenu = () => {
    return (
      <div className='flex justify-center items-center' onClick={() => navigate(`${webRoutes.cart}`)} >
        <Popover
          content={
            <div className='max-w-xs'>
              {cartItems.map((cart: CartResponse) => (
                <div className='flex items-center cursor-pointer  pt-3 pb-3 hover:bg-card w-full'>
                  <Text key={cart.cartId} className='m-auto pl-1 line-clamp-1 w-full'>{cart.productName}</Text>
                </div>
              ))}
            </div>
          }
          trigger={["hover", "click"]}
        >
          <Badge count={cartItems.length}>
            <BiCart className='mr-2 ml-3 text-xl' onClick={() => navigate(`${webRoutes.cart}`)} />
          </Badge>
        </Popover>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <footer style={{ backgroundColor: "#f6f6f6", padding: "50px 0", color: "black" }}>
        <Row gutter={[0, 32]}>
          <Col xs={24} lg={8}>
            <Col span={24}>
              <Title level={3} className='text-center mb-10'>E-web</Title>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>E-web nơi bạn có thể giao dịch mọi thứ</Text>
            </Col>
          </Col>
          <Col xs={24} lg={4}>
            <Col span={24}>
              <Title level={3} className='text-center mb-10'>Giới thiệu</Title>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Về tôi</Text>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Trung tâm giúp đỡ</Text>
            </Col>
          </Col>
          <Col xs={24} lg={4}>
            <Col span={24}>
              <Title level={3} className='text-center mb-10'>Người dùng</Title>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Thành viên</Text>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Khuyến mãi</Text>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Tài khoản</Text>
            </Col>
          </Col>
          <Col xs={24} lg={4}>
            <Col span={24}>
              <Title level={3} className='text-center mb-10'>Trợ giúp</Title>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Liên lạc</Text>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Phương thức thanh toán</Text>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Cửa hàng</Text>
            </Col>
          </Col>
          <Col xs={24} lg={4}>
            <Col span={24}>
              <Title level={3} className='text-center mb-10'>FAQ</Title>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Người dùng</Text>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Hệ thống</Text>
            </Col>
            <Col span={24} className='flex justify-center'>
              <Text className='mb-5'>Hướng dẫn</Text>
            </Col>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: "20px" }}>
          <Col>
            <a href="/">
              <FacebookOutlined style={{ fontSize: "24px", margin: "0 10px" }} />
            </a>
            <a href="/">
              <TwitterOutlined style={{ fontSize: "24px", margin: "0 10px" }} />
            </a>
            <a href="/">
              <InstagramOutlined style={{ fontSize: "24px", margin: "0 10px" }} />
            </a>
            <a href="/">
              <YoutubeOutlined style={{ fontSize: "24px", margin: "0 10px" }} />
            </a>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: "20px" }}>
          <Col>
            <Text style={{ color: "#8c8c8c" }}>
              © {new Date().getFullYear()} Đồ án tốt nghiệp demo sản phẩm
            </Text>
          </Col>
        </Row>
      </footer>
    )
  }
  return (
    <div className="h-screen">
      <ProLayout
        {...defaultProps}
        token={{
          sider: {
            colorMenuBackground: '#f5f5f5',
          },
          header: {
            colorBgHeader: 'primary'
          }
        }}
        location={location}
        onMenuHeaderClick={() => navigate(webRoutes.home)}
        menuItemRender={(item, dom) => (
          <a
            onClick={(e) => {
              e.preventDefault();
              item.path && navigate(item.path);
            }}
            href={item.path}
          >
            {dom}
          </a>
        )}
        avatarProps={{
          src: auth ? auth.imgUrl : '',
          className: 'bg-primary bg-opacity-20 text-primary text-opacity-90',
          size: 'small',
          shape: 'square',
          title: auth ? (!isMobile ? auth.username : '') : 'Đăng nhập',

          render: (_, dom) => {
            if (auth) {
              return (
                <div className='hover:bg-inherit'>
                  <div className='flex justify-around items-center'>
                    <Input
                      placeholder='Tìm kiếm...'
                      size='small'
                      prefix={<BiSearch />}
                      style={{ maxWidth: 200 }}
                    />
                    {renderNotifiMenu()}
                    {renderCardMenu()}
                  </div>
                  <Dropdown
                  className='pl-3'
                    menu={{
                      items: [
                        {
                          key: 'profile',
                          icon: <ImProfile />,
                          label: 'Tài khoản',
                          onClick: () => {
                            navigate(webRoutes.profile);
                          },
                        },
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: 'Đăng xuất',
                          onClick: () => {
                            logoutAdmin();
                          },
                        },
                      ],
                    }}
                  >
                    {dom}
                  </Dropdown>
                </div>
              );
            } else {
              return (
                <div>
                  <div className='flex justify-around items-center'>
                    <Input
                      placeholder='Tìm kiếm...'
                      size='small'
                      prefix={<BiSearch />}
                      style={{ maxWidth: 200 }}
                    />

                    {renderNotifiMenu()}
                    {renderCardMenu()}
                  </div>
                  <Button onClick={() => navigate(`${webRoutes.login}`)} style={{ border: 'none', boxShadow: 'none' }}>Đăng nhập</Button>
                </div>

              )
            }
          },
        }}
        footerRender={renderFooter}
      >
        <Outlet />
        <Modal
          className='m-auto'
          title={modalProps.title}
          centered
          open={modalProps.isOpen}
          okType='primary'
          closable={false}
          footer={[
            <div className='flex justify-center' key="modal-footer">
              <Button
                key="submit"
                type="primary"
                onClick={() => setModalProps({ isOpen: false })}
              >
                Xác nhận
              </Button>
            </div>
          ]}
        >
          <div className="p-4">
            <Text>{modalProps.content}</Text>
            <br />
            <Text>{modalProps.createdAt?.toString()}</Text>
          </div>
        </Modal>
      </ProLayout>
    </div>
  );
};

export default memo(Layout);
