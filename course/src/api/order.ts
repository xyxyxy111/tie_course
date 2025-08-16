import { request } from '@/utils/request.ts';

// 订单状态枚举
export enum OrderStatus {
  CANCELLED = 1,    // 已取消
  UNPAID = 2,       // 未支付
  PAID = 3,         // 已付款
  REFUNDING = 4,    // 退款中
  REFUNDED = 5      // 已退款
}

// 支付方式枚举
export enum PaymentType {
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  BANK = 'bank'
}

// 微信支付状态枚举
export enum WechatTradeState {
  SUCCESS = 'SUCCESS',     // 支付成功
  REFUND = 'REFUND',       // 转入退款
  NOTPAY = 'NOTPAY',       // 未支付
  CLOSED = 'CLOSED',       // 已关闭
  REVOKED = 'REVOKED',     // 已撤销
  USERPAYING = 'USERPAYING', // 用户支付中
  PAYERROR = 'PAYERROR'    // 支付失败
}

// 订单项接口
export interface OrderVO {
  id?: number;
  orderId: number;
  userId: number;
  courseId: number;
  courseName: string;
  courseImage: string;
  courseOriginalPrice: number;
  courseDiscount: number;
  currentPrice: number;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string | null;
  unused?: string;
}

// 订单接口
export interface Order {
  id?: number;
  orderId: number;
  userId: number;
  status: OrderStatus;
  paymentType: PaymentType;
  paymentTime?: string;
  paymentPrice: number;
  originalPrice: number;
  couponId?: number;
  couponOwnerId?: number;
  couponPrice?: number;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string | null;
  unused?: string;
  orderItemList: OrderVO[];
}

// 微信支付订单响应数据
export interface WechatOrderResponseData {
  orderId: string;
  codeUrl?: string;        // 二维码链接
  formHtml?: string;       // 表单HTML
  tradeState?: WechatTradeState;
  tradeStateDesc?: string;
}

// 创建订单请求参数
export interface CreateOrderParams {
  orderId: number;
  userId: number;
  status: OrderStatus;
  paymentType: PaymentType;
  paymentTime?: string;
  paymentPrice: number;
  originalPrice: number;
  couponId?: number;
  couponOwnerId?: number;
  couponPrice?: number;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string | null;
  unused?: string;
  orderItemList: OrderVO[];
}

// 更新订单状态请求参数
export interface UpdateOrderStatusParams {
  orderId: string;
  status: OrderStatus;
}

// 微信支付创建订单参数
export interface CreateWechatOrderParams {
  userId: string | null;
  paymentPrice: number;
  orderItemList: Array<{
    courseId: string;
    courseName: string;
    coursePrice: number;
    courseImage: string;
  }>;
}

// 微信支付退款参数
export interface WechatRefundParams {
  orderId: string;
  reason?: string;
}

// 订单列表响应
export interface OrderListResponse {
  status: number;
  message: string;
  data: Order[];
}

// 单个订单响应
export interface OrderResponse {
  status: number;
  message: string;
  data: Order;
}

// 微信支付订单响应
export interface WechatOrderResponse {
  status: number;
  message: string;
  data: WechatOrderResponseData;
}

// 订单操作响应
export interface OrderOperationResponse {
  status: number;
  message: string;
  data: null;
}

export const orderApi = {
  // 获取当前用户订单列表
  getMyOrders: () => {
    return request<Order[]>({
      method: 'GET',
      url: '/order/myorders'
    });
  },

  // 新建订单
  createOrder: (data: CreateOrderParams) => {
    return request<null>({
      method: 'POST',
      url: '/order/insert',
      data
    });
  },

  // 更新订单状态
  updateOrderStatus: (data: UpdateOrderStatusParams) => {
    return request<null>({
      method: 'POST',
      url: '/order/update',
      data
    });
  },

  // 根据订单ID查询订单详情
  getOrderById: (orderId: string) => {
    return request<Order>({
      method: 'GET',
      url: `/order/single/${orderId}`
    });
  },

  // 创建微信支付订单
  createWechatOrder: (data: CreateWechatOrderParams) => {
    return request<WechatOrderResponseData>({
      method: 'POST',
      url: '/api/pay/wechat/create',
      data
    });
  },

  // 查询微信支付订单状态
  queryWechatOrderStatus: (orderId: string) => {
    return request<{
      tradeState: WechatTradeState;
      tradeStateDesc: string;
    }>({
      method: 'GET',
      url: `/api/pay/wechat/status/${orderId}`
    });
  },

  // 关闭微信支付订单
  closeWechatOrder: (orderId: string) => {
    return request<null>({
      method: 'POST',
      url: `/api/pay/wechat/close/${orderId}`
    });
  },

  // 微信支付退款
  refundWechatOrder: (data: WechatRefundParams) => {
    return request<null>({
      method: 'POST',
      url: '/api/pay/wechat/refund',
      data
    });
  },

  // 取消订单
  cancelOrder: (orderId: string) => {
    return request<null>({
      method: 'POST',
      url: `/order/cancel/${orderId}`
    });
  },

  // 申请退款
  applyRefund: (orderId: string, reason: string) => {
    return request<null>({
      method: 'POST',
      url: '/order/refund',
      data: { orderId, reason }
    });
  }
};

// 订单相关的成功状态码
export const orderSuccessCodes = [
  1200,   // 获取订单信息成功
  1201,   // 获取订单列表信息成功
  1202,   // 订单创建成功
  1204,   // 订单状态更新成功
  1209,   // 退款申请成功
  1210    // 微信支付订单创建成功
];

// 订单相关的错误状态码
export const orderErrorCodes = [
  2200,   // 订单号错误
  2202,   // 订单内容不能为空
  2203,   // 订单创建失败
  2204,   // 订单状态更新失败
  2209,   // 退款申请失败
  2210    // 微信支付订单创建失败
];

// 微信支付相关状态码
export const wechatPayCodes = {
  SUCCESS: 1210,       // 微信支付成功
  USERPAYING: 1211,    // 用户支付中
  FAIL: 2210,          // 微信支付失败
  CLOSED: 2211         // 订单已关闭
};