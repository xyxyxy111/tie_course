
import { NavigationButton } from '../components/widget/NavigateButton';

import { CourseQuickView } from './widget/CourseQuickView';
import { toRef, ref, onMounted, defineComponent } from 'vue';
import { CommunityVoice } from '../components/widget/CommunityVoices';

const courseTitles = ref<NavigationButton[]>([
  new NavigationButton('JavaScript'),
  new NavigationButton('React JS'),
  new NavigationButton('Angular'),
  new NavigationButton('Java'),
  new NavigationButton('CSS'),
  new NavigationButton('Android'),
  new NavigationButton('iOS')
])

const courseQuickViews = ref<CourseQuickView[]>([
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  ),
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  ),
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  ),
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  ),
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  ),
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  ),
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  ),
  new CourseQuickView(
    '/src/images/image2.png', // 封面图片URL
    '2025 Python全攻略', // 课程标题
    4.7, // 评分 (2,187条评价)
    74.99, // 原价 (US$74.99)
    new Date('2025-03-01'), // 更新日期 (2025年3月)
    2730, // 总分钟数 (45.5小时 = 2730分钟)
    '超過40小時的內容，學習Python語法、程式邏輯、識別Python資料類別與使用時機，用正規表示式處理資料、處理文件系統、運用Python網路爬蟲、連結SQL資料庫、處理Excel和CSV，寄送email，一步步實作成為Python達人！', // 课程描述
    '學會基本Python語法、培養程式邏輯以及程式語言觀念\n識別基本與進階Python資料類別與使用時機' // 你将学到什么
  )
]);

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
    price: 'US$69.99'
  },
  {
    id: 2,
    coverImgUrl: '/src/images/image4.png',
    name: '2025 Python全攻略',
    author: 'Wilson Ren',
    rating: '4.7',
    reviewCount: '2,187',
    isPopular: true,
    price: 'US$74.99'
  },
  {
    id: 3,
    coverImgUrl: '/src/images/image5.png',
    name: '2025 網頁全端開發',
    author: 'Wilson Ren',
    rating: '4.8',
    reviewCount: '2,040',
    isPopular: true,
    price: 'US$59.99'
  }
];

const relatedTopics = [
  'Spring Boot',
  'Spring Framework',
  'Selenium WebDriver'
];


export {
courseTitles,
  courseQuickViews, communityVoices,
recommendedProducts,relatedTopics
}