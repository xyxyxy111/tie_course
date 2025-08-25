<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-default-skin vjs-big-play-centered"
      controls
      preload="auto"
    >
      </video>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { videoApi } from '@/api/course';
import localVideo from './10001_new.mp4'
import { currentCoursePayStatus, currentLessonPreviewStatus } from './content';

const props = defineProps({
  videoMessage: {
    type: Object,
    required: true,
  },
});

const videoPlayer = ref(null);
const player = ref(null);
const videoUrl = ref(null);
const cancellationToken = ref(0); 

// 封装一个独立的初始化函数
const initializeVideoPlayer = () => {
  if (player.value) {
    return;
  }
  // src: localVideo,
  nextTick(() => {
    if (videoPlayer.value) {
      const playerOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: localVideo,
          // src: videoUrl.value,
          type: 'video/mp4',
        }
        ], // 初始时 sources 留空
        controlBar: {
          children: [
            'playToggle',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'volumePanel',
            'fullscreenToggle'
          ]
        }
      };
      player.value = videojs(videoPlayer.value, playerOptions, () => {
        console.log('播放器实例已创建!');
      });
    }
  });
};

// 负责加载新视频源
const loadNewVideo = async () => {
  if (!props.videoMessage.lessonId) {
    return;
  }
  
  const currentToken = ++cancellationToken.value;

  try {
    const response = await videoApi.getLessonVideoOssSignatureUrl(props.videoMessage);

    if (currentToken !== cancellationToken.value) {
      console.log('请求已过时，忽略此结果。');
      return;
    }

    videoUrl.value = response.data;
    if (player.value) {
      player.value.src({
        src: localVideo,
        // src: videoUrl.value,
        type: 'video/mp4',
      });
      player.value.load();
      player.value.play();
    } else {
      console.error('播放器实例不存在!');
    }
  } catch (error) {
    if (currentToken !== cancellationToken.value) {
      console.error('过时的请求发生错误，已忽略:', error);
    } else {
      console.error('获取视频 URL 失败:', error);
    }
  }
};

// mounted 时初始化一次播放器实例
onMounted(() => {
  initializeVideoPlayer();
});

watch(
  () => props.videoMessage,
  (newVal) => {
    if (newVal) {
      //这是有新值而且不Load吧
      if(!currentLessonPreviewStatus){
        loadNewVideo();
      }
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose();
  }
});
</script>


<style>

@font-face {
  font-family: 'iconfont';
  src: url('@/assets/fonts/play.woff') format('woff');
}
.video-js {
  display: flex;
    width: 100% !important; 
    height: auto !important;
  font-size: 14px;
}
.video-js.vjs-paused .vjs-big-play-button {
  display: block;
}

/* .video-js .vjs-control-bar {
  background-color: #f1f1f1; 
  color: #333; 
} */

/* .video-js .vjs-play-control.vjs-control .vjs-icon-placeholder::before {
  font-family: 'iconfont';
  content: '\e902'; 
  font-size: 1.6em;
  line-height: 1.9;
}
.video-js.vjs-playing .vjs-play-control.vjs-control .vjs-icon-placeholder::before {
  font-family: 'iconfont';
  content: '\e900'; 
  font-size: 1.6em;
  line-height: 1.9;
}

.video-js:not(.vjs-volume-muted) .vjs-mute-control .vjs-icon-placeholder::before {
  content: '🔊';
}

.video-js.vjs-volume-muted .vjs-mute-control .vjs-icon-placeholder::before {
  content: '🔇';
}


.video-js .vjs-progress-control {
  background-color: #555;
} */

.vjs-live .vjs-time-control,
.vjs-time-divider,
.video-js .vjs-current-time,
.video-js .vjs-duration {
  display: block !important;
}
/* .vjs-time-divider{
    display: block !important;

} */
.video-js .vjs-progress-holder .vjs-load-progress {
  background-color: rgba(0, 102, 255, 0.5);
}


.video-js .vjs-play-progress {
  background-color: #f1f1f1;
}

.video-js .vjs-play-progress::before {
  color: #f1f1f1; 
}

.video-js .vjs-time-tooltip {
  background-color: #555;
  color: #fff;
}



/* .video-js:not(.vjs-fullscreen) .vjs-fullscreen-control::before {
  content: ' 🗖 ' 
}


.video-js.vjs-fullscreen .vjs-fullscreen-control::before {
  content: ' 🗗 ' 
} */


/* 
  进度条在上面
  缓存？？
  切片怎么实现
  阿里云的视频流
  控制栏在鼠标进入视频的时候自动划出 离开视频区域的时候划退 
  小视频预览
*/
</style>



<!-- export default {
  name: 'VideoPlayer',
  data() {
    return {
      player: null,
      videoUrl: 'test', 
      videoFileName: 'your-video-file.mp4' ,
    };
  },
  props: {
    videoMessage: {
      type: Object,
      required: true
    }
  },
   watch: {
    videoMessage: {
      handler(newVal, oldVal) {
        console.log('videoMessage prop changed!');
        console.log('New Value:', newVal);
        console.log('New Value:', oldVal);

        this.getVideo();
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
    async getVideo() {
      console.log(this.videoMessage);

        const response = await videoApi.getLessonVideoOssSignatureUrl(this.videoMessage);
        console.log(response);
        this.videoUrl = response.data;


        this.initVideoPlayer(); // 成功获取URL后，初始化播放器
    },
    initVideoPlayer() {
      console.log('yes')
      console.log(this.videoUrl)
      if (!this.videoUrl) {
        return;
      }
      if (this.player) {
        this.player.dispose(); // 如果存在，先销毁它
      }
      
      this.$nextTick(() => {
      if (this.$refs.videoPlayer) {
        const playerOptions = {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: true,
          sources: [
            {
              // src: this.videoUrl,
              src: localVideo,
              type: 'video/mp4'
            }
          ],
          controlBar: {
            children: [
              'playToggle',
              'currentTimeDisplay',
              'timeDivider',
              'durationDisplay',
              'progressControl',
              'volumePanel',
              'fullscreenToggle'
            ]
          }
        };
        this.player = videojs(this.$refs.videoPlayer, playerOptions, () => {
          console.log('Player is ready!');
        });
      }})

    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}; -->