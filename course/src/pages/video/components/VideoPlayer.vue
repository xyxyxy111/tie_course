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

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import localVideo from './10001.mp4'; 
import { videoApi } from '@/api/course';

export default {
  name: 'VideoPlayer',
  data() {
    return {
      player: null,
      videoUrl: 'test', 
      videoFileName: 'your-video-file.mp4' 
    };
  },
  methods:{
    async getVideo() {
        const response = await videoApi.getLessonVideoOssSignatureUrl('10001.mp4');
        console.log(response);
        this.videoUrl = response.data;


        this.initVideoPlayer(); // 成功获取URL后，初始化播放器

      // try {


      //   // 检查请求是否成功
      //   // if (data && data.code === 1150 && data.data) {
      //   //   this.videoUrl = data.data;
      //   //   this.initVideoPlayer(); // 成功获取URL后，初始化播放器
      //   // } else {
      //   //   console.error('获取签名URL失败:', data.description);
      //   //   alert('服务器繁忙，请稍候再试')
      //   // }
      // } catch (error) {
      //   console.error('API 请求失败:', error);
      // }
    },
    initVideoPlayer() {
      console.log('yes')
      console.log(this.videoUrl)
      if (!this.videoUrl) {
        return;
      }
      
      const playerOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: this.videoUrl,
            // src: localVideo,
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
    }
  },
  mounted() {
    this.getVideo();
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>

<style>

@font-face {
  font-family: 'iconfont';
  src: url('@/assets/fonts/play.woff') format('woff');
}
.video-js {
  width: 100%;
}
.video-js.vjs-paused .vjs-big-play-button {
  display: block;
}

/* .video-js .vjs-control-bar {
  background-color: #f1f1f1; 
  color: #333; 
} */
/* 
.video-js .vjs-play-control.vjs-control .vjs-icon-placeholder::before {
  font-family: 'iconfont';
  content: '\e902'; 
  font-size: 1.6em;
  line-height: 1.9;
} */
/* .video-js.vjs-playing .vjs-play-control.vjs-control .vjs-icon-placeholder::before {
  font-family: 'iconfont';
  content: '\e900'; 
  font-size: 1.6em;
  line-height: 1.9;
} */

/* .video-js:not(.vjs-volume-muted) .vjs-mute-control .vjs-icon-placeholder::before {
  content: '🔊';
}

.video-js.vjs-volume-muted .vjs-mute-control .vjs-icon-placeholder::before {
  content: '🔇';
} */


/* .video-js .vjs-progress-control {
  background-color: #555;
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



.video-js:not(.vjs-fullscreen) .vjs-fullscreen-control::before {
  content: ' 🗖 ' 
}


/* .video-js.vjs-fullscreen .vjs-fullscreen-control::before {
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
