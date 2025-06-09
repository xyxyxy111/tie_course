// 用户相关类
export class User {
  id: bigint | undefined;
  userId: string='';
  email: string='';
  phone: string='' ;
  passwordHash: string='';
  qqId: string='' ;
  wxId: string='' ;
  studentId: string='' ;
  role:number=0;
  createdAt: Date | undefined;
  upDatedAt: Date | undefined;
  deletedAt: Date | undefined;
  unused: string='' ;
}

export class UserInfo {
  id: bigint | undefined;
  userId: string='';
  username: string='';
  lastName: string='' ;
  firstName: string='' ;
  major: string='' ;
  allowEmailNotify: boolean = false;
  allowSmsNotify: boolean = false;
  avatarUrl: string='' ;
  createdAt: Date | undefined;
  upDatedAt: Date | undefined;
  deletedAt: Date | undefined;
  unused: string='' ;
}

export class UserLog {
  id: bigint | undefined;
  userId: string='';
  username: string='';
  IP: string='';
  location: string='' ;
  action: string='';
  createdAt: Date | undefined;
  upDatedAt: Date | undefined;
  deletedAt: Date | undefined;
  unused: string='' ;
}

// 课程相关类
export class Category {
  id:number=0;
  categoryId:number=0;
  name: string='';
  tag: string='' ;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

export class Course {
  id:number=0;
  courseId:number=0;
  categoryId: string='';
  tag: string='' ;
  categoryName: string='';
  coverImgUrl: string='';
  title: string='';
  score:number=0 ;
  whatYouWillLearn: string='';
  chapterNum:number=0;
  lessonNum:number=0;
  totalMinutes: number=0;
  description: string='';
  originalPrice:number=0;
  currentPrice:number=0;
  discountDate: Date | undefined;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

export class Chapter {
  id:number=0;
  chapterId:number=0;
  categoryId:number=0;
  sortOrder:number=0;
  title: string='';
  lessonNum:number=0;
  lessonTotalMinute: bigint | undefined;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

export class Lesson {
  id:number=0;
  lessonId:number=0;
  categoryId:number=0;
  chapterId:number=0;
  sortOrder:number=0;
  title: string='';
  isPreviewable: boolean = false;
  totalSeconds: bigint | undefined;
  thumbnailUrl: string='' ;
  videoUrl: string='' ;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

export class Evaluation {
  id:number=0;
  evaluationId:number=0;
  userId:number=0;
  courseId:number=0;
  score:number=0;
  comment: string='';
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

// 收藏与心愿单
export class Favorite {
  id: bigint | undefined;
  userId: string='';
  courseId: string='';
  title: string='';
  originalPrice:number=0;
  currentPrice:number=0;
  coverImgUrl: string='';
  score: string='' ;
  totalMinutes: bigint | undefined;
  createdAt: Date | undefined;
  upDatedAt: Date | undefined;
  deletedAt: Date | undefined;
  unused: string='' ;
}

export class Wishlist {
  id: bigint | undefined;
  userId: string='';
  courseId: string='';
  title: string='';
  originalPrice:number=0;
  currentPrice:number=0;
  coverImgUrl: string='';
  score: string='' ;
  totalMinutes: bigint | undefined;
  createdAt: Date | undefined;
  upDatedAt: Date | undefined;
  deletedAt: Date | undefined;
  unused: string='' ;
}

// 我的课程
export class MyCourse {
  id:number=0;
  myCourseId:number=0;
  userId:number=0;
  courseId:number=0;
  title: string='';
  coverImgUrl: string='';
  watchProgress: string='';
  lastViewedChapterId: bigint | undefined;
  lastViewedLessonId: bigint | undefined;
  lastViewedAt: bigint | undefined;
  lastViewedTime: Date | undefined;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

// 优惠券相关
export class CouponType {
  id:number=0;
  couponTemplateId: bigint | undefined;
  title: string='';
  couponType: string='';
  discountValue:number=0;
  validDaysAfterIssue:number=0;
  applicationCourseId: string='' ;
  status: string='';
  minOrderAmount:number=0 ;
  maxDiscountAmount:number=0 ;
  totalQuantity:number=0;
  startTime: Date | undefined;
  endTime: Date | undefined;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

export class UserCoupon {
  id:number=0;
  userCouponId: bigint | undefined;
  couponTemplateId: bigint | undefined;
  ownerId: bigint | undefined;
  actualUserId: bigint | undefined;
  status: string='';
  issueTime: Date | undefined;
  expireTime: Date | undefined;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

// 订单相关
export class Order {
  id:number=0;
  orderId: string='';
  userId:number=0;
  status:number=0;
  paymentType: string='' ;
  paymentTime: Date | undefined;
  paymentPrice:number=0;
  originalPrice:number=0;
  couponId:number=0 ;
  couponOwnerId:number=0 ;
  couponPrice:number=0 ;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}

export class OrderItem {
  id:number=0;
  userId:number=0;
  orderId: string='';
  courseId:number=0;
  courseName: string='';
  courseImage: string='';
  courseOriginalPrice:number=0;
  courseDiscount:number=0;
  currentPrice:number=0;
  createTime: Date | undefined;
  upDateTime: Date | undefined;
  deleteTime: Date | undefined;
  unused: string='' ;
}