import { toRef, ref, onMounted, defineComponent, reactive } from 'vue';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { categoryApi, courseApi } from '@/api/course';
import type { CategoryList, Tag, CourseListVO } from '@/api/course';
import { profileApi } from '@/api';
const userInfo = reactive({
  username: '',
  firstName: '',
  lastName: '',
  major: '',
  avatarUrl: '',
  allowEmailNotify: false,
  allowSMSNotify: false
})

class NavigationButton {
  activeFlag: boolean = false;
  hoverFlag: boolean = false;
  constructor(public title: string, public id: number) { }
  mouseEnter() {
    this.hoverFlag = true;
  }
  mouseLeave() {
    this.hoverFlag = false;
  }
}

export class CourseQuickView {
  hoverFlag: boolean = false;
  courseId: number;
  coverImgUrl: string;
  title: string;
  score: number;
  originalPrice: number;
  updateTime: Date;
  totalMinutes: number;
  description: string;
  whatYouWillLearn: string;

  constructor(
    courseId: number,
    coverImgUrl: string,
    title: string,
    score: number,
    originalPrice: number,
    updateTime: Date,
    totalMinutes: number,
    description: string,
    whatYouWillLearn: string
  ) {
    this.courseId = courseId;
    this.coverImgUrl = coverImgUrl;
    this.title = title;
    this.score = score;
    this.originalPrice = originalPrice;
    this.updateTime = updateTime;
    this.totalMinutes = totalMinutes;
    this.description = description;
    this.whatYouWillLearn = whatYouWillLearn;
  }

  mouseEnter() {
    this.hoverFlag = true;
  }

  mouseLeave() {
    this.hoverFlag = false;
  }
}

class CommunityVoice {
  constructor(
    public comment: string,
    public user: string,
    public userPictrue: string,
    public course: string) { }
}

const userId = ref<string | null>(null);
const categories = ref<CategoryList[]>([]);
const selectedCategoryId = ref<number | null>(null);
let selectedCategoryTitle = ref("");
const tags = ref<Tag[]>([]);
const selectedTagId = ref<number | null>(null);
const courseListVos = ref<CourseListVO[]>([]);
const categoryTitles = ref<NavigationButton[]>([]);
const tagTitles = ref<NavigationButton[]>([]);
const courseQuickViews = ref<CourseQuickView[]>([]);

export const useIndexData = () => {

  const initializeData = async () => {
    const token = getValidToken();
    if (token) {
      userId.value = getCurrentUserId();
    }
    await fetchProfile();
    await fetchCategories();
    selectedCategoryId.value = 1;
    await getTagListByCategoryId(1);
    categoryTitles.value = categories.value.map(category => new NavigationButton(category.name.toString(), category.categoryId!));
    categoryTitles.value[0].activeFlag = true;
    selectedCategoryTitle.value = categoryTitles.value[0].title;
    tagTitles.value = tags.value.map(tag => new NavigationButton(tag.name, tag.tagId));
    tagTitles.value[0].activeFlag = true;
    selectedTagId.value = tagTitles.value[0].id;
    await getCourseListByTagId(tagTitles.value[0].id);
    courseQuickViews.value = courseListVos.value.map(course => {
      return new CourseQuickView(
        course.courseId,
        course.coverImgUrl,
        course.title,
        course.score,
        course.originalPrice,
        new Date(course.updateTime || new Date()),
        course.totalMinutes,
        course.description,
        course.whatYouWillLearn
      );
    });
  };
  return {
    categories,
    tags,
    courseListVos,
    userId,
    selectedCategoryId,
    selectedTagId,
    courseQuickViews,
    initializeData,
    userInfo
  };
};

const communityVoices = ref<CommunityVoice[]>([
  new CommunityVoice(
    "Manus AI彻底改变了我的工作流程。相比ChatGPT等工具，它能完整执行从规划到交付的整个项目流程，就像拥有一个AI团队。",
    'User', '/src/images/userPic.png', 'course'
  )
])


interface Product {
  id: number;
  coverImgUrl: string;
  name: string;
  author: string;
  rating: string;
  reviewCount: string;
  isPopular: boolean;
  price: string;
}

const fetchProfile = async () => {
  try {
    const { data } = await profileApi.getProfile()
    Object.assign(userInfo, data)
  } catch (error) {
    console.error('获取个人信息失败:', error)
  }
}

const fetchCategories = async () => {
  try {
    const categoriesResponse = await categoryApi.getAllCategories();
    categories.value = categoriesResponse.data;
    for (const category of categories.value) {
      if (category.categoryId) {
        const tagsResponse = await categoryApi.getTagListByCategoryId(category.categoryId);
        (category as any).tags = tagsResponse.data;
      }
    }
  } catch (error) {
    console.error('获取categories失败:', error);
  }
};



const changeCategory = async (i: NavigationButton) => {
  try {
    categoryTitles.value.forEach(element => {
      element.activeFlag = false;
    });
    i.activeFlag = true;
    selectedCategoryId.value = i.id;
    await getTagListByCategoryId(i.id);
    tagTitles.value = tags.value.map(tag => new NavigationButton(tag.name, tag.tagId));
    tagTitles.value[0].activeFlag = true;
    console.log("第一个标签已选中:", tagTitles.value[0]);
    selectedCategoryTitle.value = i.title;
    changeTag(tagTitles.value[0]);
  } catch (error) {
    console.error("获取标签列表失败:", error);
  }
};

const changeTag = async (i: NavigationButton) => {
  tagTitles.value.forEach(element => {
    element.activeFlag = false;
  });
  i.activeFlag = true;
  selectedTagId.value = i.id;
  await getCourseListByTagId(i.id);
  courseQuickViews.value = courseListVos.value.map(course => {
    return new CourseQuickView(
      course.courseId,
      course.coverImgUrl,
      course.title,
      course.score,
      course.originalPrice,
      new Date(course.updateTime || new Date()),
      course.totalMinutes,
      course.description,
      course.whatYouWillLearn
    );
  });
  console.log("courseQuickViews:" + courseQuickViews.value.map(course => course.title));
};

const getCourseListByTagId = async (tagId: number) => {
  const courseListVosResponse = await courseApi.getCourseListByTagId(tagId);
  courseListVos.value = courseListVosResponse.data;
  courseQuickViews.value = courseListVos.value.map(course => {
    return new CourseQuickView(
      course.courseId,
      course.coverImgUrl,
      course.title,
      course.score,
      course.originalPrice,
      new Date(course.updateTime || new Date()),
      course.totalMinutes,
      course.description,
      course.whatYouWillLearn
    );
  });
};

const getTagListByCategoryId = async (categoryId: number) => {
  const tagsResponse = await categoryApi.getTagListByCategoryId(categoryId);
  tags.value = tagsResponse.data;
};

export {
  userId, selectedCategoryTitle,
  courseQuickViews, communityVoices,
  fetchCategories, changeCategory,
  changeTag, categoryTitles, tagTitles
}
