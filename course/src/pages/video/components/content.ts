import { ref, computed } from 'vue';
import { getValidToken } from '@/utils/request';
import { useCart } from '@/composables/useCart'
import type { CourseVO, Chapter, Lesson } from '@/api/course';
import { categoryApi, courseApi, courseSuccessCodes, categorySuccessCodes } from '@/api/course';
import { convertMinutesToHoursAndMinutes,formatDateToYearMonth } from '@/utils/common';

export const userId = ref<string | null>(null)
export const chapters = ref<Chapter[]>([]);
export const courseVo = ref<CourseVO | null>(null);
export const currentLesson = ref<Lesson | null>(null)



const searchParams = new URLSearchParams(window.location.search);
//设置为默认
export let courseId = ref(parseInt(searchParams.get('courseId') || '1001'));
export let lessonId = ref(parseInt(searchParams.get('lessonId') || '0'));


export const firstChapterOrder = ref(1);
export const currentLessonPreviewStatus = ref(true);
//
export const currentCoursePayStatus = ref(true);

export const getCourseMessage = async () => {
  const courseVoResponse = await courseApi.getSingleCourseDetail(courseId.value);
  courseVo.value = courseVoResponse.data;

  const chaptersResponse = await courseApi.getChapterListById(courseId.value);
  chapters.value = chaptersResponse.data;
  chapters.value.forEach(chapter => {
    let result = convertMinutesToHoursAndMinutes(chapter.lessonTotalMinute);
    chapter.hours = result.hours;
    chapter.minutes = result.minutes;
  });


  //后端查询
  if(lessonId.value !== 0){
    const resp = await courseApi.getChapterOrderByLessonId(lessonId.value);
    firstChapterOrder.value = resp.data;
  }
  const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId.value, firstChapterOrder.value);
  console.log(lessonsResponse);

  //赋值该课程所包含的章节
  const firstChapter = chapters.value.find(chapter => chapter.chapterSortOrder === firstChapterOrder.value);
  if (firstChapter) {
    firstChapter.lessons! = lessonsResponse.data;
    firstChapter.hasLoadedLessons = true;
    currentLesson.value = firstChapter.lessons[0];
  } else {
    console.warn("No chapters found");
  }
  
  getPreviewStatus();
}

export const getLessonListBySortOrder = async (sortOrder: number) => {
  const chooseChapter = chapters.value.find(chapter => chapter.chapterSortOrder === sortOrder);
  if (!chooseChapter?.hasLoadedLessons) {
    //true
    const lessonsResponse = await courseApi.getLessonsByCourseIdAndSortOrder(courseId.value, sortOrder);
    console.log("lessonsResponse" + lessonsResponse.data.map(lesson => lesson.title));
    if (chooseChapter) {
      chooseChapter.lessons! = lessonsResponse.data;
      chooseChapter.hasLoadedLessons = true;
    } else {
      console.warn("No chapters found");
    }
  }
}

//传输一个包含两个值的对象给后端
export let videoMsg = computed(() => {
  return {
    courseId: courseId.value,
    lessonId: lessonId.value
  };
});

export const getPreviewStatus = async() => {
  if(lessonId.value!==0){
    const resp = await courseApi.getPreviewStatusByLessonId(lessonId.value);
    currentLessonPreviewStatus.value = resp.data;
  }
};

export const getCoursePayStatus = async() => {
  //get
  if(lessonId.value!==0){
    const resp = await courseApi.getCoursePayStatusByLessonId(userId.value!,courseId.value);
    currentCoursePayStatus.value = resp.data;
    console.log('当前购买情况');
    console.log(currentCoursePayStatus.value);
  }
};


