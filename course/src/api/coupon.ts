import { request } from '@/utils/request.ts';

// 优惠券状态枚举
export enum CouponStatus {
  UNUSED = 'UNUSED',         // 未使用
  USED = 'USED',             // 已使用
  EXPIRED = 'EXPIRED'        // 已过期
}

// 优惠券类型枚举
export enum CouponType {
  DISCOUNT = 'fixed',     // 折扣券
  REDUCTION = 'percentage'    // 满减券
}

// 用户优惠券VO
export interface UserCouponVO {
  userCouponId: number;               // 优惠券ID
  status: string;               // 优惠券状态
  usedByUserName?: string | null;     // 使用者用户名，可选
  issueTime: string;                  // 发放时间
  expireTime: string;                 // 过期时间
  couponTemplateId?: number | null;   // 优惠券模板ID，可选
  title?: string | null;              // 优惠券标题，可选
  couponType?: string | null;     // 优惠券类型（折扣券、满减券），可选
  discountValue?: number | null;      // 优惠券折扣值，可选
  minOrderAmount?: number | null;     // 最低订单金额，可选
  applicationCourseTitle?: string | null; // 适用课程标题，可选
}

// 价格详情DTO（应用优惠券请求参数）
export interface PriceDetailDTO {
  userCouponId?: number;
  courseIds: number[];
  totalPrice: number;
}

// 价格详情VO（应用优惠券返回结果）
export interface PriceDetailVO {
  totalPrice: number;
  discountPrice: number;
  finalPrice: number;
}

// 发放优惠券请求参数
export interface IssueCouponParams {
  couponTemplateId: number;
}

// 优惠券列表响应
export interface CouponListResponse {
  status: number;
  message: string;
  data: UserCouponVO[];
}

// 价格详情响应
export interface PriceDetailResponse {
  status: number;
  message: string;
  data: PriceDetailVO;
}

// 操作响应
export interface CouponOperationResponse {
  status: number;
  message: string;
  data: null;
}

export const couponApi = {
  // 获取当前用户优惠券列表
  getMyCoupons: () => {
    return request<UserCouponVO[]>({
      method: 'GET',
      url: '/course/coupons/my-coupons'
    });
  },

  // 发放优惠券
  issueCoupon: (data: number) => {
    return request<null>({
      method: 'POST',
      url: '/course/coupons/issue',
      data
    });
  },

  // 应用优惠券
  applyCoupon: (data: PriceDetailDTO) => {
    return request<PriceDetailVO>({
      method: 'POST',
      url: '/course/coupons/apply',
      data
    });
  }
};

// 优惠券相关的成功状态码
export const couponSuccessCodes = [
  1160,   // 获取优惠券列表成功
  1161,   // 优惠券领取成功
  1162    // 优惠券应用成功
];

// 优惠券相关的错误状态码
export const couponErrorCodes = [
  2160,   // 获取优惠券列表失败
  2161,   // 优惠券领取失败
  2162    // 优惠券应用失败
];