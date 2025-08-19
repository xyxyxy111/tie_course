<template>
  <div class="Header">
    <div class="header-left">
      <div id="logo">
        <img src="/src/images/iclass_dark.png" alt="">
      </div>
      <span id="copyright">
        |
      </span>
    </div>

    <div class="header-right">

      <div class="card-header">
        <h2 class="card-title">★ 留下评分</h2>
      </div>

      <div class="progress-section">
        <div class="progress-info">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="20" stroke="#666" stroke-width="6" fill="none" />
            <circle cx="30" cy="30" r="20" stroke="#e0ebf6" stroke-width="6" fill="none" stroke-dasharray="125.66"
              stroke-dashoffset="105.66" transform="rotate(-90 30 30)" />
            <!-- :stroke-dashoffset=125.66-(进度)*125.66 -->
            <g transform="translate(18, 18) scale(0.8)">
              <svg width="30" height="30" fill="#222">
                <use href="#material-symbols--trophy" />
              </svg>

            </g>

          </svg>

          <span class="progress">
            <div>3/4</div>
            <div>您的进度</div>
          </span>
        </div>

      </div>

      <button class="share-btn"> 分享
        <svg width="24" height="24" fill="#222">
          <use href="#material-symbols--share" />
        </svg>
      </button>


      <button class="btn">
        <svg width="24" height="24" fill="#222">
          <use href="#mage--dots" />
        </svg>
      </button>

    </div>
  </div>
</template>

<script lang="ts">
import { useWindowSize } from '@/useWindowSize'
import { ref, computed, defineComponent, } from 'vue'
const { width, height } = useWindowSize()


export default defineComponent({
  name: 'Header',
  props: {
    userId: {
      type: String,
      default: undefined
    },
    courseName: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {

    return {

    };
  }
});

</script>

<style scoped>
.Header {
  width: 100vw;
  min-width: 1920px;
  height: 60px;
  background-color: #101010;
  color: white;
  z-index: 2000;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-sizing: border-box;
}

.Header .header-left #logo img {
  height: 30px;
  margin-right: 10px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.header-left #i {
  font-size: 4rem;
  color: #215496;
  font-family: 'HarmonyOS_Sans_Condensed-black';
  margin-right: 4px;
}

#copyright {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  color: #fff;
}

.copyright-symbol {
  font-size: 2rem;
  margin-right: 6px;
}

.header-center {
  flex: 1;
  justify-content: center;
  color: #fff;
  font-size: 1.8rem;
}

.header-right {
  color: #fff;
  font-size: 1.8rem;
  font-weight: bold;
}

.lang-icon {
  margin-top: 10px;
}

.lang-text {
  font-size: 1.6rem;
}

.rating-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  padding: 30px;
  text-align: center;
  display: flex;
}

.card-header {
  margin-bottom: 25px;
}

.card-title {
  font-size: 14px;
  color: #eee;
  margin: 20px 1rem 0rem;
  font-weight: 600;
}


.star {
  cursor: pointer;
  font-size: 2.2rem;
  color: #ddd;
  margin: 0 5px;
  transition: all 0.2s ease;
}

.star:hover {
  transform: scale(1.2);
}

.star.active {
  color: #ffc107;
}

.progress-section {
  margin: 10px 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
}

.progress {
  font-size: 11px;
  margin: 10px 10px 10px 0px;
}

.progress div {
  font-weight: bolder;
}

.share-btn,
.btn {
  background-color: #101010;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 0 0.5px #fff;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-right: 15px;
}

.btn {
  padding: 8px;
}

.share-btn svg {
  margin-left: 3px;
}

/* 
.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.6);
} */


.rating-message {
  margin-top: 15px;
  font-size: 0.9rem;
  color: #636e72;
  min-height: 20px;
}
</style>