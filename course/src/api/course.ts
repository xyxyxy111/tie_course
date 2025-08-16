import { request } from '@/utils/request.ts';

// 课程接口
export interface Category{
  categoryId?: number;
  name: String;
}

export interface Tag {
  tagId: number;
  categoryId: number;
  name: string;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string;
  unused?: string;
}

export interface CategoryList{
  categoryId?: number;
  name: String;
  tags?: Tag[];
}

export interface CourseListVO {
  courseId: number;
  categoryId: number;
  tagId: number;
  categoryName: string;
  tagName: string;
  coverImgUrl: string;
  title: string;
  score: number;
  highLights: string;
  whatYouWillLearn: string;
  chapterNum: number;
  lessonNum: number;
  totalMinutes: number;
  description: string;
  originalPrice: number;
  currentPrice: number;
  discountValue: number;
  discountDate?: string;
  updateTime?: string;
}

export interface CourseVO {
  courseId: number;
  categoryId: number;
  tagId: number;
  categoryName: string;
  tagName: string;
  coverImgUrl: string;
  title: string;
  score: number;
  highLights: string;
  whatYouWillLearn: string;
  chapterNum: number;
  lessonNum: number;
  totalMinutes: number;
  description: string;
  originalPrice: number;
  currentPrice: number;
  discountValue: number;
  discountDate?: string;
  updateTime?: string;
}

export interface Chapter {
  chapterId: number;
  courseId: number;
  chapterSortOrder: number;
  title: string;
  description: string;
  lessonNum: number;
  lessonTotalMinute: number;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string;
  unused?: string;
  lessons?: Lesson[];
  isLoadingLessons?: boolean; // 用于显示加载状态
  hasLoadedLessons?: boolean; // 表示是否已经加载过
  //for show
  hours?: number;
  minutes?: number;
}

export interface Lesson {
  lessonId: number;
  courseId: number;
  chapterSortOrder: number;
  lessonSortOrder: number;
  title: string;
  isPreviewable: boolean;
  totalSeconds: number;
  coverImgUrl: string;
  videoUrl: string;
  createTime?: string;
  updateTime?: string;
  deleteTime?: string;
  unused?: string;
}


export const courseApi = {
  getCourseListByTagId: (tagId: number) => {
    return request<CourseListVO[]>({
      method: 'GET',
      url: `/tags/${tagId}/courses`
    });
  },

  getSingleCourseDetail: (courseId: number) => {
    return request<CourseVO>({
      method: 'GET',
      url: `/courses/${courseId}`
    });
  },

  getChapterListById: (courseId: string | number) => {
    return request<Chapter[]>({
      method: 'GET',
      url: `/courses/${courseId}/chapters`
    });
  },

  getLessonsByCourseIdAndSortOrder: (courseId: number, sortOrder: number) => {
    return request<Lesson[]>({
      method: 'GET',
      url: `/courses/${courseId}/lessons/${sortOrder}`
    });
  },

  getHottestCourse: () => {
    return request<CourseListVO[]>({
      method: 'GET',
      url: 'courses/hottest'
    })
  },

  getCourseTogetherBuy: (tagId: string, courseId: string) => {
    return request<CourseListVO>({
      method: 'GET',
      url: '/courses/togetherBuy',
      params: {
        tagId: tagId,
        courseId: courseId
      }
    })
  }
};

export const categoryApi = {
  getCategoryDetail: (categoryId: number) => {
    return request<Category>({
      method: 'GET',
      url: `/categories/${categoryId}`
    });
  },
  getAllCategories: () => {
    return request<Category[]>({
      method: 'GET',
      url: '/categories'
    });
  },
  getTagListByCategoryId: (categoryId: number) => {
    return request<Tag[]>({
      method: 'GET',
      url: `/categories/${categoryId}/tags`
    });
  },
}

export const videoApi = {
  getLessonVideoOssSignatureUrl: (fileName: string) => {
    return request<String>({
      method: 'GET',
      url: `/videos/lessons/signature-url/${fileName}`
    });
  },
  // getCoverVideoOssSignatureUrl: () => {
  //   return request<String>({
  //     method: 'GET',
  //     url: '/categories'
  //   });
  // },
}

export const courseSuccessCodes = [
  1101, // 获取标签列表成功
  1110, // 获取课程列表信息成功
  1111, // 获取单个课程详情成功
  1120, // 获取章节信息成功
  1130, // 获取课信息成功
];

export const categorySuccessCodes = [
  1100, // 获取分类列表成功
];

export const searchCourseByMessage = (pageNum: number, pageSize: number, courseMessage?: string) => {
  return request({
    method: 'GET',
    url: '/courses/search',
    params: {
      pageNum,
      pageSize,
      courseMessage
    }
  });
};

// 最新课程
export const searchLatestCourse = (pageNum: number, pageSize: number) => {
  return request({
    method: 'GET',
    url: '/courses/latest',
    params: {
      pageNum,
      pageSize
    }
  });
};