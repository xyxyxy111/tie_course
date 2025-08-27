import { ref } from 'vue';
import {
  couponApi,
  type UserCouponVO,
  type PriceDetailDTO,
  type PriceDetailVO,
  CouponStatus,
  CouponType,
  couponSuccessCodes
} from '@/api/coupon';

// 使用优惠券组合式函数
export const useCoupon = () => {
  // 用户优惠券列表
  const coupons = ref<UserCouponVO[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 获取用户优惠券列表
  const fetchMyCoupons = async () => {
    loading.value = true;
    error.value = null;
    try {
      console.log("开始获取优惠券列表...");
      const response = await couponApi.getMyCoupons();
      coupons.value = response.data;
      console.log("优惠券API响应:", coupons.value);
    } catch (err: any) {
      console.error("获取优惠券列表错误:", err);
      error.value = err.message || '获取优惠券列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 发放优惠券
  const issueCoupon = async (couponTemplateId: number) => {
    loading.value = true;
    error.value = null;
    try {
      console.log("发放优惠券:", couponTemplateId);
      const response = await couponApi.issueCoupon(couponTemplateId);

      if (response.status === 1161) {
        console.log("优惠券发放成功");
        // 重新获取优惠券列表以更新状态
        await fetchMyCoupons();
        return response;
      } else {
        const errorMsg = response.message || '优惠券领取失败';
        throw new Error(errorMsg);
      }

    } catch (err: any) {
      console.error("发放优惠券错误:", err);
      error.value = err.message || '优惠券领取失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 应用优惠券
  const applyCoupon = async (userCouponId: number | undefined, courseIds: number[], totalPrice: number) => {
    loading.value = true;
    error.value = null;

    try {
      const params: PriceDetailDTO = {
        userCouponId,
        courseIds,
        totalPrice
      };

      console.log("应用优惠券参数:", params);
      const response = await couponApi.applyCoupon(params);

      if (response.status === 1162) {
        console.log("优惠券应用成功:", response.data);
        return response;
      } else {
        const errorMsg = response.message || '优惠券应用失败';
        throw new Error(errorMsg);
      }

    } catch (err: any) {
      console.error("应用优惠券错误:", err);
      error.value = err.message || '优惠券应用失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 检查优惠券是否有有效信息
  const hasValidInfo = (coupon: UserCouponVO): boolean => {
    return !!(coupon.couponType && coupon.discountValue !== null && coupon.minOrderAmount !== null);
  };

  // 筛选可用优惠券（只包含有有效信息的）
  const getAvailableCoupons = (totalAmount: number): UserCouponVO[] => {
    return coupons.value.filter(coupon =>
      coupon.status === CouponStatus.UNUSED &&
      hasValidInfo(coupon) &&
      (coupon.minOrderAmount || 0) <= totalAmount
    );
  };

  // 筛选不可用优惠券（包括信息不全的）
  const getUnavailableCoupons = (totalAmount: number): UserCouponVO[] => {
    return coupons.value.filter(coupon =>
      coupon.status !== CouponStatus.UNUSED ||
      !hasValidInfo(coupon) ||
      (coupon.minOrderAmount || 0) > totalAmount
    );
  };

  // 根据类型筛选优惠券（只包含有有效信息的）
  const getCouponsByType = (type: CouponType): UserCouponVO[] => {
    return coupons.value.filter(coupon =>
      hasValidInfo(coupon) && coupon.couponType === type
    );
  };

  // 根据状态筛选优惠券
  const getCouponsByStatus = (status: CouponStatus): UserCouponVO[] => {
    return coupons.value.filter(coupon => coupon.status === status);
  };

  // 计算优惠金额（只对有有效信息的优惠券）
  const calculateDiscount = (coupon: UserCouponVO, totalPrice: number): number => {
    if (!hasValidInfo(coupon)) {
      return 0;
    }

    const minOrderAmount = coupon.minOrderAmount || 0;
    const discountValue = coupon.discountValue || 0;

    if (totalPrice < minOrderAmount) {
      return 0;
    }

    if (coupon.couponType === 'fixed') {
      // 折扣券：discountValue 应该是折扣百分比（如10表示9折）
      return totalPrice * (discountValue / 100);
    } else  {
      // 满减券：直接减固定金额
      return discountValue;
    }

    return 0;
  };

  // 计算最终价格
  const calculateFinalPrice = (coupon: UserCouponVO, totalPrice: number): number => {
    const discount = calculateDiscount(coupon, totalPrice);
    
    return Math.max(0, totalPrice - discount);
  };

  // 获取信息不全的优惠券（需要加载详情的）
  const getIncompleteCoupons = (): UserCouponVO[] => {
    return coupons.value.filter(coupon => !hasValidInfo(coupon));
  };

  // 获取有效优惠券数量
  const getValidCouponsCount = (): number => {
    return coupons.value.filter(hasValidInfo).length;
  };

  // 获取优惠券状态文本
  const getStatusText = (status: CouponStatus): string => {
    switch (status) {
      case CouponStatus.UNUSED: return '未使用';
      case CouponStatus.USED: return '已使用';
      case CouponStatus.EXPIRED: return '已过期';
      default: return status;
    }
  };

  return {
    // 状态
    coupons,
    loading,
    error,

    // 方法
    fetchMyCoupons,
    issueCoupon,
    applyCoupon,
    getAvailableCoupons,
    getUnavailableCoupons,
    getCouponsByType,
    getCouponsByStatus,
    calculateDiscount,
    calculateFinalPrice,
    getIncompleteCoupons,
    getValidCouponsCount,
    getStatusText,
    hasValidInfo,

    // 枚举
    CouponStatus,
    CouponType
  };
};

export default useCoupon;