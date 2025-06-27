import { ref, computed } from 'vue';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { orderApi } from '@/api/order';
import type { OrderVO } from '@/api/order';

// 共享的响应式数据
const orders = ref<OrderVO[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const userId = ref<string | null>(null);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const totalOrders = ref(0);

// 筛选相关
const selectedStatus = ref<string>('all'); // all, pending, paid, completed, cancelled
const selectedTimeRange = ref<string>('all'); // all, week, month, year

// 共享的订单数据逻辑
export const useOrderData = () => {
  const initializeData = async () => {
    // 获取userId
    const token = getValidToken();
    if (token) {
      userId.value = getCurrentUserId();
    }

    if (!userId.value) {
      error.value = '请先登录';
      return;
    }

    await fetchOrders();
  };

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await orderApi.getMyOrders({
        page: currentPage.value,
        pageSize: pageSize.value,
        status: selectedStatus.value === 'all' ? undefined : selectedStatus.value,
        timeRange: selectedTimeRange.value === 'all' ? undefined : selectedTimeRange.value
      });

      if (response.code === 200) {
        orders.value = response.data.content;
        totalPages.value = response.data.totalPages;
        totalOrders.value = response.data.totalElements;
      } else {
        error.value = response.message || '获取订单列表失败';
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取订单列表失败';
      console.error('获取订单列表失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
    fetchOrders();
  };

  const handleStatusFilter = (status: string) => {
    selectedStatus.value = status;
    currentPage.value = 1;
    fetchOrders();
  };

  const handleTimeRangeFilter = (timeRange: string) => {
    selectedTimeRange.value = timeRange;
    currentPage.value = 1;
    fetchOrders();
  };

  const cancelOrder = async (orderId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await orderApi.cancelOrder(orderId);
      if (response.code === 200) {
        // 重新获取订单列表
        await fetchOrders();
      } else {
        error.value = response.message || '取消订单失败';
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '取消订单失败';
      console.error('取消订单失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const confirmReceipt = async (orderId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await orderApi.confirmReceipt(orderId);
      if (response.code === 200) {
        // 重新获取订单列表
        await fetchOrders();
      } else {
        error.value = response.message || '确认收货失败';
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '确认收货失败';
      console.error('确认收货失败:', err);
    } finally {
      loading.value = false;
    }
  };

  const applyRefund = async (orderId: string, reason: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await orderApi.applyRefund({
        orderId,
        reason
      });
      if (response.code === 200) {
        // 重新获取订单列表
        await fetchOrders();
      } else {
        error.value = response.message || '申请退款失败';
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || '申请退款失败';
      console.error('申请退款失败:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    loading,
    error,
    userId,
    currentPage,
    pageSize,
    totalPages,
    totalOrders,
    selectedStatus,
    selectedTimeRange,
    initializeData,
    fetchOrders,
    handlePageChange,
    handleStatusFilter,
    handleTimeRangeFilter,
    cancelOrder,
    confirmReceipt,
    applyRefund
  };
};

// 共享的工具函数
export const useOrderUtils = () => {
  // 格式化订单状态
  const formatOrderStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待付款',
      'PAID': '已付款',
      'COMPLETED': '已完成',
      'CANCELLED': '已取消',
      'REFUNDING': '退款中',
      'REFUNDED': '已退款'
    };
    return statusMap[status] || status;
  };

  // 获取订单状态颜色
  const getOrderStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'PENDING': '#ff9500',
      'PAID': '#007aff',
      'COMPLETED': '#34c759',
      'CANCELLED': '#ff3b30',
      'REFUNDING': '#ff9500',
      'REFUNDED': '#8e8e93'
    };
    return colorMap[status] || '#8e8e93';
  };

  // 格式化价格
  const formatPrice = (price: number) => {
    return `US$${price.toFixed(2)}`;
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化订单号
  const formatOrderNumber = (orderNumber: string) => {
    return orderNumber.replace(/(.{4})/g, '$1 ').trim();
  };

  // 计算订单总价
  const calculateOrderTotal = (order: OrderVO) => {
    return order.orderItems?.reduce((total, item) => total + item.currentPrice, 0) || 0;
  };

  // 计算订单原价总和
  const calculateOrderOriginalTotal = (order: OrderVO) => {
    return order.orderItems?.reduce((total, item) => total + item.originalPrice, 0) || 0;
  };

  // 检查订单是否可以取消
  const canCancelOrder = (order: OrderVO) => {
    return order.status === 'PENDING' || order.status === 'PAID';
  };

  // 检查订单是否可以确认收货
  const canConfirmReceipt = (order: OrderVO) => {
    return order.status === 'PAID';
  };

  // 检查订单是否可以申请退款
  const canApplyRefund = (order: OrderVO) => {
    return order.status === 'PAID' || order.status === 'COMPLETED';
  };

  return {
    formatOrderStatus,
    getOrderStatusColor,
    formatPrice,
    formatTime,
    formatOrderNumber,
    calculateOrderTotal,
    calculateOrderOriginalTotal,
    canCancelOrder,
    canConfirmReceipt,
    canApplyRefund
  };
};

// 导出静态数据
export const orderStatusOptions = [
  { value: 'all', label: '全部订单' },
  { value: 'PENDING', label: '待付款' },
  { value: 'PAID', label: '已付款' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
  { value: 'REFUNDING', label: '退款中' },
  { value: 'REFUNDED', label: '已退款' }
];

export const timeRangeOptions = [
  { value: 'all', label: '全部时间' },
  { value: 'week', label: '最近一周' },
  { value: 'month', label: '最近一个月' },
  { value: 'year', label: '最近一年' }
]; 