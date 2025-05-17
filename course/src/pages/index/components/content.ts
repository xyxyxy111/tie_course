
import { NavigationButton } from '../components/widget/NavigateButton';
import { CourseQuickView } from '../components/widget/CourseQuickView';
import { ProjectQuickView } from '../components/widget/ProjectQuickView';
import { toRef, ref, onMounted, defineComponent } from 'vue';
import { CommunityVoice } from '../components/widget/CommunityVoices';


const courseTitles = ref<NavigationButton[]>([
  new NavigationButton('软件开发架构'),
  new NavigationButton('Web应用开发'),
  new NavigationButton('Linux程序设计环境')])


const projectTitles = ref<NavigationButton[]>([
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
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image1.png',
    '',
    89.99
  ),
  new CourseQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image2.png',
    '',
    79.50
  ),
  new CourseQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image3.png',
    '',
    69.99
  ),
  new CourseQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image4.png',
    '',
    59.95
  ),
  new CourseQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image5.png',
    '',
    49.99
  ),
  new CourseQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image6.png',
    '',
    39.99
  ),
  new CourseQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image7.png',
    '',
    29.99
  ),
  new CourseQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image8.png',
    '',
    19.99
  )
]);

const projectQuickViews = ref<ProjectQuickView[]>([
  new ProjectQuickView(
    '2022網頁開發全攻略',
    '超過65小時，你需要的唯一網頁開ffff發課程 - 學習前端與後端知識，成為網超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網  - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image1.png',
    '',
    99.99
  ),
  new ProjectQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image2.png',
    '',
    89.50
  ),
  new ProjectQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image3.png',
    '',
    79.99
  ),
  new ProjectQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image4.png',
    '',
    69.95
  ),
  new ProjectQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image5.png',
    '',
    59.99
  ),
  new ProjectQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image6.png',
    '',
    49.99
  ),
  new ProjectQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image7.png',
    '',
    39.99
  ),
  new ProjectQuickView(
    '2022網頁開發全攻略',
    ' 超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識，成為網頁全端工程師。內容包含HTML, CSS, JavaScript, React, Node.js, MongoDB, AND MORE!超過65小時，你需要的唯一網頁開發課程 - 學習前端與後端知識， 成為網頁全端工程師。內容包含HTML',
    '/src/images/image8.png',
    '',
    29.99
  )
]);

const CommunityVoices = ref<CommunityVoice[]>([
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
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),

  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
  new CommunityVoice('I\'ve used ChatGPT, Claude, Gemini, andPerplexity daily but Manus impressed mein a way the others didn\'t. l gave it acomplex Al CPTO research and validationtask, and it handled everything: planning,researching, executing, and deliveringstructured results like a team of smartanalysts with a project manager in charge.It\'s not just another Al tool, it actually getsthings done.',
    'User', '/src/images/userPic.png', 'course'
  ),
])


export {
  courseTitles, projectTitles, courseQuickViews,
  projectQuickViews, CommunityVoices
}