import { request } from '@/utils/request.ts';

// 订单状态枚举
export enum OrderStatus {
  CANCELLED = 1,    // 已取消
  UNPAID = 2,       // 未支付
  PAID = 3          // 已付款
}

// 支付方式枚举
export enum PaymentType {
  ALIPAY = 'alipay',
  WECHAT = 'wechat',
  BANK = 'bank'
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
  }
};

// 订单相关的成功状态码
export const orderSuccessCodes = [
  1200,   // 获取订单信息成功
  1201,   // 获取订单列表信息成功
  1202,   // 订单创建成功
  1204    // 订单状态更新成功
];

// 订单相关的错误状态码
export const orderErrorCodes = [
  2200,   // 订单号错误
  2202    // 订单内容不能为空
]; 