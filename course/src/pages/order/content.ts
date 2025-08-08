import { ref, computed } from 'vue';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { orderApi } from '@/api/order';
import type { OrderVO, Order } from '@/api/order';
// 购物车数据
const cartData = ref<any>(null);
const cartCourses = ref<any[]>([]);
const cartTotal = ref(0);
const cartOriginalTotal = ref(0);
const cartSaved = ref(0);

// 响应式数据
const selectedPayment = ref('alipay'); // 默认选择支付宝
const couponCode = ref(''); // 优惠券码
const discountAmount = ref(0); // 优惠金额
const finalPrice = ref(0);

// 共享的响应式数据
// const orders = ref<Order[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const userId = ref<string | null>(null);
// 分页相关
// const currentPage = ref(1);
// const pageSize = ref(10);
// const totalPages = ref(1);
// const totalOrders = ref(0);
// 筛选相关
// const selectedStatus = ref<string>('all'); // all, pending, paid, completed, cancelled
// const selectedTimeRange = ref<string>('all'); // all, week, month, year

const payAmount = ref(0.01);
const payLoading = ref(false);
const payStatusMsg = ref('');
const payStatusType = ref('loading');
const payOrderInfo = ref<any>(null);
const currentOrderId = ref<string | null>(null);

const apiBase = 'https://itie.sumixer.com/api';


const initializeData = async () => {
  //用户名
  const token = getValidToken();
  if (token) {
    userId.value = getCurrentUserId();
  }
  if (!userId.value) {
    error.value = '请先登录';
    return;
  }
  console.log(token)
  loadCartData();


  //区分两种情况 一个course和一个courseList 主要是获取的时候设置这个course为一个项目了 这不对 
  console.log(userId.value)
  console.log(cartCourses.value)

  calculateFinalPrice();
};
const useOrderData = () => {


  // const fetchOrders = async () => {
  //   loading.value = true;
  //   error.value = null;
  //   try {
  //     const response = await orderApi.getMyOrders();
  //     orders.value = response.data;

  //   } catch (err: any) {
  //     error.value = err.response?.data?.message || '获取订单列表失败';
  //     console.error('获取订单列表失败:', err);
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  // const handlePageChange = (page: number) => {
  //   currentPage.value = page;
  //   fetchOrders();
  // };

  // const handleStatusFilter = (status: string) => {
  //   selectedStatus.value = status;
  //   currentPage.value = 1;
  //   fetchOrders();
  // };

  // const handleTimeRangeFilter = (timeRange: string) => {
  //   selectedTimeRange.value = timeRange;
  //   currentPage.value = 1;
  //   fetchOrders();
  // };

  // const cancelOrder = async (orderId: string) => {
  //   loading.value = true;
  //   error.value = null;
  //   try {
  //     const response = await orderApi.cancelOrder(orderId);
  //     if (response.code === 200) {
  //       // 重新获取订单列表
  //       await fetchOrders();
  //     } else {
  //       error.value = response.message || '取消订单失败';
  //     }
  //   } catch (err: any) {
  //     error.value = err.response?.data?.message || '取消订单失败';
  //     console.error('取消订单失败:', err);
  //   } finally {
  //     loading.value = false;
  //   }
  // };


  // const applyRefund = async (orderId: string, reason: string) => {
  //   loading.value = true;
  //   error.value = null;
  //   try {
  //     const response = await orderApi.applyRefund({
  //       orderId,
  //       reason
  //     });
  //     if (response.code === 200) {
  //       // 重新获取订单列表
  //       await fetchOrders();
  //     } else {
  //       error.value = response.message || '申请退款失败';
  //     }
  //   } catch (err: any) {
  //     error.value = err.response?.data?.message || '申请退款失败';
  //     console.error('申请退款失败:', err);
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  return {
    loading,
    error,
    userId,
    initializeData,
    // fetchOrders,
    // handlePageChange,
    // handleStatusFilter,
    // handleTimeRangeFilter,

  };
};

// 共享的工具函数
const useOrderUtils = () => {
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
    return `¥${price.toFixed(2)}`;
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
  const calculateOrderTotal = (order: Order) => {
    return order.orderItemList?.reduce((total, item) => total + item.currentPrice, 0) || 0;
  };

  // 计算订单原价总和
  const calculateOrderOriginalTotal = (order: Order) => {
    return order.orderItemList?.reduce((total, item) => total + item.courseOriginalPrice, 0) || 0;
  };

  // 检查订单是否可以取消
  const canCancelOrder = (order: Order) => {
    return order.status === 1 || order.status === 2;
  };

  // 检查订单是否可以申请退款
  const canApplyRefund = (order: Order) => {
    return order.status === 3;
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
    canApplyRefund
  };
};

