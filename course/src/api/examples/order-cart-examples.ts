// 订单和购物车API使用示例
import { orderApi } from '../order';
import { cartApi } from '../cart';
import {
  OrderStatus,
  PaymentType
} from '../order';
import type {
  CreateOrderParams,
  UpdateOrderStatusParams
} from '../order';
import { successCodes } from '../../utils/request';

// ==================== 订单API示例 ====================

// 1. 获取当前用户订单列表
const handleGetMyOrders = async () => {
  try {
    const response = await orderApi.getMyOrders();
    console.log('订单列表:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取订单列表失败:', error);
  }
};

// 2. 创建新订单
const handleCreateOrder = async () => {
  const orderData: CreateOrderParams = {
    orderId: `ORDER${Date.now()}`, // 生成唯一订单号
    userId: 123, // 从JWT中获取
    status: OrderStatus.UNPAID,
    paymentType: PaymentType.ALIPAY,
    paymentPrice: 199.99,
    originalPrice: 299.99,
    couponId: 1,
    couponOwnerId: 123,
    couponPrice: 100.00,
    orderItemList: [
      {
        orderId: `ORDER${Date.now()}`,
        userId: 123,
        courseId: 101,
        courseName: "Java入门",
        courseImage: "http://example.com/java.png",
        courseOriginalPrice: 299.99,
        courseDiscount: 100.00,
        currentPrice: 199.99
      }
    ]
  };

  try {
    const response = await orderApi.createOrder(orderData);
    if (successCodes.includes(response.status)) {
      console.log('订单创建成功');
      return response.data;
    } else {
      console.error('订单创建失败:', response.message);
    }
  } catch (error) {
    console.error('创建订单失败:', error);
  }
};

// 3. 更新订单状态
const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
  const updateData: UpdateOrderStatusParams = {
    orderId,
    status: newStatus
  };

  try {
    const response = await orderApi.updateOrderStatus(updateData);
    if (successCodes.includes(response.status)) {
      console.log('订单状态更新成功');
      return response.data;
    } else {
      console.error('订单状态更新失败:', response.message);
    }
  } catch (error) {
    console.error('更新订单状态失败:', error);
  }
};

// 4. 根据订单ID查询订单详情
const handleGetOrderById = async (orderId: string) => {
  try {
    const response = await orderApi.getOrderById(orderId);
    console.log('订单详情:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取订单详情失败:', error);
  }
};

// ==================== 购物车API示例 ====================

// 1. 获取当前用户购物车
const handleGetMyCart = async () => {
  try {
    const response = await cartApi.getMyCart();
    console.log('购物车信息:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取购物车失败:', error);
  }
};

// 2. 向购物车添加课程
const handleAddCourseToCart = async (courseId: number) => {
  try {
    const response = await cartApi.addCourseToCart(courseId);
    if (successCodes.includes(response.status)) {
      console.log('课程添加成功');
      return response.data;
    } else {
      console.error('课程添加失败:', response.message);
    }
  } catch (error) {
    console.error('添加课程到购物车失败:', error);
  }
};

// 3. 从购物车移除课程
const handleRemoveCourseFromCart = async (courseId: number) => {
  try {
    const response = await cartApi.removeCourseFromCart(courseId);
    if (successCodes.includes(response.status)) {
      console.log('课程移除成功');
      return response.data;
    } else {
      console.error('课程移除失败:', response.message);
    }
  } catch (error) {
    console.error('从购物车移除课程失败:', error);
  }
};

// 4. 清空购物车
const handleClearCart = async () => {
  try {
    const response = await cartApi.clearCart();
    if (successCodes.includes(response.status)) {
      console.log('购物车清空成功');
      return response.data;
    } else {
      console.error('购物车清空失败:', response.message);
    }
  } catch (error) {
    console.error('清空购物车失败:', error);
  }
};

// ==================== 完整购物流程示例 ====================

// 完整的购物流程：添加商品到购物车 -> 创建订单 -> 支付
const handleCompleteShoppingFlow = async (courseId: number) => {
  try {
    // 1. 添加商品到购物车
    console.log('步骤1: 添加商品到购物车');
    const cartResponse = await cartApi.addCourseToCart(courseId);
    if (!successCodes.includes(cartResponse.status)) {
      throw new Error('添加商品到购物车失败');
    }

    // 2. 获取购物车信息
    console.log('步骤2: 获取购物车信息');
    const cartInfo = await cartApi.getMyCart();
    if (!cartInfo.data.cartItemList.length) {
      throw new Error('购物车为空');
    }

    // 3. 创建订单
    console.log('步骤3: 创建订单');
    const orderData: CreateOrderParams = {
      orderId: `ORDER${Date.now()}`,
      userId: 123, // 从JWT中获取
      status: OrderStatus.UNPAID,
      paymentType: PaymentType.ALIPAY,
      paymentPrice: cartInfo.data.currentPrice,
      originalPrice: cartInfo.data.originalPrice,
      orderItemList: cartInfo.data.cartItemList.map(item => ({
        orderId: `ORDER${Date.now()}`,
        userId: item.userId,
        courseId: item.courseId,
        courseName: item.courseName,
        courseImage: item.courseImage,
        courseOriginalPrice: item.courseOriginalPrice,
        courseDiscount: item.courseDiscount,
        currentPrice: item.currentPrice
      }))
    };

    const orderResponse = await orderApi.createOrder(orderData);
    if (!successCodes.includes(orderResponse.status)) {
      throw new Error('创建订单失败');
    }

    // 4. 清空购物车
    console.log('步骤4: 清空购物车');
    await cartApi.clearCart();

    console.log('购物流程完成！');
    return {
      orderId: orderData.orderId,
      totalPrice: orderData.paymentPrice
    };

  } catch (error) {
    console.error('购物流程失败:', error);
    throw error;
  }
};

// 导出所有示例函数
export {
  handleGetMyOrders,
  handleCreateOrder,
  handleUpdateOrderStatus,
  handleGetOrderById,
  handleGetMyCart,
  handleAddCourseToCart,
  handleRemoveCourseFromCart,
  handleClearCart,
  handleCompleteShoppingFlow
}; 