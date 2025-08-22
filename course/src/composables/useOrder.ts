import { orderApi, type Order, type OrderVO } from '@/api/order';
import { ref } from 'vue'

const myOrdersCourseId = ref<number[]>([]);

/*检查用户是否已购买指定课程 */
const checkIfCoursePurchased = async (courseId: number): Promise<boolean> => {
  try {
    await getPurchasedCourseIds();

    console.log(myOrdersCourseId.value.includes(courseId))
    return myOrdersCourseId.value.includes(courseId);
  } catch (error) {
    return false;
  }
};

/*获取用户已购买的所有课程ID */
const getPurchasedCourseIds = async (): Promise<number[]> => {
  try {
    const response = await orderApi.getMyOrders();
    console.log(response)
    if (response.status !== 1201) {
      console.error('获取订单列表失败');
      return [];
    }
    const orders: Order[] = response.data || [];
    // 遍历所有已支付订单，收集课程ID
    for (const order of orders) {
      order.orderItemList.forEach((item: OrderVO) => {
        myOrdersCourseId.value.push(item.courseId);
      });

      // if (order.status === 3) { // 3 = OrderStatus.PAID
      //   order.orderItemList.forEach((item: OrderVO) => {
      //     purchasedCourseIds.push(item.courseId);
      //   });
      // }
    }
    return myOrdersCourseId.value;
  } catch (error) {
    console.error('获取已购买课程ID时出错:', error);
    return [];
  }
};

export {
  myOrdersCourseId, checkIfCoursePurchased, getPurchasedCourseIds
}