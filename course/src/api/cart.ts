import { request } from '@/utils/request.ts';

// 购物车项接口
export interface CartItem {
  id?: number;
  userId: number;
  courseId: number;
  courseName: string;
  courseImage: string;
  courseOriginalPrice: number;
  courseDiscount: number;
  currentPrice: number;
  deleted?: number;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string | null;
  unused?: string | null;
}

// 购物车接口
export interface Cart {
  userId: number;
  itemNum: number;
  originalPrice: number;
  currentPrice: number;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string | null;
  unused?: string | null;
  cartItemList: CartItem[];
}

// 购物车响应
export interface CartResponse {
  status: number;
  message: string;
  data: Cart;
}

export const cartApi = {
  // 获取当前用户购物车
  getMyCart: () => {
    return request<Cart>({
      method: 'GET',
      url: '/cart/my'
    });
  },

  // 向购物车添加课程
  addCourseToCart: (courseId: number) => {
    return request<Cart>({
      method: 'POST',
      url: `/cart/courses/${courseId}`
    });
  },

  // 从购物车移除课程
  removeCourseFromCart: (courseId: number) => {
    return request<Cart>({
      method: 'DELETE',
      url: `/cart/courses/${courseId}`
    });
  },

  // 清空购物车
  clearCart: () => {
    return request<Cart>({
      method: 'DELETE',
      url: '/cart/clear'
    });
  }
};

// 购物车相关的成功状态码
export const cartSuccessCodes = [
  1300,   // 获取购物车信息成功
  1301,   // 创建购物车成功
  1302    // 购物车信息更新成功
];

// 购物车相关的错误状态码
export const cartErrorCodes = [
  2301,   // 商品已在购物车中
  2302    // 商品不在购物车中
]; 