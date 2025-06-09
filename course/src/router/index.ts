import { createRouter, createWebHistory } from 'vue-router';
import MyLearning from '@/pages/myLearn/App.vue';
import AllCourse from '@/pages/myLearn/views/AllCourse.vue';
import MyList from '@/pages/myLearn/views/MyList.vue';
import Wishlist from '@/pages/myLearn/views/Wishlist.vue';
import Archived from '@/pages/myLearn/views/Archived.vue';
import BasicInformation from '@/pages/myInfo/views/BasicInformation.vue';
import Communication from '@/pages/myInfo/views/Communication.vue';
import Courses from '@/pages/myInfo/views/Courses.vue';
import Photo from '@/pages/myInfo/views/Photo.vue';
import Privacy from '@/pages/myInfo/views/Privacy.vue';
import Profile from '@/pages/myInfo/views/Profile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/my-info.html', // 根路径直接重定向
      redirect: '/my-info/profile'
    },
   {
      path: '/my-info/profile', // 根路径直接重定向
    name: 'Profile',
     component: Profile,
     redirect: '/my-info/profile/basic-infomation',
     // 或者使用嵌套路由方式
     children: [
       {
         path: 'basic-infomation',
         name: 'BasicInformation',
         component: BasicInformation
       },
       {
         path: 'privacy',
         name: 'Privacy',
         component: Privacy
       },
       {
         path: 'photo',
         name: 'Photo',
         component: Photo
       }
     ]
    },
    {
      name: 'Courses',
      component: Courses,
      path: '/my-info/courses'
    },
    {
      name: 'Communication',
      component: Communication,
      path: '/my-info/communication'
    },
    {
      path: '/learning.html', // 根路径直接重定向
      redirect: '/learning/all-courses'
    },
    {
      name: 'AllCourse',
      path: '/learning/all-courses', // 使用带连字符的路径
      component: AllCourse
    },
    {
      name: 'MyList',
      path: '/learning/my-list', // 使用带连字符的路径
      component: MyList
    },
    {
      name: 'Wishlist',
      path: '/learning/wishlist',
      component: Wishlist
    },
    {
      name: 'Archived',
      path: '/learning/archived',
      component: Archived
    }
  ]
})

export default router;