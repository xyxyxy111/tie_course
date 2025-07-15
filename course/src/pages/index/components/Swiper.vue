<template>
  <swiper :modules="[Navigation, Pagination, Autoplay]" :autoplay="{ delay: 3000 }" :loop="true"
    :pagination="{ clickable: true }" :navigation="true" class="carousel">
    <swiper-slide v-for="n in 3" :key="n">
      <img :src="`/src/images/image${n}.png`" class="carousel-img" />
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
</script>

<style>
.carousel {
  width: 100%;
  max-width: 1300px;
  height: 400px;
  margin: 32px auto 0 auto;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #fff;
  position: relative;
}

.carousel-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.swiper-pagination {
  position: absolute;
  bottom: 16px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10;
}

.swiper-button-next,
.swiper-button-prev {
  color: #222;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  border: 2px solid #e5eaf3;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 55%;
  transform: translateY(-50%);
  transition: background 0.2s, color 0.2s, border 0.2s;
  z-index: 10;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgb(242, 242, 242);
}

.swiper-button-next:after,
.swiper-button-prev:after {
  font-size: 22px;
  font-weight: bold;
}
</style>
