import { toRef, ref, onMounted, defineComponent } from 'vue';
import { getCurrentUserId, getValidToken } from '@/utils/request';
import { categoryApi, courseApi } from '@/api/course';
import type { Category, Tag, CourseListVO } from '@/api/course';

class NavigationButton {
  activeFlag: boolean = false;
  hoverFlag: boolean = false;

  constructor(public text: string, public tagId: number) { }

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

// 共享的响应式数据
const categories = ref<Category[]>([]);
const singleCategory = ref<Category | null>(null);
const tags = ref<Tag[]>([]);
const courseListVos = ref<CourseListVO[]>([]);
const userId = ref<string | null>(null);
const selectedTagId = ref<number | null>(null);

const courseTitles = ref<NavigationButton[]>([]);
const courseQuickViews = ref<CourseQuickView[]>([]);

// 共享的数据获取逻辑
export const useIndexData = () => {
  const initializeData = async () => {
    // 获取userId
    const token = getValidToken();
    if (token) {
      userId.value = getCurrentUserId();
    }

    const searchParams = new URLSearchParams(window.location.search);
    let categoryId;
    if (!searchParams.get('categoryId')) {
      categoryId = 1;
    } else {
      categoryId = parseInt(searchParams.get('categoryId')!);
    }

    const categoriesResponse = await categoryApi.getAllCategories();
    categories.value = categoriesResponse.data;

    const singleCategoryResponse = await categoryApi.getCategoryDetail(categoryId);
    singleCategory.value = singleCategoryResponse.data;

    const tagsResponse = await categoryApi.getTagListByCategoryId(categoryId);
    tags.value = tagsResponse.data;
    courseTitles.value = tags.value.map(tag => new NavigationButton(tag.name, tag.tagId));

    let tagId;
    if (!searchParams.get('tagId')) {
      let firstTag = tags.value[0];
      tagId = firstTag.tagId;
    } else {
      tagId = parseInt(searchParams.get('tagId')!);
    }
    selectedTagId.value = tagId;
    await getCourseListByTagId(tagId);
    if (courseTitles.value.length > 0) courseTitles.value[0].activeFlag = true;
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

  const changeCourseTheme = (i: NavigationButton) => {
    courseTitles.value.forEach(element => {
      element.activeFlag = false;
    });
    i.activeFlag = true;
    selectedTagId.value = i.tagId;
    getCourseListByTagId(i.tagId);
  };

  return {
    categories,
    singleCategory,
    tags,
    courseListVos,
    userId,
    selectedTagId,
    courseTitles,
    courseQuickViews,
    initializeData,
    getCourseListByTagId,
    changeCourseTheme
  };
};

const communityVoices = ref<CommunityVoice[]>([
  new CommunityVoice(
    "Manus AI彻底改变了我的工作流程。相比ChatGPT等工具，它能完整执行从规划到交付的整个项目流程，就像拥有一个AI团队。",
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice(
    "作为技术主管，我最欣赏Manus的结构化输出能力。它不仅能回答问题，还能提供可直接交付客户的专业报告。",
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice(
    "在尝试了市面上所有主流AI工具后，Manus的端到端任务处理能力是独一无二的。特别是对复杂研究任务的拆解和执行令人惊艳。",
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a Course manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
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


const recommendedProducts: Product[] = [
  {
    id: 1,
    coverImgUrl: '/src/images/image3.png',
    name: '来杯Java吧! 2025 Java 入門到精通課程',
    author: 'Wilson Ren',
    rating: '4.6',
    reviewCount: '889',
    isPopular: true,
    price: '¥69.99'
  },
  {
    id: 2,
    coverImgUrl: '/src/images/image4.png',
    name: '2025 Python全攻略',
    author: 'Wilson Ren',
    rating: '4.7',
    reviewCount: '2,187',
    isPopular: true,
    price: '¥74.99'
  },
  {
    id: 3,
    coverImgUrl: '/src/images/image5.png',
    name: '2025 網頁全端開發',
    author: 'Wilson Ren',
    rating: '4.8',
    reviewCount: '2,040',
    isPopular: true,
    price: '¥59.99'
  }
];

const relatedTopics = [
  'Spring Boot',
  'Spring Framework',
  'Selenium WebDriver'
];


export {
  courseTitles, NavigationButton,
  courseQuickViews, communityVoices,
  recommendedProducts, relatedTopics
}