// 导出静态数据
const orderStatusOptions = [
  { value: 'all', label: '全部订单' },
  { value: 'PENDING', label: '待付款' },
  { value: 'PAID', label: '已付款' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
  { value: 'REFUNDING', label: '退款中' },
  { value: 'REFUNDED', label: '已退款' }
];

const timeRangeOptions = [
  { value: 'all', label: '全部时间' },
  { value: 'week', label: '最近一周' },
  { value: 'month', label: '最近一个月' },
  { value: 'year', label: '最近一年' }
];


const loadCartData = () => {
  try {
    const storedData = localStorage.getItem('tempCartData');
    console.log(storedData)
    if (storedData) {
      cartData.value = JSON.parse(storedData);
      console.log(cartData.value)

      cartCourses.value = cartData.value.courses || [];
      cartTotal.value = cartData.value.total || 0;

      //这两个数据是？
      cartOriginalTotal.value = cartData.value.originalTotal || 0;
      cartSaved.value = cartData.value.saved || 0;
    } else {
      console.log('没有找到购物车数据');
      // window.location.href = '/cart.html';
    }
  } catch (error) {
    console.error('读取购物车数据失败:', error);
  }
};

// 计算最终价格
const calculateFinalPrice = () => {
  finalPrice.value = cartTotal.value - discountAmount.value;
};

// 处理付款方式选择
const handlePaymentChange = (paymentMethod: string) => {
  selectedPayment.value = paymentMethod;
};

// 应用优惠券
const applyCoupon = () => {
  if (!couponCode.value.trim()) {
    alert('请输入优惠券码');
    return;
  }
  if (couponCode.value.toLowerCase() === 'discount10') {

    calculateFinalPrice();
  } else {
    alert('无效的优惠券码');
  }
};

// 处理支付
const handlePayment = () => {
  console.log(`使用${selectedPayment.value === 'alipay' ? '支付宝' : '微信支付'}支付 ¥${finalPrice.value.toFixed(2)}`);

  if (selectedPayment.value === 'alipay') {
    console.log("pay")

    createAliPayment();
  }
};

async function createAliPayment() {
  payLoading.value = true;
  payStatusType.value = 'loading';
  payStatusMsg.value = '🔄 正在创建支付订单...';
  payOrderInfo.value = null;
  try {
    const orderItemList = cartCourses.value.map(course => ({
      courseId: course.courseId,
      courseName: course.title,
      currentPrice: course.price,
      courseOriginalPrice: course.originalPrice,
      courseDiscount: course.price / course.originalPrice
    }));
    const orderData = {
      userId: userId.value,
      paymentPrice: finalPrice.value,
      paymentType: "alipay",
      orderItemList: orderItemList
    };
    console.log(orderData)
    const res = await fetch('https://itie.sumixer.com/api/api/pay/alipay/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    console.log(payStatusType)
    const result = await res.json();
    console.log(result)
    if (result.status === 1202 && result.data) {
      currentOrderId.value = result.data.orderId;
      payOrderInfo.value = {
        orderId: result.data.orderId,
        userId: userId.value,
        paymentPrice: finalPrice.value,
      };
      payStatusType.value = 'success';
      payStatusMsg.value = '✅ 支付订单创建成功！订单已保存到数据库，可以继续测试其他功能';
      if (result.data.formHtml) {
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = result.data.formHtml;
        document.body.appendChild(tempDiv);
        const form = tempDiv.querySelector('form');
        if (form) form.submit();
      }
    } else {
      console.log("error")
      payStatusType.value = 'error';
      payStatusMsg.value = `❌ 创建支付订单失败: ${result.message}`;
    }
  } catch (e: any) {
    payStatusType.value = 'error';
    payStatusMsg.value = `❌ 创建支付订单失败: ${e.message}`;
  } finally {
    payLoading.value = false;
  }
}

async function testNotify() {
  if (!currentOrderId.value) {
    payStatusType.value = 'error';
    payStatusMsg.value = '❌ 请先创建支付订单';
    return;
  }
  payStatusType.value = 'loading';
  payStatusMsg.value = '🔄 正在测试异步通知...';
  try {
    const mockParams = `out_trade_no=${currentOrderId.value}&trade_no=2024122600000000&trade_status=TRADE_SUCCESS&total_amount=${payAmount.value}&buyer_id=2088102122458832&app_id=9021000149688581&sign_type=RSA2&timestamp=2024-12-26+11:18:54&version=1.0&sign=test_real_sign`;
    const res = await fetch(`${apiBase}/api/pay/alipay/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `params=${encodeURIComponent(mockParams)}`
    });
    const result = await res.json();
    if (result.status === 1) {
      payStatusType.value = 'success';
      payStatusMsg.value = '✅ 异步通知测试成功！订单状态已更新，课程已添加到用户课程表';
    } else {
      payStatusType.value = 'error';
      payStatusMsg.value = `❌ 异步通知测试失败: ${result.message}`;
    }
  } catch (e: any) {
    payStatusType.value = 'error';
    payStatusMsg.value = `❌ 异步通知测试失败: ${e.message}`;
  }
}

async function testCancel() {
  if (!currentOrderId.value) {
    payStatusType.value = 'error';
    payStatusMsg.value = '❌ 请先创建支付订单';
    return;
  }
  payStatusType.value = 'loading';
  payStatusMsg.value = '🔄 正在测试取消订单...';
  try {
    const res = await fetch(`${apiBase}/api/pay/alipay/cancel?orderId=${currentOrderId.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (result.status === 1) {
      payStatusType.value = 'success';
      payStatusMsg.value = '✅ 取消订单测试成功！';
    } else {
      payStatusType.value = 'error';
      payStatusMsg.value = `❌ 取消订单测试失败: ${result.message}`;
    }
  } catch (e: any) {
    payStatusType.value = 'error';
    payStatusMsg.value = `❌ 取消订单测试失败: ${e.message}`;
  }
}

async function testRefund() {
  if (!currentOrderId.value) {
    payStatusType.value = 'error';
    payStatusMsg.value = '❌ 请先创建支付订单';
    return;
  }
  payStatusType.value = 'loading';
  payStatusMsg.value = '🔄 正在测试退款...';
  try {
    const res = await fetch(`${apiBase}/api/pay/alipay/refund?orderId=${currentOrderId.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (result.status === 1) {
      payStatusType.value = 'success';
      payStatusMsg.value = `✅ 退款测试成功！<br/>${result.data || ''}`;
    } else {
      payStatusType.value = 'error';
      payStatusMsg.value = `❌ 退款测试失败: ${result.message}`;
    }
  } catch (e: any) {
    payStatusType.value = 'error';
    payStatusMsg.value = `❌ 退款测试失败: ${e.message}`;
  }
}



async function queryOrder() {
  if (!currentOrderId.value) {
    payStatusType.value = 'error';
    payStatusMsg.value = '❌ 请先创建支付订单';
    return;
  }
  payStatusType.value = 'loading';
  payStatusMsg.value = '🔄 正在查询订单状态...';
  try {
    const res = await fetch(`${apiBase}/order/single/${currentOrderId.value}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (result.status === 1) {
      const order = result.data;
      const statusText = getStatusText(order.status);
      const paymentTime = order.paymentTime ? new Date(order.paymentTime).toLocaleString() : '未支付';
      const currentTime = new Date().toLocaleString();
      let timeInfo = '';
      if (order.paymentTime) {
        const timeDiff = Date.now() - new Date(order.paymentTime).getTime();
        const hoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
        const minutesDiff = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
        if (hoursDiff < 24) {
          timeInfo = `<p>✅ 距离支付时间: ${hoursDiff}小时${minutesDiff}分钟 (可退款)</p>`;
        } else {
          timeInfo = `<p>❌ 距离支付时间: ${hoursDiff}小时${minutesDiff}分钟 (超过24小时，不可退款)</p>`;
        }
      }
      payStatusType.value = 'success';
      payStatusMsg.value = `
        <p>✅ 订单查询成功！</p>
        <p><strong>订单信息:</strong></p>
        <p>订单ID: ${order.orderId}</p>
        <p>订单状态: ${statusText}</p>
        <p>支付金额: ¥${order.paymentPrice || 0}</p>
        <p>支付时间: ${paymentTime}</p>
        <p>当前时间: ${currentTime}</p>
        ${timeInfo}
      `;
    } else {
      payStatusType.value = 'error';
      payStatusMsg.value = `❌ 订单查询失败: ${result.message}`;
    }
  } catch (e: any) {
    payStatusType.value = 'error';
    payStatusMsg.value = `❌ 订单查询失败: ${e.message}`;
  }
}

function getStatusText(status: number) {
  switch (status) {
    case 1: return "已取消";
    case 2: return "未支付";
    case 3: return "已支付";
    case 4: return "已退款";
    default: return "未知状态";
  }
}

export {
  userId,
  cartData,
  cartCourses,
  cartTotal,
  cartOriginalTotal,
  cartSaved,
  loadCartData,
  selectedPayment,
  couponCode,
  applyCoupon,
  discountAmount,
  finalPrice,
  payAmount,
  payLoading,
  payStatusMsg,
  payStatusType,
  payOrderInfo,
  currentOrderId,
  initializeData,
  useOrderData,
  useOrderUtils,

  orderStatusOptions,
  timeRangeOptions,
  handlePayment,
  handlePaymentChange,
  createAliPayment,
  testNotify,
  testCancel,
  testRefund,
  queryOrder,
  getStatusText
}